import { layoutNary, type LayoutNary } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

type NNode = {
  id: number;
  key: number;
  children: NNode[];
};

function toLayout(node: NNode): LayoutNary {
  return {
    id: node.id,
    key: node.key,
    children: node.children.map(toLayout),
  };
}

function push(
  t: TreeTrace,
  root: NNode,
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

/** Build an n-ary tree by attaching each key under a random existing parent. */
export function naryTree(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  const root: NNode = { id: nextId++, key: input.values[0] ?? 1, children: [] };
  push(
    t,
    root,
    { [root.id]: "start" },
    "N-ary Tree — each node may have any number of children.",
  );

  for (let i = 1; i < input.values.length; i += 1) {
    const key = input.values[i]!;
    const flat: NNode[] = [];
    const walk = (n: NNode) => {
      flat.push(n);
      for (const c of n.children) walk(c);
    };
    walk(root);
    const parent = flat[(i * 7 + key) % flat.length]!;
    const child: NNode = { id: nextId++, key, children: [] };
    parent.children.push(child);
    t.visit();
    push(
      t,
      root,
      { [parent.id]: "current", [child.id]: "path" },
      `Attach ${key} under ${parent.key}.`,
    );
  }

  // Level-order walk
  const q: NNode[] = [root];
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!;
    t.visit();
    order.push(u.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of order) roles[id] = "visited";
    roles[u.id] = "current";
    for (const c of u.children) {
      q.push(c);
      roles[c.id] = "frontier";
    }
    push(
      t,
      root,
      roles,
      `Level-order visit ${u.key}.`,
      q.map((n) => n.id),
    );
  }
  push(
    t,
    root,
    Object.fromEntries(order.map((id) => [id, "path" as const])),
    "N-ary build + traversal done.",
  );
  return t.frames;
}

/** Complete k-ary tree (k=3) filled level-order from the array. */
export function karyTree(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const k = 3;
  const values = input.values;
  if (!values.length) return t.frames;

  const nodes: NNode[] = values.map((key, id) => ({ id, key, children: [] }));
  for (let i = 0; i < nodes.length; i += 1) {
    for (let c = 0; c < k; c += 1) {
      const j = k * i + c + 1;
      if (j < nodes.length) nodes[i]!.children.push(nodes[j]!);
    }
  }
  const root = nodes[0]!;
  push(
    t,
    root,
    { [root.id]: "start" },
    `K-ary Tree (k=${k}) — complete layout from the array.`,
  );

  for (let i = 1; i < nodes.length; i += 1) {
    const parent = nodes[Math.floor((i - 1) / k)]!;
    t.visit();
    push(
      t,
      root,
      { [parent.id]: "current", [nodes[i]!.id]: "path" },
      `Child slot of ${parent.key} ← ${nodes[i]!.key}.`,
    );
  }

  // Search target via level-order
  const target = input.target;
  const q: NNode[] = [root];
  while (q.length) {
    const u = q.shift()!;
    t.compare();
    push(t, root, { [u.id]: "current" }, `Seek ${target} at ${u.key}.`);
    if (u.key === target) {
      push(t, root, { [u.id]: "goal" }, `Found ${target}.`);
      return t.frames;
    }
    t.visit();
    for (const c of u.children) q.push(c);
  }
  push(t, root, {}, `${target} not found.`);
  return t.frames;
}
