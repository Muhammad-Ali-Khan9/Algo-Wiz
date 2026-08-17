import type { CodeSnippets } from "@/lib/code/languages";
import type { GraphData, GraphFrame } from "@/lib/graphs/types";

export type PathAlgoId =
  | "bfs"
  | "bidirectional-bfs"
  | "dijkstra"
  | "bellman-ford"
  | "floyd-warshall"
  | "astar"
  | "greedy-best-first"
  | "bidirectional-dijkstra"
  | "bidirectional-astar";

export interface PathMeta {
  id: PathAlgoId;
  name: string;
  group: string;
  worst: string;
  average: string;
  best: string;
  space: string;
  weighted: boolean;
  heuristic: boolean;
  available: boolean;
  definition: string;
  usage: string;
  code?: CodeSnippets;
}

export type PathRunner = (graph: GraphData) => GraphFrame[];
