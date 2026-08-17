import {
  GraphTrace,
  adjacency,
  paintTerminal,
  reconstructPath,
} from "@/lib/graphs/trace";
import type { GraphData, GraphFrame, NodeRole } from "@/lib/graphs/types";

function euclid(nodes: GraphData["nodes"], a: number, b: number) {
  return Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
}

/** Match edge-weight scale used in randomGraph (distance / 9). */
function heuristic(nodes: GraphData["nodes"], a: number, b: number) {
  return Math.round((euclid(nodes, a, b) / 9) * 10) / 10;
}

export function dijkstra(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);
  const dist = new Array(nodes.length).fill(Infinity);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const parentEdge = new Array<number | null>(nodes.length).fill(null);
  const done = new Array(nodes.length).fill(false);
  dist[start] = 0;

  const labels = () =>
    Object.fromEntries(
      dist.map((value, id) => [
        id,
        Number.isFinite(value) ? String(Math.round(value * 10) / 10) : "∞",
      ]),
    );

  const open = () =>
    dist
      .map((value, id) => ({ value, id }))
      .filter((item) => !done[item.id] && Number.isFinite(item.value))
      .sort((a, b) => a.value - b.value)
      .map((item) => item.id);

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (done[i]) roles[i] = "visited";
      else if (Number.isFinite(dist[i])) roles[i] = "frontier";
    }
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(
    baseRoles(),
    t.idleEdgeRoles(),
    `Dijkstra from ${start} — distances start at 0 / ∞.`,
    { labels: labels(), frontier: open() },
  );

  while (true) {
    const frontier = open();
    if (!frontier.length) break;
    const u = frontier[0];
    done[u] = true;
    t.visit();

    const roles = baseRoles();
    roles[u] = "current";
    t.push(roles, t.idleEdgeRoles(), `Settle ${u} at distance ${dist[u]}.`, {
      labels: labels(),
      frontier: open(),
    });

    if (u === goal) {
      const path = reconstructPath(parent, parentEdge, start, goal);
      paintTerminal(
        t,
        start,
        goal,
        path.nodes,
        path.edges,
        `Shortest path cost ${dist[goal]}.`,
      );
      return t.frames;
    }

    for (const { to, weight, edgeId } of adj[u]) {
      if (done[to]) continue;
      const edgeRoles = t.idleEdgeRoles();
      edgeRoles[edgeId] = "consider";
      const consider = baseRoles();
      consider[u] = "current";
      t.relax();
      t.push(consider, edgeRoles, `Relax ${u} → ${to} (w=${weight}).`, {
        labels: labels(),
        frontier: open(),
      });

      const next = dist[u] + weight;
      if (next < dist[to]) {
        dist[to] = next;
        parent[to] = u;
        parentEdge[to] = edgeId;
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const updated = baseRoles();
        updated[u] = "current";
        t.push(updated, treeEdges, `Update dist[${to}] = ${next}.`, {
          labels: labels(),
          frontier: open(),
        });
      } else {
        const rejected = t.idleEdgeRoles();
        rejected[edgeId] = "rejected";
        const rolesReject = baseRoles();
        rolesReject[u] = "current";
        t.push(rolesReject, rejected, `No improvement for ${to}.`, {
          labels: labels(),
          frontier: open(),
        });
      }
    }
  }

  paintTerminal(
    t,
    start,
    goal,
    new Set([start]),
    new Set(),
    `Dijkstra finished — ${goal} unreachable.`,
  );
  return t.frames;
}

export function astar(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);
  const gScore = new Array(nodes.length).fill(Infinity);
  const fScore = new Array(nodes.length).fill(Infinity);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const parentEdge = new Array<number | null>(nodes.length).fill(null);
  const closed = new Array(nodes.length).fill(false);
  gScore[start] = 0;
  fScore[start] = heuristic(nodes, start, goal);

  const labels = () =>
    Object.fromEntries(
      nodes.map((_, id) => {
        const h = Math.round(heuristic(nodes, id, goal));
        if (!Number.isFinite(gScore[id])) return [id, `∞|h${h}`];
        const g = Math.round(gScore[id]);
        return [id, `g${g}|h${h}`];
      }),
    );

  const open = () =>
    fScore
      .map((value, id) => ({ value, id }))
      .filter((item) => !closed[item.id] && Number.isFinite(item.value))
      .sort((a, b) => a.value - b.value)
      .map((item) => item.id);

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (closed[i]) roles[i] = "visited";
      else if (Number.isFinite(fScore[i])) roles[i] = "frontier";
    }
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(
    baseRoles(),
    t.idleEdgeRoles(),
    `A* from ${start} to ${goal} — ∞ means not reached yet; h is the heuristic to the goal.`,
    { labels: labels(), frontier: open() },
  );

  while (true) {
    const frontier = open();
    if (!frontier.length) break;
    const u = frontier[0];
    closed[u] = true;
    t.visit();

    const roles = baseRoles();
    roles[u] = "current";
    t.push(roles, t.idleEdgeRoles(), `Expand ${u} (f=${Math.round(fScore[u])}).`, {
      labels: labels(),
      frontier: open(),
    });

    if (u === goal) {
      const path = reconstructPath(parent, parentEdge, start, goal);
      paintTerminal(
        t,
        start,
        goal,
        path.nodes,
        path.edges,
        `A* found a path with cost ${gScore[goal]}.`,
      );
      return t.frames;
    }

    for (const { to, weight, edgeId } of adj[u]) {
      if (closed[to]) continue;
      const edgeRoles = t.idleEdgeRoles();
      edgeRoles[edgeId] = "consider";
      const consider = baseRoles();
      consider[u] = "current";
      t.relax();
      t.push(consider, edgeRoles, `Check neighbor ${to}.`, {
        labels: labels(),
        frontier: open(),
      });

      const tentative = gScore[u] + weight;
      if (tentative < gScore[to]) {
        parent[to] = u;
        parentEdge[to] = edgeId;
        gScore[to] = tentative;
        fScore[to] = tentative + heuristic(nodes, to, goal);
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const updated = baseRoles();
        updated[u] = "current";
        t.push(
          updated,
          treeEdges,
          `Improve ${to}: g=${Math.round(tentative)} f=${Math.round(fScore[to])}.`,
          { labels: labels(), frontier: open() },
        );
      } else {
        const rejected = t.idleEdgeRoles();
        rejected[edgeId] = "rejected";
        const rolesReject = baseRoles();
        rolesReject[u] = "current";
        t.push(rolesReject, rejected, `Skip ${to} — no better g.`, {
          labels: labels(),
          frontier: open(),
        });
      }
    }
  }

  paintTerminal(
    t,
    start,
    goal,
    new Set([start]),
    new Set(),
    `A* finished — ${goal} unreachable.`,
  );
  return t.frames;
}
