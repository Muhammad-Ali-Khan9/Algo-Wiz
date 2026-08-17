import { GraphTrace, adjacency, paintTerminal } from "./trace";
import type { GraphData, GraphFrame, NodeRole } from "./types";

class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }

  union(a: number, b: number) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) this.parent[ra] = rb;
    else if (this.rank[ra] > this.rank[rb]) this.parent[rb] = ra;
    else {
      this.parent[rb] = ra;
      this.rank[ra] += 1;
    }
    return true;
  }
}

export function prim(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);
  const inMst = new Array(nodes.length).fill(false);
  const treeEdges = new Set<number>();
  inMst[start] = true;
  t.visit();

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (inMst[i]) roles[i] = "path";
    }
    roles[start] = "start";
    return roles;
  };

  const edgePaint = () => {
    const roles = t.idleEdgeRoles();
    for (const id of treeEdges) roles[id] = "tree";
    return roles;
  };

  t.push(
    baseRoles(),
    edgePaint(),
    `Prim MST growing from ${start}.`,
  );

  for (let step = 1; step < nodes.length; step += 1) {
    let best:
      | { to: number; weight: number; edgeId: number; from: number }
      | null = null;

    for (let u = 0; u < nodes.length; u += 1) {
      if (!inMst[u]) continue;
      for (const { to, weight, edgeId } of adj[u]) {
        if (inMst[to]) continue;
        const consider = edgePaint();
        consider[edgeId] = "consider";
        const roles = baseRoles();
        roles[u] = "current";
        roles[to] = "frontier";
        t.relax();
        t.push(
          roles,
          consider,
          `Candidate cut edge ${u} — ${to} (w=${weight}).`,
        );
        if (!best || weight < best.weight) {
          best = { to, weight, edgeId, from: u };
        }
      }
    }

    if (!best) break;
    inMst[best.to] = true;
    treeEdges.add(best.edgeId);
    t.visit();
    const roles = baseRoles();
    roles[best.to] = "current";
    const edgesRoles = edgePaint();
    edgesRoles[best.edgeId] = "tree";
    t.push(
      roles,
      edgesRoles,
      `Add edge ${best.from} — ${best.to} (w=${best.weight}) to the MST.`,
    );
  }

  paintTerminal(
    t,
    start,
    null,
    new Set(inMst.map((value, id) => (value ? id : -1)).filter((id) => id >= 0)),
    treeEdges,
    "Prim finished — minimum spanning tree complete.",
  );
  return t.frames;
}

export function kruskal(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const uf = new UnionFind(nodes.length);
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const treeEdges = new Set<number>();
  const inMst = new Set<number>();

  const edgePaint = () => {
    const roles = t.idleEdgeRoles();
    for (const id of treeEdges) roles[id] = "tree";
    return roles;
  };

  const nodePaint = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (const id of inMst) roles[id] = "path";
    roles[start] = "start";
    return roles;
  };

  t.push(
    nodePaint(),
    edgePaint(),
    "Kruskal sorts edges by weight, then unions components.",
  );

  for (const edge of sorted) {
    const consider = edgePaint();
    consider[edge.id] = "consider";
    t.relax();
    t.push(
      nodePaint(),
      consider,
      `Consider edge ${edge.u} — ${edge.v} (w=${edge.weight}).`,
    );

    if (uf.union(edge.u, edge.v)) {
      treeEdges.add(edge.id);
      inMst.add(edge.u);
      inMst.add(edge.v);
      t.visit();
      const accepted = edgePaint();
      accepted[edge.id] = "tree";
      t.push(
        nodePaint(),
        accepted,
        `Accept edge ${edge.u} — ${edge.v} into the MST.`,
      );
    } else {
      const rejected = edgePaint();
      rejected[edge.id] = "rejected";
      t.push(
        nodePaint(),
        rejected,
        `Reject ${edge.u} — ${edge.v} — would form a cycle.`,
      );
    }

    if (treeEdges.size === nodes.length - 1) break;
  }

  paintTerminal(
    t,
    start,
    null,
    inMst,
    treeEdges,
    "Kruskal finished — minimum spanning tree complete.",
  );
  return t.frames;
}
