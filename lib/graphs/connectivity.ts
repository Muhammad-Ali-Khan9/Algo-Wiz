import { GraphTrace, adjacency } from "./trace";
import type { EdgeRole, GraphData, GraphFrame, NodeRole } from "./types";

function componentLabels(comp: (number | null)[]): Record<number, string> {
  const labels: Record<number, string> = {};
  for (let i = 0; i < comp.length; i += 1) {
    if (comp[i] != null) labels[i] = `C${comp[i]}`;
  }
  return labels;
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

/** Undirected connected components via DFS floods. */
export function connectedComponents(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, true);
  const visited = new Array(nodes.length).fill(false);
  const comp = new Array<number | null>(nodes.length).fill(null);
  const done = new Set<number>();
  let compId = 0;
  const treeEdges = new Set<number>();

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Find connected components — flood each unvisited vertex.",
  );

  for (let seed = 0; seed < nodes.length; seed += 1) {
    if (visited[seed]) continue;

    const stack = [seed];
    visited[seed] = true;
    comp[seed] = compId;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited,
        current: seed,
        frontier: stack,
        done,
        start,
      }),
      paintEdges(t, treeEdges),
      `Start component C${compId} at ${seed}.`,
      { labels: componentLabels(comp), frontier: [...stack] },
    );

    while (stack.length) {
      const u = stack.pop()!;
      t.push(
        rolesFromState(nodes.length, {
          visited,
          current: u,
          frontier: stack,
          done,
          start,
        }),
        paintEdges(t, treeEdges),
        `Expand ${u} in C${compId}.`,
        { labels: componentLabels(comp), frontier: [...stack] },
      );

      for (const { to, edgeId } of adj[u]) {
        const edgeRoles = paintEdges(t, treeEdges);
        edgeRoles[edgeId] = "consider";
        t.relax();
        t.push(
          rolesFromState(nodes.length, {
            visited,
            current: u,
            frontier: stack,
            done,
            start,
          }),
          edgeRoles,
          `Inspect ${u} — ${to}.`,
          { labels: componentLabels(comp), frontier: [...stack] },
        );

        if (!visited[to]) {
          visited[to] = true;
          comp[to] = compId;
          treeEdges.add(edgeId);
          stack.push(to);
          t.visit();
          t.push(
            rolesFromState(nodes.length, {
              visited,
              current: u,
              frontier: stack,
              done,
              start,
            }),
            paintEdges(t, treeEdges),
            `Add ${to} to C${compId}.`,
            { labels: componentLabels(comp), frontier: [...stack] },
          );
        }
      }
    }

    for (let i = 0; i < nodes.length; i += 1) {
      if (comp[i] === compId) done.add(i);
    }
    t.push(
      rolesFromState(nodes.length, { visited, done, start }),
      paintEdges(t, treeEdges),
      `Finished C${compId}.`,
      { labels: componentLabels(comp) },
    );
    compId += 1;
  }

  t.push(
    rolesFromState(nodes.length, { done, start }),
    paintEdges(t, treeEdges),
    `Found ${compId} connected component${compId === 1 ? "" : "s"}.`,
    { labels: componentLabels(comp) },
  );
  return t.frames;
}

function paintEdges(t: GraphTrace, tree: Set<number>, extra?: EdgeRole[]): EdgeRole[] {
  const roles = extra ? extra.slice() : t.idleEdgeRoles();
  for (const id of tree) roles[id] = "tree";
  return roles;
}

/** Kosaraju: DFS finish order, then DFS on transpose. */
export function sccKosaraju(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, false);
  const radj: { to: number; weight: number; edgeId: number }[][] = Array.from(
    { length: nodes.length },
    () => [],
  );
  for (const edge of edges) {
    radj[edge.v].push({ to: edge.u, weight: edge.weight, edgeId: edge.id });
  }

  const visited = new Array(nodes.length).fill(false);
  const order: number[] = [];
  const finish = new Array<number | null>(nodes.length).fill(null);
  let time = 0;
  const treeEdges = new Set<number>();

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Kosaraju pass 1 — DFS and record finishing times.",
  );

  const finishLabels = () => {
    const out: Record<number, string> = {};
    for (let i = 0; i < finish.length; i += 1) {
      if (finish[i] != null) out[i] = `f${finish[i]}`;
    }
    return out;
  };

  const dfs1 = (u: number) => {
    visited[u] = true;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited,
        current: u,
        start,
      }),
      paintEdges(t, treeEdges),
      `Visit ${u} (pass 1).`,
      { labels: finishLabels() },
    );

    for (const { to, edgeId } of adj[u]) {
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, { visited, current: u, start }),
        edgeRoles,
        `Inspect ${u} → ${to}.`,
        { labels: finishLabels() },
      );
      if (!visited[to]) {
        treeEdges.add(edgeId);
        dfs1(to);
      }
    }

    finish[u] = time;
    time += 1;
    order.push(u);
    t.push(
      rolesFromState(nodes.length, { visited, current: u, start }),
      paintEdges(t, treeEdges),
      `Finish ${u} at time ${finish[u]}.`,
      {
        labels: finishLabels(),
        frontier: [...order].reverse(),
      },
    );
  };

  for (let u = 0; u < nodes.length; u += 1) {
    if (!visited[u]) dfs1(u);
  }

  t.push(
    rolesFromState(nodes.length, { visited, start }),
    paintEdges(t, treeEdges),
    `Pass 1 done. Process nodes in reverse finish order: [${[...order].reverse().join(", ")}].`,
    {
      labels: finishLabels(),
      frontier: [...order].reverse(),
    },
  );

  const assigned = new Array(nodes.length).fill(false);
  const comp = new Array<number | null>(nodes.length).fill(null);
  const done = new Set<number>();
  let sccId = 0;
  const sccEdges = new Set<number>();

  const dfs2 = (u: number) => {
    assigned[u] = true;
    comp[u] = sccId;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited: assigned,
        current: u,
        done,
        start,
      }),
      paintEdges(t, sccEdges),
      `Assign ${u} to SCC C${sccId}.`,
      { labels: componentLabels(comp) },
    );

    for (const { to, edgeId } of radj[u]) {
      const edgeRoles = paintEdges(t, sccEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, {
          visited: assigned,
          current: u,
          done,
          start,
        }),
        edgeRoles,
        `Transpose edge ${u} → ${to}.`,
        { labels: componentLabels(comp) },
      );
      if (!assigned[to]) {
        sccEdges.add(edgeId);
        dfs2(to);
      }
    }
  };

  for (let i = order.length - 1; i >= 0; i -= 1) {
    const u = order[i]!;
    if (assigned[u]) continue;
    dfs2(u);
    for (let v = 0; v < nodes.length; v += 1) {
      if (comp[v] === sccId) done.add(v);
    }
    t.push(
      rolesFromState(nodes.length, { visited: assigned, done, start }),
      paintEdges(t, sccEdges),
      `Closed SCC C${sccId}.`,
      { labels: componentLabels(comp) },
    );
    sccId += 1;
  }

  t.push(
    rolesFromState(nodes.length, { done, start }),
    paintEdges(t, sccEdges),
    `Kosaraju found ${sccId} strongly connected component${sccId === 1 ? "" : "s"}.`,
    { labels: componentLabels(comp) },
  );
  return t.frames;
}

/** Tarjan SCC with discovery / low-link. */
export function sccTarjan(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, false);
  const disc = new Array(nodes.length).fill(-1);
  const low = new Array(nodes.length).fill(-1);
  const onStack = new Array(nodes.length).fill(false);
  const stack: number[] = [];
  const comp = new Array<number | null>(nodes.length).fill(null);
  const done = new Set<number>();
  const treeEdges = new Set<number>();
  let time = 0;
  let sccId = 0;

  const labels = () => {
    const out: Record<number, string> = {};
    for (let i = 0; i < nodes.length; i += 1) {
      if (comp[i] != null) out[i] = `C${comp[i]}`;
      else if (disc[i] >= 0) out[i] = `d${disc[i]}/L${low[i]}`;
    }
    return out;
  };

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Tarjan — DFS with discovery times and low-link values.",
  );

  const strongConnect = (u: number) => {
    disc[u] = time;
    low[u] = time;
    time += 1;
    stack.push(u);
    onStack[u] = true;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited: disc.map((d) => d >= 0),
        current: u,
        frontier: stack.filter((id) => onStack[id]),
        done,
        start,
      }),
      paintEdges(t, treeEdges),
      `Discover ${u} (disc=${disc[u]}).`,
      { labels: labels(), frontier: [...stack] },
    );

    for (const { to, edgeId } of adj[u]) {
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, {
          visited: disc.map((d) => d >= 0),
          current: u,
          frontier: stack.filter((id) => onStack[id]),
          done,
          start,
        }),
        edgeRoles,
        `Inspect ${u} → ${to}.`,
        { labels: labels(), frontier: [...stack] },
      );

      if (disc[to] < 0) {
        treeEdges.add(edgeId);
        strongConnect(to);
        low[u] = Math.min(low[u], low[to]);
        t.push(
          rolesFromState(nodes.length, {
            visited: disc.map((d) => d >= 0),
            current: u,
            frontier: stack.filter((id) => onStack[id]),
            done,
            start,
          }),
          paintEdges(t, treeEdges),
          `Update low[${u}] = ${low[u]}.`,
          { labels: labels(), frontier: [...stack] },
        );
      } else if (onStack[to]) {
        low[u] = Math.min(low[u], disc[to]);
        edgeRoles[edgeId] = "rejected";
        t.push(
          rolesFromState(nodes.length, {
            visited: disc.map((d) => d >= 0),
            current: u,
            frontier: stack.filter((id) => onStack[id]),
            done,
            start,
          }),
          edgeRoles,
          `Back edge to ${to} — low[${u}] = ${low[u]}.`,
          { labels: labels(), frontier: [...stack] },
        );
      }
    }

    if (low[u] === disc[u]) {
      let v: number;
      do {
        v = stack.pop()!;
        onStack[v] = false;
        comp[v] = sccId;
        done.add(v);
      } while (v !== u);

      t.push(
        rolesFromState(nodes.length, {
          visited: disc.map((d) => d >= 0),
          current: u,
          done,
          start,
        }),
        paintEdges(t, treeEdges),
        `Pop SCC C${sccId} (root ${u}).`,
        { labels: labels() },
      );
      sccId += 1;
    }
  };

  for (let u = 0; u < nodes.length; u += 1) {
    if (disc[u] < 0) strongConnect(u);
  }

  t.push(
    rolesFromState(nodes.length, { done, start }),
    paintEdges(t, treeEdges),
    `Tarjan found ${sccId} strongly connected component${sccId === 1 ? "" : "s"}.`,
    { labels: labels() },
  );
  return t.frames;
}

/** Undirected cycle detection via DFS parent check. */
export function cycleUndirected(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, true);
  const visited = new Array(nodes.length).fill(false);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const parentEdge = new Array<number | null>(nodes.length).fill(null);
  const treeEdges = new Set<number>();

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Detect cycles in an undirected graph with DFS.",
  );

  const dfs = (u: number): boolean => {
    visited[u] = true;
    t.visit();
    t.push(
      rolesFromState(nodes.length, { visited, current: u, start }),
      paintEdges(t, treeEdges),
      `Visit ${u}.`,
    );

    for (const { to, edgeId } of adj[u]) {
      if (to === parent[u]) continue;
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, { visited, current: u, start }),
        edgeRoles,
        `Inspect ${u} — ${to}.`,
      );

      if (visited[to]) {
        edgeRoles[edgeId] = "rejected";
        const cycleNodes = new Set<number>([u, to]);
        let cur: number | null = u;
        while (cur != null && cur !== to) {
          cycleNodes.add(cur);
          cur = parent[cur];
        }
        cycleNodes.add(to);
        const cycleEdges = new Set<number>([edgeId]);
        cur = u;
        while (cur != null && cur !== to) {
          const pe = parentEdge[cur];
          if (pe != null) cycleEdges.add(pe);
          cur = parent[cur];
        }
        const nodeRoles = t.idleNodeRoles();
        for (const id of cycleNodes) nodeRoles[id] = "path";
        nodeRoles[u] = "current";
        const finalEdges = t.idleEdgeRoles();
        for (const id of cycleEdges) finalEdges[id] = "path";
        finalEdges[edgeId] = "rejected";
        t.push(nodeRoles, finalEdges, `Cycle found via back edge ${u} — ${to}.`);
        return true;
      }

      parent[to] = u;
      parentEdge[to] = edgeId;
      treeEdges.add(edgeId);
      if (dfs(to)) return true;
    }
    return false;
  };

  for (let u = 0; u < nodes.length; u += 1) {
    if (!visited[u] && dfs(u)) return t.frames;
  }

  t.push(
    rolesFromState(nodes.length, {
      visited,
      done: new Set(nodes.map((_, i) => i)),
      start,
    }),
    paintEdges(t, treeEdges),
    "No cycle — the undirected graph is a forest.",
  );
  return t.frames;
}

/** Directed cycle detection via 3-color DFS. */
export function cycleDirected(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, false);
  // 0 white, 1 gray, 2 black
  const color = new Array(nodes.length).fill(0);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const parentEdge = new Array<number | null>(nodes.length).fill(null);
  const treeEdges = new Set<number>();

  const visitedFlags = () => color.map((c) => c !== 0);
  const frontierGray = () =>
    color.map((c, id) => (c === 1 ? id : -1)).filter((id) => id >= 0);

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Detect directed cycles — gray = on the recursion stack.",
  );

  const dfs = (u: number): boolean => {
    color[u] = 1;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited: visitedFlags(),
        current: u,
        frontier: frontierGray(),
        start,
      }),
      paintEdges(t, treeEdges),
      `Mark ${u} gray.`,
      { frontier: frontierGray() },
    );

    for (const { to, edgeId } of adj[u]) {
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, {
          visited: visitedFlags(),
          current: u,
          frontier: frontierGray(),
          start,
        }),
        edgeRoles,
        `Inspect ${u} → ${to}.`,
        { frontier: frontierGray() },
      );

      if (color[to] === 1) {
        edgeRoles[edgeId] = "rejected";
        const cycleNodes = new Set<number>([to]);
        const cycleEdges = new Set<number>([edgeId]);
        let cur: number | null = u;
        while (cur != null && cur !== to) {
          cycleNodes.add(cur);
          const pe = parentEdge[cur];
          if (pe != null) cycleEdges.add(pe);
          cur = parent[cur];
        }
        cycleNodes.add(to);
        const nodeRoles = t.idleNodeRoles();
        for (const id of cycleNodes) nodeRoles[id] = "path";
        nodeRoles[u] = "current";
        const finalEdges = t.idleEdgeRoles();
        for (const id of cycleEdges) finalEdges[id] = "path";
        finalEdges[edgeId] = "rejected";
        t.push(
          nodeRoles,
          finalEdges,
          `Back edge to gray node ${to} — directed cycle found.`,
        );
        return true;
      }

      if (color[to] === 0) {
        parent[to] = u;
        parentEdge[to] = edgeId;
        treeEdges.add(edgeId);
        if (dfs(to)) return true;
      }
    }

    color[u] = 2;
    t.push(
      rolesFromState(nodes.length, {
        visited: visitedFlags(),
        current: u,
        frontier: frontierGray(),
        done: new Set(color.map((c, id) => (c === 2 ? id : -1)).filter((id) => id >= 0)),
        start,
      }),
      paintEdges(t, treeEdges),
      `Mark ${u} black.`,
      { frontier: frontierGray() },
    );
    return false;
  };

  for (let u = 0; u < nodes.length; u += 1) {
    if (color[u] === 0 && dfs(u)) return t.frames;
  }

  t.push(
    rolesFromState(nodes.length, {
      done: new Set(nodes.map((_, i) => i)),
      start,
    }),
    paintEdges(t, treeEdges),
    "No directed cycle — the graph is a DAG.",
  );
  return t.frames;
}
