import { snippets, type CodeSnippets } from "@/lib/code/languages";
import type { BacktrackingAlgoId } from "./types";

export const BACKTRACKING_CODE: Record<BacktrackingAlgoId, CodeSnippets> = {
  permutations: snippets(
    `void permute(int* a, int n, int* path, int d, int* used) {
    if (d == n) { /* record path */ return; }
    for (int i = 0; i < n; i++) {
        if (used[i]) continue;
        used[i] = 1; path[d] = a[i];
        permute(a, n, path, d + 1, used);
        used[i] = 0;
    }
}`,
    `#include <vector>
using namespace std;

void permute(vector<int>& a, vector<int>& path, vector<int>& used, vector<vector<int>>& out) {
    if ((int)path.size() == (int)a.size()) { out.push_back(path); return; }
    for (int i = 0; i < (int)a.size(); i++) {
        if (used[i]) continue;
        used[i] = 1; path.push_back(a[i]);
        permute(a, path, used, out);
        path.pop_back(); used[i] = 0;
    }
}`,
    `def permute(a: list[int]) -> list[list[int]]:
    out, path, used = [], [], [False] * len(a)
    def dfs():
        if len(path) == len(a):
            out.append(path[:])
            return
        for i, x in enumerate(a):
            if used[i]:
                continue
            used[i] = True
            path.append(x)
            dfs()
            path.pop()
            used[i] = False
    dfs()
    return out`,
    `static void permute(int[] a, List<Integer> path, boolean[] used, List<List<Integer>> out) {
    if (path.size() == a.length) { out.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < a.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(a[i]);
        permute(a, path, used, out);
        path.remove(path.size() - 1); used[i] = false;
    }
}`,
    `function permute(a) {
  const out = [], path = [], used = Array(a.length).fill(false);
  function dfs() {
    if (path.length === a.length) { out.push(path.slice()); return; }
    for (let i = 0; i < a.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(a[i]);
      dfs();
      path.pop(); used[i] = false;
    }
  }
  dfs();
  return out;
}`,
    `static void Permute(int[] a, List<int> path, bool[] used, List<IList<int>> output) {
    if (path.Count == a.Length) { output.Add(path.ToList()); return; }
    for (int i = 0; i < a.Length; i++) {
        if (used[i]) continue;
        used[i] = true; path.Add(a[i]);
        Permute(a, path, used, output);
        path.RemoveAt(path.Count - 1); used[i] = false;
    }
}`,
  ),

  combinations: snippets(
    `void combine(int n, int k, int start, int* path, int d) {
    if (d == k) { /* record */ return; }
    for (int i = start; i <= n; i++) {
        path[d] = i;
        combine(n, k, i + 1, path, d + 1);
    }
}`,
    `#include <vector>
using namespace std;

void combine(int n, int k, int start, vector<int>& path, vector<vector<int>>& out) {
    if ((int)path.size() == k) { out.push_back(path); return; }
    for (int i = start; i <= n; i++) {
        path.push_back(i);
        combine(n, k, i + 1, path, out);
        path.pop_back();
    }
}`,
    `def combine(n: int, k: int) -> list[list[int]]:
    out, path = [], []
    def dfs(start: int):
        if len(path) == k:
            out.append(path[:])
            return
        for i in range(start, n + 1):
            if n - i + 1 < k - len(path):
                break
            path.append(i)
            dfs(i + 1)
            path.pop()
    dfs(1)
    return out`,
    `static void combine(int n, int k, int start, List<Integer> path, List<List<Integer>> out) {
    if (path.size() == k) { out.add(new ArrayList<>(path)); return; }
    for (int i = start; i <= n; i++) {
        path.add(i);
        combine(n, k, i + 1, path, out);
        path.remove(path.size() - 1);
    }
}`,
    `function combine(n, k) {
  const out = [], path = [];
  function dfs(start) {
    if (path.length === k) { out.push(path.slice()); return; }
    for (let i = start; i <= n; i++) {
      if (n - i + 1 < k - path.length) break;
      path.push(i);
      dfs(i + 1);
      path.pop();
    }
  }
  dfs(1);
  return out;
}`,
    `static void Combine(int n, int k, int start, List<int> path, List<IList<int>> output) {
    if (path.Count == k) { output.Add(path.ToList()); return; }
    for (int i = start; i <= n; i++) {
        path.Add(i);
        Combine(n, k, i + 1, path, output);
        path.RemoveAt(path.Count - 1);
    }
}`,
  ),

  subsets: snippets(
    `void subsets(int* a, int n, int i, int* path, int d) {
    if (i == n) { /* record path[0..d) */ return; }
    subsets(a, n, i + 1, path, d);          /* skip */
    path[d] = a[i];
    subsets(a, n, i + 1, path, d + 1);      /* take */
}`,
    `#include <vector>
using namespace std;

void subsets(const vector<int>& a, int i, vector<int>& path, vector<vector<int>>& out) {
    if (i == (int)a.size()) { out.push_back(path); return; }
    subsets(a, i + 1, path, out);
    path.push_back(a[i]);
    subsets(a, i + 1, path, out);
    path.pop_back();
}`,
    `def subsets(a: list[int]) -> list[list[int]]:
    out, path = [], []
    def dfs(i: int):
        if i == len(a):
            out.append(path[:])
            return
        dfs(i + 1)          # skip
        path.append(a[i])
        dfs(i + 1)          # take
        path.pop()
    dfs(0)
    return out`,
    `static void subsets(int[] a, int i, List<Integer> path, List<List<Integer>> out) {
    if (i == a.length) { out.add(new ArrayList<>(path)); return; }
    subsets(a, i + 1, path, out);
    path.add(a[i]);
    subsets(a, i + 1, path, out);
    path.remove(path.size() - 1);
}`,
    `function subsets(a) {
  const out = [], path = [];
  function dfs(i) {
    if (i === a.length) { out.push(path.slice()); return; }
    dfs(i + 1);
    path.push(a[i]);
    dfs(i + 1);
    path.pop();
  }
  dfs(0);
  return out;
}`,
    `static void Subsets(int[] a, int i, List<int> path, List<IList<int>> output) {
    if (i == a.Length) { output.Add(path.ToList()); return; }
    Subsets(a, i + 1, path, output);
    path.Add(a[i]);
    Subsets(a, i + 1, path, output);
    path.RemoveAt(path.Count - 1);
}`,
  ),

  "combination-sum": snippets(
    `void combo_sum(int* a, int n, int start, int remain, int* path, int d) {
    if (remain == 0) { /* record */ return; }
    for (int i = start; i < n; i++) {
        if (a[i] > remain) break;
        path[d] = a[i];
        combo_sum(a, n, i, remain - a[i], path, d + 1);
    }
}`,
    `#include <vector>
using namespace std;

void combinationSum(vector<int>& a, int start, int remain, vector<int>& path, vector<vector<int>>& out) {
    if (remain == 0) { out.push_back(path); return; }
    for (int i = start; i < (int)a.size(); i++) {
        if (a[i] > remain) break;
        path.push_back(a[i]);
        combinationSum(a, i, remain - a[i], path, out);
        path.pop_back();
    }
}`,
    `def combination_sum(a: list[int], target: int) -> list[list[int]]:
    a = sorted(a)
    out, path = [], []
    def dfs(start: int, remain: int):
        if remain == 0:
            out.append(path[:])
            return
        for i in range(start, len(a)):
            if a[i] > remain:
                break
            path.append(a[i])
            dfs(i, remain - a[i])  # reuse allowed
            path.pop()
    dfs(0, target)
    return out`,
    `static void combinationSum(int[] a, int start, int remain, List<Integer> path, List<List<Integer>> out) {
    if (remain == 0) { out.add(new ArrayList<>(path)); return; }
    for (int i = start; i < a.length; i++) {
        if (a[i] > remain) break;
        path.add(a[i]);
        combinationSum(a, i, remain - a[i], path, out);
        path.remove(path.size() - 1);
    }
}`,
    `function combinationSum(a, target) {
  a = [...a].sort((x, y) => x - y);
  const out = [], path = [];
  function dfs(start, remain) {
    if (remain === 0) { out.push(path.slice()); return; }
    for (let i = start; i < a.length; i++) {
      if (a[i] > remain) break;
      path.push(a[i]);
      dfs(i, remain - a[i]);
      path.pop();
    }
  }
  dfs(0, target);
  return out;
}`,
    `static void CombinationSum(int[] a, int start, int remain, List<int> path, List<IList<int>> output) {
    if (remain == 0) { output.Add(path.ToList()); return; }
    for (int i = start; i < a.Length; i++) {
        if (a[i] > remain) break;
        path.Add(a[i]);
        CombinationSum(a, i, remain - a[i], path, output);
        path.RemoveAt(path.Count - 1);
    }
}`,
  ),

  "n-queens": snippets(
    `int nqueens(int n, int row, int* cols, int* col, int* d1, int* d2) {
    if (row == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row+c] || d2[row-c+n]) continue;
        cols[row]=c; col[c]=d1[row+c]=d2[row-c+n]=1;
        count += nqueens(n, row+1, cols, col, d1, d2);
        col[c]=d1[row+c]=d2[row-c+n]=0;
    }
    return count;
}`,
    `#include <vector>
using namespace std;
int nQueens(int n, int row, vector<int>& cols, vector<int>& col, vector<int>& d1, vector<int>& d2) {
    if (row == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row+c] || d2[row-c+n]) continue;
        cols[row]=c; col[c]=d1[row+c]=d2[row-c+n]=1;
        count += nQueens(n, row+1, cols, col, d1, d2);
        col[c]=d1[row+c]=d2[row-c+n]=0;
    }
    return count;
}`,
    `def n_queens(n: int) -> list[list[int]]:
    cols, col, d1, d2 = [-1]*n, [False]*n, [False]*(2*n), [False]*(2*n)
    out = []
    def dfs(row: int):
        if row == n:
            out.append(cols[:]); return
        for c in range(n):
            if col[c] or d1[row+c] or d2[row-c+n]: continue
            cols[row]=c; col[c]=d1[row+c]=d2[row-c+n]=True
            dfs(row+1)
            col[c]=d1[row+c]=d2[row-c+n]=False
    dfs(0)
    return out`,
    `static int nQueens(int n, int row, int[] cols, boolean[] col, boolean[] d1, boolean[] d2) {
    if (row == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row+c] || d2[row-c+n]) continue;
        cols[row]=c; col[c]=d1[row+c]=d2[row-c+n]=true;
        count += nQueens(n, row+1, cols, col, d1, d2);
        col[c]=d1[row+c]=d2[row-c+n]=false;
    }
    return count;
}`,
    `function nQueens(n) {
  const cols = Array(n).fill(-1), col = Array(n).fill(false);
  const d1 = Array(2*n).fill(false), d2 = Array(2*n).fill(false), out = [];
  function dfs(row) {
    if (row === n) { out.push(cols.slice()); return; }
    for (let c = 0; c < n; c++) {
      if (col[c] || d1[row+c] || d2[row-c+n]) continue;
      cols[row]=c; col[c]=d1[row+c]=d2[row-c+n]=true;
      dfs(row+1);
      col[c]=d1[row+c]=d2[row-c+n]=false;
    }
  }
  dfs(0);
  return out;
}`,
    `static int NQueens(int n, int row, int[] cols, bool[] col, bool[] d1, bool[] d2) {
    if (row == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[row+c] || d2[row-c+n]) continue;
        cols[row]=c; col[c]=d1[row+c]=d2[row-c+n]=true;
        count += NQueens(n, row+1, cols, col, d1, d2);
        col[c]=d1[row+c]=d2[row-c+n]=false;
    }
    return count;
}`,
  ),

  sudoku: snippets(
    `int solve(char** b, int n) {
    for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (b[r][c] == '.') {
        for (char ch = '1'; ch <= '0'+n; ch++) if (ok(b,n,r,c,ch)) {
            b[r][c] = ch; if (solve(b,n)) return 1; b[r][c] = '.';
        }
        return 0;
    }
    return 1;
}`,
    `bool solve(vector<vector<char>>& b) {
    int n = (int)b.size();
    for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (b[r][c] == '.') {
        for (char ch = '1'; ch <= char('0'+n); ch++) if (ok(b,r,c,ch)) {
            b[r][c] = ch; if (solve(b)) return true; b[r][c] = '.';
        }
        return false;
    }
    return true;
}`,
    `def solve(board: list[list[str]]) -> bool:
    n = len(board)
    for r in range(n):
        for c in range(n):
            if board[r][c] != ".": continue
            for d in range(1, n + 1):
                ch = str(d)
                if ok(board, r, c, ch):
                    board[r][c] = ch
                    if solve(board): return True
                    board[r][c] = "."
            return False
    return True`,
    `static boolean solve(char[][] b) {
    int n = b.length;
    for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (b[r][c] == '.') {
        for (char ch = '1'; ch <= (char)('0'+n); ch++) if (ok(b,r,c,ch)) {
            b[r][c] = ch; if (solve(b)) return true; b[r][c] = '.';
        }
        return false;
    }
    return true;
}`,
    `function solve(b) {
  const n = b.length;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (b[r][c] === ".") {
    for (let d = 1; d <= n; d++) {
      const ch = String(d);
      if (!ok(b, r, c, ch)) continue;
      b[r][c] = ch;
      if (solve(b)) return true;
      b[r][c] = ".";
    }
    return false;
  }
  return true;
}`,
    `static bool Solve(char[][] b) {
    int n = b.Length;
    for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (b[r][c] == '.') {
        for (char ch = '1'; ch <= (char)('0'+n); ch++) if (Ok(b,r,c,ch)) {
            b[r][c] = ch; if (Solve(b)) return true; b[r][c] = '.';
        }
        return false;
    }
    return true;
}`,
  ),

  "graph-coloring": snippets(
    `int color_graph(int u, int n, int k, int* color, int** adj) {
    if (u == n) return 1;
    for (int c = 0; c < k; c++) {
        if (!safe(u, c, color, adj, n)) continue;
        color[u] = c;
        if (color_graph(u+1, n, k, color, adj)) return 1;
        color[u] = -1;
    }
    return 0;
}`,
    `bool colorGraph(int u, int n, int k, vector<int>& color, const vector<vector<int>>& adj) {
    if (u == n) return true;
    for (int c = 0; c < k; c++) {
        if (!safe(u, c, color, adj)) continue;
        color[u] = c;
        if (colorGraph(u+1, n, k, color, adj)) return true;
        color[u] = -1;
    }
    return false;
}`,
    `def color_graph(adj: list[list[int]], k: int) -> list[int] | None:
    n, color = len(adj), [-1] * len(adj)
    def dfs(u: int) -> bool:
        if u == n: return True
        for c in range(k):
            if any(color[v] == c for v in adj[u]): continue
            color[u] = c
            if dfs(u + 1): return True
            color[u] = -1
        return False
    return color if dfs(0) else None`,
    `static boolean colorGraph(int u, int n, int k, int[] color, List<Integer>[] adj) {
    if (u == n) return true;
    for (int c = 0; c < k; c++) {
        if (!safe(u, c, color, adj)) continue;
        color[u] = c;
        if (colorGraph(u+1, n, k, color, adj)) return true;
        color[u] = -1;
    }
    return false;
}`,
    `function colorGraph(adj, k) {
  const n = adj.length, color = Array(n).fill(-1);
  function dfs(u) {
    if (u === n) return true;
    for (let c = 0; c < k; c++) {
      if (adj[u].some((v) => color[v] === c)) continue;
      color[u] = c;
      if (dfs(u + 1)) return true;
      color[u] = -1;
    }
    return false;
  }
  return dfs(0) ? color : null;
}`,
    `static bool ColorGraph(int u, int n, int k, int[] color, List<int>[] adj) {
    if (u == n) return true;
    for (int c = 0; c < k; c++) {
        if (!Safe(u, c, color, adj)) continue;
        color[u] = c;
        if (ColorGraph(u+1, n, k, color, adj)) return true;
        color[u] = -1;
    }
    return false;
}`,
  ),

  crossword: snippets(
    `int fill(int si, Slot* slots, int ns, char** words, int* used) {
    if (si == ns) return 1;
    for (int wi = 0; wi < nwords; wi++) {
        if (used[wi] || !fits(slots[si], words[wi])) continue;
        used[wi] = 1; place(slots[si], words[wi]);
        if (fill(si+1, slots, ns, words, used)) return 1;
        unplace(slots[si]); used[wi] = 0;
    }
    return 0;
}`,
    `bool fill(int si, vector<Slot>& slots, vector<string>& words, vector<int>& used) {
    if (si == (int)slots.size()) return true;
    for (int wi = 0; wi < (int)words.size(); wi++) {
        if (used[wi] || !fits(slots[si], words[wi])) continue;
        used[wi] = 1; place(slots[si], words[wi]);
        if (fill(si+1, slots, words, used)) return true;
        unplace(slots[si]); used[wi] = 0;
    }
    return false;
}`,
    `def fill(slots, words):
    used = [False] * len(words)
    def dfs(si: int) -> bool:
        if si == len(slots): return True
        for wi, word in enumerate(words):
            if used[wi] or not fits(slots[si], word): continue
            used[wi] = True
            wrote = place(slots[si], word)
            if dfs(si + 1): return True
            unplace(slots[si], wrote)
            used[wi] = False
        return False
    return dfs(0)`,
    `static boolean fill(int si, List<Slot> slots, List<String> words, boolean[] used) {
    if (si == slots.size()) return true;
    for (int wi = 0; wi < words.size(); wi++) {
        if (used[wi] || !fits(slots.get(si), words.get(wi))) continue;
        used[wi] = true; place(slots.get(si), words.get(wi));
        if (fill(si+1, slots, words, used)) return true;
        unplace(slots.get(si)); used[wi] = false;
    }
    return false;
}`,
    `function fill(slots, words) {
  const used = Array(words.length).fill(false);
  function dfs(si) {
    if (si === slots.length) return true;
    for (let wi = 0; wi < words.length; wi++) {
      if (used[wi] || !fits(slots[si], words[wi])) continue;
      used[wi] = true;
      const wrote = place(slots[si], words[wi]);
      if (dfs(si + 1)) return true;
      unplace(slots[si], wrote);
      used[wi] = false;
    }
    return false;
  }
  return dfs(0);
}`,
    `static bool Fill(int si, List<Slot> slots, List<string> words, bool[] used) {
    if (si == slots.Count) return true;
    for (int wi = 0; wi < words.Count; wi++) {
        if (used[wi] || !Fits(slots[si], words[wi])) continue;
        used[wi] = true; Place(slots[si], words[wi]);
        if (Fill(si+1, slots, words, used)) return true;
        Unplace(slots[si]); used[wi] = false;
    }
    return false;
}`,
  ),
};
