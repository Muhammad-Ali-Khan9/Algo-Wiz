export type BarRole =
  | "idle"
  | "compare"
  | "swap"
  | "sorted"
  | "pivot"
  | "key"
  | "min"
  | "write";

export type AlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap"
  | "shell"
  | "counting"
  | "radix"
  | "bucket";

export interface AuxBucket {
  label: string;
  values: number[];
}

export interface SortStats {
  comparisons: number;
  writes: number;
}

export interface SortFrame {
  array: number[];
  roles: BarRole[];
  hint: string;
  stats: SortStats;
  auxBuckets?: AuxBucket[];
}

export interface AlgorithmMeta {
  id: AlgorithmId;
  name: string;
  worst: string;
  average: string;
  best: string;
  space: string;
  stable: boolean;
  definition: string;
  usage: string;
}

export type SortRunner = (values: number[]) => SortFrame[];
