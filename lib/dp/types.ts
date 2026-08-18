import type { CodeSnippets } from "@/lib/code/languages";

export type DpAlgoId =
  | "fibonacci"
  | "climbing-stairs"
  | "house-robber"
  | "coin-change"
  | "unique-paths"
  | "min-path-sum"
  | "dungeon-game"
  | "knapsack-01"
  | "knapsack-unbounded"
  | "subset-sum"
  | "lcs"
  | "edit-distance"
  | "word-break"
  | "palindromic-subsequence"
  | "lis"
  | "bitonic-subsequence"
  | "matrix-chain"
  | "burst-balloons"
  | "palindrome-partitioning"
  | "tree-diameter"
  | "maximum-path-sum"
  | "dag-dp"
  | "tsp"
  | "assignment"
  | "minimax"
  | "optimal-strategy";

export type DpCellRole = "idle" | "current" | "read" | "write" | "answer" | "skip";

export interface DpStats {
  subproblems: number;
  transitions: number;
}

export interface DpTreeNode {
  id: number;
  x: number;
  y: number;
  label: string;
  caption?: string;
}

export interface DpTreeEdge {
  id: number;
  u: number;
  v: number;
  weight?: number;
}

export interface DpFrame {
  table: (number | null)[];
  roles: DpCellRole[];
  input?: number[];
  inputRoles?: DpCellRole[];
  grid?: (number | null)[][];
  gridRoles?: DpCellRole[][];
  sourceGrid?: number[][];
  items?: { weight: number; value: number }[];
  itemRoles?: DpCellRole[];
  words?: string[];
  wordRoles?: DpCellRole[];
  colLabels?: string[];
  rowLabels?: string[];
  treeNodes?: DpTreeNode[];
  treeEdges?: DpTreeEdge[];
  treeRoles?: Record<number, DpCellRole>;
  treeEdgeRoles?: Record<number, DpCellRole>;
  hint: string;
  formula?: string;
  stats: DpStats;
}

export interface DpGraphEdge {
  u: number;
  v: number;
  weight: number;
}

export interface DpInput {
  n: number;
  values: number[];
  coins: number[];
  amount: number;
  rows: number;
  cols: number;
  grid: number[][];
  weights: number[];
  profits: number[];
  capacity: number;
  textA: string;
  textB: string;
  words: string[];
  treeLeft: (number | null)[];
  treeRight: (number | null)[];
  graphEdges: DpGraphEdge[];
}

export interface DpMeta {
  id: DpAlgoId;
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

export type DpRunner = (input: DpInput) => DpFrame[];
