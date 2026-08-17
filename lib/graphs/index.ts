import {
  bipartiteCheck,
  degreeCalc,
  degreeInOut,
  findArticulation,
  findBridges,
  graphColoring,
} from "./analysis";
import {
  connectedComponents,
  cycleDirected,
  cycleUndirected,
  sccKosaraju,
  sccTarjan,
} from "./connectivity";
import { kruskal, prim } from "./mst";
import { topoDfs, topoKahn } from "./ordering";
import { GRAPH_CODE } from "./snippets";
import { bfs, dfs } from "./traversal";
import type { GraphAlgoId, GraphMeta, GraphRunner } from "./types";

export type { GraphAlgoId, GraphData, GraphFrame, GraphKind, GraphMeta } from "./types";
export { GRAPH_KINDS } from "./types";
export { generateGraph, randomGraph } from "./random";

export const GRAPH_META: GraphMeta[] = [
  {
    id: "bfs",
    name: "BFS",
    group: "Traversal",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Breadth-first search explores layer by layer from a start vertex using a queue. The first time it reaches a node is along a shortest path in number of edges.",
    usage:
      "Unweighted shortest paths, connected components, level-order traversal, and building a BFS tree.",
    code: GRAPH_CODE.bfs,
  },
  {
    id: "dfs",
    name: "DFS",
    group: "Traversal",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Depth-first search plunges along a path using a stack (or recursion) before backtracking. It discovers a spanning tree of tree edges and classifies the rest.",
    usage:
      "Cycle detection, topological sort on DAGs, articulation points, mazes, and any search that benefits from going deep first.",
    code: GRAPH_CODE.dfs,
  },
  {
    id: "components",
    name: "Connected Components",
    group: "Connectivity & Components",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Partition an undirected graph into maximal connected subgraphs by flooding from unvisited vertices.",
    usage:
      "Clustering, island counting, and preprocessing before per-component algorithms.",
    code: GRAPH_CODE.components,
  },
  {
    id: "scc-kosaraju",
    name: "SCC — Kosaraju",
    group: "Connectivity & Components",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Kosaraju finds strongly connected components with two DFS passes: on the graph, then on its transpose in finishing-time order.",
    usage: "Condensation DAGs, 2-SAT, and analyzing directed reachability.",
    code: GRAPH_CODE["scc-kosaraju"],
  },
  {
    id: "scc-tarjan",
    name: "SCC — Tarjan",
    group: "Connectivity & Components",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Tarjan’s algorithm finds SCCs in one DFS using low-link values and an explicit stack of the current path.",
    usage: "Same SCC applications as Kosaraju, often with a single traversal.",
    code: GRAPH_CODE["scc-tarjan"],
  },
  {
    id: "cycle-undirected",
    name: "Cycle Detection — Undirected",
    group: "Connectivity & Components",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "DFS detects whether an undirected graph contains a cycle by revisiting a non-parent neighbor.",
    usage: "Validating trees, Kruskal rejections, and structural checks.",
    code: GRAPH_CODE["cycle-undirected"],
  },
  {
    id: "cycle-directed",
    name: "Cycle Detection — Directed",
    group: "Connectivity & Components",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Colored DFS (white/gray/black) finds directed cycles via back edges to gray nodes.",
    usage: "Dependency graphs, deadlock detection, and verifying DAGs.",
    code: GRAPH_CODE["cycle-directed"],
  },
  {
    id: "prim",
    name: "Prim",
    group: "Minimum Spanning Tree",
    worst: "O(E log V)",
    average: "O(E log V)",
    best: "O(E + V log V)",
    space: "O(V)",
    weighted: true,
    heuristic: false,
    available: true,
    definition:
      "Prim grows a minimum spanning tree from a seed vertex by always adding the lightest edge that crosses the cut between the tree and the rest of the graph.",
    usage:
      "Dense graphs or when you already have an adjacency list and want an MST rooted at a particular node.",
    code: GRAPH_CODE.prim,
  },
  {
    id: "kruskal",
    name: "Kruskal",
    group: "Minimum Spanning Tree",
    worst: "O(E log E)",
    average: "O(E log E)",
    best: "O(E log E)",
    space: "O(V)",
    weighted: true,
    heuristic: false,
    available: true,
    definition:
      "Kruskal sorts all edges by weight and adds an edge when its endpoints lie in different components, tracked with union–find.",
    usage:
      "Sparse graphs and edge-list inputs. Classic for wiring / clustering where you only care about the global MST.",
    code: GRAPH_CODE.kruskal,
  },
  {
    id: "topo-kahn",
    name: "Topological Sort — Kahn",
    group: "Ordering",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Kahn’s algorithm repeatedly peels vertices of in-degree zero, producing a linear order of a DAG.",
    usage: "Build systems, course prerequisites, and scheduling.",
    code: GRAPH_CODE["topo-kahn"],
  },
  {
    id: "topo-dfs",
    name: "Topological Sort — DFS",
    group: "Ordering",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "DFS finishing times reverse to a topological order on a DAG; a back edge means a cycle.",
    usage: "Same ordering tasks as Kahn, often paired with cycle detection.",
    code: GRAPH_CODE["topo-dfs"],
  },
  {
    id: "bipartite",
    name: "Bipartite Check",
    group: "Graph Analysis",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "2-color the graph with BFS/DFS; an odd cycle means the graph is not bipartite.",
    usage: "Matching preconditions, conflict graphs, and coloring shortcuts.",
    code: GRAPH_CODE.bipartite,
  },
  {
    id: "bridges",
    name: "Bridge Finding",
    group: "Graph Analysis",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "A bridge is an edge whose removal increases the number of connected components, found via DFS low-link values.",
    usage: "Network reliability and critical-link analysis.",
    code: GRAPH_CODE.bridges,
  },
  {
    id: "articulation",
    name: "Articulation Points",
    group: "Graph Analysis",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "An articulation point is a vertex whose removal increases components; DFS discovery/low values identify them.",
    usage: "Finding single points of failure in networks.",
    code: GRAPH_CODE.articulation,
  },
  {
    id: "degree",
    name: "Degree Calculation",
    group: "Graph Analysis",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Count incident edges per vertex to obtain the degree sequence of an undirected graph.",
    usage: "Handshaking lemma checks, regularity tests, and degree-based heuristics.",
    code: GRAPH_CODE.degree,
  },
  {
    id: "degree-io",
    name: "In-degree / Out-degree",
    group: "Graph Analysis",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "For directed graphs, tally incoming and outgoing arcs separately for each vertex.",
    usage: "Kahn’s algorithm seeds, Euler path conditions, and flow balance checks.",
    code: GRAPH_CODE["degree-io"],
  },
  {
    id: "coloring",
    name: "Graph Coloring",
    group: "Graph Analysis",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "Assign colors so adjacent vertices differ — greedy coloring is a classic O(V + E) approximation.",
    usage: "Register allocation, scheduling, and map coloring demos.",
    code: GRAPH_CODE.coloring,
  },
];

export const GRAPH_RUNNERS: Partial<Record<GraphAlgoId, GraphRunner>> = {
  bfs,
  dfs,
  components: connectedComponents,
  "scc-kosaraju": sccKosaraju,
  "scc-tarjan": sccTarjan,
  "cycle-undirected": cycleUndirected,
  "cycle-directed": cycleDirected,
  prim,
  kruskal,
  "topo-kahn": topoKahn,
  "topo-dfs": topoDfs,
  bipartite: bipartiteCheck,
  bridges: findBridges,
  articulation: findArticulation,
  degree: degreeCalc,
  "degree-io": degreeInOut,
  coloring: graphColoring,
};

export function getGraphAlgo(id: GraphAlgoId): GraphMeta {
  const meta = GRAPH_META.find((item) => item.id === id);
  if (!meta) throw new Error(`Unknown graph algorithm: ${id}`);
  return meta;
}

export function runGraphAlgo(id: GraphAlgoId, graph: Parameters<GraphRunner>[0]) {
  const runner = GRAPH_RUNNERS[id];
  if (!runner) throw new Error(`Graph algorithm not available yet: ${id}`);
  return runner(graph);
}
