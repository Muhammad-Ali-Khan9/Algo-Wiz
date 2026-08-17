import type { GraphData, GraphEdge, GraphKind, GraphNode } from "./types";

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dist(a: GraphNode, b: GraphNode) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function weightBetween(a: GraphNode, b: GraphNode, rand: () => number, scale = 1) {
  return Math.max(
    1,
    Math.round((dist(a, b) / 9) * scale + 1 + rand() * 4),
  );
}

function gridShape(n: number, rand: () => number): { cols: number; rows: number } {
  const options: { cols: number; rows: number }[] = [];
  for (let cols = 2; cols <= n; cols += 1) {
    const rows = Math.ceil(n / cols);
    if (rows < 2) continue;
    if (cols * (rows - 1) >= n && rows > 2) continue;
    const waste = cols * rows - n;
    if (waste > cols) continue;
    options.push({ cols, rows });
  }
  if (!options.length) {
    const cols = Math.ceil(Math.sqrt(n));
    return { cols, rows: Math.ceil(n / cols) };
  }
  options.sort(
    (a, b) =>
      Math.abs(a.cols - a.rows) - Math.abs(b.cols - b.rows) ||
      a.cols * a.rows - b.cols * b.rows,
  );
  const top = options.slice(0, Math.min(4, options.length));
  return top[Math.floor(rand() * top.length)]!;
}

function pickEndpoints(n: number, rand: () => number) {
  const start = Math.floor(rand() * n);
  let goal = Math.floor(rand() * n);
  if (goal === start) goal = (start + Math.max(1, Math.floor(n / 2))) % n;
  return { start, goal };
}

function buildEdges(
  nodes: GraphNode[],
  pairs: [number, number][],
  rand: () => number,
  weightScale = 1,
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const linked = new Set<string>();
  const key = (u: number, v: number) => (u < v ? `${u}-${v}` : `${v}-${u}`);
  let id = 0;
  for (const [u, v] of pairs) {
    if (u === v) continue;
    const k = key(u, v);
    if (linked.has(k)) continue;
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

function placeOnGrid(
  n: number,
  cols: number,
  rows: number,
  rand: () => number,
  minStep: number,
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
  const pad = minStep >= 44 ? 5 : minStep >= 30 ? 7 : 10;
  const maxSpan = 100 - pad * 2;
  const rawW = useCols <= 1 ? 0 : (useCols - 1) * minStep;
  const rawH = useRows <= 1 ? 0 : (useRows - 1) * minStep;
  const scale = Math.min(1, maxSpan / Math.max(rawW, 1), maxSpan / Math.max(rawH, 1));
  const stepX = minStep * scale;
  const stepY = minStep * scale;
  const gridW = (useCols - 1) * stepX;
  const gridH = (useRows - 1) * stepY;
  const originX = (100 - gridW) / 2;
  const originY = (100 - gridH) / 2;

  const nodes: GraphNode[] = [];
  const at: (number | null)[][] = Array.from({ length: useRows }, () =>
    Array.from({ length: useCols }, () => null),
  );

  for (let i = 0; i < n; i += 1) {
    const r = Math.floor(i / useCols);
    const c = i % useCols;
    const gx = flipX ? useCols - 1 - c : c;
    const gy = flipY ? useRows - 1 - r : r;
    nodes.push({
      id: i,
      x: originX + gx * stepX,
      y: originY + gy * stepY,
      label: String(i),
    });
    at[r]![c] = i;
  }

  return { nodes, at, cols: useCols, rows: useRows };
}

function randomLatticeGraph(
  n: number,
  rand: () => number,
  minStep: number,
): GraphData {
  const shape = gridShape(n, rand);
  const { nodes, at, cols, rows } = placeOnGrid(
    n,
    shape.cols,
    shape.rows,
    rand,
    minStep,
  );
  const pairs: [number, number][] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const u = at[r]![c];
      if (u == null) continue;
      if (c + 1 < cols) {
        const v = at[r]![c + 1];
        if (v != null) pairs.push([u, v]);
      }
      if (r + 1 < rows) {
        const v = at[r + 1]![c];
        if (v != null) pairs.push([u, v]);
      }
    }
  }

  for (let r = 0; r < rows - 1; r += 1) {
    for (let c = 0; c < cols - 1; c += 1) {
      const a = at[r]![c];
      const b = at[r + 1]![c + 1];
      const c1 = at[r]![c + 1];
      const d = at[r + 1]![c];
      if (a != null && b != null && rand() < 0.3) pairs.push([a, b]);
      if (c1 != null && d != null && rand() < 0.22) pairs.push([c1, d]);
    }
  }

  return { nodes, edges: buildEdges(nodes, pairs, rand), ...pickEndpoints(n, rand) };
}

function completeGraph(n: number, rand: () => number, minStep: number): GraphData {
  const shape = gridShape(n, rand);
  const { nodes } = placeOnGrid(n, shape.cols, shape.rows, rand, minStep);
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) pairs.push([i, j]);
  }
  return { nodes, edges: buildEdges(nodes, pairs, rand), ...pickEndpoints(n, rand) };
}

function bipartiteGraph(n: number, rand: () => number, minStep: number): GraphData {
  void minStep;
  const left = Math.ceil(n / 2);
  const right = n - left;
  const pad = 12;
  const nodes: GraphNode[] = [];
  for (let i = 0; i < left; i += 1) {
    const t = left === 1 ? 0.5 : i / (left - 1);
    nodes.push({
      id: i,
      x: pad + 16,
      y: pad + t * (100 - pad * 2),
      label: String(i),
    });
  }
  for (let i = 0; i < right; i += 1) {
    const t = right === 1 ? 0.5 : i / (right - 1);
    nodes.push({
      id: left + i,
      x: 100 - pad - 16,
      y: pad + t * (100 - pad * 2),
      label: String(left + i),
    });
  }
  const pairs: [number, number][] = [];
  for (let i = 0; i < left; i += 1) {
    for (let j = 0; j < right; j += 1) {
      if (rand() < 0.5 || pairs.length < n - 1) pairs.push([i, left + j]);
    }
  }
  return { nodes, edges: buildEdges(nodes, pairs, rand), ...pickEndpoints(n, rand) };
}

function treeGraph(n: number, rand: () => number, minStep: number): GraphData {
  const children: number[][] = Array.from({ length: n }, () => []);
  const parent = new Array(n).fill(-1);

  // Grow a rooted tree: bias toward nodes with fewer children so it fans out like a real tree.
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

  const pad = Math.max(8, Math.min(14, Math.round(minStep / 3)));
  const top = pad + 2;
  const bottom = 100 - pad - 2;
  const left = pad + 2;
  const right = 100 - pad - 2;
  const spanY = bottom - top;

  const xs = new Array(n).fill(50);
  const ys = new Array(n).fill(50);

  const place = (u: number, x0: number, x1: number) => {
    xs[u] = (x0 + x1) / 2;
    ys[u] =
      maxDepth === 0 ? (top + bottom) / 2 : top + (depth[u]! / maxDepth) * spanY;
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

  // Tiny sibling spread when a node has one child so edges don't stack vertically on the same x.
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

  const pairs: [number, number][] = [];
  for (let i = 1; i < n; i += 1) pairs.push([parent[i]!, i]);

  const leaves = nodes.map((_, i) => i).filter((i) => children[i]!.length === 0);
  const start = 0;
  const goal =
    leaves[Math.floor(rand() * leaves.length)] ??
    Math.max(1, n - 1);

  return {
    nodes,
    edges: buildEdges(nodes, pairs, rand),
    start,
    goal: goal === start && n > 1 ? 1 : goal,
  };
}

function dagGraph(n: number, rand: () => number, minStep: number): GraphData {
  const shape = gridShape(n, rand);
  const { nodes } = placeOnGrid(n, shape.cols, shape.rows, rand, minStep);
  const order = [...nodes.keys()].sort(
    (a, b) => nodes[a]!.x - nodes[b]!.x || nodes[a]!.y - nodes[b]!.y,
  );
  const pairs: [number, number][] = [];
  for (let i = 0; i < order.length; i += 1) {
    const u = order[i]!;
    const span = 1 + Math.floor(rand() * 2);
    for (let k = 1; k <= span && i + k < order.length; k += 1) {
      if (k === 1 || rand() < 0.65) pairs.push([u, order[i + k]!]);
    }
  }
  return { nodes, edges: buildEdges(nodes, pairs, rand), ...pickEndpoints(n, rand) };
}

function cycleGraph(n: number, rand: () => number, minStep: number): GraphData {
  void minStep;
  const pad = 14;
  const radius = 50 - pad;
  const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      id: i,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      label: String(i),
    };
  });
  const pairs: [number, number][] = Array.from({ length: n }, (_, i) => [
    i,
    (i + 1) % n,
  ]);
  return { nodes, edges: buildEdges(nodes, pairs, rand), ...pickEndpoints(n, rand) };
}

function gridGraph(n: number, rand: () => number, minStep: number): GraphData {
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const placed = placeOnGrid(n, cols, rows, rand, minStep);
  const pairs: [number, number][] = [];
  for (let r = 0; r < placed.rows; r += 1) {
    for (let c = 0; c < placed.cols; c += 1) {
      const u = placed.at[r]?.[c];
      if (u == null) continue;
      if (c + 1 < placed.cols) {
        const v = placed.at[r]![c + 1];
        if (v != null) pairs.push([u, v]);
      }
      if (r + 1 < placed.rows) {
        const v = placed.at[r + 1]?.[c];
        if (v != null) pairs.push([u, v]);
      }
    }
  }
  return {
    nodes: placed.nodes,
    edges: buildEdges(placed.nodes, pairs, rand),
    ...pickEndpoints(n, rand),
  };
}

export function generateGraph(
  kind: GraphKind = "random",
  nodeCount = 10,
  seed = Date.now(),
  options?: { minStep?: number },
): GraphData {
  const rand = mulberry32(seed >>> 0);
  const n = Math.max(4, Math.min(12, nodeCount));
  const minStep = options?.minStep ?? 24;

  switch (kind) {
    case "complete":
      return completeGraph(n, rand, minStep);
    case "bipartite":
      return bipartiteGraph(n, rand, minStep);
    case "tree":
      return treeGraph(n, rand, minStep);
    case "dag":
      return dagGraph(n, rand, minStep);
    case "cycle":
      return cycleGraph(n, rand, minStep);
    case "grid":
      return gridGraph(n, rand, minStep);
    case "random":
    default:
      return randomLatticeGraph(n, rand, minStep);
  }
}

export function randomGraph(
  nodeCount = 10,
  seed = Date.now(),
  options?: { minStep?: number },
): GraphData {
  return generateGraph("random", nodeCount, seed, options);
}
