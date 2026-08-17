import { GraphTrace, adjacency } from "./trace";
import type { EdgeRole, GraphData, GraphFrame, NodeRole } from "./types";

function paintEdges(
  t: GraphTrace,
  tree: Set<number>,
  special?: { path?: Set<number>; rejected?: Set<number> },
): EdgeRole[] {
  const roles = t.idleEdgeRoles();
  for (const id of tree) roles[id] = "tree";
  if (special?.path) for (const id of special.path) roles[id] = "path";
  if (special?.rejected) for (const id of special.rejected) roles[id] = "rejected";
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

/** BFS 2-coloring bipartite check. */
export function bipartiteCheck(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, true);
  const color = new Array<number>(nodes.length).fill(-1);
  const treeEdges = new Set<number>();

  const labels = () => {
    const out: Record<number, string> = {};
    for (let i = 0; i < nodes.length; i += 1) {
      if (color[i] === 0) out[i] = "A";
      else if (color[i] === 1) out[i] = "B";
    }
    return out;
  };

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Bipartite check — 2-color with BFS; odd cycle ⇒ not bipartite.",
  );

  for (let seed = 0; seed < nodes.length; seed += 1) {
    if (color[seed] >= 0) continue;
    color[seed] = 0;
    const queue = [seed];
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited: color.map((c) => c >= 0),
        current: seed,
        frontier: queue,
        start,
      }),
      paintEdges(t, treeEdges),
      `Seed component at ${seed} with color A.`,
      { labels: labels(), frontier: [...queue] },
    );

    while (queue.length) {
      const u = queue.shift()!;
      t.push(
        rolesFromState(nodes.length, {
          visited: color.map((c) => c >= 0),
          current: u,
          frontier: queue,
          start,
        }),
        paintEdges(t, treeEdges),
        `Expand ${u} (side ${color[u] === 0 ? "A" : "B"}).`,
        { labels: labels(), frontier: [...queue] },
      );

      for (const { to, edgeId } of adj[u]) {
        const edgeRoles = paintEdges(t, treeEdges);
        edgeRoles[edgeId] = "consider";
        t.relax();
        t.push(
          rolesFromState(nodes.length, {
            visited: color.map((c) => c >= 0),
            current: u,
            frontier: queue,
            start,
          }),
          edgeRoles,
          `Inspect ${u} — ${to}.`,
          { labels: labels(), frontier: [...queue] },
        );

        if (color[to] < 0) {
          color[to] = 1 - color[u];
          treeEdges.add(edgeId);
          queue.push(to);
          t.visit();
          t.push(
            rolesFromState(nodes.length, {
              visited: color.map((c) => c >= 0),
              current: u,
              frontier: queue,
              start,
            }),
            paintEdges(t, treeEdges),
            `Color ${to} as ${color[to] === 0 ? "A" : "B"}.`,
            { labels: labels(), frontier: [...queue] },
          );
        } else if (color[to] === color[u]) {
          edgeRoles[edgeId] = "rejected";
          const nodeRoles = t.idleNodeRoles();
          for (let i = 0; i < nodes.length; i += 1) {
            if (color[i] >= 0) nodeRoles[i] = "visited";
          }
          nodeRoles[u] = "current";
          nodeRoles[to] = "path";
          t.push(
            nodeRoles,
            edgeRoles,
            `Same color on both ends — odd cycle; not bipartite.`,
            { labels: labels() },
          );
          return t.frames;
        }
      }
    }
  }

  const done = new Set(nodes.map((_, i) => i));
  t.push(
    rolesFromState(nodes.length, { done, start }),
    paintEdges(t, treeEdges),
    "Graph is bipartite — sides A and B.",
    { labels: labels() },
  );
  return t.frames;
}

/** Find bridges via DFS discovery / low-link. */
export function findBridges(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, true);
  const disc = new Array(nodes.length).fill(-1);
  const low = new Array(nodes.length).fill(-1);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const treeEdges = new Set<number>();
  const bridges = new Set<number>();
  let time = 0;

  const labels = () => {
    const out: Record<number, string> = {};
    for (let i = 0; i < nodes.length; i += 1) {
      if (disc[i] >= 0) out[i] = `d${disc[i]}/L${low[i]}`;
    }
    return out;
  };

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Bridge finding — an edge is a bridge when low[child] > disc[u].",
  );

  const dfs = (u: number) => {
    disc[u] = time;
    low[u] = time;
    time += 1;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited: disc.map((d) => d >= 0),
        current: u,
        start,
      }),
      paintEdges(t, treeEdges, { path: bridges }),
      `Discover ${u}.`,
      { labels: labels() },
    );

    for (const { to, edgeId } of adj[u]) {
      if (to === parent[u]) continue;
      const edgeRoles = paintEdges(t, treeEdges, { path: bridges });
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, {
          visited: disc.map((d) => d >= 0),
          current: u,
          start,
        }),
        edgeRoles,
        `Inspect ${u} — ${to}.`,
        { labels: labels() },
      );

      if (disc[to] < 0) {
        parent[to] = u;
        treeEdges.add(edgeId);
        dfs(to);
        low[u] = Math.min(low[u], low[to]);
        t.push(
          rolesFromState(nodes.length, {
            visited: disc.map((d) => d >= 0),
            current: u,
            start,
          }),
          paintEdges(t, treeEdges, { path: bridges }),
          `low[${u}] = ${low[u]}.`,
          { labels: labels() },
        );
        if (low[to] > disc[u]) {
          bridges.add(edgeId);
          t.push(
            rolesFromState(nodes.length, {
              visited: disc.map((d) => d >= 0),
              current: u,
              start,
            }),
            paintEdges(t, treeEdges, { path: bridges }),
            `Bridge found: ${u} — ${to}.`,
            { labels: labels() },
          );
        }
      } else {
        low[u] = Math.min(low[u], disc[to]);
        edgeRoles[edgeId] = "rejected";
        t.push(
          rolesFromState(nodes.length, {
            visited: disc.map((d) => d >= 0),
            current: u,
            start,
          }),
          edgeRoles,
          `Back edge updates low[${u}] = ${low[u]}.`,
          { labels: labels() },
        );
      }
    }
  };

  for (let u = 0; u < nodes.length; u += 1) {
    if (disc[u] < 0) dfs(u);
  }

  t.push(
    rolesFromState(nodes.length, {
      done: new Set(nodes.map((_, i) => i)),
      start,
    }),
    paintEdges(t, treeEdges, { path: bridges }),
    bridges.size
      ? `Found ${bridges.size} bridge${bridges.size === 1 ? "" : "s"} (highlighted).`
      : "No bridges — the graph is 2-edge-connected (per component).",
    { labels: labels() },
  );
  return t.frames;
}

/** Find articulation points via DFS discovery / low-link. */
export function findArticulation(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, true);
  const disc = new Array(nodes.length).fill(-1);
  const low = new Array(nodes.length).fill(-1);
  const parent = new Array<number | null>(nodes.length).fill(null);
  const artic = new Set<number>();
  const treeEdges = new Set<number>();
  let time = 0;

  const labels = () => {
    const out: Record<number, string> = {};
    for (let i = 0; i < nodes.length; i += 1) {
      if (artic.has(i)) out[i] = "AP";
      else if (disc[i] >= 0) out[i] = `d${disc[i]}/L${low[i]}`;
    }
    return out;
  };

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Articulation points — root with ≥2 children, or low[child] ≥ disc[u].",
  );

  const dfs = (u: number) => {
    disc[u] = time;
    low[u] = time;
    time += 1;
    let children = 0;
    t.visit();
    t.push(
      rolesFromState(nodes.length, {
        visited: disc.map((d) => d >= 0),
        current: u,
        done: artic,
        start,
      }),
      paintEdges(t, treeEdges),
      `Discover ${u}.`,
      { labels: labels() },
    );

    for (const { to, edgeId } of adj[u]) {
      if (to === parent[u]) continue;
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      t.push(
        rolesFromState(nodes.length, {
          visited: disc.map((d) => d >= 0),
          current: u,
          done: artic,
          start,
        }),
        edgeRoles,
        `Inspect ${u} — ${to}.`,
        { labels: labels() },
      );

      if (disc[to] < 0) {
        children += 1;
        parent[to] = u;
        treeEdges.add(edgeId);
        dfs(to);
        low[u] = Math.min(low[u], low[to]);
        const isRoot = parent[u] == null;
        if ((isRoot && children > 1) || (!isRoot && low[to] >= disc[u])) {
          artic.add(u);
          t.push(
            rolesFromState(nodes.length, {
              visited: disc.map((d) => d >= 0),
              current: u,
              done: artic,
              start,
            }),
            paintEdges(t, treeEdges),
            `Mark ${u} as an articulation point.`,
            { labels: labels() },
          );
        } else {
          t.push(
            rolesFromState(nodes.length, {
              visited: disc.map((d) => d >= 0),
              current: u,
              done: artic,
              start,
            }),
            paintEdges(t, treeEdges),
            `low[${u}] = ${low[u]}.`,
            { labels: labels() },
          );
        }
      } else {
        low[u] = Math.min(low[u], disc[to]);
        edgeRoles[edgeId] = "rejected";
        t.push(
          rolesFromState(nodes.length, {
            visited: disc.map((d) => d >= 0),
            current: u,
            done: artic,
            start,
          }),
          edgeRoles,
          `Back edge updates low[${u}] = ${low[u]}.`,
          { labels: labels() },
        );
      }
    }
  };

  for (let u = 0; u < nodes.length; u += 1) {
    if (disc[u] < 0) dfs(u);
  }

  t.push(
    rolesFromState(nodes.length, {
      done: artic.size ? artic : new Set(nodes.map((_, i) => i)),
      start,
    }),
    paintEdges(t, treeEdges),
    artic.size
      ? `Found ${artic.size} articulation point${artic.size === 1 ? "" : "s"}.`
      : "No articulation points — 2-vertex-connected (per component).",
    { labels: labels() },
  );
  return t.frames;
}

/** Undirected degree of each vertex. */
export function degreeCalc(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const deg = new Array(nodes.length).fill(0);
  const seen = new Set<number>();

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Compute undirected degree for each vertex.",
    { labels: Object.fromEntries(deg.map((d, id) => [id, `deg${d}`])) },
  );

  for (const edge of edges) {
    const edgeRoles = t.idleEdgeRoles();
    edgeRoles[edge.id] = "consider";
    t.relax();
    deg[edge.u] += 1;
    deg[edge.v] += 1;
    seen.add(edge.u);
    seen.add(edge.v);
    t.push(
      rolesFromState(nodes.length, {
        current: edge.u,
        visited: nodes.map((_, i) => seen.has(i)),
        start,
      }),
      edgeRoles,
      `Edge ${edge.u} — ${edge.v}: deg[${edge.u}]=${deg[edge.u]}, deg[${edge.v}]=${deg[edge.v]}.`,
      { labels: Object.fromEntries(deg.map((d, id) => [id, `deg${d}`])) },
    );
  }

  t.visit();
  t.push(
    rolesFromState(nodes.length, {
      done: new Set(nodes.map((_, i) => i)),
      start,
    }),
    t.idleEdgeRoles(),
    `Degree sequence: [${deg.join(", ")}]. Sum=${deg.reduce((a, b) => a + b, 0)} (= 2|E|).`,
    { labels: Object.fromEntries(deg.map((d, id) => [id, `deg${d}`])) },
  );
  return t.frames;
}

/** Directed in-degree / out-degree. */
export function degreeInOut(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const indeg = new Array(nodes.length).fill(0);
  const outdeg = new Array(nodes.length).fill(0);

  const labels = () =>
    Object.fromEntries(
      nodes.map((_, id) => [id, `↓${indeg[id]}/↑${outdeg[id]}`]),
    );

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Tally directed in-degree (↓) and out-degree (↑).",
    { labels: labels() },
  );

  for (const edge of edges) {
    const edgeRoles = t.idleEdgeRoles();
    edgeRoles[edge.id] = "consider";
    t.relax();
    outdeg[edge.u] += 1;
    indeg[edge.v] += 1;
    t.push(
      rolesFromState(nodes.length, {
        current: edge.u,
        visited: nodes.map(
          (_, i) => indeg[i] > 0 || outdeg[i] > 0,
        ),
        start,
      }),
      edgeRoles,
      `Arc ${edge.u} → ${edge.v}.`,
      { labels: labels() },
    );
  }

  t.visit();
  t.push(
    rolesFromState(nodes.length, {
      done: new Set(nodes.map((_, i) => i)),
      start,
    }),
    t.idleEdgeRoles(),
    "In/out degrees complete for every vertex.",
    { labels: labels() },
  );
  return t.frames;
}

/** Greedy graph coloring. */
export function graphColoring(graph: GraphData): GraphFrame[] {
  const { nodes, edges, start } = graph;
  const t = new GraphTrace(nodes, edges);
  const adj = adjacency(nodes.length, edges, true);
  const color = new Array<number>(nodes.length).fill(-1);
  const treeEdges = new Set<number>();

  const labels = () => {
    const out: Record<number, string> = {};
    for (let i = 0; i < nodes.length; i += 1) {
      if (color[i] >= 0) out[i] = `c${color[i]}`;
    }
    return out;
  };

  t.push(
    rolesFromState(nodes.length, { start }),
    t.idleEdgeRoles(),
    "Greedy coloring — assign the smallest color not used by neighbors.",
  );

  for (let u = 0; u < nodes.length; u += 1) {
    const used = new Set<number>();
    t.push(
      rolesFromState(nodes.length, {
        visited: color.map((c) => c >= 0),
        current: u,
        start,
      }),
      paintEdges(t, treeEdges),
      `Color vertex ${u}.`,
      { labels: labels() },
    );

    for (const { to, edgeId } of adj[u]) {
      const edgeRoles = paintEdges(t, treeEdges);
      edgeRoles[edgeId] = "consider";
      t.relax();
      if (color[to] >= 0) used.add(color[to]);
      t.push(
        rolesFromState(nodes.length, {
          visited: color.map((c) => c >= 0),
          current: u,
          start,
        }),
        edgeRoles,
        color[to] >= 0
          ? `Neighbor ${to} uses c${color[to]}.`
          : `Neighbor ${to} uncolored.`,
        { labels: labels() },
      );
    }

    let c = 0;
    while (used.has(c)) c += 1;
    color[u] = c;
    t.visit();
    for (const { to, edgeId } of adj[u]) {
      if (color[to] >= 0) treeEdges.add(edgeId);
    }
    t.push(
      rolesFromState(nodes.length, {
        visited: color.map((c) => c >= 0),
        current: u,
        done: new Set(
          color.map((v, id) => (v >= 0 ? id : -1)).filter((id) => id >= 0),
        ),
        start,
      }),
      paintEdges(t, treeEdges),
      `Assign ${u} → c${c}.`,
      { labels: labels() },
    );
  }

  const chromatic = Math.max(...color) + 1;
  t.push(
    rolesFromState(nodes.length, {
      done: new Set(nodes.map((_, i) => i)),
      start,
    }),
    paintEdges(t, treeEdges),
    `Greedy coloring used ${chromatic} color${chromatic === 1 ? "" : "s"}.`,
    { labels: labels() },
  );
  return t.frames;
}
