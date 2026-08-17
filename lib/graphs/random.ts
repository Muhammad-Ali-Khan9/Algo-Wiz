import { edgeNodeClearance, segmentClearsNodes } from "./edge-geometry";
import type { GraphData, GraphEdge, GraphKind, GraphNode } from "./types";

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mix wall-clock entropy so rapid shuffles still diverge. */
export function shuffleSeed(extra = 0): number {
  const a = Date.now() >>> 0;
  const b = Math.floor(Math.random() * 0x100000000) >>> 0;
  const c = (performance?.now?.() ?? 0) * 1000;
  return (a ^ b ^ (c >>> 0) ^ (extra >>> 0)) >>> 0;
}

function dist(a: GraphNode, b: GraphNode) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function weightBetween(a: GraphNode, b: GraphNode, rand: () => number, scale = 1) {
  return Math.max(1, Math.round((dist(a, b) / 9) * scale + 1 + rand() * 5));
}

function edgeKey(u: number, v: number) {
  return u < v ? `${u}-${v}` : `${v}-${u}`;
}

function buildAdj(n: number, pairs: [number, number][], undirected = true): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of pairs) {
    adj[u]!.push(v);
    if (undirected) adj[v]!.push(u);
  }
  return adj;
}

function hopDistances(n: number, start: number, adj: number[][]): number[] {
  const distHops = new Array(n).fill(Infinity);
  distHops[start] = 0;
  const q = [start];
  for (let qi = 0; qi < q.length; qi += 1) {
    const u = q[qi]!;
    for (const v of adj[u]!) {
      if (Number.isFinite(distHops[v]!)) continue;
      distHops[v] = distHops[u]! + 1;
      q.push(v);
    }
  }
  return distHops;
}

/**
 * Prefer start/goal that are far in hop distance and geometry.
 * Falls back to farthest Euclidean pair if the graph is disconnected.
 */
function pickFarEndpoints(
  nodes: GraphNode[],
  pairs: [number, number][],
  rand: () => number,
  options?: { undirected?: boolean; preferSides?: [number[], number[]] },
): { start: number; goal: number } {
  const n = nodes.length;
  if (n < 2) return { start: 0, goal: 0 };

  const undirected = options?.undirected !== false;
  const adj = buildAdj(n, pairs, undirected);

  type Candidate = {
    start: number;
    goal: number;
    hops: number;
    score: number;
  };
  const candidates: Candidate[] = [];

  const starts = options?.preferSides?.[0] ?? nodes.map((_, i) => i);
  const goals = options?.preferSides?.[1] ?? nodes.map((_, i) => i);

  const maxGeo = Math.max(...nodes.flatMap((a) => nodes.map((b) => dist(a, b))), 1);

  for (const start of starts) {
    const hops = hopDistances(n, start, adj);
    for (const goal of goals) {
      if (goal === start) continue;
      const hop = hops[goal]!;
      if (!Number.isFinite(hop)) continue;
      const geo = dist(nodes[start]!, nodes[goal]!) / maxGeo;
      // Hop distance dominates; geometry only breaks ties.
      const score = hop * 10 + geo * 2.5 + rand() * 0.08;
      candidates.push({ start, goal, hops: hop, score });
    }
  }

  if (!candidates.length) {
    // Disconnected: pick farthest Euclidean pair from preferred sides.
    let best = { start: starts[0] ?? 0, goal: goals[0] ?? 1, d: -1 };
    for (const s of starts) {
      for (const g of goals) {
        if (s === g) continue;
        const d = dist(nodes[s]!, nodes[g]!);
        if (d > best.d) best = { start: s, goal: g, d };
      }
    }
    return {
      start: best.start,
      goal: best.goal === best.start ? Math.min(1, n - 1) : best.goal,
    };
  }

  const maxHops = Math.max(...candidates.map((c) => c.hops));
  // Keep only near-diameter pairs so start/goal stay far apart.
  const far = candidates.filter((c) => c.hops >= Math.max(1, maxHops - 1));
  far.sort((a, b) => b.score - a.score);
  const tier = Math.max(2, Math.min(5, Math.ceil(far.length * 0.2)));
  const pick = far[Math.floor(rand() * Math.min(tier, far.length))]!;
  return { start: pick.start, goal: pick.goal };
}

function gridShape(
  n: number,
  rand: () => number,
  preferSquare = false,
): { cols: number; rows: number } {
  const options: { cols: number; rows: number }[] = [];
  for (let cols = 2; cols <= n; cols += 1) {
    const rows = Math.ceil(n / cols);
    if (rows < 2) continue;
    const waste = cols * rows - n;
    if (waste > Math.max(2, cols)) continue;
    options.push({ cols, rows });
  }
  if (!options.length) {
    const cols = Math.ceil(Math.sqrt(n));
    return { cols, rows: Math.ceil(n / cols) };
  }
  const squarer = [...options].sort(
    (a, b) =>
      Math.abs(a.cols - a.rows) - Math.abs(b.cols - b.rows) ||
      a.cols * a.rows - b.cols * b.rows,
  );
  // Large nodes need squarer packs so spacing survives fitting.
  if (preferSquare) {
    return squarer[Math.floor(rand() * Math.min(3, squarer.length))]!;
  }
  const elongated = [...options].sort(
    (a, b) =>
      Math.abs(b.cols - b.rows) - Math.abs(a.cols - a.rows) ||
      b.cols * b.rows - a.cols * a.rows,
  );
  const pool = [
    ...squarer.slice(0, Math.min(3, squarer.length)),
    ...elongated.slice(0, Math.min(2, elongated.length)),
  ];
  return pool[Math.floor(rand() * pool.length)]!;
}

function buildEdges(
  nodes: GraphNode[],
  pairs: [number, number][],
  rand: () => number,
  weightScale = 1,
  options?: { allowThroughNodes?: boolean; clearance?: number },
): GraphEdge[] {
  const clearance = options?.clearance ?? edgeNodeClearance(3.6);
  const edges: GraphEdge[] = [];
  const linked = new Set<string>();
  let id = 0;
  for (const [u, v] of pairs) {
    if (u === v) continue;
    const k = edgeKey(u, v);
    if (linked.has(k)) continue;
    if (!options?.allowThroughNodes && !segmentClearsNodes(nodes, u, v, clearance)) {
      continue;
    }
    linked.add(k);
    edges.push({
      id,
      u,
      v,
      weight: weightBetween(nodes[u]!, nodes[v]!, rand, weightScale),
    });
    id += 1;
  }
  return edges;
}

/** Spanning-tree backbone (always kept) plus optional clear extras. */
function assembleClearPairs(
  nodes: GraphNode[],
  backbone: [number, number][],
  extras: [number, number][],
  clearance: number,
): [number, number][] {
  const pairs: [number, number][] = [];
  const linked = new Set<string>();
  for (const [u, v] of backbone) addPair(pairs, linked, u, v);
  for (const [u, v] of extras) {
    if (!segmentClearsNodes(nodes, u, v, clearance)) continue;
    addPair(pairs, linked, u, v);
  }
  return pairs;
}

function layoutClearance(minStep: number, nodeRadius?: number) {
  const r = nodeRadius ?? (minStep >= 44 ? 10.5 : minStep >= 30 ? 4.8 : 3.6);
  return edgeNodeClearance(r, r >= 7 ? 2.5 : 1.85);
}

function refineEdgesAfterLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  clearance: number,
  rand: () => number,
): GraphEdge[] {
  if (nodes.length < 2) return edges;
  const parent = new Map<number, number>();
  const find = (x: number): number => {
    let p = parent.get(x) ?? x;
    while (p !== (parent.get(p) ?? p)) p = parent.get(p)!;
    parent.set(x, p);
    return p;
  };
  const unite = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent.set(rb, ra);
    return true;
  };
  for (const node of nodes) parent.set(node.id, node.id);

  const sorted = [...edges].sort(
    (a, b) => dist(nodes[a.u]!, nodes[a.v]!) - dist(nodes[b.u]!, nodes[b.v]!),
  );
  const backbone: [number, number][] = [];
  const extras: [number, number][] = [];
  for (const edge of sorted) {
    if (unite(edge.u, edge.v)) backbone.push([edge.u, edge.v]);
    else extras.push([edge.u, edge.v]);
  }
  const root = nodes[0]!.id;
  for (const node of nodes) {
    if (find(node.id) === find(root)) continue;
    let best: [number, number] | null = null;
    let bestD = Infinity;
    for (const other of nodes) {
      if (find(other.id) !== find(root)) continue;
      const d = dist(node, other);
      if (d < bestD) {
        bestD = d;
        best = [node.id, other.id];
      }
    }
    if (best) {
      backbone.push(best);
      unite(best[0], best[1]);
    }
  }

  const pairs = assembleClearPairs(nodes, backbone, extras, clearance);
  return buildEdges(nodes, pairs, rand, 1, {
    allowThroughNodes: true,
    clearance,
  });
}

function enforceMinSeparation(nodes: GraphNode[], minDist: number, iterations = 28) {
  if (nodes.length < 2 || minDist <= 0) return;
  for (let iter = 0; iter < iterations; iter += 1) {
    let moved = false;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        if (d >= minDist) continue;
        const push = (minDist - d) / 2;
        const ux = dx / d;
        const uy = dy / d;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
        moved = true;
      }
    }
    if (!moved) break;
  }
}

function minCenterDistance(minStep: number, nodeRadius?: number) {
  const radius = nodeRadius ?? (minStep >= 44 ? 10.5 : minStep >= 30 ? 4.8 : 3.6);
  // Large disks need generous breathing room so labels/edges stay readable.
  const gap = radius >= 7 ? 24 : radius >= 4 ? 7 : 2.4;
  return Math.max(radius * 2 + gap, minStep >= 44 ? minStep * 0.78 : 0);
}

function placeOnGrid(
  n: number,
  cols: number,
  rows: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): { nodes: GraphNode[]; at: (number | null)[][]; cols: number; rows: number } {
  let useCols = cols;
  let useRows = rows;
  if (rand() < 0.5) {
    const tmp = useCols;
    useCols = useRows;
    useRows = tmp;
    if (useCols * useRows < n) {
      useCols = Math.ceil(Math.sqrt(n));
      useRows = Math.ceil(n / useCols);
    }
  }

  const flipX = rand() < 0.5;
  const flipY = rand() < 0.5;
  const radius = nodeRadius ?? (minStep >= 44 ? 10.5 : minStep >= 30 ? 4.8 : 3.6);
  const minCenter = minCenterDistance(minStep, radius);
  const edgePad = Math.max(minStep >= 44 ? 10 : minStep >= 30 ? 8 : 10, radius + 2);
  const maxSpan = Math.max(40, 100 - edgePad * 2);
  const rawW = useCols <= 1 ? 0 : (useCols - 1) * minStep;
  const rawH = useRows <= 1 ? 0 : (useRows - 1) * minStep;
  let scale = Math.min(1, maxSpan / Math.max(rawW, 1), maxSpan / Math.max(rawH, 1));
  // Never compress closer than minCenter — overflow is fine (viewBox zooms out).
  if (minStep * scale < minCenter) {
    scale = minCenter / Math.max(minStep, 1);
  }
  const stepX = minStep * scale;
  const stepY = minStep * scale;
  const gridW = (useCols - 1) * stepX;
  const gridH = (useRows - 1) * stepY;
  const originX = (100 - gridW) / 2;
  const originY = (100 - gridH) / 2;

  const slots: { r: number; c: number }[] = [];
  for (let r = 0; r < useRows; r += 1) {
    for (let c = 0; c < useCols; c += 1) slots.push({ r, c });
  }
  if (rand() < 0.45) {
    for (let i = slots.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = slots[i]!;
      slots[i] = slots[j]!;
      slots[j] = tmp;
    }
  } else if (rand() < 0.5) {
    slots.sort((a, b) => a.r - b.r || (a.r % 2 === 0 ? a.c - b.c : b.c - a.c));
  }

  const nodes: GraphNode[] = [];
  const at: (number | null)[][] = Array.from({ length: useRows }, () =>
    Array.from({ length: useCols }, () => null),
  );

  const slack = Math.max(0, Math.min(stepX, stepY) - minCenter);
  const jitter =
    Math.min(stepX, stepY) *
    (minStep >= 44 ? 0.012 : 0.03 + rand() * 0.04) *
    (slack > 1 ? 1 : 0.25);

  for (let i = 0; i < n; i += 1) {
    const slot = slots[i]!;
    const gx = flipX ? useCols - 1 - slot.c : slot.c;
    const gy = flipY ? useRows - 1 - slot.r : slot.r;
    const jx = (rand() - 0.5) * 2 * jitter;
    const jy = (rand() - 0.5) * 2 * jitter;
    nodes.push({
      id: i,
      x: originX + gx * stepX + jx,
      y: originY + gy * stepY + jy,
      label: String(i),
    });
    at[slot.r]![slot.c] = i;
  }

  enforceMinSeparation(nodes, minCenter);
  return { nodes, at, cols: useCols, rows: useRows };
}

function addPair(
  pairs: [number, number][],
  linked: Set<string>,
  u: number | null | undefined,
  v: number | null | undefined,
) {
  if (u == null || v == null || u === v) return;
  const k = edgeKey(u, v);
  if (linked.has(k)) return;
  linked.add(k);
  pairs.push([u, v]);
}

/** Spanning tree over occupied cells so the graph stays connected. */
function spanningTreePairs(
  at: (number | null)[][],
  rows: number,
  cols: number,
  rand: () => number,
): [number, number][] {
  const cells: { r: number; c: number; id: number }[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const id = at[r]![c];
      if (id != null) cells.push({ r, c, id });
    }
  }
  if (cells.length < 2) return [];

  const parent = new Map<number, number>();
  const find = (x: number): number => {
    let p = parent.get(x) ?? x;
    while (p !== (parent.get(p) ?? p)) p = parent.get(p)!;
    return p;
  };
  const unite = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent.set(rb, ra);
    return true;
  };
  for (const cell of cells) parent.set(cell.id, cell.id);

  const candidates: [number, number][] = [];
  for (const cell of cells) {
    const { r, c, id } = cell;
    const neighbors = [
      at[r]?.[c + 1],
      at[r + 1]?.[c],
      at[r + 1]?.[c + 1],
      at[r + 1]?.[c - 1],
    ];
    for (const v of neighbors) {
      if (v != null) candidates.push([id, v]);
    }
  }
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = candidates[i]!;
    candidates[i] = candidates[j]!;
    candidates[j] = tmp;
  }

  const tree: [number, number][] = [];
  for (const [u, v] of candidates) {
    if (unite(u, v)) tree.push([u, v]);
    if (tree.length >= cells.length - 1) break;
  }

  // If still disconnected (sparse occupancy), star leftover to first cell.
  const root = cells[0]!.id;
  for (const cell of cells) {
    if (find(cell.id) !== find(root)) {
      tree.push([root, cell.id]);
      unite(root, cell.id);
    }
  }
  return tree;
}

function randomLatticeGraph(
  n: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): GraphData {
  const shape = gridShape(n, rand, minStep >= 44);
  const { nodes, at, cols, rows } = placeOnGrid(
    n,
    shape.cols,
    shape.rows,
    rand,
    minStep,
    nodeRadius,
  );
  const backbone = spanningTreePairs(at, rows, cols, rand);
  const extras: [number, number][] = [];
  const linked = new Set<string>();

  // Orthogonal neighbors (clear on a lattice).
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const u = at[r]![c];
      if (u == null) continue;
      if (rand() < 0.94) {
        const v = at[r]![c + 1];
        if (v != null) extras.push([u, v]);
      }
      if (rand() < 0.94) {
        const v = at[r + 1]?.[c];
        if (v != null) extras.push([u, v]);
      }
      // Skip links only when the middle cell is empty (won't cut a node).
      if (rand() < 0.4 && at[r]![c + 1] == null) {
        const v = at[r]![c + 2];
        if (v != null) extras.push([u, v]);
      }
      if (rand() < 0.4 && at[r + 1]?.[c] == null) {
        const v = at[r + 2]?.[c];
        if (v != null) extras.push([u, v]);
      }
    }
  }

  // Diagonals + knight leaps (filtered for clearance later).
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const u = at[r]![c];
      if (u == null) continue;
      if (rand() < 0.55) {
        const v = at[r + 1]?.[c + 1];
        if (v != null) extras.push([u, v]);
      }
      if (rand() < 0.45) {
        const v = at[r + 1]?.[c - 1];
        if (v != null) extras.push([u, v]);
      }
      if (rand() < 0.28) {
        const v = at[r + 2]?.[c + 1];
        if (v != null) extras.push([u, v]);
      }
      if (rand() < 0.28) {
        const v = at[r + 1]?.[c + 2];
        if (v != null) extras.push([u, v]);
      }
      if (rand() < 0.14) {
        const v = at[r + 2]?.[c + 2];
        if (v != null) extras.push([u, v]);
      }
    }
  }

  const ids = nodes.map((node) => node.id);
  const chordCount = 2 + Math.floor(rand() * Math.max(2, Math.floor(n / 2)));
  for (let i = 0; i < chordCount; i += 1) {
    const a = ids[Math.floor(rand() * ids.length)]!;
    let b = ids[Math.floor(rand() * ids.length)]!;
    let guard = 0;
    while ((b === a || dist(nodes[a]!, nodes[b]!) < 32) && guard < 16) {
      b = ids[Math.floor(rand() * ids.length)]!;
      guard += 1;
    }
    if (a !== b) extras.push([a, b]);
  }

  void linked;
  const clearance = layoutClearance(minStep, nodeRadius);
  const pairs = assembleClearPairs(nodes, backbone, extras, clearance);

  return {
    nodes,
    edges: buildEdges(nodes, pairs, rand, 1, {
      allowThroughNodes: true,
      clearance,
    }),
    ...pickFarEndpoints(nodes, pairs, rand),
  };
}

function completeGraph(
  n: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): GraphData {
  const shape = gridShape(n, rand, minStep >= 44);
  const { nodes } = placeOnGrid(n, shape.cols, shape.rows, rand, minStep, nodeRadius);
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) pairs.push([i, j]);
  }
  const clearance = layoutClearance(minStep, nodeRadius);
  // Prefer geometrically short edges as the connected backbone of K_n.
  const sorted = [...pairs].sort(
    (a, b) => dist(nodes[a[0]]!, nodes[a[1]]!) - dist(nodes[b[0]]!, nodes[b[1]]!),
  );
  const backbone: [number, number][] = [];
  const extras: [number, number][] = [];
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number =>
    parent[x] === x ? x : (parent[x] = find(parent[x]!));
  for (const [u, v] of sorted) {
    const ru = find(u);
    const rv = find(v);
    if (ru === rv) extras.push([u, v]);
    else {
      parent[rv] = ru;
      backbone.push([u, v]);
    }
  }
  const kept = assembleClearPairs(nodes, backbone, extras, clearance);
  return {
    nodes,
    edges: buildEdges(nodes, kept, rand, 1, {
      allowThroughNodes: true,
      clearance,
    }),
    ...pickFarEndpoints(nodes, kept, rand),
  };
}

function bipartiteGraph(
  n: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): GraphData {
  const left = Math.ceil(n / 2);
  const right = n - left;
  const radius = nodeRadius ?? (minStep >= 44 ? 10.5 : 3.6);
  const minCenter = minCenterDistance(minStep, radius);
  const pad = Math.max(12, radius + 4);
  const colX = Math.max(pad + radius, 18);
  const nodes: GraphNode[] = [];
  for (let i = 0; i < left; i += 1) {
    const t = left === 1 ? 0.5 : i / (left - 1);
    const spanY = Math.max(100 - pad * 2, (left - 1) * minCenter);
    const originY = (100 - spanY) / 2;
    nodes.push({
      id: i,
      x: colX + (rand() - 0.5) * 1.5,
      y: originY + t * spanY,
      label: String(i),
    });
  }
  for (let i = 0; i < right; i += 1) {
    const t = right === 1 ? 0.5 : i / (right - 1);
    const spanY = Math.max(100 - pad * 2, (right - 1) * minCenter);
    const originY = (100 - spanY) / 2;
    nodes.push({
      id: left + i,
      x: 100 - colX + (rand() - 0.5) * 1.5,
      y: originY + t * spanY,
      label: String(left + i),
    });
  }
  enforceMinSeparation(nodes, minCenter);

  const pairs: [number, number][] = [];
  const linked = new Set<string>();
  // Guarantee each left/right vertex has ≥1 edge, then densify.
  for (let i = 0; i < left; i += 1) {
    addPair(pairs, linked, i, left + Math.floor(rand() * right));
  }
  for (let j = 0; j < right; j += 1) {
    addPair(pairs, linked, Math.floor(rand() * left), left + j);
  }
  for (let i = 0; i < left; i += 1) {
    for (let j = 0; j < right; j += 1) {
      if (rand() < 0.72) addPair(pairs, linked, i, left + j);
    }
  }

  const leftIds = Array.from({ length: left }, (_, i) => i);
  const rightIds = Array.from({ length: right }, (_, i) => left + i);
  const clearance = layoutClearance(minStep, nodeRadius);
  const edges = buildEdges(nodes, pairs, rand, 1, { clearance });
  const edgePairs = edges.map((e) => [e.u, e.v] as [number, number]);
  return {
    nodes,
    edges,
    ...pickFarEndpoints(nodes, edgePairs, rand, {
      preferSides: [leftIds, rightIds],
    }),
  };
}

function treeGraph(
  n: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): GraphData {
  const children: number[][] = Array.from({ length: n }, () => []);
  const parent = new Array(n).fill(-1);

  for (let i = 1; i < n; i += 1) {
    const weighted: number[] = [];
    for (let p = 0; p < i; p += 1) {
      const slots = Math.max(1, 3 - children[p]!.length);
      for (let k = 0; k < slots; k += 1) weighted.push(p);
    }
    const p = weighted[Math.floor(rand() * weighted.length)]!;
    parent[i] = p;
    children[p]!.push(i);
  }

  const leafCount = new Array(n).fill(0);
  const countLeaves = (u: number): number => {
    const kids = children[u]!;
    if (!kids.length) {
      leafCount[u] = 1;
      return 1;
    }
    let sum = 0;
    for (const c of kids) sum += countLeaves(c);
    leafCount[u] = sum;
    return sum;
  };
  countLeaves(0);

  const depth = new Array(n).fill(0);
  const setDepth = (u: number, d: number) => {
    depth[u] = d;
    for (const c of children[u]!) setDepth(c, d + 1);
  };
  setDepth(0, 0);
  const maxDepth = Math.max(...depth, 0);

  const radius = nodeRadius ?? (minStep >= 44 ? 10.5 : 3.6);
  const minCenter = minCenterDistance(minStep, radius);
  const pad = Math.max(8, Math.min(16, Math.round(minStep / 3)), radius + 3);
  const top = pad + 2;
  const bottom = Math.max(top + maxDepth * minCenter, 100 - pad - 2);
  const left = pad + 2;
  const right = Math.max(
    left + (n > 1 ? minCenter * Math.ceil(n / 2) : 0),
    100 - pad - 2,
  );
  const spanY = bottom - top;

  const xs = new Array(n).fill(50);
  const ys = new Array(n).fill(50);

  const place = (u: number, x0: number, x1: number) => {
    xs[u] = (x0 + x1) / 2;
    ys[u] = maxDepth === 0 ? (top + bottom) / 2 : top + (depth[u]! / maxDepth) * spanY;
    const kids = children[u]!;
    if (!kids.length) return;
    let cursor = x0;
    const width = x1 - x0;
    for (const c of kids) {
      const share = (leafCount[c]! / leafCount[u]!) * width;
      place(c, cursor, cursor + share);
      cursor += share;
    }
  };
  place(0, left, right);

  for (let u = 0; u < n; u += 1) {
    const kids = children[u]!;
    if (kids.length === 1) {
      const c = kids[0]!;
      const nudge = (rand() < 0.5 ? -1 : 1) * Math.min(4, (right - left) * 0.04);
      xs[c] = Math.min(right, Math.max(left, xs[c]! + nudge));
    }
  }

  const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: xs[i]!,
    y: ys[i]!,
    label: String(i),
  }));
  enforceMinSeparation(nodes, minCenter);

  const pairs: [number, number][] = [];
  for (let i = 1; i < n; i += 1) pairs.push([parent[i]!, i]);

  const leaves = nodes
    .map((_, i) => i)
    .filter((i) => children[i]!.length === 0)
    .sort((a, b) => depth[b]! - depth[a]!);

  // Prefer two deep leaves that are far apart geometrically (not always root→leaf).
  let start = 0;
  let goal = leaves[0] ?? Math.max(1, n - 1);
  if (leaves.length >= 2) {
    const deep = leaves.slice(0, Math.max(2, Math.ceil(leaves.length * 0.6)));
    let best = { start: deep[0]!, goal: deep[1]!, score: -1 };
    for (const s of deep) {
      for (const g of deep) {
        if (s === g) continue;
        // LCA hop distance ≈ depth[s] + depth[g] - 2*depth[lca]; use geometry + depth sum.
        const score =
          depth[s]! + depth[g]! + dist(nodes[s]!, nodes[g]!) / 20 + rand() * 0.1;
        if (score > best.score) best = { start: s, goal: g, score };
      }
    }
    start = best.start;
    goal = best.goal;
  } else if (n > 1) {
    start = 0;
    goal = leaves[0] ?? n - 1;
  }

  return {
    nodes,
    edges: buildEdges(nodes, pairs, rand, 1, {
      allowThroughNodes: true,
      clearance: layoutClearance(minStep, nodeRadius),
    }),
    start,
    goal: goal === start && n > 1 ? (leaves[0] ?? 1) : goal,
  };
}

function dagGraph(
  n: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): GraphData {
  const shape = gridShape(n, rand, minStep >= 44);
  const { nodes } = placeOnGrid(n, shape.cols, shape.rows, rand, minStep, nodeRadius);
  const order = [...nodes.keys()].sort(
    (a, b) => nodes[a]!.x - nodes[b]!.x || nodes[a]!.y - nodes[b]!.y,
  );
  const backbone: [number, number][] = [];
  const extras: [number, number][] = [];
  const linked = new Set<string>();

  for (let i = 0; i < order.length - 1; i += 1) {
    addPair(backbone, linked, order[i], order[i + 1]);
  }
  for (let i = 0; i < order.length; i += 1) {
    const u = order[i]!;
    const maxSpan = 3 + Math.floor(rand() * 4);
    for (let k = 2; k <= maxSpan && i + k < order.length; k += 1) {
      if (rand() < 0.7 / k) extras.push([u, order[i + k]!]);
    }
  }

  const clearance = layoutClearance(minStep, nodeRadius);
  const pairs = assembleClearPairs(nodes, backbone, extras, clearance);
  const early = order.slice(0, Math.max(1, Math.ceil(order.length * 0.28)));
  const late = order.slice(Math.floor(order.length * 0.72));
  return {
    nodes,
    edges: buildEdges(nodes, pairs, rand, 1, {
      allowThroughNodes: true,
      clearance,
    }),
    ...pickFarEndpoints(nodes, pairs, rand, {
      undirected: false,
      preferSides: [early, late.length ? late : order.slice(-1)],
    }),
  };
}

function cycleGraph(
  n: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): GraphData {
  const radiusNode = nodeRadius ?? (minStep >= 44 ? 10.5 : 3.6);
  const minCenter = minCenterDistance(minStep, radiusNode);
  // Chord length between adjacent ring nodes ≈ 2 R sin(π/n); solve for R.
  const ringRadius = Math.max(
    50 - (12 + rand() * 4),
    minCenter / (2 * Math.sin(Math.PI / Math.max(n, 3))),
  );
  const spin = rand() * Math.PI * 2;
  const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => {
    const angle = spin + (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      id: i,
      x: 50 + Math.cos(angle) * ringRadius,
      y: 50 + Math.sin(angle) * ringRadius,
      label: String(i),
    };
  });
  enforceMinSeparation(nodes, minCenter);
  const backbone: [number, number][] = Array.from({ length: n }, (_, i) => [
    i,
    (i + 1) % n,
  ]);
  const extras: [number, number][] = [];
  const chordTries = Math.max(2, Math.floor(n / 2));
  for (let i = 0; i < chordTries; i += 1) {
    if (rand() > 0.7) continue;
    const a = Math.floor(rand() * n);
    const span = 2 + Math.floor(rand() * Math.max(1, Math.floor(n / 2)));
    extras.push([a, (a + span) % n]);
  }
  const clearance = layoutClearance(minStep, radiusNode);
  const pairs = assembleClearPairs(nodes, backbone, extras, clearance);

  // Near-antipodal start/goal on the ring.
  const start = Math.floor(rand() * n);
  const antipode = Math.floor(n / 2);
  const jitter = Math.floor(rand() * Math.max(1, Math.floor(n / 6)));
  const goal = (start + antipode + (rand() < 0.5 ? -jitter : jitter) + n) % n;
  return {
    nodes,
    edges: buildEdges(nodes, pairs, rand, 1, {
      allowThroughNodes: true,
      clearance,
    }),
    start,
    goal: goal === start ? (start + 1) % n : goal,
  };
}

function gridGraph(
  n: number,
  rand: () => number,
  minStep: number,
  nodeRadius?: number,
): GraphData {
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const placed = placeOnGrid(n, cols, rows, rand, minStep, nodeRadius);
  const backbone = spanningTreePairs(placed.at, placed.rows, placed.cols, rand);
  const extras: [number, number][] = [];

  for (let r = 0; r < placed.rows; r += 1) {
    for (let c = 0; c < placed.cols; c += 1) {
      const u = placed.at[r]?.[c];
      if (u == null) continue;
      const right = placed.at[r]![c + 1];
      const down = placed.at[r + 1]?.[c];
      if (right != null) extras.push([u, right]);
      if (down != null) extras.push([u, down]);
      if (rand() < 0.4 && placed.at[r]![c + 1] == null) {
        const skip = placed.at[r]![c + 2];
        if (skip != null) extras.push([u, skip]);
      }
      if (rand() < 0.4 && placed.at[r + 1]?.[c] == null) {
        const skip = placed.at[r + 2]?.[c];
        if (skip != null) extras.push([u, skip]);
      }
      if (rand() < 0.45) {
        const diag = placed.at[r + 1]?.[c + 1];
        if (diag != null) extras.push([u, diag]);
      }
      if (rand() < 0.35) {
        const diag = placed.at[r + 1]?.[c - 1];
        if (diag != null) extras.push([u, diag]);
      }
    }
  }

  const clearance = layoutClearance(minStep, nodeRadius);
  const pairs = assembleClearPairs(placed.nodes, backbone, extras, clearance);

  return {
    nodes: placed.nodes,
    edges: buildEdges(placed.nodes, pairs, rand, 1, {
      allowThroughNodes: true,
      clearance,
    }),
    ...pickFarEndpoints(placed.nodes, pairs, rand),
  };
}

export function generateGraph(
  kind: GraphKind = "random",
  nodeCount = 10,
  seed = Date.now(),
  options?: { minStep?: number; nodeRadius?: number },
): GraphData {
  const mixed = (seed ^ Math.imul(seed, 0x9e3779b9) ^ (seed >>> 16)) >>> 0;
  const rand = mulberry32(mixed);
  for (let i = 0; i < 6 + (mixed % 5); i += 1) rand();

  const n = Math.max(4, Math.min(14, nodeCount));
  const minStep = options?.minStep ?? 24;
  const nodeRadius = options?.nodeRadius;

  let graph: GraphData;
  switch (kind) {
    case "complete":
      graph = completeGraph(n, rand, minStep, nodeRadius);
      break;
    case "bipartite":
      graph = bipartiteGraph(n, rand, minStep, nodeRadius);
      break;
    case "tree":
      graph = treeGraph(n, rand, minStep, nodeRadius);
      break;
    case "dag":
      graph = dagGraph(n, rand, minStep, nodeRadius);
      break;
    case "cycle":
      graph = cycleGraph(n, rand, minStep, nodeRadius);
      break;
    case "grid":
      graph = gridGraph(n, rand, minStep, nodeRadius);
      break;
    case "random":
    default:
      graph = randomLatticeGraph(n, rand, minStep, nodeRadius);
      break;
  }

  enforceMinSeparation(graph.nodes, minCenterDistance(minStep, nodeRadius));
  const clearance = layoutClearance(minStep, nodeRadius);
  graph = {
    ...graph,
    edges: refineEdgesAfterLayout(graph.nodes, graph.edges, clearance, rand),
  };
  // Re-pick far endpoints against the pruned edge set when possible.
  if (graph.edges.length) {
    const pairs = graph.edges.map((e) => [e.u, e.v] as [number, number]);
    const ends = pickFarEndpoints(graph.nodes, pairs, rand);
    graph = { ...graph, ...ends };
  }
  return graph;
}

export function randomGraph(
  nodeCount = 10,
  seed = Date.now(),
  options?: { minStep?: number; nodeRadius?: number },
): GraphData {
  return generateGraph("random", nodeCount, seed, options);
}
