import { snippets, type CodeSnippets } from "@/lib/code/languages";
import type { PathAlgoId } from "./types";

export const PATH_CODE: Record<PathAlgoId, CodeSnippets> = {
  bfs: snippets(
    `int bfs_path(int start, int goal, int n, int** adj, int* deg, int* parent) {
    for (int i = 0; i < n; i++) parent[i] = -1;
    int q[128], head = 0, tail = 0;
    int seen[128] = {0};
    q[tail++] = start; seen[start] = 1; parent[start] = start;
    while (head < tail) {
        int u = q[head++];
        if (u == goal) return 1;
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (!seen[v]) { seen[v] = 1; parent[v] = u; q[tail++] = v; }
        }
    }
    return 0;
}`,
    `vector<int> bfs_path(int start, int goal, const vector<vector<int>>& adj) {
    vector<int> parent(adj.size(), -1);
    queue<int> q; parent[start] = start; q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (u == goal) break;
        for (int v : adj[u]) if (parent[v] < 0) {
            parent[v] = u; q.push(v);
        }
    }
    if (parent[goal] < 0) return {};
    vector<int> path;
    for (int u = goal; ; u = parent[u]) {
        path.push_back(u);
        if (u == start) break;
    }
    reverse(path.begin(), path.end());
    return path;
}`,
    `from collections import deque

def bfs_path(start, goal, adj):
    parent = {start: None}
    q = deque([start])
    while q:
        u = q.popleft()
        if u == goal:
            break
        for v in adj[u]:
            if v not in parent:
                parent[v] = u
                q.append(v)
    if goal not in parent:
        return None
    path = []
    cur = goal
    while cur is not None:
        path.append(cur)
        cur = parent[cur]
    path.reverse()
    return path`,
    `static List<Integer> bfsPath(int start, int goal, List<List<Integer>> adj) {
    int n = adj.size();
    int[] parent = new int[n];
    Arrays.fill(parent, -1);
    ArrayDeque<Integer> q = new ArrayDeque<>();
    parent[start] = start; q.add(start);
    while (!q.isEmpty()) {
        int u = q.removeFirst();
        if (u == goal) break;
        for (int v : adj.get(u)) if (parent[v] < 0) {
            parent[v] = u; q.addLast(v);
        }
    }
    if (parent[goal] < 0) return null;
    LinkedList<Integer> path = new LinkedList<>();
    for (int u = goal; ; u = parent[u]) {
        path.addFirst(u);
        if (u == start) break;
    }
    return path;
}`,
    `function bfsPath(start, goal, adj) {
  const parent = new Map([[start, null]]);
  const q = [start];
  while (q.length) {
    const u = q.shift();
    if (u === goal) break;
    for (const v of adj[u]) if (!parent.has(v)) {
      parent.set(v, u); q.push(v);
    }
  }
  if (!parent.has(goal)) return null;
  const path = [];
  for (let u = goal; u != null; u = parent.get(u)) path.push(u);
  return path.reverse();
}`,
    `static List<int>? BfsPath(int start, int goal, List<int>[] adj) {
    var parent = Enumerable.Repeat(-1, adj.Length).ToArray();
    var q = new Queue<int>();
    parent[start] = start; q.Enqueue(start);
    while (q.Count > 0) {
        int u = q.Dequeue();
        if (u == goal) break;
        foreach (var v in adj[u]) if (parent[v] < 0) {
            parent[v] = u; q.Enqueue(v);
        }
    }
    if (parent[goal] < 0) return null;
    var path = new List<int>();
    for (int u = goal; ; u = parent[u]) {
        path.Add(u);
        if (u == start) break;
    }
    path.Reverse();
    return path;
}`,
  ),

  dijkstra: snippets(
    `void dijkstra(int start, int n, int w[][128], int* dist) {
    int done[128] = {0};
    for (int i = 0; i < n; i++) dist[i] = 1e9;
    dist[start] = 0;
    for (int it = 0; it < n; it++) {
        int u = -1;
        for (int i = 0; i < n; i++)
            if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
        if (u < 0 || dist[u] >= 1e9) break;
        done[u] = 1;
        for (int v = 0; v < n; v++)
            if (w[u][v] < 1e8 && dist[u] + w[u][v] < dist[v])
                dist[v] = dist[u] + w[u][v];
    }
}`,
    `vector<long long> dijkstra(int start, const vector<vector<pair<int,int>>>& adj) {
    const long long INF = 1e18;
    vector<long long> dist(adj.size(), INF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[start] = 0; pq.push({0, start});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d != dist[u]) continue;
        for (auto [v, w] : adj[u]) if (d + w < dist[v]) {
            dist[v] = d + w; pq.push({dist[v], v});
        }
    }
    return dist;
}`,
    `import heapq

def dijkstra(start, adj):
    dist = {start: 0}
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist.get(u):
            continue
        for v, w in adj[u]:
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
    `static long[] dijkstra(int start, List<int[]>[] adj) {
    long INF = Long.MAX_VALUE / 4;
    long[] dist = new long[adj.length];
    Arrays.fill(dist, INF);
    PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
    dist[start] = 0; pq.add(new long[]{0, start});
    while (!pq.isEmpty()) {
        long[] cur = pq.poll();
        int u = (int) cur[1];
        if (cur[0] != dist[u]) continue;
        for (int[] e : adj[u]) {
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.add(new long[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
    `function dijkstra(start, adj) {
  const dist = new Map([[start, 0]]);
  const pq = [[0, start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d !== dist.get(u)) continue;
    for (const [v, w] of adj[u]) {
      const nd = d + w;
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd);
        pq.push([nd, v]);
      }
    }
  }
  return dist;
}`,
    `static Dictionary<int, long> Dijkstra(int start, List<(int v, int w)>[] adj) {
    var dist = new Dictionary<int, long> { [start] = 0 };
    var pq = new PriorityQueue<int, long>();
    pq.Enqueue(start, 0);
    while (pq.Count > 0) {
        pq.TryDequeue(out int u, out long d);
        if (d != dist[u]) continue;
        foreach (var (v, w) in adj[u]) {
            long nd = d + w;
            if (!dist.ContainsKey(v) || nd < dist[v]) {
                dist[v] = nd; pq.Enqueue(v, nd);
            }
        }
    }
    return dist;
}`,
  ),

  astar: snippets(
    `int astar(int start, int goal, int n, int w[][128], int* h, int* dist) {
    int done[128] = {0};
    for (int i = 0; i < n; i++) dist[i] = 1e9;
    dist[start] = 0;
    for (int it = 0; it < n; it++) {
        int u = -1; int best = 1e9;
        for (int i = 0; i < n; i++) if (!done[i] && dist[i] < 1e9) {
            int f = dist[i] + h[i];
            if (u < 0 || f < best) { best = f; u = i; }
        }
        if (u < 0) return 0;
        if (u == goal) return 1;
        done[u] = 1;
        for (int v = 0; v < n; v++)
            if (w[u][v] < 1e8 && dist[u] + w[u][v] < dist[v])
                dist[v] = dist[u] + w[u][v];
    }
    return 0;
}`,
    `optional<long long> astar(int start, int goal,
    const vector<vector<pair<int,int>>>& adj, auto h) {
    const long long INF = 1e18;
    vector<long long> g(adj.size(), INF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    g[start] = 0; pq.push({h(start), start});
    while (!pq.empty()) {
        auto [f, u] = pq.top(); pq.pop();
        if (u == goal) return g[u];
        if (f != g[u] + h(u)) continue;
        for (auto [v, w] : adj[u]) {
            long long ng = g[u] + w;
            if (ng < g[v]) { g[v] = ng; pq.push({ng + h(v), v}); }
        }
    }
    return nullopt;
}`,
    `import heapq

def astar(start, goal, adj, h):
    g = {start: 0}
    pq = [(h(start), start)]
    while pq:
        _, u = heapq.heappop(pq)
        if u == goal:
            return g[u]
        for v, w in adj[u]:
            ng = g[u] + w
            if ng < g.get(v, float("inf")):
                g[v] = ng
                heapq.heappush(pq, (ng + h(v), v))
    return None`,
    `static Long astar(int start, int goal, List<int[]>[] adj, ToIntFunction<Integer> h) {
    long INF = Long.MAX_VALUE / 4;
    long[] g = new long[adj.length];
    Arrays.fill(g, INF);
    PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
    g[start] = 0; pq.add(new long[]{h.applyAsInt(start), start});
    while (!pq.isEmpty()) {
        long[] cur = pq.poll();
        int u = (int) cur[1];
        if (u == goal) return g[u];
        if (cur[0] != g[u] + h.applyAsInt(u)) continue;
        for (int[] e : adj[u]) {
            int v = e[0], w = e[1];
            long ng = g[u] + w;
            if (ng < g[v]) {
                g[v] = ng;
                pq.add(new long[]{ng + h.applyAsInt(v), v});
            }
        }
    }
    return null;
}`,
    `function astar(start, goal, adj, h) {
  const g = new Map([[start, 0]]);
  const pq = [[h(start), start]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [, u] = pq.shift();
    if (u === goal) return g.get(u);
    for (const [v, w] of adj[u]) {
      const ng = g.get(u) + w;
      if (ng < (g.get(v) ?? Infinity)) {
        g.set(v, ng);
        pq.push([ng + h(v), v]);
      }
    }
  }
  return null;
}`,
    `static long? AStar(int start, int goal, List<(int v, int w)>[] adj, Func<int, int> h) {
    var g = new Dictionary<int, long> { [start] = 0 };
    var pq = new PriorityQueue<int, long>();
    pq.Enqueue(start, h(start));
    while (pq.Count > 0) {
        pq.TryDequeue(out int u, out _);
        if (u == goal) return g[u];
        foreach (var (v, w) in adj[u]) {
            long ng = g[u] + w;
            if (!g.ContainsKey(v) || ng < g[v]) {
                g[v] = ng; pq.Enqueue(v, ng + h(v));
            }
        }
    }
    return null;
}`,
  ),

  "bidirectional-bfs": snippets(
    `// Expand smaller frontier from start and goal until waves meet.
int bibfs(int s, int g, int n, int** adj, int* deg, int* meet) {
    int side[128] = {0}, qf[128], qb[128], hf=0,tf=0,hb=0,tb=0;
    side[s]=1; side[g]=2; qf[tf++]=s; qb[tb++]=g;
    while (hf<tf && hb<tb) {
        int forward = (tf-hf) <= (tb-hb);
        int u = forward ? qf[hf++] : qb[hb++];
        int mine = forward ? 1 : 2;
        for (int i=0;i<deg[u];i++) {
            int v = adj[u][i];
            if (!side[v]) {
                side[v]=mine;
                if (forward) qf[tf++]=v; else qb[tb++]=v;
            } else if (side[v]!=mine) { *meet=v; return 1; }
        }
    }
    return 0;
}`,
    `optional<int> bidirectional_bfs(int s, int g, const vector<vector<int>>& adj) {
    vector<int> side(adj.size());
    queue<int> qf, qb; side[s]=1; side[g]=2; qf.push(s); qb.push(g);
    while (!qf.empty() && !qb.empty()) {
        bool fwd = qf.size() <= qb.size();
        int u = fwd ? qf.front() : qb.front();
        (fwd ? qf : qb).pop();
        int mine = fwd ? 1 : 2;
        for (int v : adj[u]) {
            if (!side[v]) { side[v]=mine; (fwd?qf:qb).push(v); }
            else if (side[v]!=mine) return v;
        }
    }
    return nullopt;
}`,
    `from collections import deque

def bidirectional_bfs(start, goal, adj):
    if start == goal: return [start]
    side = {start: 1, goal: 2}
    qf, qb = deque([start]), deque([goal])
    parent_f, parent_b = {start: None}, {goal: None}
    while qf and qb:
        forward = len(qf) <= len(qb)
        q, parent, mine = (qf, parent_f, 1) if forward else (qb, parent_b, 2)
        u = q.popleft()
        for v in adj[u]:
            if v not in side:
                side[v] = mine; parent[v] = u; q.append(v)
            elif side[v] != mine:
                # meet at v — stitch parents
                return v
    return None`,
    `static Integer bidirectionalBfs(int s, int g, List<List<Integer>> adj) {
    int[] side = new int[adj.size()];
    ArrayDeque<Integer> qf = new ArrayDeque<>(), qb = new ArrayDeque<>();
    side[s]=1; side[g]=2; qf.add(s); qb.add(g);
    while (!qf.isEmpty() && !qb.isEmpty()) {
        boolean fwd = qf.size() <= qb.size();
        int u = fwd ? qf.removeFirst() : qb.removeFirst();
        int mine = fwd ? 1 : 2;
        for (int v : adj.get(u)) {
            if (side[v]==0) {
                side[v]=mine; (fwd?qf:qb).addLast(v);
            } else if (side[v]!=mine) return v;
        }
    }
    return null;
}`,
    `function bidirectionalBfs(start, goal, adj) {
  if (start === goal) return start;
  const side = new Map([[start, 1], [goal, 2]]);
  const qf = [start], qb = [goal];
  while (qf.length && qb.length) {
    const forward = qf.length <= qb.length;
    const q = forward ? qf : qb;
    const mine = forward ? 1 : 2;
    const u = q.shift();
    for (const v of adj[u]) {
      if (!side.has(v)) { side.set(v, mine); q.push(v); }
      else if (side.get(v) !== mine) return v;
    }
  }
  return null;
}`,
    `static int? BidirectionalBfs(int s, int g, List<int>[] adj) {
    var side = new int[adj.Length];
    var qf = new Queue<int>(); var qb = new Queue<int>();
    side[s]=1; side[g]=2; qf.Enqueue(s); qb.Enqueue(g);
    while (qf.Count>0 && qb.Count>0) {
        bool fwd = qf.Count <= qb.Count;
        int u = fwd ? qf.Dequeue() : qb.Dequeue();
        int mine = fwd ? 1 : 2;
        foreach (var v in adj[u]) {
            if (side[v]==0) { side[v]=mine; (fwd?qf:qb).Enqueue(v); }
            else if (side[v]!=mine) return v;
        }
    }
    return null;
}`,
  ),

  "bellman-ford": snippets(
    `int bellman_ford(int start, int n, int m, int edges[][3], int* dist) {
    for (int i=0;i<n;i++) dist[i]=1e9; dist[start]=0;
    for (int i=1;i<n;i++) {
        int changed=0;
        for (int e=0;e<m;e++) {
            int u=edges[e][0], v=edges[e][1], w=edges[e][2];
            if (dist[u]<1e9 && dist[u]+w < dist[v]) {
                dist[v]=dist[u]+w; changed=1;
            }
        }
        if (!changed) break;
    }
    for (int e=0;e<m;e++) {
        int u=edges[e][0], v=edges[e][1], w=edges[e][2];
        if (dist[u]<1e9 && dist[u]+w < dist[v]) return 0; // neg cycle
    }
    return 1;
}`,
    `optional<vector<long long>> bellman_ford(int start, int n,
    const vector<array<int,3>>& edges) {
    const long long INF=1e18;
    vector<long long> dist(n, INF); dist[start]=0;
    for (int i=1;i<n;i++) {
        bool ch=false;
        for (auto [u,v,w] : edges)
            if (dist[u]<INF && dist[u]+w < dist[v]) { dist[v]=dist[u]+w; ch=true; }
        if (!ch) break;
    }
    for (auto [u,v,w] : edges)
        if (dist[u]<INF && dist[u]+w < dist[v]) return nullopt;
    return dist;
}`,
    `def bellman_ford(start, n, edges):
    dist = [float("inf")] * n
    dist[start] = 0
    for _ in range(n - 1):
        changed = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break
    if any(dist[u] + w < dist[v] for u, v, w in edges if dist[u] < float("inf")):
        raise ValueError("negative cycle")
    return dist`,
    `static long[] bellmanFord(int start, int n, List<int[]> edges) {
    long INF = Long.MAX_VALUE/4;
    long[] dist = new long[n];
    Arrays.fill(dist, INF); dist[start]=0;
    for (int i=1;i<n;i++) {
        boolean ch=false;
        for (int[] e : edges) {
            int u=e[0],v=e[1],w=e[2];
            if (dist[u]<INF && dist[u]+w < dist[v]) { dist[v]=dist[u]+w; ch=true; }
        }
        if (!ch) break;
    }
    for (int[] e : edges)
        if (dist[e[0]]<INF && dist[e[0]]+e[2] < dist[e[1]])
            throw new IllegalStateException("neg cycle");
    return dist;
}`,
    `function bellmanFord(start, n, edges) {
  const dist = Array(n).fill(Infinity);
  dist[start] = 0;
  for (let i = 1; i < n; i++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges)
    if (dist[u] + w < dist[v]) throw new Error("negative cycle");
  return dist;
}`,
    `static long[] BellmanFord(int start, int n, List<(int u, int v, int w)> edges) {
    var dist = Enumerable.Repeat(long.MaxValue/4, n).ToArray();
    dist[start]=0;
    for (int i=1;i<n;i++) {
        bool ch=false;
        foreach (var (u,v,w) in edges)
            if (dist[u] < long.MaxValue/4 && dist[u]+w < dist[v]) {
                dist[v]=dist[u]+w; ch=true;
            }
        if (!ch) break;
    }
    foreach (var (u,v,w) in edges)
        if (dist[u] < long.MaxValue/4 && dist[u]+w < dist[v])
            throw new InvalidOperationException("neg cycle");
    return dist;
}`,
  ),

  "floyd-warshall": snippets(
    `void floyd(int n, int dist[][128], int nextt[][128]) {
    for (int i=0;i<n;i++) for (int j=0;j<n;j++) nextt[i][j] = (dist[i][j]<1e8? j : -1);
    for (int i=0;i<n;i++) { dist[i][i]=0; nextt[i][i]=i; }
    for (int k=0;k<n;k++)
        for (int i=0;i<n;i++)
            for (int j=0;j<n;j++)
                if (dist[i][k]<1e8 && dist[k][j]<1e8 &&
                    dist[i][k]+dist[k][j] < dist[i][j]) {
                    dist[i][j]=dist[i][k]+dist[k][j];
                    nextt[i][j]=nextt[i][k];
                }
}`,
    `void floyd(vector<vector<long long>>& dist, vector<vector<int>>& nxt) {
    int n=dist.size();
    for (int k=0;k<n;k++)
      for (int i=0;i<n;i++)
        for (int j=0;j<n;j++)
          if (dist[i][k]+dist[k][j] < dist[i][j]) {
            dist[i][j]=dist[i][k]+dist[k][j];
            nxt[i][j]=nxt[i][k];
          }
}`,
    `def floyd_warshall(dist):
    n = len(dist)
    nxt = [[j if dist[i][j] < float("inf") else None for j in range(n)] for i in range(n)]
    for i in range(n):
        dist[i][i] = 0; nxt[i][i] = i
    for k in range(n):
        for i in range(n):
            for j in range(n):
                via = dist[i][k] + dist[k][j]
                if via < dist[i][j]:
                    dist[i][j] = via
                    nxt[i][j] = nxt[i][k]
    return dist, nxt`,
    `static void floydWarshall(long[][] dist, int[][] nxt) {
    int n = dist.length;
    for (int k=0;k<n;k++)
        for (int i=0;i<n;i++)
            for (int j=0;j<n;j++)
                if (dist[i][k] < Long.MAX_VALUE/4 && dist[k][j] < Long.MAX_VALUE/4
                    && dist[i][k]+dist[k][j] < dist[i][j]) {
                    dist[i][j]=dist[i][k]+dist[k][j];
                    nxt[i][j]=nxt[i][k];
                }
}`,
    `function floydWarshall(dist) {
  const n = dist.length;
  const nxt = dist.map((row, i) => row.map((d, j) => (d < Infinity ? j : null)));
  for (let i = 0; i < n; i++) { dist[i][i] = 0; nxt[i][i] = i; }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const via = dist[i][k] + dist[k][j];
        if (via < dist[i][j]) { dist[i][j] = via; nxt[i][j] = nxt[i][k]; }
      }
  return { dist, nxt };
}`,
    `static void FloydWarshall(long[][] dist, int?[][] nxt) {
    int n = dist.Length;
    for (int k=0;k<n;k++)
        for (int i=0;i<n;i++)
            for (int j=0;j<n;j++)
                if (dist[i][k]+dist[k][j] < dist[i][j]) {
                    dist[i][j]=dist[i][k]+dist[k][j];
                    nxt[i][j]=nxt[i][k];
                }
}`,
  ),

  "greedy-best-first": snippets(
    `// Priority = heuristic only (not optimal).
int greedy(int start, int goal, int n, int** adj, int* deg, int* h, int* parent) {
    int open[128], oc=0, closed[128]={0};
    for (int i=0;i<n;i++) parent[i]=-1;
    open[oc++]=start; parent[start]=start;
    while (oc) {
        int best=0;
        for (int i=1;i<oc;i++) if (h[open[i]]<h[open[best]]) best=i;
        int u=open[best]; open[best]=open[--oc];
        if (u==goal) return 1;
        if (closed[u]) continue; closed[u]=1;
        for (int i=0;i<deg[u];i++) {
            int v=adj[u][i];
            if (!closed[v] && parent[v]<0) { parent[v]=u; open[oc++]=v; }
        }
    }
    return 0;
}`,
    `optional<vector<int>> greedy(int s, int g, const vector<vector<int>>& adj, auto h) {
    vector<int> parent(adj.size(), -1), closed(adj.size());
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    parent[s]=s; pq.push({h(s), s});
    while (!pq.empty()) {
        auto [_, u] = pq.top(); pq.pop();
        if (closed[u]) continue; closed[u]=1;
        if (u==g) { /* reconstruct */ return vector<int>{}; }
        for (int v : adj[u]) if (parent[v]<0) { parent[v]=u; pq.push({h(v), v}); }
    }
    return nullopt;
}`,
    `import heapq

def greedy_best_first(start, goal, adj, h):
    parent = {start: None}
    pq = [(h(start), start)]
    closed = set()
    while pq:
        _, u = heapq.heappop(pq)
        if u in closed: continue
        closed.add(u)
        if u == goal: return parent
        for v in adj[u]:
            if v not in parent:
                parent[v] = u
                heapq.heappush(pq, (h(v), v))
    return None`,
    `static Map<Integer,Integer> greedy(int s, int g, List<List<Integer>> adj, ToIntFunction<Integer> h) {
    Map<Integer,Integer> parent = new HashMap<>(); parent.put(s,s);
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a->a[0]));
    boolean[] closed = new boolean[adj.size()];
    pq.add(new int[]{h.applyAsInt(s), s});
    while (!pq.isEmpty()) {
        int u = pq.poll()[1];
        if (closed[u]) continue; closed[u]=true;
        if (u==g) return parent;
        for (int v : adj.get(u)) if (!parent.containsKey(v)) {
            parent.put(v,u); pq.add(new int[]{h.applyAsInt(v), v});
        }
    }
    return null;
}`,
    `function greedyBestFirst(start, goal, adj, h) {
  const parent = new Map([[start, null]]);
  const pq = [[h(start), start]];
  const closed = new Set();
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [, u] = pq.shift();
    if (closed.has(u)) continue;
    closed.add(u);
    if (u === goal) return parent;
    for (const v of adj[u]) if (!parent.has(v)) {
      parent.set(v, u); pq.push([h(v), v]);
    }
  }
  return null;
}`,
    `static Dictionary<int,int>? Greedy(int s, int g, List<int>[] adj, Func<int,int> h) {
    var parent = new Dictionary<int,int> { [s]=s };
    var pq = new PriorityQueue<int,int>();
    var closed = new bool[adj.Length];
    pq.Enqueue(s, h(s));
    while (pq.Count>0) {
        int u = pq.Dequeue();
        if (closed[u]) continue; closed[u]=true;
        if (u==g) return parent;
        foreach (var v in adj[u]) if (!parent.ContainsKey(v)) {
            parent[v]=u; pq.Enqueue(v, h(v));
        }
    }
    return null;
}`,
  ),

  "bidirectional-dijkstra": snippets(
    `// Two Dijkstras; stop when min f-frontier + min b-frontier >= best meet.
long long bidijkstra(int s, int g, int n, int w[][128], int* meet) {
    long long df[128], db[128], best=1e18; int donef[128]={0}, doneb[128]={0};
    for (int i=0;i<n;i++) { df[i]=db[i]=1e18; } df[s]=0; db[g]=0; *meet=-1;
    for (;;) {
        int uf=-1, ub=-1;
        for (int i=0;i<n;i++) {
            if (!donef[i] && (uf<0 || df[i]<df[uf])) uf=i;
            if (!doneb[i] && (ub<0 || db[i]<db[ub])) ub=i;
        }
        if (uf<0 || ub<0 || df[uf]+db[ub] >= best) break;
        int fwd = df[uf] <= db[ub];
        int u = fwd ? uf : ub; long long* dist = fwd ? df : db; int* done = fwd ? donef : doneb;
        done[u]=1;
        if (df[u]+db[u] < best) { best=df[u]+db[u]; *meet=u; }
        for (int v=0;v<n;v++) if (w[u][v]<1e8 && dist[u]+w[u][v] < dist[v])
            dist[v]=dist[u]+w[u][v];
    }
    return best;
}`,
    `pair<long long,int> bidirectional_dijkstra(int s, int g,
    const vector<vector<pair<int,int>>>& adj) {
    int n=adj.size();
    vector<long long> df(n,1e18), db(n,1e18);
    vector<int> donef(n), doneb(n);
    priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>> pf, pb;
    df[s]=0; db[g]=0; pf.push({0,s}); pb.push({0,g});
    long long best=1e18; int meet=-1;
    while (!pf.empty() && !pb.empty()) {
        if (pf.top().first + pb.top().first >= best) break;
        bool fwd = pf.size() <= pb.size();
        auto& pq = fwd ? pf : pb; auto& dist = fwd ? df : db; auto& done = fwd ? donef : doneb;
        auto [d,u]=pq.top(); pq.pop();
        if (done[u]) continue; done[u]=1;
        if (df[u]+db[u] < best) { best=df[u]+db[u]; meet=u; }
        for (auto [v,w] : adj[u]) if (d+w < dist[v]) {
            dist[v]=d+w; pq.push({dist[v],v});
            if (df[v]+db[v] < best) { best=df[v]+db[v]; meet=v; }
        }
    }
    return {best, meet};
}`,
    `import heapq

def bidirectional_dijkstra(start, goal, adj):
    df, db = {start: 0}, {goal: 0}
    done_f, done_b = set(), set()
    pf, pb = [(0, start)], [(0, goal)]
    best, meet = float("inf"), None
    while pf and pb:
        if pf[0][0] + pb[0][0] >= best: break
        forward = len(pf) <= len(pb)
        pq, dist, done = (pf, df, done_f) if forward else (pb, db, done_b)
        d, u = heapq.heappop(pq)
        if u in done: continue
        done.add(u)
        if df.get(u, float("inf")) + db.get(u, float("inf")) < best:
            best = df[u] + db[u]; meet = u
        for v, w in adj[u]:
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd; heapq.heappush(pq, (nd, v))
                if df.get(v, float("inf")) + db.get(v, float("inf")) < best:
                    best = df[v] + db[v]; meet = v
    return best, meet`,
    `static long[] biDijkstra(int s, int g, List<int[]>[] adj) {
    int n = adj.length;
    long INF = Long.MAX_VALUE/4;
    long[] df = new long[n], db = new long[n];
    Arrays.fill(df, INF); Arrays.fill(db, INF);
    boolean[] donef = new boolean[n], doneb = new boolean[n];
    PriorityQueue<long[]> pf = new PriorityQueue<>(Comparator.comparingLong(a->a[0]));
    PriorityQueue<long[]> pb = new PriorityQueue<>(Comparator.comparingLong(a->a[0]));
    df[s]=0; db[g]=0; pf.add(new long[]{0,s}); pb.add(new long[]{0,g});
    long best = INF; int meet = -1;
    while (!pf.isEmpty() && !pb.isEmpty()) {
        if (pf.peek()[0] + pb.peek()[0] >= best) break;
        boolean fwd = pf.size() <= pb.size();
        PriorityQueue<long[]> pq = fwd ? pf : pb;
        long[] dist = fwd ? df : db; boolean[] done = fwd ? donef : doneb;
        long[] cur = pq.poll(); int u = (int)cur[1];
        if (done[u]) continue; done[u]=true;
        if (df[u] < INF && db[u] < INF && df[u]+db[u] < best) {
            best = df[u]+db[u]; meet = u;
        }
        for (int[] e : adj[u]) {
            int v=e[0], w=e[1];
            if (cur[0]+w < dist[v]) {
                dist[v]=cur[0]+w; pq.add(new long[]{dist[v], v});
            }
        }
    }
    return new long[]{best, meet};
}`,
    `function bidirectionalDijkstra(start, goal, adj) {
  const df = new Map([[start, 0]]), db = new Map([[goal, 0]]);
  const doneF = new Set(), doneB = new Set();
  const pf = [[0, start]], pb = [[0, goal]];
  let best = Infinity, meet = null;
  const top = (pq) => (pq.sort((a,b)=>a[0]-b[0]), pq[0]);
  while (pf.length && pb.length) {
    if (top(pf)[0] + top(pb)[0] >= best) break;
    const forward = pf.length <= pb.length;
    const pq = forward ? pf : pb;
    const dist = forward ? df : db;
    const done = forward ? doneF : doneB;
    pq.sort((a,b)=>a[0]-b[0]);
    const [d, u] = pq.shift();
    if (done.has(u)) continue;
    done.add(u);
    const other = (forward ? db : df).get(u);
    if (other != null && d + other < best) { best = d + other; meet = u; }
    for (const [v, w] of adj[u]) {
      const nd = d + w;
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd); pq.push([nd, v]);
        const ov = (forward ? db : df).get(v);
        if (ov != null && nd + ov < best) { best = nd + ov; meet = v; }
      }
    }
  }
  return { best, meet };
}`,
    `static (long best, int meet) BiDijkstra(int s, int g, List<(int v, int w)>[] adj) {
    int n = adj.Length;
    var df = Enumerable.Repeat(long.MaxValue/4, n).ToArray();
    var db = Enumerable.Repeat(long.MaxValue/4, n).ToArray();
    var doneF = new bool[n]; var doneB = new bool[n];
    var pf = new PriorityQueue<int, long>(); var pb = new PriorityQueue<int, long>();
    df[s]=0; db[g]=0; pf.Enqueue(s,0); pb.Enqueue(g,0);
    long best = long.MaxValue/4; int meet = -1;
    while (pf.Count>0 && pb.Count>0) {
        if (pf.TryPeek(out _, out long ft) && pb.TryPeek(out _, out long bt) && ft+bt >= best) break;
        bool fwd = pf.Count <= pb.Count;
        var pq = fwd ? pf : pb; var dist = fwd ? df : db; var done = fwd ? doneF : doneB;
        pq.TryDequeue(out int u, out long d);
        if (done[u]) continue; done[u]=true;
        if (df[u]+db[u] < best) { best = df[u]+db[u]; meet = u; }
        foreach (var (v, w) in adj[u]) if (d+w < dist[v]) {
            dist[v]=d+w; pq.Enqueue(v, dist[v]);
        }
    }
    return (best, meet);
}`,
  ),

  "bidirectional-astar": snippets(
    `long long bi_astar(int s, int g, int n, int w[][128], int* hG, int* hS, int* meet) {
    long long df[128], db[128], best=1e18;
    int donef[128]={0}, doneb[128]={0};
    for (int i=0;i<n;i++) { df[i]=db[i]=1e18; } df[s]=0; db[g]=0; *meet=-1;
    for (;;) {
        int uf=-1, ub=-1; long long ff=1e18, fb=1e18;
        for (int i=0;i<n;i++) {
            if (!donef[i] && df[i]<1e18) {
                long long f=df[i]+hG[i]; if (uf<0 || f<ff) { ff=f; uf=i; }
            }
            if (!doneb[i] && db[i]<1e18) {
                long long f=db[i]+hS[i]; if (ub<0 || f<fb) { fb=f; ub=i; }
            }
        }
        if (uf<0 || ub<0 || ff+fb >= best) break;
        int fwd = ff <= fb;
        int u = fwd ? uf : ub; long long* dist = fwd ? df : db; int* done = fwd ? donef : doneb;
        done[u]=1;
        if (df[u]+db[u] < best) { best=df[u]+db[u]; *meet=u; }
        for (int v=0;v<n;v++) if (w[u][v]<1e8 && dist[u]+w[u][v] < dist[v])
            dist[v]=dist[u]+w[u][v];
    }
    return best;
}`,
    `pair<long long,int> bidirectional_astar(int s, int g,
    const vector<vector<pair<int,int>>>& adj, auto hG, auto hS) {
    int n=adj.size();
    vector<long long> df(n,1e18), db(n,1e18);
    vector<int> donef(n), doneb(n);
    priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>> pf, pb;
    df[s]=0; db[g]=0; pf.push({hG(s),s}); pb.push({hS(g),g});
    long long best=1e18; int meet=-1;
    while (!pf.empty() && !pb.empty()) {
        if (pf.top().first + pb.top().first >= best) break;
        bool fwd = pf.size() <= pb.size();
        auto& pq = fwd ? pf : pb; auto& dist = fwd ? df : db; auto& done = fwd ? donef : doneb;
        auto h = fwd ? hG : hS;
        auto [f,u]=pq.top(); pq.pop();
        if (done[u]) continue; done[u]=1;
        if (df[u]+db[u] < best) { best=df[u]+db[u]; meet=u; }
        for (auto [v,w] : adj[u]) if (dist[u]+w < dist[v]) {
            dist[v]=dist[u]+w; pq.push({dist[v]+h(v), v});
        }
    }
    return {best, meet};
}`,
    `import heapq

def bidirectional_astar(start, goal, adj, h_to_goal, h_to_start):
    df, db = {start: 0}, {goal: 0}
    pf = [(h_to_goal(start), start)]
    pb = [(h_to_start(goal), goal)]
    done_f, done_b = set(), set()
    best, meet = float("inf"), None
    while pf and pb:
        if pf[0][0] + pb[0][0] >= best: break
        forward = len(pf) <= len(pb)
        pq, dist, done, h = (
            (pf, df, done_f, h_to_goal) if forward else (pb, db, done_b, h_to_start)
        )
        _, u = heapq.heappop(pq)
        if u in done: continue
        done.add(u)
        if df.get(u, float("inf")) + db.get(u, float("inf")) < best:
            best = df[u] + db[u]; meet = u
        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(pq, (nd + h(v), v))
    return best, meet`,
    `static long[] biAstar(int s, int g, List<int[]>[] adj,
                      ToIntFunction<Integer> hG, ToIntFunction<Integer> hS) {
    int n = adj.length;
    long INF = Long.MAX_VALUE/4;
    long[] df = new long[n], db = new long[n];
    Arrays.fill(df, INF); Arrays.fill(db, INF);
    boolean[] donef = new boolean[n], doneb = new boolean[n];
    PriorityQueue<long[]> pf = new PriorityQueue<>(Comparator.comparingLong(a->a[0]));
    PriorityQueue<long[]> pb = new PriorityQueue<>(Comparator.comparingLong(a->a[0]));
    df[s]=0; db[g]=0;
    pf.add(new long[]{hG.applyAsInt(s), s});
    pb.add(new long[]{hS.applyAsInt(g), g});
    long best = INF; int meet = -1;
    while (!pf.isEmpty() && !pb.isEmpty()) {
        if (pf.peek()[0] + pb.peek()[0] >= best) break;
        boolean fwd = pf.size() <= pb.size();
        PriorityQueue<long[]> pq = fwd ? pf : pb;
        long[] dist = fwd ? df : db; boolean[] done = fwd ? donef : doneb;
        ToIntFunction<Integer> h = fwd ? hG : hS;
        long[] cur = pq.poll(); int u = (int)cur[1];
        if (done[u]) continue; done[u]=true;
        if (df[u]+db[u] < best) { best=df[u]+db[u]; meet=u; }
        for (int[] e : adj[u]) {
            int v=e[0], w=e[1];
            if (dist[u]+w < dist[v]) {
                dist[v]=dist[u]+w;
                pq.add(new long[]{dist[v]+h.applyAsInt(v), v});
            }
        }
    }
    return new long[]{best, meet};
}`,
    `function bidirectionalAstar(start, goal, adj, hGoal, hStart) {
  const df = new Map([[start, 0]]), db = new Map([[goal, 0]]);
  const pf = [[hGoal(start), start]], pb = [[hStart(goal), goal]];
  const doneF = new Set(), doneB = new Set();
  let best = Infinity, meet = null;
  while (pf.length && pb.length) {
    pf.sort((a,b)=>a[0]-b[0]); pb.sort((a,b)=>a[0]-b[0]);
    if (pf[0][0] + pb[0][0] >= best) break;
    const forward = pf.length <= pb.length;
    const pq = forward ? pf : pb;
    const dist = forward ? df : db;
    const done = forward ? doneF : doneB;
    const h = forward ? hGoal : hStart;
    const [, u] = pq.shift();
    if (done.has(u)) continue;
    done.add(u);
    const cand = (df.get(u) ?? Infinity) + (db.get(u) ?? Infinity);
    if (cand < best) { best = cand; meet = u; }
    for (const [v, w] of adj[u]) {
      const nd = dist.get(u) + w;
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd); pq.push([nd + h(v), v]);
      }
    }
  }
  return { best, meet };
}`,
    `static (long best, int meet) BiAstar(int s, int g, List<(int v, int w)>[] adj,
        Func<int,int> hG, Func<int,int> hS) {
    int n = adj.Length;
    var df = Enumerable.Repeat(long.MaxValue/4, n).ToArray();
    var db = Enumerable.Repeat(long.MaxValue/4, n).ToArray();
    var doneF = new bool[n]; var doneB = new bool[n];
    var pf = new PriorityQueue<int, long>(); var pb = new PriorityQueue<int, long>();
    df[s]=0; db[g]=0; pf.Enqueue(s, hG(s)); pb.Enqueue(g, hS(g));
    long best = long.MaxValue/4; int meet = -1;
    while (pf.Count>0 && pb.Count>0) {
        if (pf.TryPeek(out _, out long ft) && pb.TryPeek(out _, out long bt) && ft+bt >= best) break;
        bool fwd = pf.Count <= pb.Count;
        var pq = fwd ? pf : pb; var dist = fwd ? df : db; var done = fwd ? doneF : doneB;
        var h = fwd ? hG : hS;
        pq.TryDequeue(out int u, out _);
        if (done[u]) continue; done[u]=true;
        if (df[u]+db[u] < best) { best=df[u]+db[u]; meet=u; }
        foreach (var (v, w) in adj[u]) if (dist[u]+w < dist[v]) {
            dist[v]=dist[u]+w; pq.Enqueue(v, dist[v]+h(v));
        }
    }
    return (best, meet);
}`,
  ),
};
