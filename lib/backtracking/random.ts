import type { BacktrackingAlgoId, BacktrackingInput } from "./types";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleSeed(n: number) {
  return ((n * 1103515245 + 12345) >>> 0) % 1_000_000;
}

/** Map UI size slider (5–16) into a small combinatorial n. */
function comboN(size: number, max = 5): number {
  return Math.max(3, Math.min(Math.round(size / 3) + 1, max));
}

const SUDOKU_PUZZLES: string[][][] = [
  [
    ["1", ".", ".", "4"],
    [".", ".", "1", "."],
    [".", "3", ".", "."],
    ["2", ".", ".", "3"],
  ],
  [
    [".", "2", ".", "."],
    [".", ".", ".", "1"],
    ["4", ".", ".", "."],
    [".", ".", "3", "."],
  ],
  [
    ["1", "2", ".", "."],
    [".", ".", ".", "3"],
    [".", ".", "4", "."],
    [".", ".", ".", "1"],
  ],
];

export function generateBacktrackingInput(
  id: BacktrackingAlgoId,
  size: number,
  seed: number,
): BacktrackingInput {
  const rand = mulberry32(seed);
  const base: BacktrackingInput = {
    values: [],
    k: 2,
    target: 8,
    n: 4,
  };

  if (id === "permutations") {
    const n = comboN(size, 4);
    const values = Array.from({ length: n }, (_, i) => i + 1);
    return { ...base, n, values };
  }

  if (id === "combinations") {
    const n = comboN(size, 6);
    const k = Math.max(2, Math.min(Math.round(n / 2), 3));
    const values = Array.from({ length: n }, (_, i) => i + 1);
    return { ...base, n, k, values };
  }

  if (id === "subsets") {
    const n = comboN(size, 4);
    const values = Array.from({ length: n }, (_, i) => i + 1);
    return { ...base, n, values };
  }

  if (id === "combination-sum") {
    const n = comboN(size, 4);
    const values = Array.from({ length: n }, () => 2 + Math.floor(rand() * 6));
    values.sort((a, b) => a - b);
    const unique = [...new Set(values)];
    while (unique.length < n) {
      unique.push(2 + Math.floor(rand() * 7));
      unique.sort((a, b) => a - b);
    }
    const candidates = unique.slice(0, n);
    const target = Math.max(
      candidates[0]! * 2,
      Math.min(
        candidates.reduce((a, b) => a + b, 0),
        candidates[0]! + candidates[candidates.length - 1]! * 2 + Math.floor(rand() * 4),
      ),
    );
    return { ...base, n: candidates.length, values: candidates, target };
  }

  if (id === "n-queens") {
    const n = size <= 8 ? 4 : 5;
    return { ...base, n };
  }

  if (id === "sudoku") {
    const puzzle = SUDOKU_PUZZLES[Math.floor(rand() * SUDOKU_PUZZLES.length)]!;
    return { ...base, n: 4, grid: puzzle.map((row) => row.slice()) };
  }

  if (id === "graph-coloring") {
    const n = Math.max(3, Math.min(Math.round(size / 4) + 2, 5));
    const k = n <= 3 ? 2 : 3;
    const pairs: [number, number][] = [];
    for (let i = 0; i < n; i += 1) pairs.push([i, (i + 1) % n]);
    if (n >= 4 && rand() > 0.4) pairs.push([0, 2]);
    if (n >= 5 && rand() > 0.5) pairs.push([1, 3]);
    return { ...base, n, k, pairs };
  }

  // crossword — larger open grids (4×4 / 5×5) with decoy bank words
  const puzzles: { grid: string[][]; words: string[] }[] = [
    {
      grid: [
        [".", ".", ".", "."],
        [".", ".", ".", "."],
        [".", ".", ".", "."],
        [".", ".", ".", "."],
      ],
      // Word square: CASE / AREA / REAR / EARS (downs CARE, AREA, SEAR, EARS)
      words: ["CASE", "AREA", "REAR", "EARS", "CARE", "SEAR", "TEAR", "SEAT"],
    },
    {
      grid: [
        [".", ".", ".", ".", "."],
        [".", ".", ".", ".", "."],
        [".", ".", ".", ".", "."],
        [".", ".", ".", ".", "."],
        [".", ".", ".", ".", "."],
      ],
      // Sator square — across & down: SATOR AREPO TENET OPERA ROTAS
      words: [
        "SATOR",
        "AREPO",
        "TENET",
        "OPERA",
        "ROTAS",
        "RATES",
        "STORE",
        "TREES",
        "NOTES",
      ],
    },
  ];
  const puzzle = size >= 10 ? puzzles[1]! : puzzles[0]!;
  return {
    ...base,
    n: puzzle.grid.length,
    grid: puzzle.grid.map((row) => row.slice()),
    words: puzzle.words.slice(),
  };
}
