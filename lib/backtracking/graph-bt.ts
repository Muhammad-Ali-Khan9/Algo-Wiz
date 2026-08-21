import { BacktrackingTrace } from "./trace";
import type {
  BacktrackingFrame,
  BacktrackingInput,
  BtGraphEdge,
  BtGraphNode,
  BtRole,
} from "./types";

function layoutCycle(n: number): BtGraphNode[] {
  const cx = 50;
  const cy = 48;
  const radius = n <= 4 ? 28 : 32;
  return Array.from({ length: n }, (_, i) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      id: i,
      x: cx + radius * Math.cos(ang),
      y: cy + radius * Math.sin(ang),
      label: String.fromCharCode(65 + i),
    };
  });
}

function buildAdj(n: number, pairs: [number, number][]): boolean[][] {
  const adj = Array.from({ length: n }, () => Array.from({ length: n }, () => false));
  for (const [u, v] of pairs) {
    if (u >= 0 && v >= 0 && u < n && v < n && u !== v) {
      adj[u]![v] = true;
      adj[v]![u] = true;
    }
  }
  return adj;
}

function defaultCyclePairs(n: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => [i, (i + 1) % n] as [number, number]);
}

function pathLabel(nodes: BtGraphNode[], path: number[]): string {
  return path.map((i) => nodes[i]!.label).join(" → ");
}

/** Hamiltonian Path — visit each vertex exactly once. */
export function hamiltonianPath(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const n = Math.max(3, Math.min(input.n || 4, 5));
  const pairs = input.pairs?.length ? input.pairs : defaultCyclePairs(n);
  const adj = buildAdj(n, pairs);
  const nodes = layoutCycle(n);
  const edges: BtGraphEdge[] = pairs.map(([u, v], i) => ({ id: i, u, v }));
  const visited = Array.from({ length: n }, () => false);
  const path: number[] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const candidates = Array.from({ length: n }, (_, i) => i);

  const nodeRoles = (focus = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    for (const v of path) roles[v] = "choose";
    if (focus >= 0) roles[focus] = mode;
    return roles;
  };

  const candRoles = (focus = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    for (const v of path) roles[v] = "choose";
    if (focus >= 0) roles[focus] = mode;
    return roles;
  };

  t.push(
    candidates,
    t.idle(n),
    [],
    `Hamiltonian Path — visit each of ${n} vertices exactly once.`,
    {
      depth: 0,
      found,
      foundLabels,
      nodes,
      edges,
      nodeRoles: t.idle(n),
    },
  );

  const dfs = (): boolean => {
    t.calls += 1;
    if (path.length === n) {
      t.solutions += 1;
      found.push(path.slice());
      foundLabels.push(pathLabel(nodes, path));
      t.push(
        candidates,
        candRoles(),
        path.slice(),
        `Path found: ${pathLabel(nodes, path)}.`,
        {
          pathRoles: path.map(() => "solution" as BtRole),
          depth: n,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: Array.from({ length: n }, () => "solution" as BtRole),
        },
      );
      return true;
    }

    const last = path[path.length - 1]!;
    for (let v = 0; v < n; v += 1) {
      t.push(
        candidates,
        candRoles(v, "current"),
        path.slice(),
        `From ${nodes[last]!.label} try ${nodes[v]!.label}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "current"),
        },
      );

      if (visited[v] || !adj[last]![v]) {
        t.push(
          candidates,
          candRoles(v, "skip"),
          path.slice(),
          `Skip ${nodes[v]!.label} — ${visited[v] ? "already visited" : "no edge"}.`,
          {
            depth: path.length,
            found,
            foundLabels,
            nodes,
            edges,
            nodeRoles: nodeRoles(v, "skip"),
          },
        );
        continue;
      }

      visited[v] = true;
      path.push(v);
      t.choices += 1;
      t.push(
        candidates,
        candRoles(v, "choose"),
        path.slice(),
        `Extend path → ${nodes[v]!.label}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "choose"),
        },
      );

      if (dfs()) return true;

      path.pop();
      visited[v] = false;
      t.backtracks += 1;
      t.push(
        candidates,
        candRoles(v, "backtrack"),
        path.slice(),
        `Backtrack from ${nodes[v]!.label}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "backtrack"),
        },
      );
    }
    return false;
  };

  // Try each start vertex until a path is found
  outer: for (let s = 0; s < n; s += 1) {
    t.push(candidates, candRoles(s, "current"), [], `Start at ${nodes[s]!.label}.`, {
      depth: 0,
      found,
      foundLabels,
      nodes,
      edges,
      nodeRoles: nodeRoles(s, "current"),
    });
    visited[s] = true;
    path.push(s);
    t.choices += 1;
    if (dfs()) break outer;
    path.pop();
    visited[s] = false;
    t.backtracks += 1;
  }

  t.push(
    candidates,
    t.idle(n),
    [],
    `Done — ${found.length ? "path found" : "no path"}.`,
    {
      found,
      foundLabels,
      nodes,
      edges,
      nodeRoles: t.idle(n),
    },
  );
  return t.frames;
}

/** Hamiltonian Cycle — path that returns to the start. */
export function hamiltonianCycle(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const n = Math.max(3, Math.min(input.n || 4, 5));
  const pairs = input.pairs?.length ? input.pairs : defaultCyclePairs(n);
  const adj = buildAdj(n, pairs);
  const nodes = layoutCycle(n);
  const edges: BtGraphEdge[] = pairs.map(([u, v], i) => ({ id: i, u, v }));
  const visited = Array.from({ length: n }, () => false);
  const path: number[] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const candidates = Array.from({ length: n }, (_, i) => i);
  const start = 0;

  const nodeRoles = (focus = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    for (const v of path) roles[v] = "choose";
    if (focus >= 0) roles[focus] = mode;
    return roles;
  };

  const candRoles = (focus = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    for (const v of path) roles[v] = "choose";
    if (focus >= 0) roles[focus] = mode;
    return roles;
  };

  t.push(
    candidates,
    t.idle(n),
    [],
    `Hamiltonian Cycle — tour all ${n} vertices and return to start.`,
    {
      depth: 0,
      found,
      foundLabels,
      nodes,
      edges,
      nodeRoles: t.idle(n),
    },
  );

  visited[start] = true;
  path.push(start);

  const dfs = (): boolean => {
    t.calls += 1;
    if (path.length === n) {
      const last = path[path.length - 1]!;
      t.push(
        candidates,
        candRoles(start, "current"),
        path.slice(),
        `All visited — check edge back to ${nodes[start]!.label}.`,
        {
          depth: n,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(start, "current"),
        },
      );
      if (!adj[last]![start]) {
        t.push(
          candidates,
          candRoles(start, "skip"),
          path.slice(),
          `No closing edge ${nodes[last]!.label}→${nodes[start]!.label}.`,
          {
            depth: n,
            found,
            foundLabels,
            nodes,
            edges,
            nodeRoles: nodeRoles(start, "skip"),
          },
        );
        return false;
      }
      t.solutions += 1;
      const cycle = [...path, start];
      found.push(cycle);
      foundLabels.push(`${pathLabel(nodes, path)} → ${nodes[start]!.label}`);
      t.push(
        candidates,
        candRoles(),
        cycle,
        `Cycle found: ${foundLabels[foundLabels.length - 1]}.`,
        {
          pathRoles: cycle.map(() => "solution" as BtRole),
          depth: n + 1,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: Array.from({ length: n }, () => "solution" as BtRole),
        },
      );
      return true;
    }

    const last = path[path.length - 1]!;
    for (let v = 0; v < n; v += 1) {
      t.push(
        candidates,
        candRoles(v, "current"),
        path.slice(),
        `From ${nodes[last]!.label} try ${nodes[v]!.label}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "current"),
        },
      );

      if (visited[v] || !adj[last]![v]) {
        t.push(
          candidates,
          candRoles(v, "skip"),
          path.slice(),
          `Skip ${nodes[v]!.label}.`,
          {
            depth: path.length,
            found,
            foundLabels,
            nodes,
            edges,
            nodeRoles: nodeRoles(v, "skip"),
          },
        );
        continue;
      }

      visited[v] = true;
      path.push(v);
      t.choices += 1;
      t.push(
        candidates,
        candRoles(v, "choose"),
        path.slice(),
        `Extend → ${nodes[v]!.label}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "choose"),
        },
      );

      if (dfs()) return true;

      path.pop();
      visited[v] = false;
      t.backtracks += 1;
      t.push(
        candidates,
        candRoles(v, "backtrack"),
        path.slice(),
        `Backtrack from ${nodes[v]!.label}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "backtrack"),
        },
      );
    }
    return false;
  };

  dfs();
  t.push(
    candidates,
    t.idle(n),
    [],
    `Done — ${found.length ? "cycle found" : "no cycle"}.`,
    {
      found,
      foundLabels,
      nodes,
      edges,
      nodeRoles: t.idle(n),
    },
  );
  return t.frames;
}

/** TSP — backtracking search for a low-cost tour on a complete graph. */
export function tsp(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const n = Math.max(3, Math.min(input.n || 4, 5));
  const nodes = layoutCycle(n);
  const weights: number[][] =
    input.weights?.length === n
      ? input.weights.map((row) => row.slice())
      : Array.from({ length: n }, (_, i) =>
          Array.from({ length: n }, (_, j) => (i === j ? 0 : 1 + ((i * 3 + j * 5) % 9))),
        );

  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) pairs.push([i, j]);
  const edges: BtGraphEdge[] = pairs.map(([u, v], i) => ({ id: i, u, v }));

  const visited = Array.from({ length: n }, () => false);
  const path: number[] = [];
  let cost = 0;
  let best = Infinity;
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const candidates = Array.from({ length: n }, (_, i) => i);
  const start = 0;
  const maxTours = 2;

  const nodeRoles = (focus = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    for (const v of path) roles[v] = "choose";
    if (focus >= 0) roles[focus] = mode;
    return roles;
  };

  const candRoles = (focus = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    for (const v of path) roles[v] = "choose";
    if (focus >= 0) roles[focus] = mode;
    return roles;
  };

  t.push(
    candidates,
    t.idle(n),
    [],
    `TSP — find a low-cost tour of ${n} cities (complete graph).`,
    {
      depth: 0,
      found,
      foundLabels,
      nodes,
      edges,
      nodeRoles: t.idle(n),
    },
  );

  visited[start] = true;
  path.push(start);

  const dfs = () => {
    t.calls += 1;
    if (path.length === n) {
      const last = path[path.length - 1]!;
      const close = weights[last]![start]!;
      const total = cost + close;
      t.push(
        candidates,
        candRoles(start, "current"),
        path.slice(),
        `Close tour ${nodes[last]!.label}→${nodes[start]!.label} (+${close}) = ${total}.`,
        {
          depth: n,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(start, "current"),
        },
      );

      if (total < best) {
        best = total;
        t.solutions += 1;
        found.push([...path, start]);
        foundLabels.push(
          `${pathLabel(nodes, path)} → ${nodes[start]!.label} · cost ${total}`,
        );
        t.push(
          candidates,
          candRoles(),
          [...path, start],
          `New best tour · cost ${total}.`,
          {
            pathRoles: Array.from(
              { length: path.length + 1 },
              () => "solution" as BtRole,
            ),
            depth: n + 1,
            found,
            foundLabels,
            nodes,
            edges,
            nodeRoles: Array.from({ length: n }, () => "solution" as BtRole),
          },
        );
      } else {
        t.push(
          candidates,
          candRoles(start, "skip"),
          path.slice(),
          `Tour cost ${total} ≥ best ${best} — skip.`,
          {
            depth: n,
            found,
            foundLabels,
            nodes,
            edges,
            nodeRoles: nodeRoles(start, "skip"),
          },
        );
      }
      return found.length >= maxTours;
    }

    const last = path[path.length - 1]!;
    for (let v = 0; v < n; v += 1) {
      const w = weights[last]![v]!;
      t.push(
        candidates,
        candRoles(v, "current"),
        path.slice(),
        `From ${nodes[last]!.label} try ${nodes[v]!.label} (w=${w}, cost=${cost + w}).`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "current"),
        },
      );

      if (visited[v]) {
        t.push(
          candidates,
          candRoles(v, "skip"),
          path.slice(),
          `Skip ${nodes[v]!.label} — visited.`,
          {
            depth: path.length,
            found,
            foundLabels,
            nodes,
            edges,
            nodeRoles: nodeRoles(v, "skip"),
          },
        );
        continue;
      }

      if (cost + w >= best) {
        t.push(
          candidates,
          candRoles(v, "skip"),
          path.slice(),
          `Prune — ${cost + w} ≥ best ${best}.`,
          {
            depth: path.length,
            found,
            foundLabels,
            nodes,
            edges,
            nodeRoles: nodeRoles(v, "skip"),
          },
        );
        continue;
      }

      visited[v] = true;
      path.push(v);
      cost += w;
      t.choices += 1;
      t.push(
        candidates,
        candRoles(v, "choose"),
        path.slice(),
        `Go to ${nodes[v]!.label} · path cost ${cost}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "choose"),
        },
      );

      if (dfs()) return true;

      cost -= w;
      path.pop();
      visited[v] = false;
      t.backtracks += 1;
      t.push(
        candidates,
        candRoles(v, "backtrack"),
        path.slice(),
        `Backtrack from ${nodes[v]!.label} · cost ${cost}.`,
        {
          depth: path.length,
          found,
          foundLabels,
          nodes,
          edges,
          nodeRoles: nodeRoles(v, "backtrack"),
        },
      );
    }
    return false;
  };

  dfs();
  t.push(
    candidates,
    t.idle(n),
    [],
    `Done — best cost ${Number.isFinite(best) ? best : "—"}.`,
    {
      found,
      foundLabels,
      nodes,
      edges,
      nodeRoles: t.idle(n),
    },
  );
  return t.frames;
}
