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

const RAT_MAZES_3: string[][][] = [
  [
    ["1", "0", "1"],
    ["1", "1", "1"],
    ["0", "1", "1"],
  ],
  [
    ["1", "1", "0"],
    ["0", "1", "1"],
    ["1", "1", "1"],
  ],
];

const RAT_MAZES_4: string[][][] = [
  [
    ["1", "0", "0", "0"],
    ["1", "1", "0", "1"],
    ["0", "1", "0", "0"],
    ["1", "1", "1", "1"],
  ],
  [
    ["1", "1", "0", "1"],
    ["0", "1", "1", "0"],
    ["1", "1", "0", "1"],
    ["0", "1", "1", "1"],
  ],
];

const RAT_MAZES_5: string[][][] = [
  [
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "0", "1"],
    ["0", "0", "1", "0", "1"],
    ["1", "1", "1", "1", "0"],
    ["1", "0", "0", "1", "1"],
  ],
  [
    ["1", "1", "0", "0", "1"],
    ["0", "1", "1", "1", "1"],
    ["1", "1", "0", "0", "1"],
    ["1", "0", "1", "1", "1"],
    ["1", "1", "1", "0", "1"],
  ],
];

const SOLVER_MAZES: string[][][] = [
  [
    ["S", ".", "#", "."],
    [".", ".", ".", "#"],
    ["#", ".", "#", "."],
    [".", ".", ".", "E"],
  ],
  [
    ["S", ".", ".", "#", "."],
    ["#", "#", ".", "#", "."],
    [".", ".", ".", ".", "."],
    [".", "#", "#", "#", "."],
    [".", ".", ".", "#", "E"],
  ],
];

const WORD_PUZZLES_3: { grid: string[][]; word: string }[] = [
  {
    grid: [
      ["C", "A", "T"],
      ["O", "R", "E"],
      ["W", "A", "N"],
    ],
    word: "CARE",
  },
  {
    grid: [
      ["H", "E", "Y"],
      ["A", "T", "E"],
      ["P", "I", "N"],
    ],
    word: "HAT",
  },
];

const WORD_PUZZLES_4: { grid: string[][]; word: string }[] = [
  {
    grid: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
      ["X", "Y", "Z", "W"],
    ],
    word: "ABCCED",
  },
  {
    grid: [
      ["A", "B", "C", "E"],
      ["S", "F", "C", "S"],
      ["A", "D", "E", "E"],
      ["Q", "U", "I", "T"],
    ],
    word: "SEE",
  },
];

const WORD_PUZZLES_5: { grid: string[][]; word: string }[] = [
  {
    grid: [
      ["S", "T", "A", "R", "T"],
      ["W", "O", "R", "D", "S"],
      ["E", "A", "R", "T", "H"],
      ["P", "L", "A", "N", "E"],
      ["M", "O", "O", "N", "S"],
    ],
    word: "WORD",
  },
  {
    grid: [
      ["A", "B", "C", "D", "E"],
      ["S", "E", "A", "R", "C"],
      ["H", "F", "G", "H", "I"],
      ["J", "K", "L", "M", "N"],
      ["O", "P", "Q", "R", "S"],
    ],
    word: "SEARCH",
  },
];

const FLOOD_GRIDS: { grid: string[][]; sr: number; sc: number; color: string }[] = [
  {
    grid: [
      ["1", "1", "1"],
      ["1", "1", "0"],
      ["1", "0", "1"],
    ],
    sr: 1,
    sc: 1,
    color: "2",
  },
  {
    grid: [
      ["0", "0", "0"],
      ["0", "1", "1"],
      ["0", "1", "1"],
    ],
    sr: 0,
    sc: 0,
    color: "X",
  },
  {
    grid: [
      ["A", "A", "B", "A"],
      ["A", "B", "B", "A"],
      ["A", "A", "A", "A"],
    ],
    sr: 0,
    sc: 0,
    color: "Z",
  },
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

  if (id === "crossword") {
    const puzzles: { grid: string[][]; words: string[] }[] = [
      {
        grid: [
          [".", ".", ".", "."],
          [".", ".", ".", "."],
          [".", ".", ".", "."],
          [".", ".", ".", "."],
        ],
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

  if (id === "rat-in-a-maze") {
    // Size slider → board: ≤8 → 3×3, ≤12 → 4×4, else → 5×5
    const n = size <= 8 ? 3 : size <= 12 ? 4 : 5;
    const pool = n === 3 ? RAT_MAZES_3 : n === 4 ? RAT_MAZES_4 : RAT_MAZES_5;
    const maze = pool[Math.floor(rand() * pool.length)]!;
    return {
      ...base,
      n,
      grid: maze.map((row) => row.slice()),
    };
  }

  if (id === "maze-solver") {
    const maze =
      size >= 10
        ? SOLVER_MAZES[1]!
        : SOLVER_MAZES[Math.floor(rand() * SOLVER_MAZES.length)]!;
    return {
      ...base,
      n: maze.length,
      grid: maze.map((row) => row.slice()),
    };
  }

  if (id === "word-search") {
    // Size slider → board: ≤8 → 3×3, ≤12 → 4×4, else → 5×5
    const n = size <= 8 ? 3 : size <= 12 ? 4 : 5;
    const pool = n === 3 ? WORD_PUZZLES_3 : n === 4 ? WORD_PUZZLES_4 : WORD_PUZZLES_5;
    const puzzle = pool[Math.floor(rand() * pool.length)]!;
    return {
      ...base,
      n,
      grid: puzzle.grid.map((row) => row.slice()),
      words: [puzzle.word],
    };
  }

  if (id === "flood-fill") {
    const puzzle = FLOOD_GRIDS[Math.floor(rand() * FLOOD_GRIDS.length)]!;
    return {
      ...base,
      n: puzzle.grid.length,
      grid: puzzle.grid.map((row) => row.slice()),
      words: [puzzle.color],
      startRow: puzzle.sr,
      startCol: puzzle.sc,
    };
  }

  if (id === "hamiltonian-path" || id === "hamiltonian-cycle") {
    const n = size <= 8 ? 4 : 5;
    // Cycle plus a few chords — guarantees Hamiltonian structure on small n
    const pairs: [number, number][] = [];
    for (let i = 0; i < n; i += 1) pairs.push([i, (i + 1) % n]);
    if (n >= 4) pairs.push([0, 2]);
    if (n >= 5 && rand() > 0.35) pairs.push([1, 3]);
    if (n >= 5 && rand() > 0.5) pairs.push([0, 3]);
    return { ...base, n, pairs };
  }

  if (id === "tsp") {
    const n = size <= 10 ? 4 : 5;
    const weights = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        if (i === j) return 0;
        return 1 + Math.floor(rand() * 9);
      }),
    );
    // Symmetrize for an undirected feel
    for (let i = 0; i < n; i += 1)
      for (let j = i + 1; j < n; j += 1) {
        weights[j]![i] = weights[i]![j]!;
      }
    const pairs: [number, number][] = [];
    for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) pairs.push([i, j]);
    return { ...base, n, pairs, weights };
  }

  if (id === "palindrome-partition") {
    const pool = size <= 8 ? ["AAB", "AAA"] : ["AABB", "ABBA", "AACAA"];
    const word = pool[Math.floor(rand() * pool.length)]!;
    return { ...base, n: word.length, words: [word] };
  }

  if (id === "generate-parentheses") {
    const n = size <= 8 ? 2 : size <= 12 ? 3 : 4;
    return { ...base, n };
  }

  if (id === "letter-combinations") {
    const pool = size <= 8 ? ["23", "79"] : ["234", "29", "567"];
    const digits = pool[Math.floor(rand() * pool.length)]!;
    return { ...base, n: digits.length, words: [digits] };
  }

  if (id === "expression-generation") {
    const puzzles = [
      { num: "123", target: 6 },
      { num: "105", target: 5 },
      { num: "232", target: 8 },
      { num: "1234", target: 10 },
    ];
    const pick =
      size <= 10
        ? puzzles[Math.floor(rand() * 3)]!
        : puzzles[Math.floor(rand() * puzzles.length)]!;
    return { ...base, n: pick.num.length, words: [pick.num], target: pick.target };
  }

  return base;
}
