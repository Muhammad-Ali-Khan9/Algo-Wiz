import {
  BinNode,
  IdGen,
  bstInsertSilent,
  buildBst,
  findNode,
  sceneFrom,
  subtreeMax,
  subtreeMin,
} from "./binary-model";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

function push(
  t: TreeTrace,
  root: BinNode | null,
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
) {
  const scene = sceneFrom(root);
  t.push(
    scene.nodes,
    scene.edges,
    rolesByNodeList(scene.nodes, roles),
    t.idleEdgeRoles(scene.edges.length),
    hint,
    { labels: scene.labels, frontier },
  );
}

export function bstInsert(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  let root: BinNode | null = null;
  push(t, root, {}, "BST Insert — empty tree; insert keys left-to-right.");

  for (const key of input.values) {
    const node = new BinNode(ids.take(), key);
    if (!root) {
      root = node;
      t.visit();
      push(t, root, { [node.id]: "current" }, `Insert ${key} as root.`);
      continue;
    }
    let cur: BinNode = root;
    const path: number[] = [];
    for (;;) {
      t.compare();
      path.push(cur.id);
      const roles: Partial<Record<number, TreeNodeRole>> = {};
      for (const id of path) roles[id] = "visited";
      roles[cur.id] = "current";
      push(t, root, roles, `Looking for ${key} — at ${cur.key}.`, path);
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
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of path) roles[id] = "visited";
    roles[node.id] = "path";
    push(t, root, roles, `Inserted ${key}.`);
  }
  push(t, root, {}, "BST insert sequence complete.");
  return t.frames;
}

export function bstSearch(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  const root = buildBst(input.values, ids);
  push(t, root, {}, `BST Search for ${input.target}.`);
  let cur = root;
  const path: number[] = [];
  while (cur) {
    t.visit();
    t.compare();
    path.push(cur.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of path) roles[id] = "visited";
    roles[cur.id] = "current";
    push(t, root, roles, `Compare ${input.target} with ${cur.key}.`, path);
    if (cur.key === input.target) {
      roles[cur.id] = "path";
      push(t, root, roles, `Found ${input.target}.`);
      return t.frames;
    }
    cur = input.target < cur.key ? cur.left : cur.right;
  }
  push(t, root, {}, `${input.target} is not in the BST.`);
  return t.frames;
}

export function bstDelete(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  let root = buildBst(input.values, ids);
  const targetKey =
    findNode(root, input.target)?.key ??
    input.values[Math.floor(input.values.length / 2)]!;
  push(t, root, {}, `BST Delete — remove ${targetKey}.`);

  const path: number[] = [];
  let cur = root;
  let parent: BinNode | null = null;
  let wentLeft = false;
  while (cur && cur.key !== targetKey) {
    t.compare();
    path.push(cur.id);
    push(
      t,
      root,
      Object.fromEntries([
        ...path.map((id) => [id, "visited" as const]),
        [cur.id, "current" as const],
      ]),
      `Seek ${targetKey} at ${cur.key}.`,
      path,
    );
    parent = cur;
    if (targetKey < cur.key) {
      wentLeft = true;
      cur = cur.left;
    } else {
      wentLeft = false;
      cur = cur.right;
    }
  }
  if (!cur) {
    push(t, root, {}, `${targetKey} not found.`);
    return t.frames;
  }
  t.visit();
  push(t, root, { [cur.id]: "current" }, `Found ${targetKey} — choose delete case.`);

  const replace = (next: BinNode | null) => {
    if (!parent) root = next;
    else if (wentLeft) parent.left = next;
    else parent.right = next;
    if (next) next.parent = parent;
  };

  if (!cur.left && !cur.right) {
    replace(null);
    push(t, root, {}, `Removed leaf ${targetKey}.`);
  } else if (!cur.left || !cur.right) {
    const child = cur.left ?? cur.right;
    replace(child);
    push(
      t,
      root,
      child ? { [child.id]: "path" } : {},
      `Replaced ${targetKey} with its only child.`,
    );
  } else {
    const succ = subtreeMin(cur.right!);
    push(
      t,
      root,
      { [cur.id]: "current", [succ.id]: "frontier" },
      `Inorder successor is ${succ.key}.`,
    );
    const succKey = succ.key;
    // delete successor then copy key
    let sp: BinNode | null = succ.parent;
    if (sp === cur) {
      cur.right = succ.right;
      if (succ.right) succ.right.parent = cur;
    } else if (sp) {
      sp.left = succ.right;
      if (succ.right) succ.right.parent = sp;
    }
    cur.key = succKey;
    push(
      t,
      root,
      { [cur.id]: "path" },
      `Copied successor key ${succKey} into deleted slot.`,
    );
  }
  push(t, root, {}, `Delete of ${targetKey} complete.`);
  return t.frames;
}

export function bstMinMax(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  const root = buildBst(input.values, ids);
  if (!root) return t.frames;
  push(t, root, {}, "BST Min / Max — walk left for min, right for max.");

  let cur: BinNode = root;
  while (cur.left) {
    t.visit();
    push(
      t,
      root,
      { [cur.id]: "visited", [cur.left.id]: "current" },
      `Go left from ${cur.key}.`,
    );
    cur = cur.left;
  }
  t.visit();
  push(t, root, { [cur.id]: "path" }, `Minimum is ${cur.key}.`);

  cur = root;
  while (cur.right) {
    t.visit();
    push(
      t,
      root,
      { [cur.id]: "visited", [cur.right.id]: "current" },
      `Go right from ${cur.key}.`,
    );
    cur = cur.right;
  }
  t.visit();
  push(t, root, { [cur.id]: "goal" }, `Maximum is ${cur.key}.`);
  return t.frames;
}

export function bstPredecessor(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  const root = buildBst(input.values, ids);
  const node =
    findNode(root, input.target) ??
    findNode(root, input.values[Math.floor(input.values.length / 2)]!);
  if (!root || !node) return t.frames;
  push(t, root, { [node.id]: "goal" }, `Predecessor of ${node.key}.`);

  if (node.left) {
    const pred = subtreeMax(node.left);
    let cur = node.left;
    while (cur) {
      t.visit();
      push(
        t,
        root,
        { [node.id]: "goal", [cur.id]: "current" },
        `Max in left subtree — at ${cur.key}.`,
      );
      if (!cur.right) break;
      cur = cur.right;
    }
    push(
      t,
      root,
      { [node.id]: "goal", [pred.id]: "path" },
      `Predecessor is ${pred.key}.`,
    );
    return t.frames;
  }

  let cur: BinNode | null = node;
  let parent = node.parent;
  while (parent && parent.left === cur) {
    t.visit();
    push(
      t,
      root,
      { [node.id]: "goal", [parent.id]: "current" },
      `Climb while we are a left child.`,
    );
    cur = parent;
    parent = parent.parent;
  }
  if (parent) {
    push(
      t,
      root,
      { [node.id]: "goal", [parent.id]: "path" },
      `Predecessor is ${parent.key}.`,
    );
  } else {
    push(t, root, { [node.id]: "goal" }, `${node.key} has no predecessor.`);
  }
  return t.frames;
}

export function bstSuccessor(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  const root = buildBst(input.values, ids);
  const node =
    findNode(root, input.target) ??
    findNode(root, input.values[Math.floor(input.values.length / 2)]!);
  if (!root || !node) return t.frames;
  push(t, root, { [node.id]: "goal" }, `Successor of ${node.key}.`);

  if (node.right) {
    const succ = subtreeMin(node.right);
    let cur = node.right;
    while (cur) {
      t.visit();
      push(
        t,
        root,
        { [node.id]: "goal", [cur.id]: "current" },
        `Min in right subtree — at ${cur.key}.`,
      );
      if (!cur.left) break;
      cur = cur.left;
    }
    push(t, root, { [node.id]: "goal", [succ.id]: "path" }, `Successor is ${succ.key}.`);
    return t.frames;
  }

  let cur: BinNode | null = node;
  let parent = node.parent;
  while (parent && parent.right === cur) {
    t.visit();
    push(
      t,
      root,
      { [node.id]: "goal", [parent.id]: "current" },
      `Climb while we are a right child.`,
    );
    cur = parent;
    parent = parent.parent;
  }
  if (parent) {
    push(
      t,
      root,
      { [node.id]: "goal", [parent.id]: "path" },
      `Successor is ${parent.key}.`,
    );
  } else {
    push(t, root, { [node.id]: "goal" }, `${node.key} has no successor.`);
  }
  return t.frames;
}

// keep parent links for pred/succ after buildBst
void bstInsertSilent;
