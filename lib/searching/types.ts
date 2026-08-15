import type { CodeSnippets } from "@/lib/code/languages";

export type ProbeRole =
  | "unsearched"
  | "current"
  | "compared"
  | "found"
  | "eliminated"
  | "range";

export type SearchId =
  | "linear"
  | "binary"
  | "jump"
  | "interpolation"
  | "exponential"
  | "fibonacci"
  | "ternary"
  | "sentinel";

export interface SearchStats {
  comparisons: number;
  probes: number;
}

export interface SearchFrame {
  array: number[];
  roles: ProbeRole[];
  hint: string;
  stats: SearchStats;
}

export interface SearchMeta {
  id: SearchId;
  name: string;
  worst: string;
  average: string;
  best: string;
  space: string;
  sortedInput: boolean;
  definition: string;
  usage: string;
  code?: CodeSnippets;
}

export type SearchRunner = (values: number[], target: number) => SearchFrame[];
