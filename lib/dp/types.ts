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
  | "subset-sum";

export type DpCellRole = "idle" | "current" | "read" | "write" | "answer" | "skip";

export interface DpStats {
  subproblems: number;
  transitions: number;
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
  colLabels?: string[];
  rowLabels?: string[];
  hint: string;
  formula?: string;
  stats: DpStats;
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
