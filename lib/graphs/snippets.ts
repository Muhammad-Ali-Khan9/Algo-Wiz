import { snippets, type CodeSnippets } from "@/lib/code/languages";

type SnippetId =
  | "bfs"
  | "dfs"
  | "components"
  | "scc-kosaraju"
  | "scc-tarjan"
  | "cycle-undirected"
  | "cycle-directed"
  | "prim"
  | "kruskal"
  | "topo-kahn"
  | "topo-dfs"
  | "bipartite"
  | "bridges"
  | "articulation"
  | "degree"
  | "degree-io"
  | "coloring";

export const GRAPH_CODE: Record<SnippetId, CodeSnippets> = {
  bfs: snippets(
    `void bfs(int start, int n, int** adj, int* deg) {
    int q[128], head = 0, tail = 0;
    int seen[128] = {0};
    q[tail++] = start; seen[start] = 1;
    while (head < tail) {
        int u = q[head++];
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (!seen[v]) { seen[v] = 1; q[tail++] = v; }
        }
    }
}`,
    `void bfs(int start, const vector<vector<int>>& adj) {
    queue<int> q;
    vector<int> seen(adj.size());
    q.push(start); seen[start] = 1;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) if (!seen[v]) {
            seen[v] = 1; q.push(v);
        }
    }
}`,
    `from collections import deque

def bfs(start, adj):
    seen = {start}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in seen:
                seen.add(v)
                q.append(v)`,
    `static void bfs(int start, List<List<Integer>> adj) {
    boolean[] seen = new boolean[adj.size()];
    ArrayDeque<Integer> q = new ArrayDeque<>();
    q.add(start); seen[start] = true;
    while (!q.isEmpty()) {
        int u = q.removeFirst();
        for (int v : adj.get(u)) if (!seen[v]) {
            seen[v] = true; q.addLast(v);
        }
    }
}`,
    `function bfs(start, adj) {
  const seen = new Set([start]);
  const q = [start];
  while (q.length) {
    const u = q.shift();
    for (const v of adj[u]) if (!seen.has(v)) {
      seen.add(v); q.push(v);
    }
  }
}`,
    `static void Bfs(int start, List<int>[] adj) {
    var seen = new bool[adj.Length];
    var q = new Queue<int>();
    q.Enqueue(start); seen[start] = true;
    while (q.Count > 0) {
        int u = q.Dequeue();
        foreach (var v in adj[u]) if (!seen[v]) {
            seen[v] = true; q.Enqueue(v);
        }
    }
}`,
  ),

  dfs: snippets(
    `void dfs(int u, int** adj, int* deg, int* seen) {
    seen[u] = 1;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (!seen[v]) dfs(v, adj, deg, seen);
    }
}`,
    `void dfs(int u, const vector<vector<int>>& adj, vector<int>& seen) {
    seen[u] = 1;
    for (int v : adj[u]) if (!seen[v]) dfs(v, adj, seen);
}`,
    `def dfs(u, adj, seen=None):
    if seen is None:
        seen = set()
    seen.add(u)
    for v in adj[u]:
        if v not in seen:
            dfs(v, adj, seen)`,
    `static void dfs(int u, List<List<Integer>> adj, boolean[] seen) {
    seen[u] = true;
    for (int v : adj.get(u)) if (!seen[v]) dfs(v, adj, seen);
}`,
    `function dfs(u, adj, seen = new Set()) {
  seen.add(u);
  for (const v of adj[u]) if (!seen.has(v)) dfs(v, adj, seen);
}`,
    `static void Dfs(int u, List<int>[] adj, bool[] seen) {
    seen[u] = true;
    foreach (var v in adj[u]) if (!seen[v]) Dfs(v, adj, seen);
}`,
  ),

  components: snippets(
    `// Flood each unvisited vertex; assign a component id.`,
    `// DFS/BFS over undirected adjacency; O(V+E).`,
    `def components(n, adj):
    seen = [False] * n
    comp = [-1] * n
    cid = 0
    def dfs(u):
        seen[u] = True
        comp[u] = cid
        for v in adj[u]:
            if not seen[v]:
                dfs(v)
    for u in range(n):
        if not seen[u]:
            dfs(u)
            cid += 1
    return comp, cid`,
    `// Java: boolean[] seen; int[] comp; DFS flood.`,
    `function components(n, adj) {
  const seen = Array(n).fill(false);
  const comp = Array(n).fill(-1);
  let cid = 0;
  const dfs = (u) => {
    seen[u] = true; comp[u] = cid;
    for (const v of adj[u]) if (!seen[v]) dfs(v);
  };
  for (let u = 0; u < n; u++) if (!seen[u]) { dfs(u); cid++; }
  return { comp, count: cid };
}`,
    `// C#: DFS flood assigning component ids.`,
  ),

  "scc-kosaraju": snippets(
    `// Pass 1: DFS finish order. Pass 2: DFS on transpose.`,
    `// Kosaraju: two DFS passes, O(V+E).`,
    `def kosaraju(n, adj, radj):
    seen, order = [False]*n, []
    def dfs1(u):
        seen[u] = True
        for v in adj[u]:
            if not seen[v]: dfs1(v)
        order.append(u)
    for u in range(n):
        if not seen[u]: dfs1(u)
    seen = [False]*n
    scc, cid = [-1]*n, 0
    def dfs2(u):
        seen[u] = True; scc[u] = cid
        for v in radj[u]:
            if not seen[v]: dfs2(v)
    for u in reversed(order):
        if not seen[u]:
            dfs2(u); cid += 1
    return scc`,
    `// Java: finish stack, then DFS on transpose.`,
    `// JS: same two-pass pattern as Python.`,
    `// C#: List finish order, then transpose DFS.`,
  ),

  "scc-tarjan": snippets(
    `// disc[], low[], stack; pop SCC when low[u]==disc[u].`,
    `// Tarjan one-pass SCC, O(V+E).`,
    `def tarjan(n, adj):
    disc = [-1]*n; low = [-1]*n
    on = [False]*n; st = []; time = 0; scc = []
    def strong(u):
        nonlocal time
        disc[u] = low[u] = time; time += 1
        st.append(u); on[u] = True
        for v in adj[u]:
            if disc[v] < 0:
                strong(v); low[u] = min(low[u], low[v])
            elif on[v]:
                low[u] = min(low[u], disc[v])
        if low[u] == disc[u]:
            comp = []
            while True:
                w = st.pop(); on[w] = False; comp.append(w)
                if w == u: break
            scc.append(comp)
    for u in range(n):
        if disc[u] < 0: strong(u)
    return scc`,
    `// Java: disc/low arrays + Deque stack.`,
    `// JS: same disc/low/stack pattern.`,
    `// C#: Stack + disc/low arrays.`,
  ),

  "cycle-undirected": snippets(
    `// DFS; a visited non-parent neighbor means a cycle.`,
    `// Undirected cycle check via parent DFS.`,
    `def has_cycle_undirected(n, adj):
    seen = [False]*n
    def dfs(u, parent):
        seen[u] = True
        for v in adj[u]:
            if v == parent: continue
            if seen[v] or dfs(v, u): return True
        return False
    return any(dfs(u, -1) for u in range(n) if not seen[u])`,
    `// Java: DFS with parent parameter.`,
    `function hasCycleUndirected(n, adj) {
  const seen = Array(n).fill(false);
  const dfs = (u, parent) => {
    seen[u] = true;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (seen[v] || dfs(v, u)) return true;
    }
    return false;
  };
  for (let u = 0; u < n; u++) if (!seen[u] && dfs(u, -1)) return true;
  return false;
}`,
    `// C#: DFS with parent; back edge ⇒ cycle.`,
  ),

  "cycle-directed": snippets(
    `// 3-color DFS: white/gray/black; edge to gray ⇒ cycle.`,
    `// Directed cycle via recursion-stack colors.`,
    `def has_cycle_directed(n, adj):
    # 0 white, 1 gray, 2 black
    color = [0]*n
    def dfs(u):
        color[u] = 1
        for v in adj[u]:
            if color[v] == 1: return True
            if color[v] == 0 and dfs(v): return True
        color[u] = 2
        return False
    return any(dfs(u) for u in range(n) if color[u] == 0)`,
    `// Java: int[] color; gray back edge ⇒ cycle.`,
    `function hasCycleDirected(n, adj) {
  const color = Array(n).fill(0);
  const dfs = (u) => {
    color[u] = 1;
    for (const v of adj[u]) {
      if (color[v] === 1) return true;
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  };
  for (let u = 0; u < n; u++) if (color[u] === 0 && dfs(u)) return true;
  return false;
}`,
    `// C#: White/Gray/Black DFS.`,
  ),

  prim: snippets(
    `// Grow MST from a start node by always adding the lightest cut edge.`,
    `// Prim: binary heap over cut edges; O(E log V).`,
    `def prim(start, adj):
    import heapq
    in_mst = {start}
    pq = [(w, start, v) for v, w in adj[start]]
    heapq.heapify(pq)
    mst = []
    while pq and len(in_mst) < len(adj):
        w, u, v = heapq.heappop(pq)
        if v in in_mst:
            continue
        in_mst.add(v)
        mst.append((u, v, w))
        for x, wx in adj[v]:
            if x not in in_mst:
                heapq.heappush(pq, (wx, v, x))
    return mst`,
    `// Java: PriorityQueue of cut edges, mark nodes in the MST.`,
    `function prim(start, adj) {
  const inMst = new Set([start]);
  const pq = adj[start].map(([v, w]) => [w, start, v]);
  const mst = [];
  while (pq.length && inMst.size < adj.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [w, u, v] = pq.shift();
    if (inMst.has(v)) continue;
    inMst.add(v);
    mst.push([u, v, w]);
    for (const [x, wx] of adj[v]) if (!inMst.has(x)) pq.push([wx, v, x]);
  }
  return mst;
}`,
    `// C#: PriorityQueue of (weight, u, v) across the cut.`,
  ),

  kruskal: snippets(
    `// Sort edges by weight; union-find accepts edges that join components.`,
    `// Kruskal + DSU: O(E log E).`,
    `def kruskal(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    mst = []
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru == rv:
            continue
        parent[rv] = ru
        mst.append((u, v, w))
    return mst`,
    `// Java: sort edges, Union-Find to skip cycles.`,
    `function kruskal(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const mst = [];
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    const ru = find(u), rv = find(v);
    if (ru === rv) continue;
    parent[rv] = ru;
    mst.push([u, v, w]);
  }
  return mst;
}`,
    `// C#: OrderBy weight, then Union on disjoint sets.`,
  ),

  "topo-kahn": snippets(
    `// Peel in-degree 0 vertices until empty or a cycle remains.`,
    `// Kahn BFS topological sort, O(V+E).`,
    `from collections import deque

def topo_kahn(n, adj):
    indeg = [0]*n
    for u in range(n):
        for v in adj[u]: indeg[v] += 1
    q = deque(i for i,d in enumerate(indeg) if d == 0)
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == n else None`,
    `// Java: Queue + indegree array.`,
    `function topoKahn(n, adj) {
  const indeg = Array(n).fill(0);
  for (let u = 0; u < n; u++) for (const v of adj[u]) indeg[v]++;
  const q = indeg.map((d,i) => d === 0 ? i : -1).filter(i => i >= 0);
  const order = [];
  while (q.length) {
    const u = q.shift(); order.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === n ? order : null;
}`,
    `// C#: Queue + in-degree counts.`,
  ),

  "topo-dfs": snippets(
    `// DFS finish times; reverse postorder is a topo order on a DAG.`,
    `// Gray back edge ⇒ cycle.`,
    `def topo_dfs(n, adj):
    color = [0]*n  # 0 white 1 gray 2 black
    order = []
    def dfs(u):
        color[u] = 1
        for v in adj[u]:
            if color[v] == 1: raise ValueError("cycle")
            if color[v] == 0: dfs(v)
        color[u] = 2
        order.append(u)
    for u in range(n):
        if color[u] == 0: dfs(u)
    order.reverse()
    return order`,
    `// Java: colors + finish list, reverse at end.`,
    `// JS: same white/gray/black DFS.`,
    `// C#: reverse finishing stack.`,
  ),

  bipartite: snippets(
    `// BFS 2-color; conflict on same-color edge ⇒ not bipartite.`,
    `// O(V+E) bipartite check.`,
    `from collections import deque

def is_bipartite(n, adj):
    color = [-1]*n
    for s in range(n):
        if color[s] >= 0: continue
        color[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for v in adj[u]:
                if color[v] < 0:
                    color[v] = 1 - color[u]; q.append(v)
                elif color[v] == color[u]:
                    return False
    return True`,
    `// Java: int[] color; BFS per component.`,
    `// JS: same 2-color BFS.`,
    `// C#: Queue 2-coloring.`,
  ),

  bridges: snippets(
    `// Bridge when low[child] > disc[u].`,
    `// DFS discovery/low-link, O(V+E).`,
    `def bridges(n, adj):
    disc = [-1]*n; low = [-1]*n; parent = [-1]*n
    time = 0; out = []
    def dfs(u):
        nonlocal time
        disc[u] = low[u] = time; time += 1
        for v in adj[u]:
            if v == parent[u]: continue
            if disc[v] < 0:
                parent[v] = u; dfs(v)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]: out.append((u, v))
            else:
                low[u] = min(low[u], disc[v])
    for u in range(n):
        if disc[u] < 0: dfs(u)
    return out`,
    `// Java: disc/low arrays.`,
    `// JS: same DFS bridge condition.`,
    `// C#: List of bridge edges.`,
  ),

  articulation: snippets(
    `// Root AP if ≥2 children; else if low[child] ≥ disc[u].`,
    `// Articulation points via DFS, O(V+E).`,
    `def articulation_points(n, adj):
    disc = [-1]*n; low = [-1]*n; parent = [-1]*n
    time = 0; ap = set()
    def dfs(u):
        nonlocal time
        children = 0
        disc[u] = low[u] = time; time += 1
        for v in adj[u]:
            if v == parent[u]: continue
            if disc[v] < 0:
                parent[v] = u; children += 1; dfs(v)
                low[u] = min(low[u], low[v])
                if parent[u] == -1 and children > 1: ap.add(u)
                if parent[u] != -1 and low[v] >= disc[u]: ap.add(u)
            else:
                low[u] = min(low[u], disc[v])
    for u in range(n):
        if disc[u] < 0: dfs(u)
    return ap`,
    `// Java: disc/low + children count for root.`,
    `// JS: same AP conditions.`,
    `// C#: HashSet of articulation points.`,
  ),

  degree: snippets(
    `// deg[u]++ for each undirected endpoint.`,
    `// Degree sequence in O(V+E).`,
    `def degrees(n, edges):
    deg = [0]*n
    for u, v in edges:
        deg[u] += 1; deg[v] += 1
    return deg`,
    `// Java: int[] deg over undirected edges.`,
    `function degrees(n, edges) {
  const deg = Array(n).fill(0);
  for (const [u, v] of edges) { deg[u]++; deg[v]++; }
  return deg;
}`,
    `// C#: int[] degree counts.`,
  ),

  "degree-io": snippets(
    `// out[u]++, in[v]++ for each directed arc u→v.`,
    `// In/out degree in O(V+E).`,
    `def degrees_io(n, edges):
    indeg = [0]*n; outdeg = [0]*n
    for u, v in edges:
        outdeg[u] += 1; indeg[v] += 1
    return indeg, outdeg`,
    `// Java: int[] inDeg, outDeg.`,
    `function degreesIO(n, edges) {
  const indeg = Array(n).fill(0), outdeg = Array(n).fill(0);
  for (const [u, v] of edges) { outdeg[u]++; indeg[v]++; }
  return { indeg, outdeg };
}`,
    `// C#: separate in/out arrays.`,
  ),

  coloring: snippets(
    `// Greedy: smallest color unused by neighbors.`,
    `// O(V+E) greedy coloring.`,
    `def greedy_color(n, adj):
    color = [-1]*n
    for u in range(n):
        used = {color[v] for v in adj[u] if color[v] >= 0}
        c = 0
        while c in used: c += 1
        color[u] = c
    return color`,
    `// Java: BitSet/boolean used colors per vertex.`,
    `function greedyColor(n, adj) {
  const color = Array(n).fill(-1);
  for (let u = 0; u < n; u++) {
    const used = new Set();
    for (const v of adj[u]) if (color[v] >= 0) used.add(color[v]);
    let c = 0; while (used.has(c)) c++;
    color[u] = c;
  }
  return color;
}`,
    `// C#: HashSet of neighbor colors.`,
  ),
};
