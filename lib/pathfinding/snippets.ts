import { snippets, type CodeSnippets } from "@/lib/code/languages";

export const PATH_CODE: Record<"bfs" | "dijkstra" | "astar", CodeSnippets> = {
  bfs: snippets(
    `// BFS shortest hop-path from start to goal`,
    `// Queue + parent pointers; stop when goal is dequeued.`,
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
    # reconstruct via parent`,
    `// Java: ArrayDeque BFS with parent[].`,
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
}`,
    `// C#: Queue + Dictionary parent.`,
  ),

  dijkstra: snippets(
    `// Pseudocode-style C sketch
void dijkstra(int start, int n) {
    // dist[] = INF; dist[start] = 0;
    // while unsettled node u with smallest dist:
    //   for each edge u->v: dist[v] = min(dist[v], dist[u] + w)
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
    `// A* = Dijkstra + heuristic h(n) toward the goal
// f(n) = g(n) + h(n); expand lowest f from the open set.`,
    `// Same as Dijkstra, but priority is g + heuristic(u, goal).`,
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
    `// Java: PriorityQueue ordered by g + heuristic(u).`,
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
    `// C#: PriorityQueue with priority = g + Heuristic(u, goal).`,
  ),
};
