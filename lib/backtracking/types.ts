import type { CodeSnippets } from "@/lib/code/languages";

export type BacktrackingAlgoId =
  | "permutations"
  | "combinations"
  | "subsets"
  | "combination-sum"
  | "n-queens"
  | "sudoku"
  | "graph-coloring"
  | "crossword"
  | "rat-in-a-maze"
  | "maze-solver"
  | "word-search"
  | "flood-fill"
  | "hamiltonian-path"
  | "hamiltonian-cycle"
  | "tsp"
  | "palindrome-partition"
  | "generate-parentheses"
  | "letter-combinations"
  | "expression-generation";

export type BtRole =
  "idle" | "current" | "choose" | "skip" | "backtrack" | "solution" | "fixed";

export interface BacktrackingStats {
  calls: number;
  choices: number;
  backtracks: number;
  solutions: number;
}

export interface BtGraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface BtGraphEdge {
  id: number;
  u: number;
  v: number;
}

export interface BacktrackingFrame {
  candidates: number[];
  roles: BtRole[];
  path: number[];
  pathRoles: BtRole[];
  depth: number;
  /** Complete solutions found so far (newest last). */
  found: number[][];
  /** Human-readable solution summaries for the panel. */
  foundLabels: string[];
  hint: string;
  stats: BacktrackingStats;
  board?: (string | null)[][];
  boardRoles?: BtRole[][];
  nodes?: BtGraphNode[];
  edges?: BtGraphEdge[];
  nodeRoles?: BtRole[];
}

export interface BacktrackingInput {
  values: number[];
  /** Combinations: pick k. Combination Sum: target. Graph coloring: color count. */
  k: number;
  target: number;
  n: number;
  /** Sudoku / crossword / maze / word-search / flood-fill grid. */
  grid?: string[][];
  /** Crossword word bank, word-search target, or flood-fill replacement color. */
  words?: string[];
  /** Graph coloring / Hamiltonian undirected edges as [u, v] pairs. */
  pairs?: [number, number][];
  /** TSP edge weights (n×n); ignored entries can be 0. */
  weights?: number[][];
  /** Flood fill / word-search start row (optional; else inferred). */
  startRow?: number;
  /** Flood fill / word-search start column (optional; else inferred). */
  startCol?: number;
}

export interface BacktrackingMeta {
  id: BacktrackingAlgoId;
  name: string;
  group: string;
  worst: string;
  average: string;
  best: string;
  space: string;
  available: boolean;
  definition: string;
  usage: string;
  code?: CodeSnippets;
}

export type BacktrackingRunner = (input: BacktrackingInput) => BacktrackingFrame[];
