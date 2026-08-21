import { combinationSum, combinations, permutations, subsets } from "./combinatorial";
import { crossword, graphColoring, nQueens, sudoku } from "./constraint";
import { hamiltonianCycle, hamiltonianPath, tsp } from "./graph-bt";
import { floodFill, mazeSolver, ratInAMaze, wordSearch } from "./grid-maze";
import {
  expressionGeneration,
  generateParentheses,
  letterCombinations,
  palindromePartition,
} from "./string-bt";
import { BACKTRACKING_CODE } from "./snippets";
import type {
  BacktrackingAlgoId,
  BacktrackingInput,
  BacktrackingMeta,
  BacktrackingRunner,
} from "./types";

export type {
  BacktrackingAlgoId,
  BacktrackingFrame,
  BacktrackingInput,
  BacktrackingMeta,
} from "./types";
export { generateBacktrackingInput, shuffleSeed } from "./random";

function meta(
  partial: Omit<BacktrackingMeta, "code"> & { id: BacktrackingAlgoId },
): BacktrackingMeta {
  return { ...partial, code: BACKTRACKING_CODE[partial.id] };
}

export const BACKTRACKING_META: BacktrackingMeta[] = [
  meta({
    id: "permutations",
    name: "Permutations",
    group: "Combinatorial",
    worst: "O(n · n!)",
    average: "O(n · n!)",
    best: "O(n · n!)",
    space: "O(n)",
    available: true,
    definition:
      "Generate every ordering of the array. At each depth pick an unused index, recurse, then backtrack by unmarking it.",
    usage: "Arrangements, anagrams, and any “order matters” exhaustive search.",
  }),
  meta({
    id: "combinations",
    name: "Combinations",
    group: "Combinatorial",
    worst: "O(k · C(n, k))",
    average: "O(k · C(n, k))",
    best: "O(k · C(n, k))",
    space: "O(k)",
    available: true,
    definition:
      "Choose k elements from n without regard to order. Start index moves forward so each subset is emitted once.",
    usage: "Team selection, lottery-style picks, and binomial enumeration.",
  }),
  meta({
    id: "subsets",
    name: "Subsets",
    group: "Combinatorial",
    worst: "O(n · 2ⁿ)",
    average: "O(n · 2ⁿ)",
    best: "O(n · 2ⁿ)",
    space: "O(n)",
    available: true,
    definition:
      "Power set via include/skip: for each element decide take or leave, then record the path at the leaves (2ⁿ subsets).",
    usage: "Feature masks, knapsack-style include/exclude trees, and bitset teaching.",
  }),
  meta({
    id: "combination-sum",
    name: "Combination Sum",
    group: "Combinatorial",
    worst: "O(n^{t/min})",
    average: "O(n^{t/min})",
    best: "O(n^{t/min})",
    space: "O(t/min)",
    available: true,
    definition:
      "Find all multisets from candidates that sum to target. Reuse is allowed; picks stay non-decreasing to avoid duplicates.",
    usage: "Coin change enumerations, recipe mixes, and bounded integer knapsacks.",
  }),
  meta({
    id: "n-queens",
    name: "N-Queens",
    group: "Constraint Satisfaction",
    worst: "O(n!)",
    average: "O(n!)",
    best: "O(n!)",
    space: "O(n)",
    available: true,
    definition:
      "Place n queens on an n×n board so none share a row, column, or diagonal. Try columns per row and backtrack on attacks.",
    usage: "Classic CSP, constraint propagation warmups, and search-tree teaching.",
  }),
  meta({
    id: "sudoku",
    name: "Sudoku",
    group: "Constraint Satisfaction",
    worst: "O(nⁿ²)",
    average: "O(nⁿ²)",
    best: "O(nⁿ²)",
    space: "O(n²)",
    available: true,
    definition:
      "Fill empty cells with digits so each row, column, and box is unique. Try a digit, recurse, undo on failure (shown here on 4×4).",
    usage: "Puzzle solving, exact cover relatives, and dancing-links motivation.",
  }),
  meta({
    id: "graph-coloring",
    name: "Graph Coloring",
    group: "Constraint Satisfaction",
    worst: "O(kⁿ)",
    average: "O(kⁿ)",
    best: "O(kⁿ)",
    space: "O(n)",
    available: true,
    definition:
      "Assign one of k colors to each vertex so adjacent vertices differ. Try colors in order and backtrack on conflicts.",
    usage: "Scheduling, register allocation, and map coloring.",
  }),
  meta({
    id: "crossword",
    name: "Crossword",
    group: "Constraint Satisfaction",
    worst: "O(wˢ)",
    average: "O(wˢ)",
    best: "O(wˢ)",
    space: "O(s)",
    available: true,
    definition:
      "Fill a 4×4 or 5×5 word square: try bank words in across slots, then require every down reading to also be in the bank.",
    usage: "Crossword generation, word squares, and interlocking constraints.",
  }),
  meta({
    id: "rat-in-a-maze",
    name: "Rat in a Maze",
    group: "Grid & Maze",
    worst: "O(4ⁿ²)",
    average: "O(4ⁿ²)",
    best: "O(n²)",
    space: "O(n²)",
    available: true,
    definition:
      "Find paths from the top-left to the bottom-right of a binary maze. Try D/L/R/U, mark visited cells, and backtrack on dead ends.",
    usage: "Path enumeration in grids, robot navigation warmups, and DFS teaching.",
  }),
  meta({
    id: "maze-solver",
    name: "Maze Solver",
    group: "Grid & Maze",
    worst: "O(4ⁿ²)",
    average: "O(4ⁿ²)",
    best: "O(n²)",
    space: "O(n²)",
    available: true,
    definition:
      "DFS from S to E through open cells. Explore neighbors, rewind when a branch hits a wall or a visited cell.",
    usage:
      "Maze games, grid routing, and contrasting DFS search with BFS shortest paths.",
  }),
  meta({
    id: "word-search",
    name: "Word Search",
    group: "Grid & Maze",
    worst: "O(m · n · 4ᴸ)",
    average: "O(m · n · 4ᴸ)",
    best: "O(L)",
    space: "O(L)",
    available: true,
    definition:
      "Locate a word by walking adjacent letters without reusing a cell. Match the next character, recurse, then unmark on failure.",
    usage: "Boggle-style boards, crossword helpers, and string search on grids.",
  }),
  meta({
    id: "flood-fill",
    name: "Flood Fill",
    group: "Grid & Maze",
    worst: "O(m · n)",
    average: "O(m · n)",
    best: "O(1)",
    space: "O(m · n)",
    available: true,
    definition:
      "Recursively paint every 4-connected cell that matches the start color. Classic DFS on a grid (paint-bucket).",
    usage: "Image editors, region labeling, and connected-component warmups.",
  }),
  meta({
    id: "hamiltonian-path",
    name: "Hamiltonian Path",
    group: "Graph Backtracking",
    worst: "O(n!)",
    average: "O(n!)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Find a path that visits every vertex exactly once. Extend along unused neighbors and backtrack on dead ends.",
    usage: "Route planning, genome assembly warmups, and NP-hard path demos.",
  }),
  meta({
    id: "hamiltonian-cycle",
    name: "Hamiltonian Cycle",
    group: "Graph Backtracking",
    worst: "O(n!)",
    average: "O(n!)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Find a cycle through every vertex once, returning to the start. Same search as a path, plus a closing edge check.",
    usage: "Tour construction, circuit design, and TSP special cases.",
  }),
  meta({
    id: "tsp",
    name: "TSP",
    group: "Graph Backtracking",
    worst: "O(n!)",
    average: "O(n!)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Traveling Salesman on a small complete graph: build a tour, prune when cost meets or exceeds the best so far.",
    usage: "Logistics, circuit wiring, and branch-and-bound teaching.",
  }),
  meta({
    id: "palindrome-partition",
    name: "Palindrome Partitioning",
    group: "String Backtracking",
    worst: "O(n · 2ⁿ)",
    average: "O(n · 2ⁿ)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Partition a string so every substring is a palindrome. Extend the cut when the next piece reads the same forward and back.",
    usage: "String DP warmups, text segmentation, and cut-point search.",
  }),
  meta({
    id: "generate-parentheses",
    name: "Generate Parentheses",
    group: "String Backtracking",
    worst: "O(4ⁿ / √n)",
    average: "O(4ⁿ / √n)",
    best: "O(4ⁿ / √n)",
    space: "O(n)",
    available: true,
    definition:
      "Build all valid strings of n pairs of parentheses. Add '(' while under the limit; add ')' only when it stays balanced.",
    usage: "Catalan-number constructions, parsers, and balanced-sequence demos.",
  }),
  meta({
    id: "letter-combinations",
    name: "Letter Combinations",
    group: "String Backtracking",
    worst: "O(4ⁿ)",
    average: "O(4ⁿ)",
    best: "O(4ⁿ)",
    space: "O(n)",
    available: true,
    definition:
      "Map phone keypad digits to letters. For each digit append one mapped letter, recurse, then try the next.",
    usage: "T9-style input, mnemonic generation, and cartesian-product search.",
  }),
  meta({
    id: "expression-generation",
    name: "Expression Generation",
    group: "String Backtracking",
    worst: "O(3ⁿ)",
    average: "O(3ⁿ)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Insert +, -, or * between digits so the expression equals a target. Handle operator precedence for * by tracking the last term.",
    usage: "Puzzle solvers, expression search, and operator-precedence teaching.",
  }),
];

export const BACKTRACKING_RUNNERS: Record<BacktrackingAlgoId, BacktrackingRunner> = {
  permutations,
  combinations,
  subsets,
  "combination-sum": combinationSum,
  "n-queens": nQueens,
  sudoku,
  "graph-coloring": graphColoring,
  crossword,
  "rat-in-a-maze": ratInAMaze,
  "maze-solver": mazeSolver,
  "word-search": wordSearch,
  "flood-fill": floodFill,
  "hamiltonian-path": hamiltonianPath,
  "hamiltonian-cycle": hamiltonianCycle,
  tsp,
  "palindrome-partition": palindromePartition,
  "generate-parentheses": generateParentheses,
  "letter-combinations": letterCombinations,
  "expression-generation": expressionGeneration,
};

export function getBacktrackingAlgo(id: BacktrackingAlgoId): BacktrackingMeta {
  const item = BACKTRACKING_META.find((m) => m.id === id);
  if (!item) throw new Error(`Unknown backtracking algorithm: ${id}`);
  return item;
}

export function runBacktrackingAlgo(id: BacktrackingAlgoId, input: BacktrackingInput) {
  return BACKTRACKING_RUNNERS[id](input);
}
