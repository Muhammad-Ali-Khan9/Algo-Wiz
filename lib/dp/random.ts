import type { DpAlgoId, DpInput } from "./types";

export function shuffleSeed(n = 1): number {
  const a = (Math.sin(n * 12.9898) * 43758.5453) % 1;
  return Math.floor(Math.abs(a) * 1e9) ^ (Date.now() & 0xffff);
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const COIN_SETS = [
  [1, 2, 5],
  [1, 3, 4],
  [1, 5, 10, 25],
  [2, 3, 5],
  [1, 4, 6],
];

function makeGrid(
  rows: number,
  cols: number,
  rand: () => number,
  kind: "cost" | "dungeon",
): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => {
      if (kind === "cost") return 1 + Math.floor(rand() * 9);
      const v = Math.floor(rand() * 21) - 10;
      return v === 0 ? -1 : v;
    }),
  );
}

function baseInput(n: number): DpInput {
  return {
    n,
    values: [],
    coins: [],
    amount: 0,
    rows: 0,
    cols: 0,
    grid: [],
    weights: [],
    profits: [],
    capacity: 0,
  };
}

export function generateDpInput(id: DpAlgoId, size: number, seed: number): DpInput {
  const rand = mulberry32(seed);
  const n = Math.max(3, Math.min(size, 18));
  const base = baseInput(n);

  if (id === "house-robber") {
    return {
      ...base,
      values: Array.from({ length: n }, () => 1 + Math.floor(rand() * 20)),
    };
  }

  if (id === "coin-change") {
    const coins = COIN_SETS[Math.floor(rand() * COIN_SETS.length)]!;
    const amount = Math.max(6, Math.min(4 + n, 30));
    return { ...base, n: amount, coins: [...coins], amount };
  }

  if (id === "unique-paths" || id === "min-path-sum" || id === "dungeon-game") {
    const dim = Math.max(3, Math.min(Math.round(size / 2), 5));
    const rows = dim;
    const cols = Math.max(3, Math.min(dim + (rand() > 0.5 ? 1 : 0), 5));
    if (id === "unique-paths") {
      return { ...base, n: rows * cols, rows, cols };
    }
    const kind = id === "dungeon-game" ? "dungeon" : "cost";
    const grid = makeGrid(rows, cols, rand, kind);
    if (id === "dungeon-game") {
      grid[rows - 1]![cols - 1] = -Math.abs(grid[rows - 1]![cols - 1]! || 5);
    }
    return { ...base, n: rows * cols, rows, cols, grid };
  }

  if (id === "knapsack-01" || id === "knapsack-unbounded" || id === "subset-sum") {
    const count = Math.max(3, Math.min(Math.round(size / 2), 5));
    const weights = Array.from({ length: count }, () => 1 + Math.floor(rand() * 5));
    if (id === "subset-sum") {
      const capacity = Math.max(
        5,
        Math.min(weights.reduce((a, b) => a + b, 0) - 1, 4 + Math.floor(rand() * 8)),
      );
      return { ...base, n: count, weights, capacity };
    }
    const profits = weights.map((w) => w + 1 + Math.floor(rand() * 6));
    const capacity = Math.max(
      5,
      Math.min(
        6 + Math.floor(rand() * 6),
        weights.reduce((a, b) => a + b, 0),
      ),
    );
    return { ...base, n: count, weights, profits, capacity };
  }

  return {
    ...base,
    n: Math.max(5, Math.min(n, 16)),
  };
}
