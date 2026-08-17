import { layoutBinary, type LayoutBin } from "./layout";
import type { TreeVizEdge, TreeVizNode } from "./types";

export class BinNode {
  left: BinNode | null = null;
  right: BinNode | null = null;
  parent: BinNode | null = null;
  height = 1;
  color: "R" | "B" = "B";

  constructor(
    public id: number,
    public key: number,
  ) {}
}

export class IdGen {
  private next = 0;
  take() {
    const id = this.next;
    this.next += 1;
    return id;
  }
  peek() {
    return this.next;
  }
}

export function toLayout(node: BinNode | null): LayoutBin | null {
  if (!node) return null;
  return {
    id: node.id,
    key: node.key,
    left: toLayout(node.left),
    right: toLayout(node.right),
    color: node.color,
    height: node.height,
    balance: (node.left?.height ?? 0) - (node.right?.height ?? 0),
  };
}

export function sceneFrom(
  root: BinNode | null,
  labelMode: "key" | "avl" | "rb" = "key",
): {
  nodes: TreeVizNode[];
  edges: TreeVizEdge[];
  labels: Record<number, string>;
  fills?: Record<number, string>;
} {
  const laid = layoutBinary(toLayout(root));
  const labels: Record<number, string> = {};
  const fills: Record<number, string> = {};

  const walk = (node: BinNode | null) => {
    if (!node) return;
    if (labelMode === "avl") {
      const bf = (node.left?.height ?? 0) - (node.right?.height ?? 0);
      labels[node.id] = `${node.key}|${bf >= 0 ? "+" : ""}${bf}`;
    } else if (labelMode === "rb") {
      labels[node.id] = String(node.key);
      fills[node.id] = node.color === "R" ? "#ef4444" : "#0f172a";
    } else {
      labels[node.id] = String(node.key);
    }
    walk(node.left);
    walk(node.right);
  };
  walk(root);

  return {
    nodes: laid.nodes,
    edges: laid.edges,
    labels,
    fills: labelMode === "rb" ? fills : undefined,
  };
}

export function bstInsertSilent(root: BinNode | null, node: BinNode): BinNode {
  if (!root) return node;
  let cur: BinNode = root;
  for (;;) {
    if (node.key < cur.key) {
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
  return root;
}

export function buildBst(keys: number[], ids: IdGen): BinNode | null {
  let root: BinNode | null = null;
  for (const key of keys) {
    root = bstInsertSilent(root, new BinNode(ids.take(), key));
  }
  return root;
}

/** Balanced-ish binary tree from sorted order via recursive midpoint. */
export function buildBalanced(keys: number[], ids: IdGen): BinNode | null {
  const sorted = [...keys].sort((a, b) => a - b);
  const build = (lo: number, hi: number, parent: BinNode | null): BinNode | null => {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const node = new BinNode(ids.take(), sorted[mid]!);
    node.parent = parent;
    node.left = build(lo, mid - 1, node);
    node.right = build(mid + 1, hi, node);
    return node;
  };
  return build(0, sorted.length - 1, null);
}

export function findNode(root: BinNode | null, key: number): BinNode | null {
  let cur = root;
  while (cur) {
    if (key === cur.key) return cur;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return null;
}

export function subtreeMin(node: BinNode): BinNode {
  let cur = node;
  while (cur.left) cur = cur.left;
  return cur;
}

export function subtreeMax(node: BinNode): BinNode {
  let cur = node;
  while (cur.right) cur = cur.right;
  return cur;
}

export function heightOf(node: BinNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(heightOf(node.left), heightOf(node.right));
}

export function refreshHeight(node: BinNode | null) {
  if (!node) return 0;
  node.height = 1 + Math.max(node.left?.height ?? 0, node.right?.height ?? 0);
  return node.height;
}

export function rotateRight(y: BinNode): BinNode {
  const x = y.left!;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  if (t2) t2.parent = y;
  x.parent = y.parent;
  y.parent = x;
  if (x.parent) {
    if (x.parent.left === y) x.parent.left = x;
    else x.parent.right = x;
  }
  refreshHeight(y);
  refreshHeight(x);
  return x;
}

export function rotateLeft(x: BinNode): BinNode {
  const y = x.right!;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  if (t2) t2.parent = x;
  y.parent = x.parent;
  x.parent = y;
  if (y.parent) {
    if (y.parent.left === x) y.parent.left = y;
    else y.parent.right = y;
  }
  refreshHeight(x);
  refreshHeight(y);
  return y;
}
