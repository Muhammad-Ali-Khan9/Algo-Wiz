import {
  BinNode,
  IdGen,
  findNode,
  refreshHeight,
  rotateLeft,
  rotateRight,
  sceneFrom,
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
  const scene = sceneFrom(root, "avl");
  t.push(
    scene.nodes,
    scene.edges,
    rolesByNodeList(scene.nodes, roles),
    t.idleEdgeRoles(scene.edges.length),
    hint,
    { labels: scene.labels, frontier },
  );
}

function balanceFactor(node: BinNode) {
  return (node.left?.height ?? 0) - (node.right?.height ?? 0);
}

function rebalance(t: TreeTrace, root: BinNode, node: BinNode): BinNode {
  refreshHeight(node);
  const bf = balanceFactor(node);
  if (bf > 1) {
    if (balanceFactor(node.left!) < 0) {
      t.rotate();
      push(
        t,
        root,
        { [node.id]: "current", [node.left!.id]: "frontier" },
        "LR — left-rotate on left child first.",
      );
      node.left = rotateLeft(node.left!);
      // root pointer may need update if rotation bubbled — handled by callers via parent
      root = findRoot(node);
      push(t, root, { [node.id]: "current" }, "LR — now right-rotate on node.");
    } else {
      push(t, findRoot(node), { [node.id]: "current" }, "LL — right-rotate.");
    }
    t.rotate();
    const newSub = rotateRight(node);
    root = findRoot(newSub);
    push(t, root, { [newSub.id]: "path" }, "AVL rebalanced (right rotation).");
    return root;
  }
  if (bf < -1) {
    if (balanceFactor(node.right!) > 0) {
      t.rotate();
      push(
        t,
        root,
        { [node.id]: "current", [node.right!.id]: "frontier" },
        "RL — right-rotate on right child first.",
      );
      node.right = rotateRight(node.right!);
      root = findRoot(node);
      push(t, root, { [node.id]: "current" }, "RL — now left-rotate on node.");
    } else {
      push(t, findRoot(node), { [node.id]: "current" }, "RR — left-rotate.");
    }
    t.rotate();
    const newSub = rotateLeft(node);
    root = findRoot(newSub);
    push(t, root, { [newSub.id]: "path" }, "AVL rebalanced (left rotation).");
    return root;
  }
  return findRoot(node);
}

function findRoot(node: BinNode): BinNode {
  let cur = node;
  while (cur.parent) cur = cur.parent;
  return cur;
}

function insertKey(t: TreeTrace, root: BinNode | null, ids: IdGen, key: number): BinNode {
  const node = new BinNode(ids.take(), key);
  if (!root) {
    t.visit();
    push(t, node, { [node.id]: "current" }, `Insert ${key} as root.`);
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
  push(t, root, { [node.id]: "path" }, `Placed ${key}. Walk up to rebalance.`);

  let walk: BinNode | null = node.parent;
  let r = root;
  while (walk) {
    refreshHeight(walk);
    const bf = balanceFactor(walk);
    push(
      t,
      r,
      { [walk.id]: "current" },
      `Ancestor ${walk.key} balance ${bf >= 0 ? "+" : ""}${bf}.`,
    );
    if (Math.abs(bf) > 1) {
      r = rebalance(t, r, walk);
      break;
    }
    walk = walk.parent;
  }
  return findRoot(r);
}

export function avlInsert(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  let root: BinNode | null = null;
  push(t, root, {}, "AVL Insert — insert then rebalance with rotations.");
  for (const key of input.values) {
    root = insertKey(t, root, ids, key);
  }
  push(t, root, {}, "AVL insert sequence complete.");
  return t.frames;
}

export function avlDelete(input: TreeInput): TreeFrame[] {
  const ids = new IdGen();
  let root: BinNode | null = null;
  for (const key of input.values) {
    const n = new BinNode(ids.take(), key);
    if (!root) root = n;
    else {
      let cur = root;
      for (;;) {
        if (key < cur.key) {
          if (!cur.left) {
            cur.left = n;
            n.parent = cur;
            break;
          }
          cur = cur.left;
        } else {
          if (!cur.right) {
            cur.right = n;
            n.parent = cur;
            break;
          }
          cur = cur.right;
        }
      }
      let w: BinNode | null = n.parent;
      while (w) {
        refreshHeight(w);
        const bf = balanceFactor(w);
        if (Math.abs(bf) > 1) {
          root = rebalanceSilent(root!, w);
          break;
        }
        w = w.parent;
      }
      root = findRoot(root!);
    }
    refreshHeight(n);
  }

  const target =
    findNode(root, input.target)?.key ??
    input.values[Math.floor(input.values.length / 2)]!;

  const tt = new TreeTrace();
  push(tt, root, {}, `AVL Delete — remove ${target}.`);
  if (!root) return tt.frames;

  let cur: BinNode | null = root;
  let parent: BinNode | null = null;
  let wentLeft = false;
  while (cur && cur.key !== target) {
    tt.compare();
    push(tt, root, { [cur.id]: "current" }, `Seek ${target} at ${cur.key}.`);
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
    push(tt, root, {}, `${target} not found.`);
    return tt.frames;
  }
  tt.visit();
  push(tt, root, { [cur.id]: "current" }, `Found ${target}.`);

  let rebalanceFrom: BinNode | null = parent;
  if (!cur.left || !cur.right) {
    const child = cur.left ?? cur.right;
    if (!parent) root = child;
    else if (wentLeft) parent.left = child;
    else parent.right = child;
    if (child) child.parent = parent;
  } else {
    const succ = subtreeMin(cur.right!);
    push(
      tt,
      root,
      { [cur.id]: "current", [succ.id]: "frontier" },
      `Successor ${succ.key}.`,
    );
    const succKey = succ.key;
    rebalanceFrom = succ.parent === cur ? cur : succ.parent;
    const sp = succ.parent!;
    if (sp === cur) {
      cur.right = succ.right;
      if (succ.right) succ.right.parent = cur;
    } else {
      sp.left = succ.right;
      if (succ.right) succ.right.parent = sp;
    }
    cur.key = succKey;
  }

  let walk = rebalanceFrom;
  while (walk) {
    refreshHeight(walk);
    const bf = balanceFactor(walk);
    push(
      tt,
      root,
      { [walk.id]: "current" },
      `Rebalance check at ${walk.key} (bf ${bf >= 0 ? "+" : ""}${bf}).`,
    );
    if (Math.abs(bf) > 1) {
      root = rebalance(tt, root!, walk);
      walk = root;
    }
    walk = walk.parent;
  }
  if (root) root = findRoot(root);
  push(tt, root, {}, `Deleted ${target}.`);
  return tt.frames;
}

function rebalanceSilent(root: BinNode, node: BinNode): BinNode {
  refreshHeight(node);
  const bf = balanceFactor(node);
  if (bf > 1) {
    if (balanceFactor(node.left!) < 0) node.left = rotateLeft(node.left!);
    return findRoot(rotateRight(node));
  }
  if (bf < -1) {
    if (balanceFactor(node.right!) > 0) node.right = rotateRight(node.right!);
    return findRoot(rotateLeft(node));
  }
  return findRoot(node);
}

function forceRotateDemo(kind: "LL" | "RR" | "LR" | "RL", input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = new IdGen();
  // Craft insertion order that forces the rotation
  let keys: number[];
  if (kind === "LL") keys = [30, 20, 10];
  else if (kind === "RR") keys = [10, 20, 30];
  else if (kind === "LR") keys = [30, 10, 20];
  else keys = [10, 30, 20];
  // Mix in extras from input for a bigger tree after demo
  const extras = input.values.filter((k) => !keys.includes(k)).slice(0, 3);
  let root: BinNode | null = null;
  push(t, root, {}, `AVL ${kind} rotation demo.`);
  for (const key of keys) {
    root = insertKey(t, root, ids, key);
  }
  for (const key of extras) root = insertKey(t, root, ids, key);
  push(t, root, {}, `${kind} demo complete.`);
  return t.frames;
}

export function avlLL(input: TreeInput) {
  return forceRotateDemo("LL", input);
}
export function avlRR(input: TreeInput) {
  return forceRotateDemo("RR", input);
}
export function avlLR(input: TreeInput) {
  return forceRotateDemo("LR", input);
}
export function avlRL(input: TreeInput) {
  return forceRotateDemo("RL", input);
}
