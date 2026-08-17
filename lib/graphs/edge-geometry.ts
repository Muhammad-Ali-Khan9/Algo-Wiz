import type { GraphNode } from "./types";

export type EdgeSegment =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "curve"; d: string };

export type EdgeDraw = {
  segments: EdgeSegment[];
  mx: number;
  my: number;
  /** Suggested weight-badge radius in viewBox units. */
  badgeR: number;
};

function distPoint(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

export function edgeNodeClearance(nodeRadius: number, badgeR = 2) {
  return nodeRadius + badgeR + 1.6;
}

export function distPointToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-9) return distPoint(px, py, ax, ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  // Ignore zones that sit inside the endpoint disks.
  if (t < 0.1 || t > 0.9) return Number.POSITIVE_INFINITY;
  return distPoint(px, py, ax + t * dx, ay + t * dy);
}

export function segmentClearsNodes(
  nodes: GraphNode[],
  u: number,
  v: number,
  clearance: number,
): boolean {
  const a = nodes[u];
  const b = nodes[v];
  if (!a || !b) return false;
  for (const node of nodes) {
    if (node.id === u || node.id === v) continue;
    if (distPointToSegment(node.x, node.y, a.x, a.y, b.x, b.y) < clearance) {
      return false;
    }
  }
  return true;
}

function quadPoint(
  t: number,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
) {
  const o = 1 - t;
  return {
    x: o * o * x0 + 2 * o * t * cx + t * t * x1,
    y: o * o * y0 + 2 * o * t * cy + t * t * y1,
  };
}

function lerp(ax: number, ay: number, bx: number, by: number, t: number) {
  return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t };
}

function splitQuadAt(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  t: number,
) {
  const p01 = lerp(x0, y0, cx, cy, t);
  const p12 = lerp(cx, cy, x1, y1, t);
  const mid = lerp(p01.x, p01.y, p12.x, p12.y, t);
  return {
    left: { x0, y0, cx: p01.x, cy: p01.y, x1: mid.x, y1: mid.y },
    right: { x0: mid.x, y0: mid.y, cx: p12.x, cy: p12.y, x1, y1 },
  };
}

/** Minimum distance from a path (and optional mid badge) to any foreign node. */
function pathClearanceScore(
  nodes: GraphNode[],
  u: number,
  v: number,
  x1: number,
  y1: number,
  cx: number | null,
  cy: number | null,
  x2: number,
  y2: number,
  badgeR: number,
): number {
  let min = Number.POSITIVE_INFINITY;
  const samples: { x: number; y: number }[] = [];
  if (cx == null || cy == null) {
    for (let i = 1; i <= 9; i += 1) {
      const t = i / 10;
      samples.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
    }
  } else {
    for (let i = 1; i <= 11; i += 1) {
      samples.push(quadPoint(i / 12, x1, y1, cx, cy, x2, y2));
    }
  }
  const mid =
    cx == null || cy == null
      ? { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
      : quadPoint(0.5, x1, y1, cx, cy, x2, y2);

  for (const node of nodes) {
    if (node.id === u || node.id === v) continue;
    for (const p of samples) {
      min = Math.min(min, distPoint(p.x, p.y, node.x, node.y));
    }
    // Weight badge must also clear the foreign disk.
    min = Math.min(min, distPoint(mid.x, mid.y, node.x, node.y) - badgeR);
  }
  return min;
}

function lineSegmentsWithGap(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  gapHalf: number,
): { segments: EdgeSegment[]; mx: number; my: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const g = Math.min(gapHalf, len * 0.28);
  return {
    mx,
    my,
    segments: [
      {
        kind: "line",
        x1,
        y1,
        x2: mx - ux * g,
        y2: my - uy * g,
      },
      {
        kind: "line",
        x1: mx + ux * g,
        y1: my + uy * g,
        x2,
        y2,
      },
    ],
  };
}

function curveSegmentsWithGap(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  gapHalf: number,
): { segments: EdgeSegment[]; mx: number; my: number } {
  const mid = quadPoint(0.5, x0, y0, cx, cy, x1, y1);
  const chord = distPoint(x0, y0, x1, y1);
  const ctrl = distPoint(x0, y0, cx, cy) + distPoint(cx, cy, x1, y1);
  const approxLen = (chord + ctrl) / 2;
  const gapT = Math.min(0.2, gapHalf / Math.max(approxLen, 1));

  const leftCut = splitQuadAt(x0, y0, cx, cy, x1, y1, 0.5 - gapT).left;
  const rightCut = splitQuadAt(x0, y0, cx, cy, x1, y1, 0.5 + gapT).right;

  return {
    mx: mid.x,
    my: mid.y,
    segments: [
      {
        kind: "curve",
        d: `M ${leftCut.x0} ${leftCut.y0} Q ${leftCut.cx} ${leftCut.cy} ${leftCut.x1} ${leftCut.y1}`,
      },
      {
        kind: "curve",
        d: `M ${rightCut.x0} ${rightCut.y0} Q ${rightCut.cx} ${rightCut.cy} ${rightCut.x1} ${rightCut.y1}`,
      },
    ],
  };
}

/**
 * Draw an edge that only belongs to its two endpoints: it stops at node rims,
 * stays clear of every other node (including the weight badge), and gaps the
 * stroke for the mid-edge weight.
 */
export function edgeDrawGeometry(
  a: GraphNode,
  b: GraphNode,
  nodes: GraphNode[],
  nodeRadius: number,
  options?: { badgeR?: number; showWeight?: boolean },
): EdgeDraw {
  const badgeR = options?.badgeR ?? (nodeRadius >= 7 ? 2.4 : 1.75);
  const showWeight = options?.showWeight !== false;
  const gapHalf = showWeight ? badgeR + 0.55 : 0;
  // Keep stroke + badge outside other node disks.
  const clearance = edgeNodeClearance(nodeRadius, showWeight ? badgeR : 0);

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const pad = Math.min(nodeRadius + 0.3, len * 0.42);
  const x1 = a.x + ux * pad;
  const y1 = a.y + uy * pad;
  const x2 = b.x - ux * pad;
  const y2 = b.y - uy * pad;

  const nx = -uy;
  const ny = ux;
  const straightScore = pathClearanceScore(
    nodes,
    a.id,
    b.id,
    x1,
    y1,
    null,
    null,
    x2,
    y2,
    showWeight ? badgeR : 0,
  );

  if (straightScore >= clearance) {
    if (!showWeight || gapHalf <= 0) {
      return {
        segments: [{ kind: "line", x1, y1, x2, y2 }],
        mx: (x1 + x2) / 2,
        my: (y1 + y2) / 2,
        badgeR,
      };
    }
    const split = lineSegmentsWithGap(x1, y1, x2, y2, gapHalf);
    return { ...split, badgeR };
  }

  // Search bows that clear other nodes; pick the safest that still works.
  type Cand = { cx: number; cy: number; score: number };
  const candidates: Cand[] = [];
  const mags = [6, 10, 14, 18, 24, 30, 38, 48, 60];
  for (const sign of [1, -1] as const) {
    for (const mag of mags) {
      const cx = (a.x + b.x) / 2 + nx * sign * mag;
      const cy = (a.y + b.y) / 2 + ny * sign * mag;
      const score = pathClearanceScore(
        nodes,
        a.id,
        b.id,
        x1,
        y1,
        cx,
        cy,
        x2,
        y2,
        showWeight ? badgeR : 0,
      );
      if (score >= clearance) candidates.push({ cx, cy, score });
    }
  }

  let chosen: { cx: number; cy: number } | null = null;
  if (candidates.length) {
    candidates.sort((p, q) => q.score - p.score);
    chosen = candidates[0]!;
  } else {
    // Last resort: furthest sampled bow even if still tight.
    let best: Cand | null = null;
    for (const sign of [1, -1] as const) {
      for (const mag of [20, 32, 44, 58, 72]) {
        const cx = (a.x + b.x) / 2 + nx * sign * mag;
        const cy = (a.y + b.y) / 2 + ny * sign * mag;
        const score = pathClearanceScore(
          nodes,
          a.id,
          b.id,
          x1,
          y1,
          cx,
          cy,
          x2,
          y2,
          showWeight ? badgeR : 0,
        );
        if (!best || score > best.score) best = { cx, cy, score };
      }
    }
    chosen = best;
  }

  if (!chosen) {
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    chosen = { cx: midX + nx * 40, cy: midY + ny * 40 };
  }

  if (!showWeight || gapHalf <= 0) {
    const mid = quadPoint(0.5, x1, y1, chosen.cx, chosen.cy, x2, y2);
    return {
      segments: [
        {
          kind: "curve",
          d: `M ${x1} ${y1} Q ${chosen.cx} ${chosen.cy} ${x2} ${y2}`,
        },
      ],
      mx: mid.x,
      my: mid.y,
      badgeR,
    };
  }

  const split = curveSegmentsWithGap(x1, y1, chosen.cx, chosen.cy, x2, y2, gapHalf);
  return { ...split, badgeR };
}
