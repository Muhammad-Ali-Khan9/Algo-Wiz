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
    `void flood(int u, int cid, int** adj, int* deg, int* seen, int* comp) {
    seen[u] = 1; comp[u] = cid;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (!seen[v]) flood(v, cid, adj, deg, seen, comp);
    }
}
int components(int n, int** adj, int* deg, int* comp) {
    int seen[128] = {0}, cid = 0;
    for (int u = 0; u < n; u++) if (!seen[u])
        flood(u, cid++, adj, deg, seen, comp);
    return cid;
}`,
    `int components(const vector<vector<int>>& adj, vector<int>& comp) {
    int n = adj.size(), cid = 0;
    vector<int> seen(n);
    function<void(int,int)> dfs = [&](int u, int id) {
        seen[u] = 1; comp[u] = id;
        for (int v : adj[u]) if (!seen[v]) dfs(v, id);
    };
    for (int u = 0; u < n; u++) if (!seen[u]) dfs(u, cid++);
    return cid;
}`,
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
    `static int components(List<List<Integer>> adj, int[] comp) {
    int n = adj.size(), cid = 0;
    boolean[] seen = new boolean[n];
    for (int u = 0; u < n; u++) if (!seen[u]) {
        ArrayDeque<Integer> st = new ArrayDeque<>();
        st.push(u); seen[u] = true; comp[u] = cid;
        while (!st.isEmpty()) {
            int x = st.pop();
            for (int v : adj.get(x)) if (!seen[v]) {
                seen[v] = true; comp[v] = cid; st.push(v);
            }
        }
        cid++;
    }
    return cid;
}`,
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
    `static int Components(List<int>[] adj, int[] comp) {
    int n = adj.Length, cid = 0;
    var seen = new bool[n];
    void Dfs(int u, int id) {
        seen[u] = true; comp[u] = id;
        foreach (var v in adj[u]) if (!seen[v]) Dfs(v, id);
    }
    for (int u = 0; u < n; u++) if (!seen[u]) Dfs(u, cid++);
    return cid;
}`,
  ),

  "scc-kosaraju": snippets(
    `void dfs1(int u, int** adj, int* deg, int* seen, int* order, int* oc) {
    seen[u] = 1;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (!seen[v]) dfs1(v, adj, deg, seen, order, oc);
    }
    order[(*oc)++] = u;
}
void dfs2(int u, int cid, int** radj, int* rdeg, int* seen, int* scc) {
    seen[u] = 1; scc[u] = cid;
    for (int i = 0; i < rdeg[u]; i++) {
        int v = radj[u][i];
        if (!seen[v]) dfs2(v, cid, radj, rdeg, seen, scc);
    }
}`,
    `vector<int> kosaraju(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<vector<int>> radj(n);
    for (int u = 0; u < n; u++) for (int v : adj[u]) radj[v].push_back(u);
    vector<int> seen(n), order, scc(n, -1);
    function<void(int)> dfs1 = [&](int u) {
        seen[u] = 1;
        for (int v : adj[u]) if (!seen[v]) dfs1(v);
        order.push_back(u);
    };
    for (int u = 0; u < n; u++) if (!seen[u]) dfs1(u);
    fill(seen.begin(), seen.end(), 0);
    int cid = 0;
    function<void(int)> dfs2 = [&](int u) {
        seen[u] = 1; scc[u] = cid;
        for (int v : radj[u]) if (!seen[v]) dfs2(v);
    };
    for (int i = n - 1; i >= 0; i--) if (!seen[order[i]]) { dfs2(order[i]); cid++; }
    return scc;
}`,
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
    `static int[] kosaraju(List<List<Integer>> adj) {
    int n = adj.size();
    List<List<Integer>> radj = new ArrayList<>();
    for (int i = 0; i < n; i++) radj.add(new ArrayList<>());
    for (int u = 0; u < n; u++) for (int v : adj.get(u)) radj.get(v).add(u);
    boolean[] seen = new boolean[n];
    List<Integer> order = new ArrayList<>();
    java.util.function.IntConsumer dfs1 = new java.util.function.IntConsumer() {
        public void accept(int u) {
            seen[u] = true;
            for (int v : adj.get(u)) if (!seen[v]) accept(v);
            order.add(u);
        }
    };
    for (int u = 0; u < n; u++) if (!seen[u]) dfs1.accept(u);
    Arrays.fill(seen, false);
    int[] scc = new int[n];
    int[] cid = {0};
    java.util.function.IntConsumer dfs2 = new java.util.function.IntConsumer() {
        public void accept(int u) {
            seen[u] = true; scc[u] = cid[0];
            for (int v : radj.get(u)) if (!seen[v]) accept(v);
        }
    };
    for (int i = n - 1; i >= 0; i--) {
        int u = order.get(i);
        if (!seen[u]) { dfs2.accept(u); cid[0]++; }
    }
    return scc;
}`,
    `function kosaraju(n, adj, radj) {
  const seen = Array(n).fill(false);
  const order = [];
  const dfs1 = (u) => {
    seen[u] = true;
    for (const v of adj[u]) if (!seen[v]) dfs1(v);
    order.push(u);
  };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs1(u);
  seen.fill(false);
  const scc = Array(n).fill(-1);
  let cid = 0;
  const dfs2 = (u) => {
    seen[u] = true; scc[u] = cid;
    for (const v of radj[u]) if (!seen[v]) dfs2(v);
  };
  for (let i = n - 1; i >= 0; i--) if (!seen[order[i]]) { dfs2(order[i]); cid++; }
  return scc;
}`,
    `static int[] Kosaraju(List<int>[] adj) {
    int n = adj.Length;
    var radj = Enumerable.Range(0, n).Select(_ => new List<int>()).ToArray();
    for (int u = 0; u < n; u++) foreach (var v in adj[u]) radj[v].Add(u);
    var seen = new bool[n];
    var order = new List<int>();
    void Dfs1(int u) {
        seen[u] = true;
        foreach (var v in adj[u]) if (!seen[v]) Dfs1(v);
        order.Add(u);
    }
    for (int u = 0; u < n; u++) if (!seen[u]) Dfs1(u);
    Array.Fill(seen, false);
    var scc = new int[n];
    int cid = 0;
    void Dfs2(int u) {
        seen[u] = true; scc[u] = cid;
        foreach (var v in radj[u]) if (!seen[v]) Dfs2(v);
    }
    for (int i = n - 1; i >= 0; i--) if (!seen[order[i]]) { Dfs2(order[i]); cid++; }
    return scc;
}`,
  ),

  "scc-tarjan": snippets(
    `void strong(int u, int** adj, int* deg, int* disc, int* low,
            int* on, int* st, int* sp, int* time, int* scc, int* cid) {
    disc[u] = low[u] = (*time)++;
    st[(*sp)++] = u; on[u] = 1;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (disc[v] < 0) {
            strong(v, adj, deg, disc, low, on, st, sp, time, scc, cid);
            if (low[v] < low[u]) low[u] = low[v];
        } else if (on[v] && disc[v] < low[u]) low[u] = disc[v];
    }
    if (low[u] == disc[u]) {
        int w;
        do { w = st[--(*sp)]; on[w] = 0; scc[w] = *cid; } while (w != u);
        (*cid)++;
    }
}`,
    `vector<vector<int>> tarjan(const vector<vector<int>>& adj) {
    int n = adj.size(), time = 0;
    vector<int> disc(n, -1), low(n), on(n);
    vector<int> st; vector<vector<int>> sccs;
    function<void(int)> strong = [&](int u) {
        disc[u] = low[u] = time++;
        st.push_back(u); on[u] = 1;
        for (int v : adj[u]) {
            if (disc[v] < 0) { strong(v); low[u] = min(low[u], low[v]); }
            else if (on[v]) low[u] = min(low[u], disc[v]);
        }
        if (low[u] == disc[u]) {
            vector<int> comp;
            while (true) {
                int w = st.back(); st.pop_back(); on[w] = 0; comp.push_back(w);
                if (w == u) break;
            }
            sccs.push_back(comp);
        }
    };
    for (int u = 0; u < n; u++) if (disc[u] < 0) strong(u);
    return sccs;
}`,
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
    `static List<List<Integer>> tarjan(List<List<Integer>> adj) {
    int n = adj.size();
    int[] disc = new int[n], low = new int[n];
    Arrays.fill(disc, -1);
    boolean[] on = new boolean[n];
    Deque<Integer> st = new ArrayDeque<>();
    List<List<Integer>> sccs = new ArrayList<>();
    int[] time = {0};
    class Rec {
        void strong(int u) {
            disc[u] = low[u] = time[0]++;
            st.push(u); on[u] = true;
            for (int v : adj.get(u)) {
                if (disc[v] < 0) { strong(v); low[u] = Math.min(low[u], low[v]); }
                else if (on[v]) low[u] = Math.min(low[u], disc[v]);
            }
            if (low[u] == disc[u]) {
                List<Integer> comp = new ArrayList<>();
                while (true) {
                    int w = st.pop(); on[w] = false; comp.add(w);
                    if (w == u) break;
                }
                sccs.add(comp);
            }
        }
    }
    Rec r = new Rec();
    for (int u = 0; u < n; u++) if (disc[u] < 0) r.strong(u);
    return sccs;
}`,
    `function tarjan(n, adj) {
  const disc = Array(n).fill(-1), low = Array(n).fill(-1);
  const on = Array(n).fill(false), st = [], scc = [];
  let time = 0;
  const strong = (u) => {
    disc[u] = low[u] = time++;
    st.push(u); on[u] = true;
    for (const v of adj[u]) {
      if (disc[v] < 0) { strong(v); low[u] = Math.min(low[u], low[v]); }
      else if (on[v]) low[u] = Math.min(low[u], disc[v]);
    }
    if (low[u] === disc[u]) {
      const comp = [];
      while (true) {
        const w = st.pop(); on[w] = false; comp.push(w);
        if (w === u) break;
      }
      scc.push(comp);
    }
  };
  for (let u = 0; u < n; u++) if (disc[u] < 0) strong(u);
  return scc;
}`,
    `static List<List<int>> Tarjan(List<int>[] adj) {
    int n = adj.Length, time = 0;
    var disc = Enumerable.Repeat(-1, n).ToArray();
    var low = new int[n];
    var on = new bool[n];
    var st = new Stack<int>();
    var sccs = new List<List<int>>();
    void Strong(int u) {
        disc[u] = low[u] = time++;
        st.Push(u); on[u] = true;
        foreach (var v in adj[u]) {
            if (disc[v] < 0) { Strong(v); low[u] = Math.Min(low[u], low[v]); }
            else if (on[v]) low[u] = Math.Min(low[u], disc[v]);
        }
        if (low[u] == disc[u]) {
            var comp = new List<int>();
            while (true) {
                int w = st.Pop(); on[w] = false; comp.Add(w);
                if (w == u) break;
            }
            sccs.Add(comp);
        }
    }
    for (int u = 0; u < n; u++) if (disc[u] < 0) Strong(u);
    return sccs;
}`,
  ),

  "cycle-undirected": snippets(
    `int dfs(int u, int parent, int** adj, int* deg, int* seen) {
    seen[u] = 1;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (v == parent) continue;
        if (seen[v] || dfs(v, u, adj, deg, seen)) return 1;
    }
    return 0;
}
int has_cycle_undirected(int n, int** adj, int* deg) {
    int seen[128] = {0};
    for (int u = 0; u < n; u++)
        if (!seen[u] && dfs(u, -1, adj, deg, seen)) return 1;
    return 0;
}`,
    `bool has_cycle_undirected(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> seen(n);
    function<bool(int,int)> dfs = [&](int u, int parent) {
        seen[u] = 1;
        for (int v : adj[u]) {
            if (v == parent) continue;
            if (seen[v] || dfs(v, u)) return true;
        }
        return false;
    };
    for (int u = 0; u < n; u++) if (!seen[u] && dfs(u, -1)) return true;
    return false;
}`,
    `def has_cycle_undirected(n, adj):
    seen = [False]*n
    def dfs(u, parent):
        seen[u] = True
        for v in adj[u]:
            if v == parent: continue
            if seen[v] or dfs(v, u): return True
        return False
    return any(dfs(u, -1) for u in range(n) if not seen[u])`,
    `static boolean hasCycleUndirected(List<List<Integer>> adj) {
    int n = adj.size();
    boolean[] seen = new boolean[n];
    class Rec {
        boolean dfs(int u, int parent) {
            seen[u] = true;
            for (int v : adj.get(u)) {
                if (v == parent) continue;
                if (seen[v] || dfs(v, u)) return true;
            }
            return false;
        }
    }
    Rec r = new Rec();
    for (int u = 0; u < n; u++) if (!seen[u] && r.dfs(u, -1)) return true;
    return false;
}`,
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
    `static bool HasCycleUndirected(List<int>[] adj) {
    int n = adj.Length;
    var seen = new bool[n];
    bool Dfs(int u, int parent) {
        seen[u] = true;
        foreach (var v in adj[u]) {
            if (v == parent) continue;
            if (seen[v] || Dfs(v, u)) return true;
        }
        return false;
    }
    for (int u = 0; u < n; u++) if (!seen[u] && Dfs(u, -1)) return true;
    return false;
}`,
  ),

  "cycle-directed": snippets(
    `int dfs(int u, int** adj, int* deg, int* color) {
    color[u] = 1;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (color[v] == 1) return 1;
        if (color[v] == 0 && dfs(v, adj, deg, color)) return 1;
    }
    color[u] = 2;
    return 0;
}
int has_cycle_directed(int n, int** adj, int* deg) {
    int color[128] = {0};
    for (int u = 0; u < n; u++)
        if (color[u] == 0 && dfs(u, adj, deg, color)) return 1;
    return 0;
}`,
    `bool has_cycle_directed(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n); // 0 white, 1 gray, 2 black
    function<bool(int)> dfs = [&](int u) {
        color[u] = 1;
        for (int v : adj[u]) {
            if (color[v] == 1) return true;
            if (color[v] == 0 && dfs(v)) return true;
        }
        color[u] = 2;
        return false;
    };
    for (int u = 0; u < n; u++) if (color[u] == 0 && dfs(u)) return true;
    return false;
}`,
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
    `static boolean hasCycleDirected(List<List<Integer>> adj) {
    int n = adj.size();
    int[] color = new int[n];
    class Rec {
        boolean dfs(int u) {
            color[u] = 1;
            for (int v : adj.get(u)) {
                if (color[v] == 1) return true;
                if (color[v] == 0 && dfs(v)) return true;
            }
            color[u] = 2;
            return false;
        }
    }
    Rec r = new Rec();
    for (int u = 0; u < n; u++) if (color[u] == 0 && r.dfs(u)) return true;
    return false;
}`,
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
    `static bool HasCycleDirected(List<int>[] adj) {
    int n = adj.Length;
    var color = new int[n];
    bool Dfs(int u) {
        color[u] = 1;
        foreach (var v in adj[u]) {
            if (color[v] == 1) return true;
            if (color[v] == 0 && Dfs(v)) return true;
        }
        color[u] = 2;
        return false;
    }
    for (int u = 0; u < n; u++) if (color[u] == 0 && Dfs(u)) return true;
    return false;
}`,
  ),

  prim: snippets(
    `// Prim with a dense O(V^2) scan of the cut.
void prim(int start, int n, int w[][128], int* parent) {
    int in_mst[128] = {0}, key[128];
    for (int i = 0; i < n; i++) { key[i] = 1e9; parent[i] = -1; }
    key[start] = 0;
    for (int it = 0; it < n; it++) {
        int u = -1;
        for (int i = 0; i < n; i++)
            if (!in_mst[i] && (u < 0 || key[i] < key[u])) u = i;
        in_mst[u] = 1;
        for (int v = 0; v < n; v++)
            if (!in_mst[v] && w[u][v] < key[v]) {
                key[v] = w[u][v]; parent[v] = u;
            }
    }
}`,
    `vector<tuple<int,int,int>> prim(int start, const vector<vector<pair<int,int>>>& adj) {
    int n = adj.size();
    vector<int> in(n); vector<tuple<int,int,int>> mst;
    priority_queue<array<int,3>, vector<array<int,3>>, greater<>> pq;
    for (auto [v, w] : adj[start]) pq.push({w, start, v});
    in[start] = 1;
    while (!pq.empty() && (int)mst.size() < n - 1) {
        auto [w, u, v] = pq.top(); pq.pop();
        if (in[v]) continue;
        in[v] = 1; mst.push_back({u, v, w});
        for (auto [x, wx] : adj[v]) if (!in[x]) pq.push({wx, v, x});
    }
    return mst;
}`,
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
    `static List<int[]> prim(int start, List<int[]>[] adj) {
    boolean[] in = new boolean[adj.length];
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    List<int[]> mst = new ArrayList<>();
    in[start] = true;
    for (int[] e : adj[start]) pq.add(new int[]{e[1], start, e[0]});
    while (!pq.isEmpty() && mst.size() < adj.length - 1) {
        int[] cur = pq.poll();
        int w = cur[0], u = cur[1], v = cur[2];
        if (in[v]) continue;
        in[v] = true; mst.add(new int[]{u, v, w});
        for (int[] e : adj[v]) if (!in[e[0]]) pq.add(new int[]{e[1], v, e[0]});
    }
    return mst;
}`,
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
    `static List<(int u, int v, int w)> Prim(int start, List<(int v, int w)>[] adj) {
    var inMst = new bool[adj.Length];
    var pq = new PriorityQueue<(int w, int u, int v), int>();
    var mst = new List<(int, int, int)>();
    inMst[start] = true;
    foreach (var (v, w) in adj[start]) pq.Enqueue((w, start, v), w);
    while (pq.Count > 0 && mst.Count < adj.Length - 1) {
        var (w, u, v) = pq.Dequeue();
        if (inMst[v]) continue;
        inMst[v] = true; mst.Add((u, v, w));
        foreach (var (x, wx) in adj[v]) if (!inMst[x]) pq.Enqueue((wx, v, x), wx);
    }
    return mst;
}`,
  ),

  kruskal: snippets(
    `int find(int x, int* parent) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
}
int kruskal(int n, int m, int edges[][3], int mst[][3]) {
    int parent[128]; for (int i = 0; i < n; i++) parent[i] = i;
    // assume edges sorted by weight ascending
    int k = 0;
    for (int i = 0; i < m; i++) {
        int u = edges[i][0], v = edges[i][1], w = edges[i][2];
        int ru = find(u, parent), rv = find(v, parent);
        if (ru == rv) continue;
        parent[rv] = ru;
        mst[k][0] = u; mst[k][1] = v; mst[k][2] = w; k++;
    }
    return k;
}`,
    `vector<array<int,3>> kruskal(int n, vector<array<int,3>> edges) {
    vector<int> parent(n); iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    };
    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a[2] < b[2]; });
    vector<array<int,3>> mst;
    for (auto [u, v, w] : edges) {
        int ru = find(u), rv = find(v);
        if (ru == rv) continue;
        parent[rv] = ru; mst.push_back({u, v, w});
    }
    return mst;
}`,
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
    `static List<int[]> kruskal(int n, List<int[]> edges) {
    int[] parent = IntStream.range(0, n).toArray();
    java.util.function.IntUnaryOperator find = new java.util.function.IntUnaryOperator() {
        public int applyAsInt(int x) {
            return parent[x] == x ? x : (parent[x] = applyAsInt(parent[x]));
        }
    };
    edges.sort(Comparator.comparingInt(e -> e[2]));
    List<int[]> mst = new ArrayList<>();
    for (int[] e : edges) {
        int ru = find.applyAsInt(e[0]), rv = find.applyAsInt(e[1]);
        if (ru == rv) continue;
        parent[rv] = ru; mst.add(e);
    }
    return mst;
}`,
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
    `static List<(int u, int v, int w)> Kruskal(int n, List<(int u, int v, int w)> edges) {
    var parent = Enumerable.Range(0, n).ToArray();
    int Find(int x) => parent[x] == x ? x : parent[x] = Find(parent[x]);
    var mst = new List<(int, int, int)>();
    foreach (var (u, v, w) in edges.OrderBy(e => e.w)) {
        int ru = Find(u), rv = Find(v);
        if (ru == rv) continue;
        parent[rv] = ru; mst.Add((u, v, w));
    }
    return mst;
}`,
  ),

  "topo-kahn": snippets(
    `int topo_kahn(int n, int** adj, int* deg, int* order) {
    int indeg[128] = {0};
    for (int u = 0; u < n; u++)
        for (int i = 0; i < deg[u]; i++) indeg[adj[u][i]]++;
    int q[128], head = 0, tail = 0, k = 0;
    for (int i = 0; i < n; i++) if (!indeg[i]) q[tail++] = i;
    while (head < tail) {
        int u = q[head++]; order[k++] = u;
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (--indeg[v] == 0) q[tail++] = v;
        }
    }
    return k == n ? k : -1;
}`,
    `optional<vector<int>> topo_kahn(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> indeg(n), order;
    for (int u = 0; u < n; u++) for (int v : adj[u]) indeg[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    if ((int)order.size() != n) return nullopt;
    return order;
}`,
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
    `static List<Integer> topoKahn(List<List<Integer>> adj) {
    int n = adj.size();
    int[] indeg = new int[n];
    for (int u = 0; u < n; u++) for (int v : adj.get(u)) indeg[v]++;
    ArrayDeque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.removeFirst(); order.add(u);
        for (int v : adj.get(u)) if (--indeg[v] == 0) q.addLast(v);
    }
    return order.size() == n ? order : null;
}`,
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
    `static List<int>? TopoKahn(List<int>[] adj) {
    int n = adj.Length;
    var indeg = new int[n];
    for (int u = 0; u < n; u++) foreach (var v in adj[u]) indeg[v]++;
    var q = new Queue<int>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.Enqueue(i);
    var order = new List<int>();
    while (q.Count > 0) {
        int u = q.Dequeue(); order.Add(u);
        foreach (var v in adj[u]) if (--indeg[v] == 0) q.Enqueue(v);
    }
    return order.Count == n ? order : null;
}`,
  ),

  "topo-dfs": snippets(
    `int dfs(int u, int** adj, int* deg, int* color, int* order, int* oc) {
    color[u] = 1;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (color[v] == 1) return 0;
        if (color[v] == 0 && !dfs(v, adj, deg, color, order, oc)) return 0;
    }
    color[u] = 2; order[(*oc)++] = u;
    return 1;
}
int topo_dfs(int n, int** adj, int* deg, int* order) {
    int color[128] = {0}, oc = 0, tmp[128];
    for (int u = 0; u < n; u++)
        if (color[u] == 0 && !dfs(u, adj, deg, color, tmp, &oc)) return 0;
    for (int i = 0; i < n; i++) order[i] = tmp[n - 1 - i];
    return 1;
}`,
    `optional<vector<int>> topo_dfs(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n), order;
    function<bool(int)> dfs = [&](int u) {
        color[u] = 1;
        for (int v : adj[u]) {
            if (color[v] == 1) return false;
            if (color[v] == 0 && !dfs(v)) return false;
        }
        color[u] = 2; order.push_back(u);
        return true;
    };
    for (int u = 0; u < n; u++) if (color[u] == 0 && !dfs(u)) return nullopt;
    reverse(order.begin(), order.end());
    return order;
}`,
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
    `static List<Integer> topoDfs(List<List<Integer>> adj) {
    int n = adj.size();
    int[] color = new int[n];
    List<Integer> order = new ArrayList<>();
    class Rec {
        boolean dfs(int u) {
            color[u] = 1;
            for (int v : adj.get(u)) {
                if (color[v] == 1) return false;
                if (color[v] == 0 && !dfs(v)) return false;
            }
            color[u] = 2; order.add(u);
            return true;
        }
    }
    Rec r = new Rec();
    for (int u = 0; u < n; u++) if (color[u] == 0 && !r.dfs(u)) return null;
    Collections.reverse(order);
    return order;
}`,
    `function topoDfs(n, adj) {
  const color = Array(n).fill(0);
  const order = [];
  const dfs = (u) => {
    color[u] = 1;
    for (const v of adj[u]) {
      if (color[v] === 1) throw new Error("cycle");
      if (color[v] === 0) dfs(v);
    }
    color[u] = 2;
    order.push(u);
  };
  for (let u = 0; u < n; u++) if (color[u] === 0) dfs(u);
  return order.reverse();
}`,
    `static List<int> TopoDfs(List<int>[] adj) {
    int n = adj.Length;
    var color = new int[n];
    var order = new List<int>();
    bool Dfs(int u) {
        color[u] = 1;
        foreach (var v in adj[u]) {
            if (color[v] == 1) return false;
            if (color[v] == 0 && !Dfs(v)) return false;
        }
        color[u] = 2; order.Add(u);
        return true;
    }
    for (int u = 0; u < n; u++) if (color[u] == 0 && !Dfs(u))
        throw new InvalidOperationException("cycle");
    order.Reverse();
    return order;
}`,
  ),

  bipartite: snippets(
    `int is_bipartite(int n, int** adj, int* deg) {
    int color[128]; for (int i = 0; i < n; i++) color[i] = -1;
    int q[128];
    for (int s = 0; s < n; s++) {
        if (color[s] >= 0) continue;
        int head = 0, tail = 0;
        color[s] = 0; q[tail++] = s;
        while (head < tail) {
            int u = q[head++];
            for (int i = 0; i < deg[u]; i++) {
                int v = adj[u][i];
                if (color[v] < 0) { color[v] = 1 - color[u]; q[tail++] = v; }
                else if (color[v] == color[u]) return 0;
            }
        }
    }
    return 1;
}`,
    `bool is_bipartite(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n, -1);
    for (int s = 0; s < n; s++) {
        if (color[s] >= 0) continue;
        queue<int> q; color[s] = 0; q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) {
                if (color[v] < 0) { color[v] = 1 - color[u]; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
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
    `static boolean isBipartite(List<List<Integer>> adj) {
    int n = adj.size();
    int[] color = new int[n];
    Arrays.fill(color, -1);
    for (int s = 0; s < n; s++) {
        if (color[s] >= 0) continue;
        ArrayDeque<Integer> q = new ArrayDeque<>();
        color[s] = 0; q.add(s);
        while (!q.isEmpty()) {
            int u = q.removeFirst();
            for (int v : adj.get(u)) {
                if (color[v] < 0) { color[v] = 1 - color[u]; q.addLast(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
    `function isBipartite(n, adj) {
  const color = Array(n).fill(-1);
  for (let s = 0; s < n; s++) {
    if (color[s] >= 0) continue;
    color[s] = 0;
    const q = [s];
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) {
        if (color[v] < 0) { color[v] = 1 - color[u]; q.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}`,
    `static bool IsBipartite(List<int>[] adj) {
    int n = adj.Length;
    var color = Enumerable.Repeat(-1, n).ToArray();
    for (int s = 0; s < n; s++) {
        if (color[s] >= 0) continue;
        var q = new Queue<int>();
        color[s] = 0; q.Enqueue(s);
        while (q.Count > 0) {
            int u = q.Dequeue();
            foreach (var v in adj[u]) {
                if (color[v] < 0) { color[v] = 1 - color[u]; q.Enqueue(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
  ),

  bridges: snippets(
    `void dfs(int u, int** adj, int* deg, int* disc, int* low, int* parent,
         int* time, int bridges[][2], int* bc) {
    disc[u] = low[u] = (*time)++;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (v == parent[u]) continue;
        if (disc[v] < 0) {
            parent[v] = u; dfs(v, adj, deg, disc, low, parent, time, bridges, bc);
            if (low[v] < low[u]) low[u] = low[v];
            if (low[v] > disc[u]) { bridges[*bc][0] = u; bridges[(*bc)++][1] = v; }
        } else if (disc[v] < low[u]) low[u] = disc[v];
    }
}`,
    `vector<pair<int,int>> bridges(const vector<vector<int>>& adj) {
    int n = adj.size(), time = 0;
    vector<int> disc(n, -1), low(n), parent(n, -1);
    vector<pair<int,int>> out;
    function<void(int)> dfs = [&](int u) {
        disc[u] = low[u] = time++;
        for (int v : adj[u]) {
            if (v == parent[u]) continue;
            if (disc[v] < 0) {
                parent[v] = u; dfs(v);
                low[u] = min(low[u], low[v]);
                if (low[v] > disc[u]) out.push_back({u, v});
            } else low[u] = min(low[u], disc[v]);
        }
    };
    for (int u = 0; u < n; u++) if (disc[u] < 0) dfs(u);
    return out;
}`,
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
    `static List<int[]> bridges(List<List<Integer>> adj) {
    int n = adj.size();
    int[] disc = new int[n], low = new int[n], parent = new int[n];
    Arrays.fill(disc, -1); Arrays.fill(parent, -1);
    List<int[]> out = new ArrayList<>();
    int[] time = {0};
    class Rec {
        void dfs(int u) {
            disc[u] = low[u] = time[0]++;
            for (int v : adj.get(u)) {
                if (v == parent[u]) continue;
                if (disc[v] < 0) {
                    parent[v] = u; dfs(v);
                    low[u] = Math.min(low[u], low[v]);
                    if (low[v] > disc[u]) out.add(new int[]{u, v});
                } else low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
    Rec r = new Rec();
    for (int u = 0; u < n; u++) if (disc[u] < 0) r.dfs(u);
    return out;
}`,
    `function bridges(n, adj) {
  const disc = Array(n).fill(-1), low = Array(n).fill(-1), parent = Array(n).fill(-1);
  let time = 0; const out = [];
  const dfs = (u) => {
    disc[u] = low[u] = time++;
    for (const v of adj[u]) {
      if (v === parent[u]) continue;
      if (disc[v] < 0) {
        parent[v] = u; dfs(v);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) out.push([u, v]);
      } else low[u] = Math.min(low[u], disc[v]);
    }
  };
  for (let u = 0; u < n; u++) if (disc[u] < 0) dfs(u);
  return out;
}`,
    `static List<(int u, int v)> Bridges(List<int>[] adj) {
    int n = adj.Length, time = 0;
    var disc = Enumerable.Repeat(-1, n).ToArray();
    var low = new int[n];
    var parent = Enumerable.Repeat(-1, n).ToArray();
    var out = new List<(int, int)>();
    void Dfs(int u) {
        disc[u] = low[u] = time++;
        foreach (var v in adj[u]) {
            if (v == parent[u]) continue;
            if (disc[v] < 0) {
                parent[v] = u; Dfs(v);
                low[u] = Math.Min(low[u], low[v]);
                if (low[v] > disc[u]) out.Add((u, v));
            } else low[u] = Math.Min(low[u], disc[v]);
        }
    }
    for (int u = 0; u < n; u++) if (disc[u] < 0) Dfs(u);
    return out;
}`,
  ),

  articulation: snippets(
    `void dfs(int u, int** adj, int* deg, int* disc, int* low, int* parent,
         int* time, int* ap) {
    int children = 0;
    disc[u] = low[u] = (*time)++;
    for (int i = 0; i < deg[u]; i++) {
        int v = adj[u][i];
        if (v == parent[u]) continue;
        if (disc[v] < 0) {
            parent[v] = u; children++;
            dfs(v, adj, deg, disc, low, parent, time, ap);
            if (low[v] < low[u]) low[u] = low[v];
            if (parent[u] < 0 && children > 1) ap[u] = 1;
            if (parent[u] >= 0 && low[v] >= disc[u]) ap[u] = 1;
        } else if (disc[v] < low[u]) low[u] = disc[v];
    }
}`,
    `unordered_set<int> articulation_points(const vector<vector<int>>& adj) {
    int n = adj.size(), time = 0;
    vector<int> disc(n, -1), low(n), parent(n, -1);
    unordered_set<int> ap;
    function<void(int)> dfs = [&](int u) {
        int children = 0;
        disc[u] = low[u] = time++;
        for (int v : adj[u]) {
            if (v == parent[u]) continue;
            if (disc[v] < 0) {
                parent[v] = u; children++; dfs(v);
                low[u] = min(low[u], low[v]);
                if (parent[u] < 0 && children > 1) ap.insert(u);
                if (parent[u] >= 0 && low[v] >= disc[u]) ap.insert(u);
            } else low[u] = min(low[u], disc[v]);
        }
    };
    for (int u = 0; u < n; u++) if (disc[u] < 0) dfs(u);
    return ap;
}`,
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
    `static Set<Integer> articulationPoints(List<List<Integer>> adj) {
    int n = adj.size();
    int[] disc = new int[n], low = new int[n], parent = new int[n];
    Arrays.fill(disc, -1); Arrays.fill(parent, -1);
    Set<Integer> ap = new HashSet<>();
    int[] time = {0};
    class Rec {
        void dfs(int u) {
            int children = 0;
            disc[u] = low[u] = time[0]++;
            for (int v : adj.get(u)) {
                if (v == parent[u]) continue;
                if (disc[v] < 0) {
                    parent[v] = u; children++; dfs(v);
                    low[u] = Math.min(low[u], low[v]);
                    if (parent[u] < 0 && children > 1) ap.add(u);
                    if (parent[u] >= 0 && low[v] >= disc[u]) ap.add(u);
                } else low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
    Rec r = new Rec();
    for (int u = 0; u < n; u++) if (disc[u] < 0) r.dfs(u);
    return ap;
}`,
    `function articulationPoints(n, adj) {
  const disc = Array(n).fill(-1), low = Array(n).fill(-1), parent = Array(n).fill(-1);
  let time = 0; const ap = new Set();
  const dfs = (u) => {
    let children = 0;
    disc[u] = low[u] = time++;
    for (const v of adj[u]) {
      if (v === parent[u]) continue;
      if (disc[v] < 0) {
        parent[v] = u; children++; dfs(v);
        low[u] = Math.min(low[u], low[v]);
        if (parent[u] < 0 && children > 1) ap.add(u);
        if (parent[u] >= 0 && low[v] >= disc[u]) ap.add(u);
      } else low[u] = Math.min(low[u], disc[v]);
    }
  };
  for (let u = 0; u < n; u++) if (disc[u] < 0) dfs(u);
  return ap;
}`,
    `static HashSet<int> ArticulationPoints(List<int>[] adj) {
    int n = adj.Length, time = 0;
    var disc = Enumerable.Repeat(-1, n).ToArray();
    var low = new int[n];
    var parent = Enumerable.Repeat(-1, n).ToArray();
    var ap = new HashSet<int>();
    void Dfs(int u) {
        int children = 0;
        disc[u] = low[u] = time++;
        foreach (var v in adj[u]) {
            if (v == parent[u]) continue;
            if (disc[v] < 0) {
                parent[v] = u; children++; Dfs(v);
                low[u] = Math.Min(low[u], low[v]);
                if (parent[u] < 0 && children > 1) ap.Add(u);
                if (parent[u] >= 0 && low[v] >= disc[u]) ap.Add(u);
            } else low[u] = Math.Min(low[u], disc[v]);
        }
    }
    for (int u = 0; u < n; u++) if (disc[u] < 0) Dfs(u);
    return ap;
}`,
  ),

  degree: snippets(
    `void degrees(int n, int m, int edges[][2], int* deg) {
    for (int i = 0; i < n; i++) deg[i] = 0;
    for (int i = 0; i < m; i++) {
        deg[edges[i][0]]++; deg[edges[i][1]]++;
    }
}`,
    `vector<int> degrees(int n, const vector<pair<int,int>>& edges) {
    vector<int> deg(n);
    for (auto [u, v] : edges) { deg[u]++; deg[v]++; }
    return deg;
}`,
    `def degrees(n, edges):
    deg = [0]*n
    for u, v in edges:
        deg[u] += 1; deg[v] += 1
    return deg`,
    `static int[] degrees(int n, List<int[]> edges) {
    int[] deg = new int[n];
    for (int[] e : edges) { deg[e[0]]++; deg[e[1]]++; }
    return deg;
}`,
    `function degrees(n, edges) {
  const deg = Array(n).fill(0);
  for (const [u, v] of edges) { deg[u]++; deg[v]++; }
  return deg;
}`,
    `static int[] Degrees(int n, List<(int u, int v)> edges) {
    var deg = new int[n];
    foreach (var (u, v) in edges) { deg[u]++; deg[v]++; }
    return deg;
}`,
  ),

  "degree-io": snippets(
    `void degrees_io(int n, int m, int edges[][2], int* indeg, int* outdeg) {
    for (int i = 0; i < n; i++) { indeg[i] = 0; outdeg[i] = 0; }
    for (int i = 0; i < m; i++) {
        outdeg[edges[i][0]]++; indeg[edges[i][1]]++;
    }
}`,
    `pair<vector<int>,vector<int>> degrees_io(int n, const vector<pair<int,int>>& edges) {
    vector<int> indeg(n), outdeg(n);
    for (auto [u, v] : edges) { outdeg[u]++; indeg[v]++; }
    return {indeg, outdeg};
}`,
    `def degrees_io(n, edges):
    indeg = [0]*n; outdeg = [0]*n
    for u, v in edges:
        outdeg[u] += 1; indeg[v] += 1
    return indeg, outdeg`,
    `static int[][] degreesIO(int n, List<int[]> edges) {
    int[] indeg = new int[n], outdeg = new int[n];
    for (int[] e : edges) { outdeg[e[0]]++; indeg[e[1]]++; }
    return new int[][]{indeg, outdeg};
}`,
    `function degreesIO(n, edges) {
  const indeg = Array(n).fill(0), outdeg = Array(n).fill(0);
  for (const [u, v] of edges) { outdeg[u]++; indeg[v]++; }
  return { indeg, outdeg };
}`,
    `static (int[] indeg, int[] outdeg) DegreesIO(int n, List<(int u, int v)> edges) {
    var indeg = new int[n]; var outdeg = new int[n];
    foreach (var (u, v) in edges) { outdeg[u]++; indeg[v]++; }
    return (indeg, outdeg);
}`,
  ),

  coloring: snippets(
    `void greedy_color(int n, int** adj, int* deg, int* color) {
    for (int u = 0; u < n; u++) {
        int used[128] = {0};
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (color[v] >= 0) used[color[v]] = 1;
        }
        int c = 0; while (used[c]) c++;
        color[u] = c;
    }
}`,
    `vector<int> greedy_color(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n, -1);
    for (int u = 0; u < n; u++) {
        vector<char> used(n);
        for (int v : adj[u]) if (color[v] >= 0) used[color[v]] = 1;
        int c = 0; while (used[c]) c++;
        color[u] = c;
    }
    return color;
}`,
    `def greedy_color(n, adj):
    color = [-1]*n
    for u in range(n):
        used = {color[v] for v in adj[u] if color[v] >= 0}
        c = 0
        while c in used: c += 1
        color[u] = c
    return color`,
    `static int[] greedyColor(List<List<Integer>> adj) {
    int n = adj.size();
    int[] color = new int[n];
    Arrays.fill(color, -1);
    for (int u = 0; u < n; u++) {
        boolean[] used = new boolean[n];
        for (int v : adj.get(u)) if (color[v] >= 0) used[color[v]] = true;
        int c = 0; while (used[c]) c++;
        color[u] = c;
    }
    return color;
}`,
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
    `static int[] GreedyColor(List<int>[] adj) {
    int n = adj.Length;
    var color = Enumerable.Repeat(-1, n).ToArray();
    for (int u = 0; u < n; u++) {
        var used = new HashSet<int>();
        foreach (var v in adj[u]) if (color[v] >= 0) used.Add(color[v]);
        int c = 0; while (used.Contains(c)) c++;
        color[u] = c;
    }
    return color;
}`,
  ),
};
