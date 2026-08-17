import { layoutNary, type LayoutNary } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

/** Multi-key B-tree style node (also covers 2-3 / 2-3-4). */
type BNode = {
  id: number;
  keys: number[];
  children: BNode[];
  leaf: boolean;
};

function labelOf(n: BNode) {
  return n.keys.join("|") || "·";
}

function toLayout(n: BNode): LayoutNary {
  return {
    id: n.id,
    key: labelOf(n),
    extra: labelOf(n),
    children: n.children.map(toLayout),
  };
}

function push(
  t: TreeTrace,
  root: BNode,
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
) {
  const { nodes, edges } = layoutNary(toLayout(root));
  const labels = Object.fromEntries(nodes.map((n) => [n.id, n.label]));
  t.push(
    nodes,
    edges,
    rolesByNodeList(nodes, roles),
    t.idleEdgeRoles(edges.length),
    hint,
    { labels, frontier },
  );
}

function createLeaf(ids: { n: number }, keys: number[] = []): BNode {
  return { id: ids.n++, keys, children: [], leaf: true };
}

function createInternal(ids: { n: number }, keys: number[], children: BNode[]): BNode {
  return { id: ids.n++, keys, children, leaf: false };
}

/**
 * Insert into a B-tree of minimum degree t (max keys = 2t-1).
 * t=2 → 2-3-4 tree; for classic 2-3 we use maxKeys=2 via t=1.5 simulated as max=2.
 */
function insertBTree(
  t: TreeTrace,
  root: BNode,
  ids: { n: number },
  key: number,
  maxKeys: number,
): BNode {
  push(t, root, {}, `Insert ${key}.`);
  if (root.keys.length === maxKeys) {
    const s = createInternal(ids, [], [root]);
    s.leaf = false;
    activeRoot = s;
    splitChild(t, s, 0, ids, maxKeys);
    root = s;
    push(t, root, { [root.id]: "current" }, `Split full root before inserting ${key}.`);
  }
  insertNonFull(t, root, key, ids, maxKeys);
  return root;
}

function splitChild(
  t: TreeTrace,
  parent: BNode,
  i: number,
  ids: { n: number },
  maxKeys: number,
) {
  const mid = Math.floor(maxKeys / 2);
  const y = parent.children[i]!;
  const z = createLeaf(ids, y.keys.slice(mid + 1));
  z.leaf = y.leaf;
  if (!y.leaf) {
    z.children = y.children.splice(mid + 1);
  }
  const up = y.keys[mid]!;
  y.keys = y.keys.slice(0, mid);
  parent.children.splice(i + 1, 0, z);
  parent.keys.splice(i, 0, up);
  t.rotate();
  push(
    t,
    activeRoot ?? parent,
    { [y.id]: "frontier", [z.id]: "path", [parent.id]: "current" },
    `Split — promote ${up}.`,
  );
}

function insertNonFull(
  t: TreeTrace,
  node: BNode,
  key: number,
  ids: { n: number },
  maxKeys: number,
) {
  t.compare();
  push(
    t,
    activeRoot ?? node,
    { [node.id]: "current" },
    `At [${labelOf(node)}] looking for ${key}.`,
  );
  if (node.leaf) {
    let i = node.keys.length - 1;
    while (i >= 0 && key < node.keys[i]!) i -= 1;
    node.keys.splice(i + 1, 0, key);
    t.visit();
    push(t, activeRoot ?? node, { [node.id]: "path" }, `Placed ${key} in leaf.`);
    return;
  }
  let i = node.keys.length - 1;
  while (i >= 0 && key < node.keys[i]!) i -= 1;
  i += 1;
  if (node.children[i]!.keys.length === maxKeys) {
    splitChild(t, node, i, ids, maxKeys);
    if (key > node.keys[i]!) i += 1;
  }
  insertNonFull(t, node.children[i]!, key, ids, maxKeys);
}

let activeRoot: BNode | null = null;

function runMultiKeyInsert(
  input: TreeInput,
  maxKeys: number,
  title: string,
): TreeFrame[] {
  const t = new TreeTrace();
  const ids = { n: 0 };
  let root = createLeaf(ids);
  activeRoot = root;
  push(t, root, { [root.id]: "start" }, `${title} — max ${maxKeys} keys per node.`);
  for (const key of input.values) {
    activeRoot = root;
    root = insertBTree(t, root, ids, key, maxKeys);
    activeRoot = root;
  }
  push(t, root, {}, `${title} insert complete.`);
  activeRoot = null;
  return t.frames;
}

export function ttTree(input: TreeInput): TreeFrame[] {
  // 2-3 tree: 1–2 keys (maxKeys = 2)
  return runMultiKeyInsert(input, 2, "2-3 Tree");
}

export function ttfTree(input: TreeInput): TreeFrame[] {
  // 2-3-4 tree: 1–3 keys
  return runMultiKeyInsert(input, 3, "2-3-4 Tree");
}

export function btree(input: TreeInput): TreeFrame[] {
  // B-tree t=3 → max 5 keys; keep small for viz → max 3
  return runMultiKeyInsert(input, 3, "B-Tree");
}

/** Simplified B+ tree: internal separators + leaf linked list (shown as bottom row). */
export function bplus(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = { n: 0 };
  const maxKeys = 3;
  let root = createLeaf(ids);
  activeRoot = root;
  push(
    t,
    root,
    { [root.id]: "start" },
    "B+ Tree — data lives in leaves; internals hold separators.",
  );

  for (const key of input.values) {
    activeRoot = root;
    // same insert as B-tree for structure; mark leaves as data
    root = insertBTree(t, root, ids, key, maxKeys);
    activeRoot = root;
    const leafIds: number[] = [];
    const collect = (n: BNode) => {
      if (n.leaf) leafIds.push(n.id);
      for (const c of n.children) collect(c);
    };
    collect(root);
    const roles: Partial<Record<number, TreeNodeRole>> = { [root.id]: "start" };
    for (const id of leafIds) roles[id] = "path";
    push(t, root, roles, `Leaves hold sorted data (after inserting ${key}).`, leafIds);
  }
  push(t, root, {}, "B+ Tree insert complete.");
  activeRoot = null;
  return t.frames;
}
