import type { GraphNode } from "./types";

export function spreadNodesForRadius(
  nodes: GraphNode[],
  nodeRadius: number,
  gap = 8,
): GraphNode[] {
  if (nodes.length < 2) return nodes;

  const minCenter = nodeRadius * 2 + gap;
  let closest = Infinity;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const d = Math.hypot(nodes[i]!.x - nodes[j]!.x, nodes[i]!.y - nodes[j]!.y);
      if (d > 0 && d < closest) closest = d;
    }
  }
  if (!Number.isFinite(closest) || closest >= minCenter) return nodes;

  const scale = minCenter / closest;
  let cx = 0;
  let cy = 0;
  for (const node of nodes) {
    cx += node.x;
    cy += node.y;
  }
  cx /= nodes.length;
  cy /= nodes.length;

  return nodes.map((node) => ({
    ...node,
    x: round(cx + (node.x - cx) * scale),
    y: round(cy + (node.y - cy) * scale),
  }));
}

export function fitGraphViewBox(
  nodes: GraphNode[],
  nodeRadius: number,
  options?: { labelPad?: number; edgePad?: number },
): string {
  if (!nodes.length) return "0 0 100 100";

  const labelPad = options?.labelPad ?? Math.max(2.5, nodeRadius * 0.55 + 1.8);
  const edgePad = options?.edgePad ?? Math.max(8, nodeRadius * 1.1 + 4);
  const pad = nodeRadius + Math.max(labelPad, edgePad);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  }

  minX -= pad;
  minY -= pad;
  maxX += pad;
  maxY += pad;

  // Already fits the design canvas — keep a stable frame.
  if (minX >= 0 && minY >= 0 && maxX <= 100 && maxY <= 100) {
    return "0 0 100 100";
  }

  // Pull in a little of the unused side so the zoom stays balanced.
  minX = Math.min(minX, 0);
  minY = Math.min(minY, 0);
  maxX = Math.max(maxX, 100);
  maxY = Math.max(maxY, 100);

  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  return `${round(minX)} ${round(minY)} ${round(width)} ${round(height)}`;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
