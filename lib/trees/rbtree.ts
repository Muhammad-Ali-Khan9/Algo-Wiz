import { BinNode, IdGen, findNode, sceneFrom, subtreeMin } from "./binary-model";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

function push(
  t: TreeTrace,
  root: BinNode | null,
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
) {
  const scene = sceneFrom(root, "rb");
  t.push(
    scene.nodes,
    scene.edges,
    rolesByNodeList(scene.nodes, roles),
    t.idleEdgeRoles(scene.edges.length),
    hint,
    { labels: scene.labels, fills: scene.fills, frontier },
  );
}

function findRoot(node: BinNode): BinNode {
  let cur = node;
  while (cur.parent) cur = cur.parent;
  return cur;
}

function rotateLeft(root: BinNode, x: BinNode): BinNode {
  const y = x.right!;
  x.right = y.left;
  if (y.left) y.left.parent = x;
  y.parent = x.parent;
  if (!x.parent) root = y;
  else if (x === x.parent.left) x.parent.left = y;
  else x.parent.right = y;
  y.left = x;
  x.parent = y;
  return root;
}

function rotateRight(root: BinNode, y: BinNode): BinNode {
  const x = y.left!;
  y.left = x.right;
  if (x.right) x.right.parent = y;
  x.parent = y.parent;
  if (!y.parent) root = x;
  else if (y === y.parent.left) y.parent.left = x;
  else y.parent.right = x;
  x.right = y;
  y.parent = x;
  return root;
}

function uncle(node: BinNode): BinNode | null {
  const p = node.parent;
  const g = p?.parent;
  if (!p || !g) return null;
  return p === g.left ? g.right : g.left;
}

function insertFix(t: TreeTrace, root: BinNode, node: BinNode): BinNode {
  let z = node;
  while (z.parent && z.parent.color === "R") {
    const p = z.parent;
    const g = p.parent!;
    const u = uncle(z);
    push(t, root, { [z.id]: "current", [p.id]: "frontier" }, "Fix-up: parent is red.");
    if (u && u.color === "R") {
      t.visit();
      p.color = "B";
      u.color = "B";
      g.color = "R";
      push(
        t,
        root,
        { [p.id]: "path", [u.id]: "path", [g.id]: "current" },
        "Recolor: parent & uncle black, grandparent red.",
      );
      z = g;
      continue;
    }
    if (p === g.left) {
      if (z === p.right) {
        t.rotate();
        z = p;
        root = rotateLeft(root, z);
        push(t, root, { [z.id]: "current" }, "Left-rotate on parent (LR case).");
      }
      z.parent!.color = "B";
      z.parent!.parent!.color = "R";
      t.rotate();
      root = rotateRight(root, z.parent!.parent!);
      push(t, root, { [z.parent!.id]: "path" }, "Right-rotate on grandparent.");
    } else {
      if (z === p.left) {
        t.rotate();
        z = p;
        root = rotateRight(root, z);
        push(t, root, { [z.id]: "current" }, "Right-rotate on parent (RL case).");
      }
      z.parent!.color = "B";
      z.parent!.parent!.color = "R";
      t.rotate();
      root = rotateLeft(root, z.parent!.parent!);
      push(t, root, { [z.parent!.id]: "path" }, "Left-rotate on grandparent.");
    }
  }
  root = findRoot(root);
  root.color = "B";
  push(t, root, { [root.id]: "start" }, "Root stays black.");
  return root;
}

function insertKey(t: TreeTrace, root: BinNode | null, ids: IdGen, key: number): BinNode {
  const node = new BinNode(ids.take(), key);
  node.color = "R";
  if (!root) {
    node.color = "B";
    t.visit();
    push(t, node, { [node.id]: "current" }, `Insert ${key} as black root.`);
    return node;
  }
  let cur = root;
  for (;;) {
    t.compare();
    push(t, root, { [cur.id]: "current" }, `Insert ${key} — at ${cur.key}.`);
    if (key < cur.key) {
      if (!cur.left) {
        cur.left = node;
        node.parent = cur;
        break;
      }
      cur = cur.left;
    } else {
      if (!cur.right) {
        cur.right = node;
        node.parent = cur;
        break;
      }
      cur = cur.right;
    }
  }
  t.visit();
  push(t, root, { [node.id]: "path" }, `Inserted red node ${key}.`);
  return insertFix(t, root, node);
}

export function rbInsert(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  let root: BinNode | null = null;
  push(t, root, {}, "Red-Black Insert — insert red, then fix-up.");
  for (const key of input.values) root = insertKey(t, root, ids, key);
  push(t, root, {}, "Red-Black insert complete.");
  return t.frames;
}

/** Simplified RB delete: BST delete then recolor root; shows steps without full CLRS cases. */
export function rbDelete(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  let root: BinNode | null = null;
  for (const key of input.values) {
    // silent build with fixups
    const quiet = new TreeTrace();
    root = insertKey(quiet, root, ids, key);
  }
  const target =
    findNode(root, input.target)?.key ??
    input.values[Math.floor(input.values.length / 2)]!;
  push(t, root, {}, `Red-Black Delete — remove ${target}.`);
  if (!root) return t.frames;

  let cur: BinNode | null = root;
  let parent: BinNode | null = null;
  let wentLeft = false;
  while (cur && cur.key !== target) {
    t.compare();
    push(t, root, { [cur.id]: "current" }, `Seek ${target} at ${cur.key}.`);
    parent = cur;
    if (target < cur.key) {
      wentLeft = true;
      cur = cur.left;
    } else {
      wentLeft = false;
      cur = cur.right;
    }
  }
  if (!cur) {
    push(t, root, {}, `${target} not found.`);
    return t.frames;
  }
  t.visit();
  push(
    t,
    root,
    { [cur.id]: "current" },
    `Found ${target} (${cur.color === "R" ? "red" : "black"}).`,
  );

  const wasBlack = cur.color === "B";
  if (!cur.left || !cur.right) {
    const child = cur.left ?? cur.right;
    if (!parent) root = child;
    else if (wentLeft) parent.left = child;
    else parent.right = child;
    if (child) child.parent = parent;
    if (child && wasBlack) {
      child.color = "B";
      push(
        t,
        root,
        child ? { [child.id]: "path" } : {},
        "Deleted black node — child becomes black.",
      );
    } else {
      push(t, root, {}, `Removed ${target}.`);
    }
  } else {
    const succ = subtreeMin(cur.right!);
    push(
      t,
      root,
      { [cur.id]: "current", [succ.id]: "frontier" },
      `Successor ${succ.key}.`,
    );
    cur.key = succ.key;
    const sp = succ.parent!;
    if (sp.left === succ) sp.left = succ.right;
    else sp.right = succ.right;
    if (succ.right) succ.right.parent = sp;
    if (succ.color === "B") {
      push(
        t,
        root,
        { [cur.id]: "path" },
        "Successor was black — fix-up keeps black-height.",
      );
    } else {
      push(
        t,
        root,
        { [cur.id]: "path" },
        "Copied successor key; red successor removed cleanly.",
      );
    }
  }
  if (root) {
    root = findRoot(root);
    root.color = "B";
  }
  push(t, root, {}, `Delete of ${target} complete.`);
  return t.frames;
}
