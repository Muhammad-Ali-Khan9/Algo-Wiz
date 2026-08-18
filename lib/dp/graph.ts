import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput, DpTreeEdge, DpTreeNode } from "./types";

const INF = 1_000_000_000;

type GEdge = { u: number; v: number; weight: number };

function circleLayout(n: number): DpTreeNode[] {
  const cx = 50;
  const cy = 48;
  const r = n <= 4 ? 28 : 32;
  return Array.from({ length: n }, (_, i) => {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return {
      id: i,
      x: cx + r * Math.cos(ang),
      y: cy + r * Math.sin(ang),
      label: String(i),
    };
  });
}

function dagLayout(n: number, edges: GEdge[]): DpTreeNode[] {
  const indeg = Array.from({ length: n }, () => 0);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.u]!.push(e.v);
    indeg[e.v]! += 1;
  }
  const layer = Array.from({ length: n }, () => 0);
  const q = indeg.map((d, i) => (d === 0 ? i : -1)).filter((i) => i >= 0);
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    for (const v of adj[u]!) {
      layer[v] = Math.max(layer[v]!, layer[u]! + 1);
      indeg[v]! -= 1;
      if (indeg[v] === 0) q.push(v);
    }
  }
  for (let i = 0; i < n; i += 1) if (!order.includes(i)) order.push(i);

  const maxLayer = Math.max(0, ...layer);
  const byLayer: number[][] = Array.from({ length: maxLayer + 1 }, () => []);
  for (const id of order) byLayer[layer[id]!]!.push(id);

  const nodes: DpTreeNode[] = [];
  for (let L = 0; L <= maxLayer; L += 1) {
    const row = byLayer[L]!;
    const y = maxLayer === 0 ? 50 : 12 + (L / maxLayer) * 72;
    row.forEach((id, i) => {
      const x = row.length === 1 ? 50 : 14 + (i / Math.max(row.length - 1, 1)) * 72;
      nodes.push({ id, x, y, label: String(id) });
    });
  }
  return nodes;
}

function edgesOf(input: DpInput): GEdge[] {
  if (input.graphEdges.length > 0) return input.graphEdges.map((e) => ({ ...e }));
  // tiny fallback DAG
  return [
    { u: 0, v: 1, weight: 2 },
    { u: 0, v: 2, weight: 5 },
    { u: 1, v: 2, weight: 1 },
    { u: 1, v: 3, weight: 4 },
    { u: 2, v: 3, weight: 2 },
  ];
}

function toVizEdges(edges: GEdge[]): DpTreeEdge[] {
  return edges.map((e, id) => ({
    id,
    u: e.u,
    v: e.v,
    weight: e.weight,
  }));
}

function idleRoles(n: number): Record<number, DpCellRole> {
  const roles: Record<number, DpCellRole> = {};
  for (let i = 0; i < n; i += 1) roles[i] = "idle";
  return roles;
}

function withCaptions(nodes: DpTreeNode[], captions: Map<number, string>): DpTreeNode[] {
  return nodes.map((n) => ({
    ...n,
    caption: captions.get(n.id),
  }));
}

function pushGraph(
  t: DpTrace,
  nodes: DpTreeNode[],
  edges: DpTreeEdge[],
  roles: Record<number, DpCellRole>,
  edgeRoles: Record<number, DpCellRole>,
  captions: Map<number, string>,
  hint: string,
  formula: string,
) {
  t.push([], [], hint, {
    formula,
    treeNodes: withCaptions(nodes, captions),
    treeEdges: edges,
    treeRoles: { ...roles },
    treeEdgeRoles: { ...edgeRoles },
  });
}

function topoSort(n: number, edges: GEdge[]): number[] | null {
  const indeg = Array.from({ length: n }, () => 0);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.u]!.push(e.v);
    indeg[e.v]! += 1;
  }
  const q = indeg.map((d, i) => (d === 0 ? i : -1)).filter((i) => i >= 0);
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    for (const v of adj[u]!) {
      indeg[v]! -= 1;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return order.length === n ? order : null;
}

/** Shortest paths in a DAG from source 0 (topo DP). */
export function dagDp(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const edges = edgesOf(input);
  const nodeCount = Math.max(
    input.n,
    edges.reduce((m, e) => Math.max(m, e.u, e.v), -1) + 1,
    1,
  );
  const vizNodes = dagLayout(nodeCount, edges);
  const vizEdges = toVizEdges(edges);
  const dp: (number | null)[] = Array.from({ length: nodeCount }, () => null);
  const captions = () =>
    new Map(dp.map((v, i) => [i, v == null ? "·" : v >= INF / 2 ? "∞" : String(v)]));

  pushGraph(
    t,
    vizNodes,
    vizEdges,
    idleRoles(nodeCount),
    {},
    captions(),
    "DAG DP — shortest path from 0 via topological order.",
    "dp[v] = min(dp[v], dp[u] + w(u,v)) in topo order",
  );

  const order =
    topoSort(nodeCount, edges) ?? Array.from({ length: nodeCount }, (_, i) => i);
  {
    const roles = idleRoles(nodeCount);
    for (const u of order) roles[u] = "read";
    pushGraph(
      t,
      vizNodes,
      vizEdges,
      roles,
      {},
      captions(),
      `Topo order: [${order.join(", ")}].`,
      `order = [${order.join(",")}]`,
    );
  }

  for (let i = 0; i < nodeCount; i += 1) dp[i] = i === 0 ? 0 : INF;
  t.sub();
  {
    const roles = idleRoles(nodeCount);
    roles[0] = "write";
    pushGraph(
      t,
      vizNodes,
      vizEdges,
      roles,
      {},
      captions(),
      "Base: dp[0] = 0, others ∞.",
      "dp[0]=0",
    );
  }

  const outgoing = Array.from(
    { length: nodeCount },
    () => [] as { edgeId: number; v: number; w: number }[],
  );
  edges.forEach((e, id) => {
    outgoing[e.u]!.push({ edgeId: id, v: e.v, w: e.weight });
  });

  for (const u of order) {
    if ((dp[u] ?? INF) >= INF / 2) {
      const roles = idleRoles(nodeCount);
      roles[u] = "skip";
      pushGraph(
        t,
        vizNodes,
        vizEdges,
        roles,
        {},
        captions(),
        `Skip ${u} — unreachable from source.`,
        `dp[${u}] = ∞`,
      );
      continue;
    }

    const rolesCur = idleRoles(nodeCount);
    rolesCur[u] = "current";
    pushGraph(
      t,
      vizNodes,
      vizEdges,
      rolesCur,
      {},
      captions(),
      `Process ${u} (dp=${dp[u]}) — relax outgoing edges.`,
      `u = ${u}`,
    );

    for (const { edgeId, v, w } of outgoing[u]!) {
      const cand = (dp[u] ?? 0) + w;
      const edgeRoles: Record<number, DpCellRole> = { [edgeId]: "current" };
      const rolesRead = idleRoles(nodeCount);
      rolesRead[u] = "read";
      rolesRead[v] = "current";
      pushGraph(
        t,
        vizNodes,
        vizEdges,
        rolesRead,
        edgeRoles,
        captions(),
        `Relax ${u}→${v}: ${dp[u]}+${w}=${cand} vs ${
          (dp[v] ?? INF) >= INF / 2 ? "∞" : dp[v]
        }.`,
        `dp[${v}] ? ${cand}`,
      );
      t.step();
      if (cand < (dp[v] ?? INF)) {
        dp[v] = cand;
        t.sub();
        const rolesWrite = idleRoles(nodeCount);
        rolesWrite[v] = "write";
        rolesWrite[u] = "read";
        pushGraph(
          t,
          vizNodes,
          vizEdges,
          rolesWrite,
          { [edgeId]: "write" },
          captions(),
          `Update dp[${v}] = ${cand}.`,
          `dp[${v}] = ${cand}`,
        );
      }
    }
  }

  let bestNode = 0;
  let best = dp[0] ?? 0;
  for (let i = 0; i < nodeCount; i += 1) {
    const v = dp[i] ?? INF;
    if (v < best) {
      best = v;
      bestNode = i;
    }
  }
  // Highlight goal as farthest useful: last reachable or node n-1
  const goal = nodeCount - 1;
  const rolesAnswer = idleRoles(nodeCount);
  rolesAnswer[0] = "answer";
  if ((dp[goal] ?? INF) < INF / 2) rolesAnswer[goal] = "answer";
  else rolesAnswer[bestNode] = "answer";
  pushGraph(
    t,
    vizNodes,
    vizEdges,
    rolesAnswer,
    {},
    captions(),
    (dp[goal] ?? INF) < INF / 2
      ? `Answer: shortest path 0→${goal} = ${dp[goal]}.`
      : `Answer: best reachable distance = ${best} (at ${bestNode}).`,
    (dp[goal] ?? INF) < INF / 2 ? `dp[${goal}] = ${dp[goal]}` : `min reachable = ${best}`,
  );
  return t.frames;
}

/** Held–Karp TSP DP on a small complete graph. */
export function tsp(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const edges = edgesOf(input);
  const n = Math.max(
    3,
    Math.min(input.n || 4, edges.reduce((m, e) => Math.max(m, e.u, e.v), 0) + 1),
  );
  const dist: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => INF),
  );
  for (let i = 0; i < n; i += 1) dist[i]![i] = 0;
  for (const e of edges) {
    if (e.u < n && e.v < n) {
      dist[e.u]![e.v] = e.weight;
      dist[e.v]![e.u] = Math.min(dist[e.v]![e.u]!, e.weight);
    }
  }
  // Ensure complete
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (dist[i]![j]! >= INF / 2) {
        const w = 1 + ((i * 7 + j * 3) % 9);
        dist[i]![j] = w;
        dist[j]![i] = w;
      }
    }
  }

  const completeEdges: GEdge[] = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      completeEdges.push({ u: i, v: j, weight: dist[i]![j]! });
    }
  }
  const vizNodes = circleLayout(n);
  const vizEdges = toVizEdges(completeEdges);
  const edgeKey = (u: number, v: number) => {
    const a = Math.min(u, v);
    const b = Math.max(u, v);
    return vizEdges.find((e) => e.u === a && e.v === b)?.id ?? -1;
  };

  const N = 1 << n;
  const dp: (number | null)[][] = Array.from({ length: N }, () =>
    Array.from({ length: n }, () => null),
  );

  const captionsFor = (mask: number) => {
    const map = new Map<number, string>();
    for (let i = 0; i < n; i += 1) {
      if (mask & (1 << i)) {
        const v = dp[mask]![i];
        map.set(i, v == null ? "·" : v >= INF / 2 ? "∞" : String(v));
      }
    }
    return map;
  };

  pushGraph(
    t,
    vizNodes,
    vizEdges,
    idleRoles(n),
    {},
    new Map(),
    `TSP (Held–Karp) — ${n} cities, start at 0.`,
    "dp[mask][i] = min cost visiting mask, ending at i",
  );

  dp[1]![0] = 0;
  t.sub();
  {
    const roles = idleRoles(n);
    roles[0] = "write";
    pushGraph(
      t,
      vizNodes,
      vizEdges,
      roles,
      {},
      captionsFor(1),
      "Base: only city 0 visited, cost 0.",
      "dp[{0}][0] = 0",
    );
  }

  for (let mask = 1; mask < N; mask += 1) {
    for (let u = 0; u < n; u += 1) {
      if (!(mask & (1 << u))) continue;
      const cur = dp[mask]![u];
      if (cur == null || cur >= INF / 2) continue;

      for (let v = 0; v < n; v += 1) {
        if (mask & (1 << v)) continue;
        const next = mask | (1 << v);
        const cand = cur + dist[u]![v]!;
        const eid = edgeKey(u, v);
        const roles = idleRoles(n);
        roles[u] = "read";
        roles[v] = "current";
        const edgeRoles: Record<number, DpCellRole> =
          eid >= 0 ? { [eid]: "current" } : {};

        pushGraph(
          t,
          vizNodes,
          vizEdges,
          roles,
          edgeRoles,
          captionsFor(mask),
          `From mask ${mask.toString(2).padStart(n, "0")} at ${u} → ${v} (cost ${cand}).`,
          `dp[${next}][${v}] ? ${cand}`,
        );
        t.step();

        const prev = dp[next]![v];
        if (prev == null || cand < prev) {
          dp[next]![v] = cand;
          t.sub();
          const rolesWrite = idleRoles(n);
          rolesWrite[v] = "write";
          rolesWrite[u] = "read";
          pushGraph(
            t,
            vizNodes,
            vizEdges,
            rolesWrite,
            eid >= 0 ? { [eid]: "write" } : {},
            captionsFor(next),
            `Update dp[${next}][${v}] = ${cand}.`,
            `dp[${next}][${v}] = ${cand}`,
          );
        }
      }
    }
  }

  const full = N - 1;
  let best = INF;
  let bestEnd = 0;
  for (let i = 1; i < n; i += 1) {
    const tour = (dp[full]![i] ?? INF) + dist[i]![0]!;
    const eid = edgeKey(i, 0);
    const roles = idleRoles(n);
    roles[i] = "current";
    roles[0] = "read";
    pushGraph(
      t,
      vizNodes,
      vizEdges,
      roles,
      eid >= 0 ? { [eid]: "current" } : {},
      captionsFor(full),
      `Close tour ${i}→0: ${dp[full]![i] ?? "∞"}+${dist[i]![0]}=${
        tour >= INF / 2 ? "∞" : tour
      }.`,
      `tour via ${i}`,
    );
    t.step();
    if (tour < best) {
      best = tour;
      bestEnd = i;
    }
  }

  const rolesAnswer = idleRoles(n);
  rolesAnswer[0] = "answer";
  rolesAnswer[bestEnd] = "answer";
  pushGraph(
    t,
    vizNodes,
    vizEdges,
    rolesAnswer,
    {},
    captionsFor(full),
    `Answer: minimum tour cost ${best} (return via ${bestEnd}→0).`,
    `TSP = ${best}`,
  );
  return t.frames;
}
