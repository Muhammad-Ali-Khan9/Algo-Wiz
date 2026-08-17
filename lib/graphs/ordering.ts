import { GraphTrace, adjacency } from "./trace";
import type { EdgeRole, GraphData, GraphFrame, NodeRole } from "./types";

function paintEdges(t: GraphTrace, tree: Set<number>): EdgeRole[] {
  const roles = t.idleEdgeRoles();
  for (const id of tree) roles[id] = "tree";
  return roles;
}

function rolesFromState(
  n: number,
  opts: {
    visited?: boolean[];
    current?: number | null;
    frontier?: number[];
    done?: Set<number>;
    start?: number;
  },
): NodeRole[] {
  const roles: NodeRole[] = Array.from({ length: n }, () => "idle");
  if (opts.visited) {
    for (let i = 0; i < n; i += 1) {
      if (opts.visited[i]) roles[i] = "visited";
    }
  }
  if (opts.done) {
    for (const id of opts.done) roles[id] = "path";
  }
  if (opts.frontier) {
    for (const id of opts.frontier) roles[id] = "frontier";
  }
  if (opts.current != null) roles[opts.current] = "current";
  if (opts.start != null) roles[opts.start] = "start";
  return roles;
}

/** Kahn’s algorithm — peel in-degree zero vertices. */
export function topoKahn(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, false);
  const indeg = new Array(nodes.length).fill(0);
  for (const edge of edges) indeg[edge.v] += 1;

  const order: number[] = [];
  const placed = new Set<number>();
  const queue = indeg
    .map((d, id) => (d === 0 ? id : -1))
    .filter((id) => id >= 0);
  const remaining = indeg.slice();
  const treeEdges = new Set<number>();

  const degLabels = () =>
    Object.fromEntries(remaining.map((d, id) => [id, placed.has(id) ? `#${order.indexOf(id)}` : `in${d}`]));

  t.push(
    rolesFromState(nodes.length, { frontier: queue, start }),
    t.idleEdgeRoles(),
    "Kahn — start with all in-degree 0 vertices in the queue.",
    { labels: degLabels(), frontier: [...queue] },
  );

  while (queue.length) {
    const u = queue.shift()!;
    order.push(u);
    placed.add(u);
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        current: u,
        frontier: queue,
        done: placed,
        start,
      }),
      paintEdges(t, treeEdges),
      `Emit ${u} (position ${order.length - 1}).`,
      { labels: degLabels(), frontier: [...queue] },
    );

    for (const { to, edgeId } of adj[u]) {
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      remaining[to] -= 1;
      t.push(
        rolesFromState(nodes.length, {
          current: u,
          frontier: queue,
          done: placed,
          start,
        }),
        edgeRoles,
        `Relax ${u} → ${to}; in-degree now ${remaining[to]}.`,
        { labels: degLabels(), frontier: [...queue] },
      );

      if (remaining[to] === 0) {
        treeEdges.add(edgeId);
        queue.push(to);
        t.push(
          rolesFromState(nodes.length, {
            current: u,
            frontier: queue,
            done: placed,
            start,
          }),
          paintEdges(t, treeEdges),
          `Enqueue ${to} (in-degree 0).`,
          { labels: degLabels(), frontier: [...queue] },
        );
      }
    }
  }

  if (order.length !== nodes.length) {
    const leftover = nodes
      .map((_, i) => i)
      .filter((i) => !placed.has(i));
    const nodeRoles = t.idleNodeRoles();
    for (const id of placed) nodeRoles[id] = "path";
    for (const id of leftover) nodeRoles[id] = "visited";
    t.push(
      nodeRoles,
      paintEdges(t, treeEdges),
      `Cycle detected — cannot order remaining nodes [${leftover.join(", ")}].`,
      { labels: degLabels() },
    );
    return t.frames;
  }

  t.push(
    rolesFromState(nodes.length, { done: placed, start }),
    paintEdges(t, treeEdges),
    `Topological order: [${order.join(", ")}].`,
    { labels: degLabels(), frontier: order },
  );
  return t.frames;
}

/** DFS topological sort via finishing times (reverse postorder). */
export function topoDfs(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, false);
  const color = new Array(nodes.length).fill(0); // 0 white 1 gray 2 black
  const order: number[] = [];
  const finish = new Array<number | null>(nodes.length).fill(null);
  const treeEdges = new Set<number>();
  let time = 0;
  let cyclic = false;

  const labels = () => {
    const out: Record<number, string> = {};
    for (let i = 0; i < nodes.length; i += 1) {
      if (finish[i] != null) out[i] = `f${finish[i]}`;
    }
    return out;
  };

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "DFS topological sort — reverse finishing times yield an order on a DAG.",
  );

  const dfs = (u: number) => {
    color[u] = 1;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited: color.map((c) => c !== 0),
        current: u,
        frontier: color.map((c, id) => (c === 1 ? id : -1)).filter((id) => id >= 0),
        start,
      }),
      paintEdges(t, treeEdges),
      `Enter ${u} (gray).`,
      { labels: labels() },
    );

    for (const { to, edgeId } of adj[u]) {
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, {
          visited: color.map((c) => c !== 0),
          current: u,
          frontier: color.map((c, id) => (c === 1 ? id : -1)).filter((id) => id >= 0),
          start,
        }),
        edgeRoles,
        `Inspect ${u} → ${to}.`,
        { labels: labels() },
      );

      if (color[to] === 1) {
        edgeRoles[edgeId] = "rejected";
        cyclic = true;
        t.push(
          rolesFromState(nodes.length, {
            visited: color.map((c) => c !== 0),
            current: u,
            frontier: color.map((c, id) => (c === 1 ? id : -1)).filter((id) => id >= 0),
            start,
          }),
          edgeRoles,
          `Back edge to gray ${to} — not a DAG.`,
          { labels: labels() },
        );
        return;
      }

      if (color[to] === 0) {
        treeEdges.add(edgeId);
        dfs(to);
        if (cyclic) return;
      }
    }

    color[u] = 2;
    finish[u] = time;
    time += 1;
    order.push(u);
    t.push(
      rolesFromState(nodes.length, {
        visited: color.map((c) => c !== 0),
        current: u,
        done: new Set(order),
        start,
      }),
      paintEdges(t, treeEdges),
      `Finish ${u} at time ${finish[u]}.`,
      { labels: labels(), frontier: [...order].reverse() },
    );
  };

  for (let u = 0; u < nodes.length; u += 1) {
    if (color[u] === 0) {
      dfs(u);
      if (cyclic) {
        t.push(
          rolesFromState(nodes.length, {
            visited: color.map((c) => c !== 0),
            start,
          }),
          paintEdges(t, treeEdges),
          "Cycle found — topological sort is impossible.",
          { labels: labels() },
        );
        return t.frames;
      }
    }
  }

  const topo = [...order].reverse();
  t.push(
    rolesFromState(nodes.length, {
      done: new Set(nodes.map((_, i) => i)),
      start,
    }),
    paintEdges(t, treeEdges),
    `Topological order: [${topo.join(", ")}].`,
    {
      labels: Object.fromEntries(topo.map((id, i) => [id, `#${i}`])),
      frontier: topo,
    },
  );
  return t.frames;
}
