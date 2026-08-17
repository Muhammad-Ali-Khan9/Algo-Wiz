import { bfs } from "@/lib/graphs/traversal";
import { PATH_CODE } from "./snippets";
import { astar, dijkstra } from "./shortest";
import type { PathAlgoId, PathMeta, PathRunner } from "./types";

export type { PathAlgoId, PathMeta } from "./types";

function soon(
  partial: Omit<PathMeta, "available" | "weighted" | "heuristic" | "code"> &
    Partial<Pick<PathMeta, "weighted" | "heuristic">>,
): PathMeta {
  return {
    weighted: false,
    heuristic: false,
    ...partial,
    available: false,
  };
}

export const PATH_META: PathMeta[] = [
  {
    id: "bfs",
    name: "BFS",
    group: "Unweighted",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    weighted: false,
    heuristic: false,
    available: true,
    definition:
      "On an unweighted graph, BFS finds a shortest hop-path from start to goal by expanding layers in lockstep.",
    usage: "Mazes without costs, social hop-distance, and any unit-weight route.",
    code: PATH_CODE.bfs,
  },
  soon({
    id: "bidirectional-bfs",
    name: "Bidirectional BFS",
    group: "Unweighted",
    worst: "O(V + E)",
    average: "O(b^{d/2})",
    best: "O(V + E)",
    space: "O(V)",
    definition:
      "Search from start and goal at once and meet in the middle, cutting the explored frontier roughly in half on uniform branching.",
    usage: "Large unweighted graphs where one-sided BFS fans out too wide.",
  }),
  {
    id: "dijkstra",
    name: "Dijkstra",
    group: "Weighted",
    worst: "O(E log V)",
    average: "O(E log V)",
    best: "O(E + V log V)",
    space: "O(V)",
    weighted: true,
    heuristic: false,
    available: true,
    definition:
      "Dijkstra repeatedly settles the unsettled node with the smallest tentative distance, then relaxes its outgoing edges. With non-negative weights it yields true shortest-path distances.",
    usage: "Road maps, network routing, and any weighted graph without negative edges.",
    code: PATH_CODE.dijkstra,
  },
  soon({
    id: "bellman-ford",
    name: "Bellman–Ford",
    group: "Weighted",
    worst: "O(VE)",
    average: "O(VE)",
    best: "O(E)",
    space: "O(V)",
    weighted: true,
    definition:
      "Relax all edges |V|−1 times; a further improving relaxation means a negative cycle. Handles negative weights.",
    usage: "Graphs with negative edges and negative-cycle detection.",
  }),
  soon({
    id: "floyd-warshall",
    name: "Floyd–Warshall",
    group: "Weighted",
    worst: "O(V³)",
    average: "O(V³)",
    best: "O(V³)",
    space: "O(V²)",
    weighted: true,
    definition:
      "Dynamic programming over intermediate vertices computes all-pairs shortest paths (or detects negatives).",
    usage: "Dense graphs and when you need every pair’s distance at once.",
  }),
  {
    id: "astar",
    name: "A*",
    group: "Heuristic",
    worst: "O(E log V)",
    average: "O(E log V)",
    best: "O(V)",
    space: "O(V)",
    weighted: true,
    heuristic: true,
    available: true,
    definition:
      "A* is Dijkstra guided by a heuristic. Each node’s priority is f = g + h, where g is the cost from the start and h estimates remaining cost to the goal.",
    usage:
      "Grid pathfinding, games, and robotics when a good heuristic can prune large parts of the graph.",
    code: PATH_CODE.astar,
  },
  soon({
    id: "greedy-best-first",
    name: "Greedy Best-First",
    group: "Heuristic",
    worst: "O(E log V)",
    average: "O(E log V)",
    best: "O(V)",
    space: "O(V)",
    heuristic: true,
    definition:
      "Always expand the node that looks closest to the goal by h alone. Fast but not optimal.",
    usage: "Quick approximate routes when optimality is less important than speed.",
  }),
  soon({
    id: "bidirectional-dijkstra",
    name: "Bidirectional Dijkstra",
    group: "Specialized",
    worst: "O(E log V)",
    average: "O(E log V)",
    best: "O(E + V log V)",
    space: "O(V)",
    weighted: true,
    definition:
      "Run Dijkstra from both ends and stop when the two searches meet with a proven optimal combination.",
    usage: "Large road networks and point-to-point queries.",
  }),
  soon({
    id: "bidirectional-astar",
    name: "Bidirectional A*",
    group: "Specialized",
    worst: "O(E log V)",
    average: "O(E log V)",
    best: "O(V)",
    space: "O(V)",
    weighted: true,
    heuristic: true,
    definition:
      "A* from both start and goal with careful meeting conditions to keep optimality.",
    usage: "Heuristic point-to-point search on large maps.",
  }),
];

export const PATH_RUNNERS: Partial<Record<PathAlgoId, PathRunner>> = {
  bfs,
  dijkstra,
  astar,
};

export function getPathAlgo(id: PathAlgoId): PathMeta {
  const meta = PATH_META.find((item) => item.id === id);
  if (!meta) throw new Error(`Unknown pathfinding algorithm: ${id}`);
  return meta;
}

export function runPathAlgo(id: PathAlgoId, graph: Parameters<PathRunner>[0]) {
  const runner = PATH_RUNNERS[id];
  if (!runner) throw new Error(`Pathfinding algorithm not available yet: ${id}`);
  return runner(graph);
}
