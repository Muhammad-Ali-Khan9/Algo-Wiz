import { combinationSum, combinations, permutations, subsets } from "./combinatorial";
import { crossword, graphColoring, nQueens, sudoku } from "./constraint";
import { floodFill, mazeSolver, ratInAMaze, wordSearch } from "./grid-maze";
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
};

export function getBacktrackingAlgo(id: BacktrackingAlgoId): BacktrackingMeta {
  const item = BACKTRACKING_META.find((m) => m.id === id);
  if (!item) throw new Error(`Unknown backtracking algorithm: ${id}`);
  return item;
}

export function runBacktrackingAlgo(id: BacktrackingAlgoId, input: BacktrackingInput) {
  return BACKTRACKING_RUNNERS[id](input);
}
