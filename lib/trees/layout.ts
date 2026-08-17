import type { TreeVizEdge, TreeVizNode } from "./types";

export type LayoutBin = {
  id: number;
  key: number | string;
  left: LayoutBin | null;
  right: LayoutBin | null;
  color?: "R" | "B";
  height?: number;
  balance?: number;
  extra?: string;
};

export type LayoutNary = {
  id: number;
  key: number | string;
  children: LayoutNary[];
  extra?: string;
};

/** Assign inorder x-slots then place in a fixed canvas. */
export function layoutBinary(
  root: LayoutBin | null,
  options?: { top?: number; bottom?: number; left?: number; right?: number },
): { nodes: TreeVizNode[]; edges: TreeVizEdge[]; idOrder: number[] } {
  const top = options?.top ?? 10;
  const bottom = options?.bottom ?? 90;
  const left = options?.left ?? 8;
  const right = options?.right ?? 92;

  const order: LayoutBin[] = [];
  const walk = (node: LayoutBin | null) => {
    if (!node) return;
    walk(node.left);
    order.push(node);
    walk(node.right);
  };
  walk(root);

  const depthOf = new Map<number, number>();
  const measure = (node: LayoutBin | null, d: number) => {
    if (!node) return;
    depthOf.set(node.id, d);
    measure(node.left, d + 1);
    measure(node.right, d + 1);
  };
  measure(root, 0);
  const maxDepth = Math.max(0, ...depthOf.values());

  const indexOf = new Map<number, number>();
  order.forEach((node, i) => indexOf.set(node.id, i));

  const nodes: TreeVizNode[] = [];
  const edges: TreeVizEdge[] = [];
  let edgeId = 0;

  const place = (node: LayoutBin | null) => {
    if (!node) return;
    const i = indexOf.get(node.id) ?? 0;
    const d = depthOf.get(node.id) ?? 0;
    const x =
      order.length <= 1
        ? (left + right) / 2
        : left + (i / Math.max(order.length - 1, 1)) * (right - left);
    const y = maxDepth === 0 ? top : top + (d / maxDepth) * (bottom - top);
    const label =
      node.extra ?? (typeof node.key === "number" ? String(node.key) : String(node.key));
    nodes.push({ id: node.id, x, y, label });
    if (node.left) {
      edges.push({ id: edgeId++, u: node.id, v: node.left.id });
      place(node.left);
    }
    if (node.right) {
      edges.push({ id: edgeId++, u: node.id, v: node.right.id });
      place(node.right);
    }
  };
  place(root);

  return { nodes, edges, idOrder: order.map((n) => n.id) };
}

/** Level-order complete binary layout (heaps / segment trees). */
export function layoutComplete(
  values: { id: number; label: string; extra?: string }[],
  options?: { top?: number; bottom?: number; left?: number; right?: number },
): { nodes: TreeVizNode[]; edges: TreeVizEdge[] } {
  const top = options?.top ?? 10;
  const bottom = options?.bottom ?? 88;
  const left = options?.left ?? 6;
  const right = options?.right ?? 94;
  const n = values.length;
  if (n === 0) return { nodes: [], edges: [] };

  const depth = Math.floor(Math.log2(n));
  const nodes: TreeVizNode[] = [];
  const edges: TreeVizEdge[] = [];

  for (let i = 0; i < n; i += 1) {
    const d = Math.floor(Math.log2(i + 1));
    const levelStart = 2 ** d - 1;
    const pos = i - levelStart;
    const levelCount = Math.min(2 ** d, n - levelStart);
    const x =
      levelCount <= 1
        ? (left + right) / 2
        : left + ((pos + 0.5) / levelCount) * (right - left);
    const y = depth === 0 ? top : top + (d / depth) * (bottom - top);
    nodes.push({
      id: values[i]!.id,
      x,
      y,
      label: values[i]!.extra ?? values[i]!.label,
    });
    if (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      edges.push({ id: i - 1, u: values[parent]!.id, v: values[i]!.id });
    }
  }
  return { nodes, edges };
}

/** Hierarchical n-ary layout (tries). */
export function layoutNary(
  root: LayoutNary | null,
  options?: { top?: number; bottom?: number; left?: number; right?: number },
): { nodes: TreeVizNode[]; edges: TreeVizEdge[] } {
  const top = options?.top ?? 8;
  const bottom = options?.bottom ?? 92;
  const left = options?.left ?? 6;
  const right = options?.right ?? 94;
  if (!root) return { nodes: [], edges: [] };

  const depths = new Map<number, number>();
  let maxDepth = 0;
  const measure = (node: LayoutNary, d: number) => {
    depths.set(node.id, d);
    maxDepth = Math.max(maxDepth, d);
    for (const child of node.children) measure(child, d + 1);
  };
  measure(root, 0);

  type Slot = { node: LayoutNary; left: number; right: number };
  const slots: Slot[] = [];
  const assign = (node: LayoutNary, L: number, R: number) => {
    slots.push({ node, left: L, right: R });
    if (!node.children.length) return;
    const span = (R - L) / node.children.length;
    node.children.forEach((child, i) => {
      assign(child, L + i * span, L + (i + 1) * span);
    });
  };
  assign(root, left, right);

  const nodes: TreeVizNode[] = [];
  const edges: TreeVizEdge[] = [];
  let edgeId = 0;
  const pos = new Map<number, { x: number; y: number }>();

  for (const { node, left: L, right: R } of slots) {
    const d = depths.get(node.id) ?? 0;
    const x = (L + R) / 2;
    const y = maxDepth === 0 ? top : top + (d / maxDepth) * (bottom - top);
    pos.set(node.id, { x, y });
    nodes.push({
      id: node.id,
      x,
      y,
      label: node.extra ?? String(node.key),
    });
  }

  const link = (node: LayoutNary) => {
    for (const child of node.children) {
      edges.push({ id: edgeId++, u: node.id, v: child.id });
      link(child);
    }
  };
  link(root);

  return { nodes, edges };
}
