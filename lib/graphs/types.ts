import type { CodeSnippets } from "@/lib/code/languages";

export type GraphKind =
  "random" | "complete" | "bipartite" | "tree" | "dag" | "cycle" | "grid";

export type GraphAlgoId =
  | "bfs"
  | "dfs"
  | "components"
  | "scc-kosaraju"
  | "scc-tarjan"
  | "cycle-undirected"
  | "cycle-directed"
  | "prim"
  | "kruskal"
  | "topo-kahn"
  | "topo-dfs"
  | "bipartite"
  | "bridges"
  | "articulation"
  | "degree"
  | "degree-io"
  | "coloring";

export type NodeRole =
  "idle" | "frontier" | "current" | "visited" | "path" | "start" | "goal";

export type EdgeRole = "idle" | "consider" | "tree" | "path" | "rejected";

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  id: number;
  u: number;
  v: number;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  start: number;
  goal: number;
}

export interface GraphStats {
  visits: number;
  relaxes: number;
}

export interface GraphFrame {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeRoles: NodeRole[];
  edgeRoles: EdgeRole[];
  labels: Record<number, string>;
  frontier: number[];
  hint: string;
  stats: GraphStats;
}

export interface GraphMeta {
  id: GraphAlgoId;
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

export type GraphRunner = (graph: GraphData) => GraphFrame[];

export const GRAPH_KINDS: { id: GraphKind; label: string }[] = [
  { id: "random", label: "Random" },
  { id: "complete", label: "Complete" },
  { id: "bipartite", label: "Bipartite" },
  { id: "tree", label: "Tree" },
  { id: "dag", label: "DAG" },
  { id: "cycle", label: "Cycle" },
  { id: "grid", label: "Grid" },
];
