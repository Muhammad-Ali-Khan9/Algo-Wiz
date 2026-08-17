import {
  GraphTrace,
  adjacency,
  paintTerminal,
  reconstructPath,
} from "@/lib/graphs/trace";
import type { GraphData, GraphFrame, NodeRole } from "@/lib/graphs/types";

function euclid(nodes: GraphData["nodes"], a: number, b: number) {
  return Math.hypot(nodes[a]!.x - nodes[b]!.x, nodes[a]!.y - nodes[b]!.y);
}

/** Match edge-weight scale used in randomGraph (distance / 9). */
export function pathHeuristic(nodes: GraphData["nodes"], a: number, b: number) {
  return Math.round((euclid(nodes, a, b) / 9) * 10) / 10;
}

function fmt(value: number) {
  return Number.isFinite(value) ? String(Math.round(value * 10) / 10) : "∞";
}

function joinPath(
  parentF: (number | null)[],
  parentEdgeF: (number | null)[],
  parentB: (number | null)[],
  parentEdgeB: (number | null)[],
  start: number,
  goal: number,
  meet: number,
): { nodes: Set<number>; edges: Set<number> } {
  const forward = reconstructPath(parentF, parentEdgeF, start, meet);
  const backward = reconstructPath(parentB, parentEdgeB, goal, meet);
  return {
    nodes: new Set([...forward.nodes, ...backward.nodes]),
    edges: new Set([...forward.edges, ...backward.edges]),
  };
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

  const labels = () => Object.fromEntries(dist.map((value, id) => [id, fmt(value)]));

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
    const u = frontier[0]!;
    done[u] = true;
    t.visit();

    const roles = baseRoles();
    roles[u] = "current";
    t.push(roles, t.idleEdgeRoles(), `Settle ${u} at distance ${fmt(dist[u]!)}.`, {
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
        `Shortest path cost ${fmt(dist[goal]!)}.`,
      );
      return t.frames;
    }

    for (const { to, weight, edgeId } of adj[u]!) {
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

      const next = dist[u]! + weight;
      if (next < dist[to]!) {
        dist[to] = next;
        parent[to] = u;
        parentEdge[to] = edgeId;
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const updated = baseRoles();
        updated[u] = "current";
        t.push(updated, treeEdges, `Update dist[${to}] = ${fmt(next)}.`, {
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
  fScore[start] = pathHeuristic(nodes, start, goal);

  const labels = () =>
    Object.fromEntries(
      nodes.map((_, id) => {
        const h = Math.round(pathHeuristic(nodes, id, goal));
        if (!Number.isFinite(gScore[id]!)) return [id, `∞|h${h}`];
        const g = Math.round(gScore[id]!);
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
      else if (Number.isFinite(fScore[i]!)) roles[i] = "frontier";
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
    const u = frontier[0]!;
    closed[u] = true;
    t.visit();

    const roles = baseRoles();
    roles[u] = "current";
    t.push(roles, t.idleEdgeRoles(), `Expand ${u} (f=${Math.round(fScore[u]!)}).`, {
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
        `A* found a path with cost ${fmt(gScore[goal]!)}.`,
      );
      return t.frames;
    }

    for (const { to, weight, edgeId } of adj[u]!) {
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

      const tentative = gScore[u]! + weight;
      if (tentative < gScore[to]!) {
        parent[to] = u;
        parentEdge[to] = edgeId;
        gScore[to] = tentative;
        fScore[to] = tentative + pathHeuristic(nodes, to, goal);
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const updated = baseRoles();
        updated[u] = "current";
        t.push(
          updated,
          treeEdges,
          `Improve ${to}: g=${Math.round(tentative)} f=${Math.round(fScore[to]!)}.`,
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

export function greedyBestFirst(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const parentEdge = new Array<number | null>(nodes.length).fill(null);
  const closed = new Array(nodes.length).fill(false);
  const seen = new Array(nodes.length).fill(false);
  const hOf = (id: number) => pathHeuristic(nodes, id, goal);
  const openIds = [start];
  seen[start] = true;

  const labels = () =>
    Object.fromEntries(
      nodes.map((_, id) => [
        id,
        seen[id] || closed[id] ? `h${Math.round(hOf(id))}` : "·",
      ]),
    );

  const sortedOpen = () => [...openIds].sort((a, b) => hOf(a) - hOf(b) || a - b);

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (closed[i]) roles[i] = "visited";
      else if (seen[i]) roles[i] = "frontier";
    }
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(
    baseRoles(),
    t.idleEdgeRoles(),
    `Greedy best-first from ${start} — expand lowest h only (not optimal).`,
    { labels: labels(), frontier: sortedOpen() },
  );

  while (openIds.length) {
    openIds.sort((a, b) => hOf(a) - hOf(b) || a - b);
    const u = openIds.shift()!;
    closed[u] = true;
    t.visit();

    const roles = baseRoles();
    roles[u] = "current";
    t.push(roles, t.idleEdgeRoles(), `Expand ${u} (h=${Math.round(hOf(u))}).`, {
      labels: labels(),
      frontier: sortedOpen(),
    });

    if (u === goal) {
      const path = reconstructPath(parent, parentEdge, start, goal);
      paintTerminal(
        t,
        start,
        goal,
        path.nodes,
        path.edges,
        `Greedy reached ${goal} (path may not be shortest).`,
      );
      return t.frames;
    }

    for (const { to, edgeId } of adj[u]!) {
      const edgeRoles = t.idleEdgeRoles();
      edgeRoles[edgeId] = "consider";
      const consider = baseRoles();
      consider[u] = "current";
      t.relax();
      t.push(consider, edgeRoles, `Check neighbor ${to} (h=${Math.round(hOf(to))}).`, {
        labels: labels(),
        frontier: sortedOpen(),
      });

      if (!seen[to]) {
        seen[to] = true;
        parent[to] = u;
        parentEdge[to] = edgeId;
        openIds.push(to);
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const updated = baseRoles();
        updated[u] = "current";
        t.push(updated, treeEdges, `Open ${to}.`, {
          labels: labels(),
          frontier: sortedOpen(),
        });
      } else {
        const rejected = t.idleEdgeRoles();
        rejected[edgeId] = "rejected";
        const rolesReject = baseRoles();
        rolesReject[u] = "current";
        t.push(rolesReject, rejected, `${to} already seen — greedy does not reopen.`, {
          labels: labels(),
          frontier: sortedOpen(),
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
    `Greedy finished — ${goal} unreachable.`,
  );
  return t.frames;
}

export function bellmanFord(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const n = nodes.length;
  const dist = new Array(n).fill(Infinity);
  const parent = new Array<number | null>(n).fill(null);
  const parentEdge = new Array<number | null>(n).fill(null);
  dist[start] = 0;

  // Undirected viz graph → treat each undirected edge as both directions.
  const directed: { u: number; v: number; w: number; edgeId: number }[] = [];
  for (const edge of edges) {
    directed.push({ u: edge.u, v: edge.v, w: edge.weight, edgeId: edge.id });
    directed.push({ u: edge.v, v: edge.u, w: edge.weight, edgeId: edge.id });
  }

  const labels = () => Object.fromEntries(dist.map((value, id) => [id, fmt(value)]));

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (Number.isFinite(dist[i]!)) roles[i] = "frontier";
    }
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(
    baseRoles(),
    t.idleEdgeRoles(),
    `Bellman–Ford from ${start} — relax all edges up to ${n - 1} rounds.`,
    { labels: labels(), frontier: [start] },
  );

  for (let round = 1; round <= n - 1; round += 1) {
    let improved = false;
    t.push(baseRoles(), t.idleEdgeRoles(), `Round ${round} of ${n - 1}.`, {
      labels: labels(),
    });

    for (const { u, v, w, edgeId } of directed) {
      if (!Number.isFinite(dist[u]!)) continue;
      const next = dist[u]! + w;
      if (next < dist[v]!) {
        const edgeRoles = t.idleEdgeRoles();
        edgeRoles[edgeId] = "consider";
        const consider = baseRoles();
        consider[u] = "current";
        t.relax();
        t.push(consider, edgeRoles, `Round ${round}: try ${u} → ${v} (w=${w}).`, {
          labels: labels(),
        });

        dist[v] = next;
        parent[v] = u;
        parentEdge[v] = edgeId;
        improved = true;
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const updated = baseRoles();
        updated[v] = "frontier";
        updated[u] = "current";
        t.push(updated, treeEdges, `Update dist[${v}] = ${fmt(next)}.`, {
          labels: labels(),
        });
      } else {
        t.relax();
      }
    }

    if (!improved) {
      t.push(
        baseRoles(),
        t.idleEdgeRoles(),
        `Early stop — no updates in round ${round}.`,
        { labels: labels() },
      );
      break;
    }
  }

  // Negative-cycle check (rarely triggers on generated graphs).
  let neg = false;
  for (const { u, v, w, edgeId } of directed) {
    if (!Number.isFinite(dist[u]!)) continue;
    if (dist[u]! + w < dist[v]!) {
      neg = true;
      const edgeRoles = t.idleEdgeRoles();
      edgeRoles[edgeId] = "rejected";
      t.push(baseRoles(), edgeRoles, `Negative cycle detected via ${u} → ${v}.`, {
        labels: labels(),
      });
      break;
    }
  }

  if (neg) {
    paintTerminal(
      t,
      start,
      goal,
      new Set([start]),
      new Set(),
      `Bellman–Ford aborted — negative cycle reachable from ${start}.`,
    );
    return t.frames;
  }

  if (Number.isFinite(dist[goal]!)) {
    const path = reconstructPath(parent, parentEdge, start, goal);
    paintTerminal(
      t,
      start,
      goal,
      path.nodes,
      path.edges,
      `Bellman–Ford distance to ${goal} is ${fmt(dist[goal]!)}.`,
    );
  } else {
    paintTerminal(
      t,
      start,
      goal,
      new Set([start]),
      new Set(),
      `Bellman–Ford finished — ${goal} unreachable.`,
    );
  }
  return t.frames;
}

export function floydWarshall(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const n = nodes.length;
  const INF = 1e12;
  const dist = Array.from({ length: n }, () => new Array(n).fill(INF));
  const next = Array.from({ length: n }, () => new Array<number | null>(n).fill(null));
  const edgeBetween = new Map<string, number>();

  for (let i = 0; i < n; i += 1) {
    dist[i]![i] = 0;
    next[i]![i] = i;
  }
  for (const edge of edges) {
    const key = (a: number, b: number) => `${a}-${b}`;
    if (edge.weight < dist[edge.u]![edge.v]!) {
      dist[edge.u]![edge.v] = edge.weight;
      dist[edge.v]![edge.u] = edge.weight;
      next[edge.u]![edge.v] = edge.v;
      next[edge.v]![edge.u] = edge.u;
      edgeBetween.set(key(edge.u, edge.v), edge.id);
      edgeBetween.set(key(edge.v, edge.u), edge.id);
    }
  }

  const labels = () =>
    Object.fromEntries(
      nodes.map((_, id) => {
        const d = dist[start]![id]!;
        // One compact token per node: integer distance from start (or ∞).
        if (!(Number.isFinite(d) && d < INF)) return [id, "∞"];
        return [id, String(Math.round(d))];
      }),
    );

  const baseRoles = (focusK?: number): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < n; i += 1) {
      if (Number.isFinite(dist[start]![i]!) && dist[start]![i]! < INF) {
        roles[i] = "frontier";
      }
    }
    if (focusK != null) roles[focusK] = "current";
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(
    baseRoles(),
    t.idleEdgeRoles(),
    `Floyd–Warshall — DP over intermediate vertices; labels show dist[${start}][*].`,
    { labels: labels() },
  );

  for (let k = 0; k < n; k += 1) {
    t.visit();
    t.push(
      baseRoles(k),
      t.idleEdgeRoles(),
      `Allow paths through ${k} as an intermediate.`,
      { labels: labels(), frontier: [k] },
    );

    for (let i = 0; i < n; i += 1) {
      if (dist[i]![k]! >= INF) continue;
      for (let j = 0; j < n; j += 1) {
        if (dist[k]![j]! >= INF) continue;
        const via = dist[i]![k]! + dist[k]![j]!;
        // Only animate updates that touch the start→* view (keeps frame count sane).
        const interesting = i === start;
        if (via < dist[i]![j]!) {
          dist[i]![j] = via;
          next[i]![j] = next[i]![k]!;
          t.relax();
          if (interesting) {
            const edgeRoles = t.idleEdgeRoles();
            const hop = next[i]![k];
            if (hop != null && hop !== i) {
              const eid = edgeBetween.get(`${i}-${hop}`);
              if (eid != null) edgeRoles[eid] = "tree";
            }
            const roles = baseRoles(k);
            roles[i] = "frontier";
            roles[j] = "frontier";
            t.push(roles, edgeRoles, `Improve ${i} → ${j} via ${k}: ${fmt(via)}.`, {
              labels: labels(),
            });
          }
        }
      }
    }
  }

  if (dist[start]![goal]! >= INF) {
    paintTerminal(
      t,
      start,
      goal,
      new Set([start]),
      new Set(),
      `Floyd–Warshall — ${goal} unreachable from ${start}.`,
    );
    return t.frames;
  }

  const pathNodes = new Set<number>();
  const pathEdges = new Set<number>();
  let u = start;
  pathNodes.add(u);
  while (u !== goal) {
    const v = next[u]![goal];
    if (v == null || v === u) break;
    const eid = edgeBetween.get(`${u}-${v}`);
    if (eid != null) pathEdges.add(eid);
    pathNodes.add(v);
    u = v;
  }

  paintTerminal(
    t,
    start,
    goal,
    pathNodes,
    pathEdges,
    `All-pairs done — shortest ${start}→${goal} costs ${fmt(dist[start]![goal]!)}.`,
  );
  return t.frames;
}

export function bidirectionalBfs(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);

  if (start === goal) {
    paintTerminal(t, start, goal, new Set([start]), new Set(), `Start equals goal.`);
    return t.frames;
  }

  const parentF = new Array<number | null>(nodes.length).fill(null);
  const parentB = new Array<number | null>(nodes.length).fill(null);
  const edgeF = new Array<number | null>(nodes.length).fill(null);
  const edgeB = new Array<number | null>(nodes.length).fill(null);
  const side = new Array<number>(nodes.length).fill(0); // 1 forward, 2 backward
  const qF: number[] = [start];
  const qB: number[] = [goal];
  side[start] = 1;
  side[goal] = 2;
  parentF[start] = start;
  parentB[goal] = goal;

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < roles.length; i += 1) {
      if (side[i]) roles[i] = "visited";
    }
    for (const id of qF) roles[id] = "frontier";
    for (const id of qB) roles[id] = "frontier";
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  t.push(
    baseRoles(),
    t.idleEdgeRoles(),
    `Bidirectional BFS — search from ${start} and ${goal} until they meet.`,
    { frontier: [...qF, ...qB] },
  );

  while (qF.length && qB.length) {
    // Expand the smaller frontier first.
    const expandForward = qF.length <= qB.length;
    const queue = expandForward ? qF : qB;
    const mySide = expandForward ? 1 : 2;
    const u = queue.shift()!;
    t.visit();

    const roles = baseRoles();
    roles[u] = "current";
    t.push(
      roles,
      t.idleEdgeRoles(),
      `Expand ${u} from the ${expandForward ? "start" : "goal"} side.`,
      { frontier: [...qF, ...qB] },
    );

    for (const { to, edgeId } of adj[u]!) {
      const edgeRoles = t.idleEdgeRoles();
      edgeRoles[edgeId] = "consider";
      const consider = baseRoles();
      consider[u] = "current";
      t.relax();
      t.push(consider, edgeRoles, `Inspect ${u} — ${to}.`, {
        frontier: [...qF, ...qB],
      });

      if (!side[to]) {
        side[to] = mySide;
        if (expandForward) {
          parentF[to] = u;
          edgeF[to] = edgeId;
          qF.push(to);
        } else {
          parentB[to] = u;
          edgeB[to] = edgeId;
          qB.push(to);
        }
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const next = baseRoles();
        next[u] = "current";
        t.push(
          next,
          treeEdges,
          `Claim ${to} for the ${expandForward ? "start" : "goal"} wave.`,
          {
            frontier: [...qF, ...qB],
          },
        );
      } else if (side[to] !== mySide) {
        // Meeting point.
        if (expandForward) {
          parentF[to] = u;
          edgeF[to] = edgeId;
        } else {
          parentB[to] = u;
          edgeB[to] = edgeId;
        }
        const path = joinPath(parentF, edgeF, parentB, edgeB, start, goal, to);
        paintTerminal(
          t,
          start,
          goal,
          path.nodes,
          path.edges,
          `Waves met at ${to} — shortest hop-path found.`,
        );
        return t.frames;
      } else {
        const rejected = t.idleEdgeRoles();
        rejected[edgeId] = "rejected";
        const rolesReject = baseRoles();
        rolesReject[u] = "current";
        t.push(rolesReject, rejected, `${to} already on this side.`, {
          frontier: [...qF, ...qB],
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
    `Bidirectional BFS — ${goal} unreachable.`,
  );
  return t.frames;
}

type BiMode = "dijkstra" | "astar";

function bidirectionalShortest(graph: GraphData, mode: BiMode): GraphFrame[] {
  const { nodes, edges, start, goal } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges);
  const n = nodes.length;

  if (start === goal) {
    paintTerminal(t, start, goal, new Set([start]), new Set(), `Start equals goal.`);
    return t.frames;
  }

  const distF = new Array(n).fill(Infinity);
  const distB = new Array(n).fill(Infinity);
  const doneF = new Array(n).fill(false);
  const doneB = new Array(n).fill(false);
  const parentF = new Array<number | null>(n).fill(null);
  const parentB = new Array<number | null>(n).fill(null);
  const edgeF = new Array<number | null>(n).fill(null);
  const edgeB = new Array<number | null>(n).fill(null);
  distF[start] = 0;
  distB[goal] = 0;

  const prio = (side: "f" | "b", id: number) => {
    const g = side === "f" ? distF[id]! : distB[id]!;
    if (!Number.isFinite(g)) return Infinity;
    if (mode === "dijkstra") return g;
    const h =
      side === "f" ? pathHeuristic(nodes, id, goal) : pathHeuristic(nodes, id, start);
    return g + h;
  };

  const open = (side: "f" | "b") => {
    const dist = side === "f" ? distF : distB;
    const done = side === "f" ? doneF : doneB;
    return dist
      .map((value, id) => ({ value: prio(side, id), id }))
      .filter((item) => !done[item.id] && Number.isFinite(dist[item.id]!))
      .sort((a, b) => a.value - b.value || a.id - b.id)
      .map((item) => item.id);
  };

  let best = Infinity;
  let meet: number | null = null;

  const labels = () =>
    Object.fromEntries(
      nodes.map((_, id) => {
        const gf = Number.isFinite(distF[id]!) ? Math.round(distF[id]!) : "∞";
        const gb = Number.isFinite(distB[id]!) ? Math.round(distB[id]!) : "∞";
        // Two short lines only — enough for dual search, fits large nodes.
        return [id, `→${gf}|←${gb}`];
      }),
    );

  const baseRoles = (): NodeRole[] => {
    const roles = t.idleNodeRoles();
    for (let i = 0; i < n; i += 1) {
      if (doneF[i] || doneB[i]) roles[i] = "visited";
      else if (Number.isFinite(distF[i]!) || Number.isFinite(distB[i]!)) {
        roles[i] = "frontier";
      }
    }
    roles[start] = "start";
    roles[goal] = "goal";
    return roles;
  };

  const name = mode === "astar" ? "Bidirectional A*" : "Bidirectional Dijkstra";
  t.push(baseRoles(), t.idleEdgeRoles(), `${name} from ${start} ↔ ${goal}.`, {
    labels: labels(),
    frontier: [...open("f"), ...open("b")],
  });

  while (true) {
    const fOpen = open("f");
    const bOpen = open("b");
    if (!fOpen.length || !bOpen.length) break;

    const fTop = prio("f", fOpen[0]!);
    const bTop = prio("b", bOpen[0]!);
    if (fTop + bTop >= best) break;

    const expandForward = fOpen.length <= bOpen.length;
    const u = (expandForward ? fOpen : bOpen)[0]!;
    const dist = expandForward ? distF : distB;
    const done = expandForward ? doneF : doneB;
    const parent = expandForward ? parentF : parentB;
    const parentEdge = expandForward ? edgeF : edgeB;
    const otherDist = expandForward ? distB : distF;

    done[u] = true;
    t.visit();

    const roles = baseRoles();
    roles[u] = "current";
    t.push(
      roles,
      t.idleEdgeRoles(),
      `Settle ${u} on the ${expandForward ? "start" : "goal"} side.`,
      { labels: labels(), frontier: [...open("f"), ...open("b")] },
    );

    if (Number.isFinite(otherDist[u]!)) {
      const cand = distF[u]! + distB[u]!;
      if (cand < best) {
        best = cand;
        meet = u;
        t.push(
          baseRoles(),
          t.idleEdgeRoles(),
          `Meet candidate at ${u} — best so far ${fmt(best)}.`,
          { labels: labels(), frontier: [...open("f"), ...open("b")] },
        );
      }
    }

    for (const { to, weight, edgeId } of adj[u]!) {
      if (done[to]) continue;
      const edgeRoles = t.idleEdgeRoles();
      edgeRoles[edgeId] = "consider";
      const consider = baseRoles();
      consider[u] = "current";
      t.relax();
      t.push(
        consider,
        edgeRoles,
        `Relax ${u} → ${to} on ${expandForward ? "forward" : "backward"} search.`,
        { labels: labels(), frontier: [...open("f"), ...open("b")] },
      );

      const next = dist[u]! + weight;
      if (next < dist[to]!) {
        dist[to] = next;
        parent[to] = u;
        parentEdge[to] = edgeId;
        const treeEdges = t.idleEdgeRoles();
        treeEdges[edgeId] = "tree";
        const updated = baseRoles();
        updated[u] = "current";
        t.push(
          updated,
          treeEdges,
          `Update ${expandForward ? "→" : "←"}dist[${to}] = ${fmt(next)}.`,
          {
            labels: labels(),
            frontier: [...open("f"), ...open("b")],
          },
        );

        if (Number.isFinite(otherDist[to]!)) {
          const cand = distF[to]! + distB[to]!;
          if (cand < best) {
            best = cand;
            meet = to;
          }
        }
      } else {
        const rejected = t.idleEdgeRoles();
        rejected[edgeId] = "rejected";
        const rolesReject = baseRoles();
        rolesReject[u] = "current";
        t.push(rolesReject, rejected, `No improvement for ${to}.`, {
          labels: labels(),
          frontier: [...open("f"), ...open("b")],
        });
      }
    }
  }

  if (meet != null && Number.isFinite(best)) {
    const path = joinPath(parentF, edgeF, parentB, edgeB, start, goal, meet);
    paintTerminal(
      t,
      start,
      goal,
      path.nodes,
      path.edges,
      `${name} met at ${meet} — cost ${fmt(best)}.`,
    );
  } else {
    paintTerminal(
      t,
      start,
      goal,
      new Set([start]),
      new Set(),
      `${name} finished — ${goal} unreachable.`,
    );
  }
  return t.frames;
}

export function bidirectionalDijkstra(graph: GraphData): GraphFrame[] {
  return bidirectionalShortest(graph, "dijkstra");
}

export function bidirectionalAstar(graph: GraphData): GraphFrame[] {
  return bidirectionalShortest(graph, "astar");
}
