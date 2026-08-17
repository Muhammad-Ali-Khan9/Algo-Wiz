import type {
  EdgeRole,
  GraphData,
  GraphEdge,
  GraphFrame,
  GraphNode,
  NodeRole,
} from "./types";

export class GraphTrace {
  frames: GraphFrame[] = [];
  visits = 0;
  relaxes = 0;

  constructor(
    public nodes: GraphNode[],
    public edges: GraphEdge[],
  ) {}

  idleNodeRoles(): NodeRole[] {
    return this.nodes.map(() => "idle");
  }

  idleEdgeRoles(): EdgeRole[] {
    return this.edges.map(() => "idle");
  }

  push(
    nodeRoles: NodeRole[],
    edgeRoles: EdgeRole[],
    hint: string,
    extra?: { labels?: Record<number, string>; frontier?: number[] },
  ) {
    this.frames.push({
      nodes: this.nodes.map((node) => ({ ...node })),
      edges: this.edges.map((edge) => ({ ...edge })),
      nodeRoles: nodeRoles.slice(),
      edgeRoles: edgeRoles.slice(),
      labels: { ...(extra?.labels ?? {}) },
      frontier: [...(extra?.frontier ?? [])],
      hint,
      stats: { visits: this.visits, relaxes: this.relaxes },
    });
  }

  visit() {
    this.visits += 1;
  }

  relax() {
    this.relaxes += 1;
  }
}

export function adjacency(
  n: number,
  edges: GraphEdge[],
  undirected = true,
): { to: number; weight: number; edgeId: number }[][] {
  const adj: { to: number; weight: number; edgeId: number }[][] = Array.from(
    { length: n },
    () => [],
  );
  for (const edge of edges) {
    adj[edge.u].push({ to: edge.v, weight: edge.weight, edgeId: edge.id });
    if (undirected) {
      adj[edge.v].push({ to: edge.u, weight: edge.weight, edgeId: edge.id });
    }
  }
  return adj;
}

export function paintTerminal(
  t: GraphTrace,
  start: number,
  goal: number | null,
  pathNodes: Set<number>,
  pathEdges: Set<number>,
  hint: string,
) {
  const nodeRoles = t.idleNodeRoles();
  const edgeRoles = t.idleEdgeRoles();
  for (let i = 0; i < nodeRoles.length; i += 1) {
    if (pathNodes.has(i)) nodeRoles[i] = "path";
  }
  nodeRoles[start] = "start";
  if (goal != null) nodeRoles[goal] = "goal";
  for (const edgeId of pathEdges) edgeRoles[edgeId] = "path";
  t.push(nodeRoles, edgeRoles, hint);
}

export function reconstructPath(
  parent: (number | null)[],
  parentEdge: (number | null)[],
  start: number,
  goal: number,
): { nodes: Set<number>; edges: Set<number> } {
  const nodes = new Set<number>();
  const edges = new Set<number>();
  let cur: number | null = goal;
  while (cur != null) {
    nodes.add(cur);
    if (cur === start) break;
    const pe = parentEdge[cur];
    if (pe != null) edges.add(pe);
    cur = parent[cur];
  }
  return { nodes, edges };
}

export function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
    start: graph.start,
    goal: graph.goal,
  };
}
