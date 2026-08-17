import { GraphTrace, adjacency, paintTerminal, reconstructPath } from "./trace";
import type { GraphData, GraphFrame, NodeRole } from "./types";

export function bfs(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);
  const visited = new Array(nodes.length).fill(false);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const parentEdge = new Array<number | null>(nodes.length).fill(null);
  const queue: number[] = [start];
  visited[start] = true;

  const baseRoles = () => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (visited[i]) roles[i] = "visited";
    }
    for (const id of queue) roles[id] = "frontier";
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(baseRoles(), t.idleEdgeRoles(), `BFS from ${start} toward ${goal}.`, {
    frontier: [...queue],
  });

  while (queue.length) {
    const u = queue.shift()!;
    t.visit();
    const nodeRoles = baseRoles();
    nodeRoles[u] = "current";
    const edgeRoles = t.idleEdgeRoles();
    t.push(nodeRoles, edgeRoles, `Dequeue ${u} and scan neighbors.`, {
      frontier: [...queue],
    });

    if (u === goal) {
      const path = reconstructPath(parent, parentEdge, start, goal);
      paintTerminal(
        t,
        start,
        goal,
        path.nodes,
        path.edges,
        `BFS found a shortest hop-path to ${goal}.`,
      );
      return t.frames;
    }

    for (const { to, edgeId } of adj[u]) {
      const considerRoles = baseRoles();
      considerRoles[u] = "current";
      const considerEdges = t.idleEdgeRoles();
      considerEdges[edgeId] = "consider";
      t.relax();
      t.push(considerRoles, considerEdges, `Inspect edge ${u} — ${to}.`, {
        frontier: [...queue],
      });

      if (!visited[to]) {
        visited[to] = true;
        parent[to] = u;
        parentEdge[to] = edgeId;
        queue.push(to);
        const edgeRolesNext = t.idleEdgeRoles();
        edgeRolesNext[edgeId] = "tree";
        const roles = baseRoles();
        roles[u] = "current";
        t.push(roles, edgeRolesNext, `Enqueue ${to}.`, {
          frontier: [...queue],
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
    `BFS finished — ${goal} is unreachable.`,
  );
  return t.frames;
}

export function dfs(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);
  const visited = new Array(nodes.length).fill(false);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const parentEdge = new Array<number | null>(nodes.length).fill(null);
  const stack: number[] = [start];

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (visited[i]) roles[i] = "visited";
    }
    for (const id of stack) roles[id] = "frontier";
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(baseRoles(), t.idleEdgeRoles(), `DFS from ${start} toward ${goal}.`, {
    frontier: [...stack],
  });

  while (stack.length) {
    const u = stack.pop()!;
    if (visited[u]) continue;
    visited[u] = true;
    t.visit();

    const nodeRoles = baseRoles();
    nodeRoles[u] = "current";
    t.push(nodeRoles, t.idleEdgeRoles(), `Visit ${u}.`, {
      frontier: [...stack],
    });

    if (u === goal) {
      const path = reconstructPath(parent, parentEdge, start, goal);
      paintTerminal(t, start, goal, path.nodes, path.edges, `DFS reached ${goal}.`);
      return t.frames;
    }

    const neighbors = [...adj[u]].reverse();
    for (const { to, edgeId } of neighbors) {
      const considerEdges = t.idleEdgeRoles();
      considerEdges[edgeId] = "consider";
      const roles = baseRoles();
      roles[u] = "current";
      t.relax();
      t.push(roles, considerEdges, `Inspect edge ${u} — ${to}.`, {
        frontier: [...stack],
      });

      if (!visited[to]) {
        parent[to] = u;
        parentEdge[to] = edgeId;
        stack.push(to);
        const edgeRoles = t.idleEdgeRoles();
        edgeRoles[edgeId] = "tree";
        const next = baseRoles();
        next[u] = "current";
        t.push(next, edgeRoles, `Push ${to} onto the stack.`, {
          frontier: [...stack],
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
    `DFS finished — ${goal} is unreachable.`,
  );
  return t.frames;
}
