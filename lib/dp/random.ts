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

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

const WORD_BREAK_CASES: { text: string; words: string[] }[] = [
  { text: "leetcode", words: ["leet", "code"] },
  { text: "applepenapple", words: ["apple", "pen"] },
  { text: "catsandog", words: ["cats", "dog", "sand", "and", "cat"] },
  { text: "catsanddog", words: ["cats", "dog", "sand", "and", "cat"] },
  { text: "aaaaaaa", words: ["a", "aa", "aaa"] },
  { text: "pineapplepen", words: ["apple", "pen", "pine", "pineapple"] },
];

const LPS_WORDS = ["bbbab", "cbbd", "aacabdkacaa", "character", "racecar", "abanana"];

function randWord(rand: () => number, len: number): string {
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += LETTERS[Math.floor(rand() * 26)]!;
  }
  return out;
}

function relatedPair(rand: () => number, lenA: number, lenB: number): [string, string] {
  const shared = randWord(rand, Math.max(2, Math.min(lenA, lenB) - 1));
  const a = (randWord(rand, Math.max(0, lenA - shared.length)) + shared).slice(0, lenA);
  const b = (shared + randWord(rand, Math.max(0, lenB - shared.length))).slice(0, lenB);
  return [a || "ab", b || "a"];
}

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
    textA: "",
    textB: "",
    words: [],
    treeLeft: [],
    treeRight: [],
    graphEdges: [],
  };
}

function randomBinaryTree(
  count: number,
  rand: () => number,
  valueFn: () => number,
): { values: number[]; treeLeft: (number | null)[]; treeRight: (number | null)[] } {
  const n = Math.max(1, count);
  const values = Array.from({ length: n }, () => valueFn());
  const treeLeft: (number | null)[] = Array.from({ length: n }, () => null);
  const treeRight: (number | null)[] = Array.from({ length: n }, () => null);
  const open: { id: number; slots: ("L" | "R")[] }[] = [{ id: 0, slots: ["L", "R"] }];

  for (let i = 1; i < n; i += 1) {
    const pick = open[Math.floor(rand() * open.length)]!;
    const slot = pick.slots.splice(Math.floor(rand() * pick.slots.length), 1)[0]!;
    if (slot === "L") treeLeft[pick.id] = i;
    else treeRight[pick.id] = i;
    if (pick.slots.length === 0) {
      const idx = open.indexOf(pick);
      if (idx >= 0) open.splice(idx, 1);
    }
    open.push({ id: i, slots: ["L", "R"] });
  }

  return { values, treeLeft, treeRight };
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

  if (id === "lcs" || id === "edit-distance") {
    const lenA = Math.max(3, Math.min(Math.round(size / 2) + 1, 6));
    const lenB = Math.max(3, Math.min(lenA - 1 + Math.floor(rand() * 2), 6));
    const [textA, textB] = relatedPair(rand, lenA, lenB);
    return { ...base, n: Math.max(lenA, lenB), textA, textB };
  }

  if (id === "word-break") {
    const pick = WORD_BREAK_CASES[Math.floor(rand() * WORD_BREAK_CASES.length)]!;
    return {
      ...base,
      n: pick.text.length,
      textA: pick.text,
      words: [...pick.words],
    };
  }

  if (id === "palindromic-subsequence") {
    const len = Math.max(4, Math.min(Math.round(size / 2) + 2, 7));
    const textA =
      rand() > 0.35
        ? LPS_WORDS[Math.floor(rand() * LPS_WORDS.length)]!.slice(0, len)
        : randWord(rand, len);
    return { ...base, n: textA.length, textA };
  }

  if (id === "lis" || id === "bitonic-subsequence") {
    const len = Math.max(5, Math.min(size, 10));
    const values = Array.from({ length: len }, () => 1 + Math.floor(rand() * 20));
    return { ...base, n: len, values };
  }

  if (id === "matrix-chain") {
    const matrices = Math.max(3, Math.min(Math.round(size / 2) + 1, 5));
    const values = Array.from(
      { length: matrices + 1 },
      () => 5 + Math.floor(rand() * 20),
    );
    return { ...base, n: matrices, values };
  }

  if (id === "burst-balloons") {
    const len = Math.max(3, Math.min(Math.round(size / 2) + 1, 5));
    const values = Array.from({ length: len }, () => 1 + Math.floor(rand() * 9));
    return { ...base, n: len, values };
  }

  if (id === "palindrome-partitioning") {
    const picks = ["aab", "a", "ab", "abbab", "ababbbabbababa", "aaabaa"];
    const textA =
      rand() > 0.3
        ? picks[Math.floor(rand() * picks.length)]!
        : randWord(rand, Math.max(3, Math.min(Math.round(size / 2) + 1, 6)));
    return { ...base, n: textA.length, textA };
  }

  if (id === "tree-diameter") {
    const count = Math.max(5, Math.min(size, 9));
    const tree = randomBinaryTree(count, rand, () => 1 + Math.floor(rand() * 20));
    return { ...base, n: count, ...tree };
  }

  if (id === "maximum-path-sum") {
    const count = Math.max(5, Math.min(size, 9));
    const tree = randomBinaryTree(count, rand, () => Math.floor(rand() * 21) - 5);
    return { ...base, n: count, ...tree };
  }

  if (id === "dag-dp") {
    const count = Math.max(4, Math.min(Math.round(size / 2) + 2, 7));
    const graphEdges: { u: number; v: number; weight: number }[] = [];
    for (let u = 0; u < count; u += 1) {
      for (let v = u + 1; v < count; v += 1) {
        if (rand() < 0.55 || v === u + 1) {
          graphEdges.push({
            u,
            v,
            weight: 1 + Math.floor(rand() * 9),
          });
        }
      }
    }
    if (graphEdges.length === 0) {
      for (let u = 0; u < count - 1; u += 1) {
        graphEdges.push({ u, v: u + 1, weight: 1 + Math.floor(rand() * 5) });
      }
    }
    return { ...base, n: count, graphEdges };
  }

  if (id === "tsp") {
    const count = Math.max(3, Math.min(Math.round(size / 3) + 2, 4));
    const graphEdges: { u: number; v: number; weight: number }[] = [];
    for (let u = 0; u < count; u += 1) {
      for (let v = u + 1; v < count; v += 1) {
        graphEdges.push({
          u,
          v,
          weight: 1 + Math.floor(rand() * 9),
        });
      }
    }
    return { ...base, n: count, graphEdges };
  }

  if (id === "assignment") {
    const count = Math.max(3, Math.min(Math.round(size / 3) + 2, 4));
    const grid = Array.from({ length: count }, () =>
      Array.from({ length: count }, () => 1 + Math.floor(rand() * 9)),
    );
    return { ...base, n: count, rows: count, cols: count, grid };
  }

  if (id === "minimax") {
    const depth = Math.max(1, Math.min(Math.round(size / 5) + 1, 3));
    const leaves = 1 << depth;
    const values = Array.from({ length: leaves }, () => 1 + Math.floor(rand() * 12));
    return { ...base, n: depth, values };
  }

  if (id === "optimal-strategy") {
    const len = Math.max(4, Math.min(Math.round(size / 2) + 2, 6));
    const values = Array.from({ length: len }, () => 1 + Math.floor(rand() * 20));
    return { ...base, n: len, values };
  }

  return {
    ...base,
    n: Math.max(5, Math.min(n, 16)),
  };
}
