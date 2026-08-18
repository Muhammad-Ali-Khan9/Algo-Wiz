import { snippets } from "@/lib/code/languages";
import type { DpAlgoId } from "./types";
import type { CodeSnippets } from "@/lib/code/languages";

export const DP_CODE: Record<DpAlgoId, CodeSnippets> = {
  fibonacci: snippets(
    `long long fib(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long long c = a + b;
        a = b; b = c;
    }
    return b;
}

/* table form */
void fib_dp(int n, long long* dp) {
    dp[0] = 0;
    if (n >= 1) dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
}`,
    `#include <vector>
using namespace std;

long long fib(int n) {
    if (n <= 1) return n;
    vector<long long> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
    `def fib(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]


def fib_rolling(n: int) -> int:
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
    `static long fib(int n) {
    if (n <= 1) return n;
    long[] dp = new long[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
    `function fib(n) {
  if (n <= 1) return n;
  const dp = Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}

function fibRolling(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
    `static long Fib(int n) {
    if (n <= 1) return n;
    var dp = new long[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
  ),

  "climbing-stairs": snippets(
    `int climb_stairs(int n) {
    if (n <= 1) return 1;
    int* dp = (int*)calloc(n + 1, sizeof(int));
    dp[0] = 1; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    int ans = dp[n];
    free(dp);
    return ans;
}`,
    `int climbStairs(int n) {
    if (n <= 1) return 1;
    vector<int> dp(n + 1);
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}`,
    `def climb_stairs(n: int) -> int:
    if n <= 1:
        return 1
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
    `static int climbStairs(int n) {
    if (n <= 1) return 1;
    int[] dp = new int[n + 1];
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
    `function climbStairs(n) {
  if (n <= 1) return 1;
  const dp = Array(n + 1).fill(0);
  dp[0] = dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}`,
    `static int ClimbStairs(int n) {
    if (n <= 1) return 1;
    var dp = new int[n + 1];
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}`,
  ),

  "house-robber": snippets(
    `int rob(int* nums, int n) {
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    int* dp = (int*)malloc(n * sizeof(int));
    dp[0] = nums[0];
    dp[1] = nums[0] > nums[1] ? nums[0] : nums[1];
    for (int i = 2; i < n; i++) {
        int take = dp[i-2] + nums[i];
        dp[i] = take > dp[i-1] ? take : dp[i-1];
    }
    int ans = dp[n-1];
    free(dp);
    return ans;
}`,
    `int rob(const vector<int>& nums) {
    int n = (int)nums.size();
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}`,
    `def rob(nums: list[int]) -> int:
    n = len(nums)
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
    return dp[-1]`,
    `static int rob(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    return dp[n - 1];
}`,
    `function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  const dp = Array(n).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n; i++)
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  return dp[n - 1];
}`,
    `static int Rob(int[] nums) {
    int n = nums.Length;
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    var dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.Max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = Math.Max(dp[i - 1], dp[i - 2] + nums[i]);
    return dp[n - 1];
}`,
  ),

  "coin-change": snippets(
    `int coin_change(int* coins, int m, int amount) {
    int INF = amount + 1;
    int* dp = (int*)malloc((amount + 1) * sizeof(int));
    for (int i = 0; i <= amount; i++) dp[i] = INF;
    dp[0] = 0;
    for (int x = 1; x <= amount; x++) {
        for (int j = 0; j < m; j++) {
            int c = coins[j];
            if (x >= c && dp[x - c] + 1 < dp[x])
                dp[x] = dp[x - c] + 1;
        }
    }
    int ans = dp[amount] >= INF ? -1 : dp[amount];
    free(dp);
    return ans;
}`,
    `int coinChange(vector<int>& coins, int amount) {
    const int INF = amount + 1;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (x >= c) dp[x] = min(dp[x], dp[x - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}`,
    `def coin_change(coins: list[int], amount: int) -> int:
    INF = amount + 1
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for x in range(1, amount + 1):
        for c in coins:
            if x >= c:
                dp[x] = min(dp[x], dp[x - c] + 1)
    return -1 if dp[amount] >= INF else dp[amount]`,
    `static int coinChange(int[] coins, int amount) {
    int INF = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (x >= c) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}`,
    `function coinChange(coins, amount) {
  const INF = amount + 1;
  const dp = Array(amount + 1).fill(INF);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (x >= c) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    }
  }
  return dp[amount] >= INF ? -1 : dp[amount];
}`,
    `static int CoinChange(int[] coins, int amount) {
    int INF = amount + 1;
    var dp = Enumerable.Repeat(INF, amount + 1).ToArray();
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        foreach (var c in coins)
            if (x >= c) dp[x] = Math.Min(dp[x], dp[x - c] + 1);
    return dp[amount] >= INF ? -1 : dp[amount];
}`,
  ),

  "unique-paths": snippets(
    `int unique_paths(int m, int n) {
    int dp[64][64];
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
    return dp[m-1][n-1];
}`,
    `int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
    return dp[m-1][n-1];
}`,
    `def unique_paths(m: int, n: int) -> int:
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    return dp[-1][-1]`,
    `static int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    return dp[m - 1][n - 1];
}`,
    `function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => Array(n).fill(1));
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
  return dp[m - 1][n - 1];
}`,
    `static int UniquePaths(int m, int n) {
    var dp = new int[m, n];
    for (int i = 0; i < m; i++) dp[i, 0] = 1;
    for (int j = 0; j < n; j++) dp[0, j] = 1;
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i, j] = dp[i - 1, j] + dp[i, j - 1];
    return dp[m - 1, n - 1];
}`,
  ),

  "min-path-sum": snippets(
    `int min_path_sum(int** grid, int m, int n) {
    int dp[64][64];
    dp[0][0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++) {
            int best = dp[i-1][j] < dp[i][j-1] ? dp[i-1][j] : dp[i][j-1];
            dp[i][j] = grid[i][j] + best;
        }
    return dp[m-1][n-1];
}`,
    `int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp = grid;
    for (int j = 1; j < n; j++) dp[0][j] += dp[0][j-1];
    for (int i = 1; i < m; i++) dp[i][0] += dp[i-1][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] += min(dp[i-1][j], dp[i][j-1]);
    return dp[m-1][n-1];
}`,
    `def min_path_sum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [row[:] for row in grid]
    for j in range(1, n):
        dp[0][j] += dp[0][j - 1]
    for i in range(1, m):
        dp[i][0] += dp[i - 1][0]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] += min(dp[i - 1][j], dp[i][j - 1])
    return dp[-1][-1]`,
    `static int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++)
        System.arraycopy(grid[i], 0, dp[i], 0, n);
    for (int j = 1; j < n; j++) dp[0][j] += dp[0][j - 1];
    for (int i = 1; i < m; i++) dp[i][0] += dp[i - 1][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] += Math.min(dp[i - 1][j], dp[i][j - 1]);
    return dp[m - 1][n - 1];
}`,
    `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = grid.map((row) => row.slice());
  for (let j = 1; j < n; j++) dp[0][j] += dp[0][j - 1];
  for (let i = 1; i < m; i++) dp[i][0] += dp[i - 1][0];
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      dp[i][j] += Math.min(dp[i - 1][j], dp[i][j - 1]);
  return dp[m - 1][n - 1];
}`,
    `static int MinPathSum(int[][] grid) {
    int m = grid.Length, n = grid[0].Length;
    var dp = grid.Select(r => (int[])r.Clone()).ToArray();
    for (int j = 1; j < n; j++) dp[0][j] += dp[0][j - 1];
    for (int i = 1; i < m; i++) dp[i][0] += dp[i - 1][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] += Math.Min(dp[i - 1][j], dp[i][j - 1]);
    return dp[m - 1][n - 1];
}`,
  ),

  "dungeon-game": snippets(
    `int calculate_minimum_hp(int** dungeon, int m, int n) {
    int dp[64][64];
    dp[m-1][n-1] = dungeon[m-1][n-1] > 0 ? 1 : 1 - dungeon[m-1][n-1];
    for (int i = m - 2; i >= 0; i--) {
        int need = dp[i+1][n-1] - dungeon[i][n-1];
        dp[i][n-1] = need > 1 ? need : 1;
    }
    for (int j = n - 2; j >= 0; j--) {
        int need = dp[m-1][j+1] - dungeon[m-1][j];
        dp[m-1][j] = need > 1 ? need : 1;
    }
    for (int i = m - 2; i >= 0; i--)
        for (int j = n - 2; j >= 0; j--) {
            int best = dp[i+1][j] < dp[i][j+1] ? dp[i+1][j] : dp[i][j+1];
            int need = best - dungeon[i][j];
            dp[i][j] = need > 1 ? need : 1;
        }
    return dp[0][0];
}`,
    `int calculateMinimumHP(vector<vector<int>>& dungeon) {
    int m = dungeon.size(), n = dungeon[0].size();
    vector<vector<int>> dp(m, vector<int>(n));
    dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1]);
    for (int i = m - 2; i >= 0; i--)
        dp[i][n-1] = max(1, dp[i+1][n-1] - dungeon[i][n-1]);
    for (int j = n - 2; j >= 0; j--)
        dp[m-1][j] = max(1, dp[m-1][j+1] - dungeon[m-1][j]);
    for (int i = m - 2; i >= 0; i--)
        for (int j = n - 2; j >= 0; j--) {
            int best = min(dp[i+1][j], dp[i][j+1]);
            dp[i][j] = max(1, best - dungeon[i][j]);
        }
    return dp[0][0];
}`,
    `def calculate_minimum_hp(dungeon: list[list[int]]) -> int:
    m, n = len(dungeon), len(dungeon[0])
    dp = [[0] * n for _ in range(m)]
    dp[-1][-1] = max(1, 1 - dungeon[-1][-1])
    for i in range(m - 2, -1, -1):
        dp[i][-1] = max(1, dp[i + 1][-1] - dungeon[i][-1])
    for j in range(n - 2, -1, -1):
        dp[-1][j] = max(1, dp[-1][j + 1] - dungeon[-1][j])
    for i in range(m - 2, -1, -1):
        for j in range(n - 2, -1, -1):
            best = min(dp[i + 1][j], dp[i][j + 1])
            dp[i][j] = max(1, best - dungeon[i][j])
    return dp[0][0]`,
    `static int calculateMinimumHP(int[][] dungeon) {
    int m = dungeon.length, n = dungeon[0].length;
    int[][] dp = new int[m][n];
    dp[m - 1][n - 1] = Math.max(1, 1 - dungeon[m - 1][n - 1]);
    for (int i = m - 2; i >= 0; i--)
        dp[i][n - 1] = Math.max(1, dp[i + 1][n - 1] - dungeon[i][n - 1]);
    for (int j = n - 2; j >= 0; j--)
        dp[m - 1][j] = Math.max(1, dp[m - 1][j + 1] - dungeon[m - 1][j]);
    for (int i = m - 2; i >= 0; i--)
        for (int j = n - 2; j >= 0; j--) {
            int best = Math.min(dp[i + 1][j], dp[i][j + 1]);
            dp[i][j] = Math.max(1, best - dungeon[i][j]);
        }
    return dp[0][0];
}`,
    `function calculateMinimumHP(dungeon) {
  const m = dungeon.length, n = dungeon[0].length;
  const dp = Array.from({ length: m }, () => Array(n).fill(0));
  dp[m - 1][n - 1] = Math.max(1, 1 - dungeon[m - 1][n - 1]);
  for (let i = m - 2; i >= 0; i--)
    dp[i][n - 1] = Math.max(1, dp[i + 1][n - 1] - dungeon[i][n - 1]);
  for (let j = n - 2; j >= 0; j--)
    dp[m - 1][j] = Math.max(1, dp[m - 1][j + 1] - dungeon[m - 1][j]);
  for (let i = m - 2; i >= 0; i--)
    for (let j = n - 2; j >= 0; j--) {
      const best = Math.min(dp[i + 1][j], dp[i][j + 1]);
      dp[i][j] = Math.max(1, best - dungeon[i][j]);
    }
  return dp[0][0];
}`,
    `static int CalculateMinimumHP(int[][] dungeon) {
    int m = dungeon.Length, n = dungeon[0].Length;
    var dp = new int[m, n];
    dp[m - 1, n - 1] = Math.Max(1, 1 - dungeon[m - 1][n - 1]);
    for (int i = m - 2; i >= 0; i--)
        dp[i, n - 1] = Math.Max(1, dp[i + 1, n - 1] - dungeon[i][n - 1]);
    for (int j = n - 2; j >= 0; j--)
        dp[m - 1, j] = Math.Max(1, dp[m - 1, j + 1] - dungeon[m - 1][j]);
    for (int i = m - 2; i >= 0; i--)
        for (int j = n - 2; j >= 0; j--) {
            int best = Math.Min(dp[i + 1, j], dp[i, j + 1]);
            dp[i, j] = Math.Max(1, best - dungeon[i][j]);
        }
    return dp[0, 0];
}`,
  ),

  "knapsack-01": snippets(
    `int knapsack01(int* wt, int* val, int n, int W) {
    int dp[64][128];
    for (int w = 0; w <= W; w++) dp[0][w] = 0;
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (w >= wt[i-1]) {
                int take = dp[i-1][w - wt[i-1]] + val[i-1];
                if (take > dp[i][w]) dp[i][w] = take;
            }
        }
    }
    return dp[n][W];
}`,
    `int knapsack01(const vector<int>& wt, const vector<int>& val, int W) {
    int n = (int)wt.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (w >= wt[i-1])
                dp[i][w] = max(dp[i][w], dp[i-1][w - wt[i-1]] + val[i-1]);
        }
    return dp[n][W];
}`,
    `def knapsack_01(wt: list[int], val: list[int], W: int) -> int:
    n = len(wt)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i - 1][w]
            if w >= wt[i - 1]:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - wt[i - 1]] + val[i - 1])
    return dp[n][W]`,
    `static int knapsack01(int[] wt, int[] val, int W) {
    int n = wt.length;
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];
            if (w >= wt[i - 1])
                dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - wt[i - 1]] + val[i - 1]);
        }
    return dp[n][W];
}`,
    `function knapsack01(wt, val, W) {
  const n = wt.length;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w];
      if (w >= wt[i - 1])
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - wt[i - 1]] + val[i - 1]);
    }
  }
  return dp[n][W];
}`,
    `static int Knapsack01(int[] wt, int[] val, int W) {
    int n = wt.Length;
    var dp = new int[n + 1, W + 1];
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= W; w++) {
            dp[i, w] = dp[i - 1, w];
            if (w >= wt[i - 1])
                dp[i, w] = Math.Max(dp[i, w], dp[i - 1, w - wt[i - 1]] + val[i - 1]);
        }
    return dp[n, W];
}`,
  ),

  "knapsack-unbounded": snippets(
    `int unbounded_knapsack(int* wt, int* val, int n, int W) {
    int* dp = (int*)calloc(W + 1, sizeof(int));
    for (int w = 1; w <= W; w++)
        for (int i = 0; i < n; i++)
            if (w >= wt[i]) {
                int take = dp[w - wt[i]] + val[i];
                if (take > dp[w]) dp[w] = take;
            }
    int ans = dp[W];
    free(dp);
    return ans;
}`,
    `int unboundedKnapsack(const vector<int>& wt, const vector<int>& val, int W) {
    vector<int> dp(W + 1, 0);
    for (int w = 1; w <= W; w++)
        for (size_t i = 0; i < wt.size(); i++)
            if (w >= wt[i])
                dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);
    return dp[W];
}`,
    `def unbounded_knapsack(wt: list[int], val: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for w in range(1, W + 1):
        for i, weight in enumerate(wt):
            if w >= weight:
                dp[w] = max(dp[w], dp[w - weight] + val[i])
    return dp[W]`,
    `static int unboundedKnapsack(int[] wt, int[] val, int W) {
    int[] dp = new int[W + 1];
    for (int w = 1; w <= W; w++)
        for (int i = 0; i < wt.length; i++)
            if (w >= wt[i])
                dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
    return dp[W];
}`,
    `function unboundedKnapsack(wt, val, W) {
  const dp = Array(W + 1).fill(0);
  for (let w = 1; w <= W; w++) {
    for (let i = 0; i < wt.length; i++) {
      if (w >= wt[i]) dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
    }
  }
  return dp[W];
}`,
    `static int UnboundedKnapsack(int[] wt, int[] val, int W) {
    var dp = new int[W + 1];
    for (int w = 1; w <= W; w++)
        for (int i = 0; i < wt.Length; i++)
            if (w >= wt[i])
                dp[w] = Math.Max(dp[w], dp[w - wt[i]] + val[i]);
    return dp[W];
}`,
  ),

  "subset-sum": snippets(
    `int subset_sum(int* a, int n, int target) {
    int dp[64][256];
    dp[0][0] = 1;
    for (int s = 1; s <= target; s++) dp[0][s] = 0;
    for (int i = 1; i <= n; i++) {
        for (int s = 0; s <= target; s++) {
            dp[i][s] = dp[i-1][s];
            if (s >= a[i-1] && dp[i-1][s - a[i-1]]) dp[i][s] = 1;
        }
    }
    return dp[n][target];
}`,
    `bool subsetSum(const vector<int>& a, int target) {
    int n = (int)a.size();
    vector<vector<char>> dp(n + 1, vector<char>(target + 1, 0));
    dp[0][0] = 1;
    for (int i = 1; i <= n; i++)
        for (int s = 0; s <= target; s++) {
            dp[i][s] = dp[i-1][s];
            if (s >= a[i-1] && dp[i-1][s - a[i-1]]) dp[i][s] = 1;
        }
    return dp[n][target];
}`,
    `def subset_sum(a: list[int], target: int) -> bool:
    n = len(a)
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for i in range(1, n + 1):
        for s in range(target + 1):
            dp[i][s] = dp[i - 1][s]
            if s >= a[i - 1] and dp[i - 1][s - a[i - 1]]:
                dp[i][s] = True
    return dp[n][target]`,
    `static boolean subsetSum(int[] a, int target) {
    int n = a.length;
    boolean[][] dp = new boolean[n + 1][target + 1];
    dp[0][0] = true;
    for (int i = 1; i <= n; i++)
        for (int s = 0; s <= target; s++) {
            dp[i][s] = dp[i - 1][s];
            if (s >= a[i - 1] && dp[i - 1][s - a[i - 1]]) dp[i][s] = true;
        }
    return dp[n][target];
}`,
    `function subsetSum(a, target) {
  const n = a.length;
  const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
  dp[0][0] = true;
  for (let i = 1; i <= n; i++) {
    for (let s = 0; s <= target; s++) {
      dp[i][s] = dp[i - 1][s];
      if (s >= a[i - 1] && dp[i - 1][s - a[i - 1]]) dp[i][s] = true;
    }
  }
  return dp[n][target];
}`,
    `static bool SubsetSum(int[] a, int target) {
    int n = a.Length;
    var dp = new bool[n + 1, target + 1];
    dp[0, 0] = true;
    for (int i = 1; i <= n; i++)
        for (int s = 0; s <= target; s++) {
            dp[i, s] = dp[i - 1, s];
            if (s >= a[i - 1] && dp[i - 1, s - a[i - 1]]) dp[i, s] = true;
        }
    return dp[n, target];
}`,
  ),

  lcs: snippets(
    `int lcs(const char* a, const char* b) {
    int m = (int)strlen(a), n = (int)strlen(b);
    int** dp = (int**)malloc((m + 1) * sizeof(int*));
    for (int i = 0; i <= m; i++) {
        dp[i] = (int*)calloc(n + 1, sizeof(int));
    }
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = dp[i-1][j] > dp[i][j-1] ? dp[i-1][j] : dp[i][j-1];
    int ans = dp[m][n];
    for (int i = 0; i <= m; i++) free(dp[i]);
    free(dp);
    return ans;
}`,
    `#include <string>
#include <vector>
using namespace std;

int lcs(const string& a, const string& b) {
    int m = (int)a.size(), n = (int)b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
    `def lcs(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
    `static int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (a.charAt(i - 1) == b.charAt(j - 1))
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}`,
    `function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
    `static int Lcs(string a, string b) {
    int m = a.Length, n = b.Length;
    var dp = new int[m + 1, n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (a[i - 1] == b[j - 1]) dp[i, j] = dp[i - 1, j - 1] + 1;
            else dp[i, j] = Math.Max(dp[i - 1, j], dp[i, j - 1]);
    return dp[m, n];
}`,
  ),

  "edit-distance": snippets(
    `int edit_distance(const char* a, const char* b) {
    int m = (int)strlen(a), n = (int)strlen(b);
    int** dp = (int**)malloc((m + 1) * sizeof(int*));
    for (int i = 0; i <= m; i++) {
        dp[i] = (int*)malloc((n + 1) * sizeof(int));
        dp[i][0] = i;
    }
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            int cost = a[i-1] == b[j-1] ? 0 : 1;
            int del = dp[i-1][j] + 1;
            int ins = dp[i][j-1] + 1;
            int rep = dp[i-1][j-1] + cost;
            dp[i][j] = del < ins ? (del < rep ? del : rep) : (ins < rep ? ins : rep);
        }
    int ans = dp[m][n];
    for (int i = 0; i <= m; i++) free(dp[i]);
    free(dp);
    return ans;
}`,
    `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int editDistance(const string& a, const string& b) {
    int m = (int)a.size(), n = (int)b.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            int cost = a[i-1] == b[j-1] ? 0 : 1;
            dp[i][j] = min({dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost});
        }
    return dp[m][n];
}`,
    `def edit_distance(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost,
            )
    return dp[m][n]`,
    `static int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
            dp[i][j] = Math.min(
                Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                dp[i - 1][j - 1] + cost);
        }
    return dp[m][n];
}`,
    `function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}`,
    `static int EditDistance(string a, string b) {
    int m = a.Length, n = b.Length;
    var dp = new int[m + 1, n + 1];
    for (int i = 0; i <= m; i++) dp[i, 0] = i;
    for (int j = 0; j <= n; j++) dp[0, j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            int cost = a[i - 1] == b[j - 1] ? 0 : 1;
            dp[i, j] = Math.Min(Math.Min(dp[i - 1, j] + 1, dp[i, j - 1] + 1),
                               dp[i - 1, j - 1] + cost);
        }
    return dp[m, n];
}`,
  ),

  "word-break": snippets(
    `int word_break(const char* s, const char** dict, int k) {
    int n = (int)strlen(s);
    int* dp = (int*)calloc(n + 1, sizeof(int));
    dp[0] = 1;
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w < k; w++) {
            int len = (int)strlen(dict[w]);
            if (i >= len && dp[i - len] &&
                strncmp(s + i - len, dict[w], len) == 0) {
                dp[i] = 1;
                break;
            }
        }
    }
    int ans = dp[n];
    free(dp);
    return ans;
}`,
    `#include <string>
#include <vector>
#include <unordered_set>
using namespace std;

bool wordBreak(const string& s, const vector<string>& dict) {
    unordered_set<string> words(dict.begin(), dict.end());
    int n = (int)s.size();
    vector<char> dp(n + 1, false);
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (const string& w : dict) {
            int len = (int)w.size();
            if (i >= len && dp[i - len] && s.compare(i - len, len, w) == 0) {
                dp[i] = true;
                break;
            }
        }
    return dp[n];
}`,
    `def word_break(s: str, dict_words: list[str]) -> bool:
    words = set(dict_words)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for w in words:
            if i >= len(w) and dp[i - len(w)] and s[i - len(w) : i] == w:
                dp[i] = True
                break
    return dp[n]`,
    `static boolean wordBreak(String s, String[] dict) {
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (String w : dict) {
            int len = w.length();
            if (i >= len && dp[i - len] && s.substring(i - len, i).equals(w)) {
                dp[i] = true;
                break;
            }
        }
    return dp[n];
}`,
    `function wordBreak(s, dict) {
  const n = s.length;
  const dp = Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i++) {
    for (const w of dict) {
      const len = w.length;
      if (i >= len && dp[i - len] && s.slice(i - len, i) === w) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}`,
    `static bool WordBreak(string s, string[] dict) {
    int n = s.Length;
    var dp = new bool[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        foreach (var w in dict) {
            int len = w.Length;
            if (i >= len && dp[i - len] && s.Substring(i - len, len) == w) {
                dp[i] = true;
                break;
            }
        }
    return dp[n];
}`,
  ),

  "palindromic-subsequence": snippets(
    `int lps(const char* s) {
    int n = (int)strlen(s);
    int** dp = (int**)malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        dp[i] = (int*)calloc(n, sizeof(int));
        dp[i][i] = 1;
    }
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j])
                dp[i][j] = (len == 2) ? 2 : dp[i+1][j-1] + 2;
            else
                dp[i][j] = dp[i+1][j] > dp[i][j-1] ? dp[i+1][j] : dp[i][j-1];
        }
    int ans = dp[0][n-1];
    for (int i = 0; i < n; i++) free(dp[i]);
    free(dp);
    return ans;
}`,
    `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int lps(const string& s) {
    int n = (int)s.size();
    vector<vector<int>> dp(n, vector<int>(n));
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j])
                dp[i][j] = (len == 2) ? 2 : dp[i+1][j-1] + 2;
            else
                dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
        }
    return dp[0][n-1];
}`,
    `def lps(s: str) -> int:
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = 2 if length == 2 else dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]`,
    `static int lps(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s.charAt(i) == s.charAt(j))
                dp[i][j] = (len == 2) ? 2 : dp[i + 1][j - 1] + 2;
            else
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
        }
    return dp[0][n - 1];
}`,
    `function lps(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) dp[i][j] = len === 2 ? 2 : dp[i + 1][j - 1] + 2;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}`,
    `static int Lps(string s) {
    int n = s.Length;
    var dp = new int[n, n];
    for (int i = 0; i < n; i++) dp[i, i] = 1;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j])
                dp[i, j] = (len == 2) ? 2 : dp[i + 1, j - 1] + 2;
            else
                dp[i, j] = Math.Max(dp[i + 1, j], dp[i, j - 1]);
        }
    return dp[0, n - 1];
}`,
  ),

  lis: snippets(
    `int lis(const int* a, int n) {
    int* dp = (int*)malloc(n * sizeof(int));
    int best = 0;
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++)
            if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        if (dp[i] > best) best = dp[i];
    }
    free(dp);
    return best;
}`,
    `#include <vector>
#include <algorithm>
using namespace std;

int lis(const vector<int>& a) {
    int n = (int)a.size(), best = 0;
    vector<int> dp(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
        best = max(best, dp[i]);
    }
    return best;
}`,
    `def lis(a: list[int]) -> int:
    n = len(a)
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if a[j] < a[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp) if dp else 0`,
    `static int lis(int[] a) {
    int n = a.length, best = 0;
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        best = Math.max(best, dp[i]);
    }
    return best;
}`,
    `function lis(a) {
  const n = a.length;
  const dp = Array(n).fill(1);
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++)
      if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
    `static int Lis(int[] a) {
    int n = a.Length, best = 0;
    var dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) dp[i] = Math.Max(dp[i], dp[j] + 1);
        best = Math.Max(best, dp[i]);
    }
    return best;
}`,
  ),

  "bitonic-subsequence": snippets(
    `int bitonic(const int* a, int n) {
    int* lis = (int*)malloc(n * sizeof(int));
    int* lds = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        lis[i] = 1;
        for (int j = 0; j < i; j++)
            if (a[j] < a[i] && lis[j] + 1 > lis[i]) lis[i] = lis[j] + 1;
    }
    for (int i = n - 1; i >= 0; i--) {
        lds[i] = 1;
        for (int j = n - 1; j > i; j--)
            if (a[j] < a[i] && lds[j] + 1 > lds[i]) lds[i] = lds[j] + 1;
    }
    int best = 0;
    for (int i = 0; i < n; i++) {
        int v = lis[i] + lds[i] - 1;
        if (v > best) best = v;
    }
    free(lis); free(lds);
    return best;
}`,
    `#include <vector>
#include <algorithm>
using namespace std;

int bitonic(const vector<int>& a) {
    int n = (int)a.size();
    vector<int> lis(n, 1), lds(n, 1);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) lis[i] = max(lis[i], lis[j] + 1);
    for (int i = n - 1; i >= 0; i--)
        for (int j = n - 1; j > i; j--)
            if (a[j] < a[i]) lds[i] = max(lds[i], lds[j] + 1);
    int best = 0;
    for (int i = 0; i < n; i++)
        best = max(best, lis[i] + lds[i] - 1);
    return best;
}`,
    `def bitonic(a: list[int]) -> int:
    n = len(a)
    lis = [1] * n
    lds = [1] * n
    for i in range(n):
        for j in range(i):
            if a[j] < a[i]:
                lis[i] = max(lis[i], lis[j] + 1)
    for i in range(n - 1, -1, -1):
        for j in range(n - 1, i, -1):
            if a[j] < a[i]:
                lds[i] = max(lds[i], lds[j] + 1)
    return max(lis[i] + lds[i] - 1 for i in range(n)) if n else 0`,
    `static int bitonic(int[] a) {
    int n = a.length;
    int[] lis = new int[n], lds = new int[n];
    for (int i = 0; i < n; i++) {
        lis[i] = 1;
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
    }
    for (int i = n - 1; i >= 0; i--) {
        lds[i] = 1;
        for (int j = n - 1; j > i; j--)
            if (a[j] < a[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
    }
    int best = 0;
    for (int i = 0; i < n; i++)
        best = Math.max(best, lis[i] + lds[i] - 1);
    return best;
}`,
    `function bitonic(a) {
  const n = a.length;
  const lis = Array(n).fill(1);
  const lds = Array(n).fill(1);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < i; j++)
      if (a[j] < a[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
  for (let i = n - 1; i >= 0; i--)
    for (let j = n - 1; j > i; j--)
      if (a[j] < a[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
  let best = 0;
  for (let i = 0; i < n; i++) best = Math.max(best, lis[i] + lds[i] - 1);
  return best;
}`,
    `static int Bitonic(int[] a) {
    int n = a.Length;
    var lis = new int[n];
    var lds = new int[n];
    for (int i = 0; i < n; i++) {
        lis[i] = 1;
        for (int j = 0; j < i; j++)
            if (a[j] < a[i]) lis[i] = Math.Max(lis[i], lis[j] + 1);
    }
    for (int i = n - 1; i >= 0; i--) {
        lds[i] = 1;
        for (int j = n - 1; j > i; j--)
            if (a[j] < a[i]) lds[i] = Math.Max(lds[i], lds[j] + 1);
    }
    int best = 0;
    for (int i = 0; i < n; i++)
        best = Math.Max(best, lis[i] + lds[i] - 1);
    return best;
}`,
  ),

  "matrix-chain": snippets(
    `int matrix_chain(const int* dims, int n) {
    /* n matrices; dims has length n+1 */
    int** dp = (int**)malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        dp[i] = (int*)calloc(n, sizeof(int));
    }
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = 1000000000;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k+1][j]
                         + dims[i] * dims[k+1] * dims[j+1];
                if (cost < dp[i][j]) dp[i][j] = cost;
            }
        }
    int ans = dp[0][n-1];
    for (int i = 0; i < n; i++) free(dp[i]);
    free(dp);
    return ans;
}`,
    `#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

int matrixChain(const vector<int>& dims) {
    int n = (int)dims.size() - 1;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            for (int k = i; k < j; k++)
                dp[i][j] = min(dp[i][j],
                    dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]);
        }
    return dp[0][n-1];
}`,
    `def matrix_chain(dims: list[int]) -> int:
    n = len(dims) - 1
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = min(
                dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                for k in range(i, j)
            )
    return dp[0][n - 1]`,
    `static int matrixChain(int[] dims) {
    int n = dims.length - 1;
    int[][] dp = new int[n][n];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++)
                dp[i][j] = Math.min(dp[i][j],
                    dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]);
        }
    return dp[0][n - 1];
}`,
    `function matrixChain(dims) {
  const n = dims.length - 1;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        dp[i][j] = Math.min(
          dp[i][j],
          dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1],
        );
      }
    }
  }
  return dp[0][n - 1];
}`,
    `static int MatrixChain(int[] dims) {
    int n = dims.Length - 1;
    var dp = new int[n, n];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i, j] = int.MaxValue;
            for (int k = i; k < j; k++)
                dp[i, j] = Math.Min(dp[i, j],
                    dp[i, k] + dp[k + 1, j] + dims[i] * dims[k + 1] * dims[j + 1]);
        }
    return dp[0, n - 1];
}`,
  ),

  "burst-balloons": snippets(
    `int burst(const int* a, int n) {
    int m = n + 2;
    int* nums = (int*)malloc(m * sizeof(int));
    nums[0] = nums[m-1] = 1;
    for (int i = 0; i < n; i++) nums[i+1] = a[i];
    int** dp = (int**)malloc(m * sizeof(int*));
    for (int i = 0; i < m; i++) dp[i] = (int*)calloc(m, sizeof(int));
    for (int len = 2; len < m; len++)
        for (int L = 0; L + len < m; L++) {
            int R = L + len;
            for (int i = L + 1; i < R; i++) {
                int v = nums[L]*nums[i]*nums[R] + dp[L][i] + dp[i][R];
                if (v > dp[L][R]) dp[L][R] = v;
            }
        }
    int ans = dp[0][m-1];
    for (int i = 0; i < m; i++) free(dp[i]);
    free(dp); free(nums);
    return ans;
}`,
    `#include <vector>
#include <algorithm>
using namespace std;

int burstBalloons(vector<int> a) {
    a.insert(a.begin(), 1);
    a.push_back(1);
    int m = (int)a.size();
    vector<vector<int>> dp(m, vector<int>(m, 0));
    for (int len = 2; len < m; len++)
        for (int L = 0; L + len < m; L++) {
            int R = L + len;
            for (int i = L + 1; i < R; i++)
                dp[L][R] = max(dp[L][R],
                    a[L]*a[i]*a[R] + dp[L][i] + dp[i][R]);
        }
    return dp[0][m-1];
}`,
    `def burst_balloons(a: list[int]) -> int:
    nums = [1] + a + [1]
    m = len(nums)
    dp = [[0] * m for _ in range(m)]
    for length in range(2, m):
        for L in range(m - length):
            R = L + length
            for i in range(L + 1, R):
                dp[L][R] = max(
                    dp[L][R],
                    nums[L] * nums[i] * nums[R] + dp[L][i] + dp[i][R],
                )
    return dp[0][m - 1]`,
    `static int burstBalloons(int[] a) {
    int m = a.length + 2;
    int[] nums = new int[m];
    nums[0] = nums[m - 1] = 1;
    System.arraycopy(a, 0, nums, 1, a.length);
    int[][] dp = new int[m][m];
    for (int len = 2; len < m; len++)
        for (int L = 0; L + len < m; L++) {
            int R = L + len;
            for (int i = L + 1; i < R; i++)
                dp[L][R] = Math.max(dp[L][R],
                    nums[L] * nums[i] * nums[R] + dp[L][i] + dp[i][R]);
        }
    return dp[0][m - 1];
}`,
    `function burstBalloons(a) {
  const nums = [1, ...a, 1];
  const m = nums.length;
  const dp = Array.from({ length: m }, () => Array(m).fill(0));
  for (let len = 2; len < m; len++) {
    for (let L = 0; L + len < m; L++) {
      const R = L + len;
      for (let i = L + 1; i < R; i++) {
        dp[L][R] = Math.max(
          dp[L][R],
          nums[L] * nums[i] * nums[R] + dp[L][i] + dp[i][R],
        );
      }
    }
  }
  return dp[0][m - 1];
}`,
    `static int BurstBalloons(int[] a) {
    int m = a.Length + 2;
    var nums = new int[m];
    nums[0] = nums[m - 1] = 1;
    Array.Copy(a, 0, nums, 1, a.Length);
    var dp = new int[m, m];
    for (int len = 2; len < m; len++)
        for (int L = 0; L + len < m; L++) {
            int R = L + len;
            for (int i = L + 1; i < R; i++)
                dp[L, R] = Math.Max(dp[L, R],
                    nums[L] * nums[i] * nums[R] + dp[L, i] + dp[i, R]);
        }
    return dp[0, m - 1];
}`,
  ),

  "palindrome-partitioning": snippets(
    `int min_cuts(const char* s) {
    int n = (int)strlen(s);
    int** isPal = (int**)malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        isPal[i] = (int*)calloc(n, sizeof(int));
        isPal[i][i] = 1;
    }
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            isPal[i][j] = (s[i] == s[j]) && (len == 2 || isPal[i+1][j-1]);
        }
    int* cuts = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (isPal[0][i]) { cuts[i] = 0; continue; }
        cuts[i] = i;
        for (int j = 1; j <= i; j++)
            if (isPal[j][i] && cuts[j-1] + 1 < cuts[i])
                cuts[i] = cuts[j-1] + 1;
    }
    int ans = cuts[n-1];
    for (int i = 0; i < n; i++) free(isPal[i]);
    free(isPal); free(cuts);
    return ans;
}`,
    `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int minCut(const string& s) {
    int n = (int)s.size();
    vector<vector<char>> isPal(n, vector<char>(n, false));
    for (int i = 0; i < n; i++) isPal[i][i] = true;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            isPal[i][j] = (s[i] == s[j]) && (len == 2 || isPal[i+1][j-1]);
        }
    vector<int> cuts(n);
    for (int i = 0; i < n; i++) {
        if (isPal[0][i]) { cuts[i] = 0; continue; }
        cuts[i] = i;
        for (int j = 1; j <= i; j++)
            if (isPal[j][i]) cuts[i] = min(cuts[i], cuts[j-1] + 1);
    }
    return cuts[n-1];
}`,
    `def min_cut(s: str) -> int:
    n = len(s)
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            is_pal[i][j] = s[i] == s[j] and (length == 2 or is_pal[i + 1][j - 1])
    cuts = [0] * n
    for i in range(n):
        if is_pal[0][i]:
            cuts[i] = 0
            continue
        cuts[i] = i
        for j in range(1, i + 1):
            if is_pal[j][i]:
                cuts[i] = min(cuts[i], cuts[j - 1] + 1)
    return cuts[n - 1]`,
    `static int minCut(String s) {
    int n = s.length();
    boolean[][] isPal = new boolean[n][n];
    for (int i = 0; i < n; i++) isPal[i][i] = true;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            isPal[i][j] = s.charAt(i) == s.charAt(j)
                && (len == 2 || isPal[i + 1][j - 1]);
        }
    int[] cuts = new int[n];
    for (int i = 0; i < n; i++) {
        if (isPal[0][i]) { cuts[i] = 0; continue; }
        cuts[i] = i;
        for (int j = 1; j <= i; j++)
            if (isPal[j][i]) cuts[i] = Math.min(cuts[i], cuts[j - 1] + 1);
    }
    return cuts[n - 1];
}`,
    `function minCut(s) {
  const n = s.length;
  const isPal = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = 0; i < n; i++) isPal[i][i] = true;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      isPal[i][j] = s[i] === s[j] && (len === 2 || isPal[i + 1][j - 1]);
    }
  }
  const cuts = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    if (isPal[0][i]) { cuts[i] = 0; continue; }
    cuts[i] = i;
    for (let j = 1; j <= i; j++)
      if (isPal[j][i]) cuts[i] = Math.min(cuts[i], cuts[j - 1] + 1);
  }
  return cuts[n - 1];
}`,
    `static int MinCut(string s) {
    int n = s.Length;
    var isPal = new bool[n, n];
    for (int i = 0; i < n; i++) isPal[i, i] = true;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            isPal[i, j] = s[i] == s[j] && (len == 2 || isPal[i + 1, j - 1]);
        }
    var cuts = new int[n];
    for (int i = 0; i < n; i++) {
        if (isPal[0, i]) { cuts[i] = 0; continue; }
        cuts[i] = i;
        for (int j = 1; j <= i; j++)
            if (isPal[j, i]) cuts[i] = Math.Min(cuts[i], cuts[j - 1] + 1);
    }
    return cuts[n - 1];
}`,
  ),

  "tree-diameter": snippets(
    `typedef struct Node { int val; struct Node* left; struct Node* right; } Node;
int best_diam;

int height(Node* u) {
    if (!u) return 0;
    int L = height(u->left), R = height(u->right);
    if (L + R > best_diam) best_diam = L + R;
    return 1 + (L > R ? L : R);
}

int diameter(Node* root) {
    best_diam = 0;
    height(root);
    return best_diam;
}`,
    `struct Node { int val; Node* left; Node* right; };
int bestDiam = 0;

int height(Node* u) {
    if (!u) return 0;
    int L = height(u->left), R = height(u->right);
    bestDiam = max(bestDiam, L + R);
    return 1 + max(L, R);
}

int diameter(Node* root) {
    bestDiam = 0;
    height(root);
    return bestDiam;
}`,
    `def diameter(root) -> int:
    best = 0
    def height(u):
        nonlocal best
        if not u:
            return 0
        L, R = height(u.left), height(u.right)
        best = max(best, L + R)
        return 1 + max(L, R)
    height(root)
    return best`,
    `static int bestDiam;

static int height(TreeNode u) {
    if (u == null) return 0;
    int L = height(u.left), R = height(u.right);
    bestDiam = Math.max(bestDiam, L + R);
    return 1 + Math.max(L, R);
}

static int diameter(TreeNode root) {
    bestDiam = 0;
    height(root);
    return bestDiam;
}`,
    `function diameter(root) {
  let best = 0;
  function height(u) {
    if (!u) return 0;
    const L = height(u.left), R = height(u.right);
    best = Math.max(best, L + R);
    return 1 + Math.max(L, R);
  }
  height(root);
  return best;
}`,
    `static int bestDiam;

static int Height(TreeNode u) {
    if (u == null) return 0;
    int L = Height(u.left), R = Height(u.right);
    bestDiam = Math.Max(bestDiam, L + R);
    return 1 + Math.Max(L, R);
}

static int Diameter(TreeNode root) {
    bestDiam = 0;
    Height(root);
    return bestDiam;
}`,
  ),

  "maximum-path-sum": snippets(
    `typedef struct Node { int val; struct Node* left; struct Node* right; } Node;
int best_sum;

int gain(Node* u) {
    if (!u) return 0;
    int L = gain(u->left); if (L < 0) L = 0;
    int R = gain(u->right); if (R < 0) R = 0;
    int through = u->val + L + R;
    if (through > best_sum) best_sum = through;
    return u->val + (L > R ? L : R);
}

int max_path_sum(Node* root) {
    best_sum = -1000000000;
    gain(root);
    return best_sum;
}`,
    `struct Node { int val; Node* left; Node* right; };
int bestSum = INT_MIN;

int gain(Node* u) {
    if (!u) return 0;
    int L = max(0, gain(u->left));
    int R = max(0, gain(u->right));
    bestSum = max(bestSum, u->val + L + R);
    return u->val + max(L, R);
}

int maxPathSum(Node* root) {
    bestSum = INT_MIN;
    gain(root);
    return bestSum;
}`,
    `def max_path_sum(root) -> int:
    best = float("-inf")
    def gain(u):
        nonlocal best
        if not u:
            return 0
        L = max(0, gain(u.left))
        R = max(0, gain(u.right))
        best = max(best, u.val + L + R)
        return u.val + max(L, R)
    gain(root)
    return best`,
    `static int bestSum;

static int gain(TreeNode u) {
    if (u == null) return 0;
    int L = Math.max(0, gain(u.left));
    int R = Math.max(0, gain(u.right));
    bestSum = Math.max(bestSum, u.val + L + R);
    return u.val + Math.max(L, R);
}

static int maxPathSum(TreeNode root) {
    bestSum = Integer.MIN_VALUE;
    gain(root);
    return bestSum;
}`,
    `function maxPathSum(root) {
  let best = -Infinity;
  function gain(u) {
    if (!u) return 0;
    const L = Math.max(0, gain(u.left));
    const R = Math.max(0, gain(u.right));
    best = Math.max(best, u.val + L + R);
    return u.val + Math.max(L, R);
  }
  gain(root);
  return best;
}`,
    `static int bestSum;

static int Gain(TreeNode u) {
    if (u == null) return 0;
    int L = Math.Max(0, Gain(u.left));
    int R = Math.Max(0, Gain(u.right));
    bestSum = Math.Max(bestSum, u.val + L + R);
    return u.val + Math.Max(L, R);
}

static int MaxPathSum(TreeNode root) {
    bestSum = int.MinValue;
    Gain(root);
    return bestSum;
}`,
  ),

  "dag-dp": snippets(
    `void dag_shortest(int n, int** adj, int* adjw_len, int** adjw, int* dp) {
    /* adj[u][0..len) neighbors; adjw same weights; topo[] precomputed */
    for (int i = 0; i < n; i++) dp[i] = 1000000000;
    dp[0] = 0;
    /* assume topo[0..n) is a valid topological order */
    for (int ti = 0; ti < n; ti++) {
        int u = topo[ti];
        if (dp[u] >= 1000000000) continue;
        for (int k = 0; k < adjw_len[u]; k++) {
            int v = adj[u][k], w = adjw[u][k];
            if (dp[u] + w < dp[v]) dp[v] = dp[u] + w;
        }
    }
}`,
    `#include <vector>
#include <queue>
#include <climits>
using namespace std;

vector<int> dagShortest(int n, const vector<vector<pair<int,int>>>& adj) {
    vector<int> indeg(n), dp(n, INT_MAX), order;
    for (int u = 0; u < n; u++)
        for (auto [v, w] : adj[u]) indeg[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (auto [v, w] : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    dp[0] = 0;
    for (int u : order) {
        if (dp[u] == INT_MAX) continue;
        for (auto [v, w] : adj[u])
            dp[v] = min(dp[v], dp[u] + w);
    }
    return dp;
}`,
    `def dag_shortest(n, edges):
    adj = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v, w in edges:
        adj[u].append((v, w))
        indeg[v] += 1
    order, q = [], [i for i in range(n) if indeg[i] == 0]
    while q:
        u = q.pop()
        order.append(u)
        for v, _ in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    INF = 10**18
    dp = [INF] * n
    dp[0] = 0
    for u in order:
        if dp[u] == INF:
            continue
        for v, w in adj[u]:
            dp[v] = min(dp[v], dp[u] + w)
    return dp`,
    `static int[] dagShortest(int n, List<int[]>[] adj) {
    int[] indeg = new int[n], dp = new int[n];
    Arrays.fill(dp, Integer.MAX_VALUE / 4);
    ArrayDeque<Integer> q = new ArrayDeque<>();
    for (int u = 0; u < n; u++)
        for (int[] e : adj[u]) indeg[e[0]]++;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.removeFirst();
        order.add(u);
        for (int[] e : adj[u]) if (--indeg[e[0]] == 0) q.add(e[0]);
    }
    dp[0] = 0;
    for (int u : order) {
        if (dp[u] >= Integer.MAX_VALUE / 4) continue;
        for (int[] e : adj[u])
            dp[e[0]] = Math.min(dp[e[0]], dp[u] + e[1]);
    }
    return dp;
}`,
    `function dagShortest(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    indeg[v]++;
  }
  const order = [];
  const q = indeg.map((d, i) => (d === 0 ? i : -1)).filter((i) => i >= 0);
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const [v] of adj[u]) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  const INF = 1e15;
  const dp = Array(n).fill(INF);
  dp[0] = 0;
  for (const u of order) {
    if (dp[u] >= INF) continue;
    for (const [v, w] of adj[u]) dp[v] = Math.min(dp[v], dp[u] + w);
  }
  return dp;
}`,
    `static int[] DagShortest(int n, List<(int v, int w)>[] adj) {
    var indeg = new int[n];
    var dp = Enumerable.Repeat(int.MaxValue / 4, n).ToArray();
    var q = new Queue<int>();
    for (int u = 0; u < n; u++)
        foreach (var e in adj[u]) indeg[e.v]++;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.Enqueue(i);
    var order = new List<int>();
    while (q.Count > 0) {
        int u = q.Dequeue();
        order.Add(u);
        foreach (var e in adj[u]) if (--indeg[e.v] == 0) q.Enqueue(e.v);
    }
    dp[0] = 0;
    foreach (int u in order) {
        if (dp[u] >= int.MaxValue / 4) continue;
        foreach (var e in adj[u])
            dp[e.v] = Math.Min(dp[e.v], dp[u] + e.w);
    }
    return dp;
}`,
  ),

  tsp: snippets(
    `int tsp(int n, int** dist) {
    int N = 1 << n;
    int** dp = (int**)malloc(N * sizeof(int*));
    for (int m = 0; m < N; m++) {
        dp[m] = (int*)malloc(n * sizeof(int));
        for (int i = 0; i < n; i++) dp[m][i] = 1000000000;
    }
    dp[1][0] = 0;
    for (int mask = 1; mask < N; mask++)
        for (int u = 0; u < n; u++) if (mask & (1 << u))
            for (int v = 0; v < n; v++) if (!(mask & (1 << v))) {
                int next = mask | (1 << v);
                int cand = dp[mask][u] + dist[u][v];
                if (cand < dp[next][v]) dp[next][v] = cand;
            }
    int best = 1000000000, full = N - 1;
    for (int i = 1; i < n; i++) {
        int tour = dp[full][i] + dist[i][0];
        if (tour < best) best = tour;
    }
    return best;
}`,
    `#include <vector>
#include <climits>
using namespace std;

int tsp(const vector<vector<int>>& dist) {
    int n = (int)dist.size(), N = 1 << n;
    vector<vector<int>> dp(N, vector<int>(n, INT_MAX / 4));
    dp[1][0] = 0;
    for (int mask = 1; mask < N; mask++)
        for (int u = 0; u < n; u++) if (mask & (1 << u))
            for (int v = 0; v < n; v++) if (!(mask & (1 << v))) {
                int next = mask | (1 << v);
                dp[next][v] = min(dp[next][v], dp[mask][u] + dist[u][v]);
            }
    int best = INT_MAX / 4, full = N - 1;
    for (int i = 1; i < n; i++)
        best = min(best, dp[full][i] + dist[i][0]);
    return best;
}`,
    `def tsp(dist: list[list[int]]) -> int:
    n = len(dist)
    N = 1 << n
    INF = 10**18
    dp = [[INF] * n for _ in range(N)]
    dp[1][0] = 0
    for mask in range(1, N):
        for u in range(n):
            if not (mask & (1 << u)):
                continue
            for v in range(n):
                if mask & (1 << v):
                    continue
                nxt = mask | (1 << v)
                dp[nxt][v] = min(dp[nxt][v], dp[mask][u] + dist[u][v])
    full = N - 1
    return min(dp[full][i] + dist[i][0] for i in range(1, n))`,
    `static int tsp(int[][] dist) {
    int n = dist.length, N = 1 << n;
    int[][] dp = new int[N][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 4);
    dp[1][0] = 0;
    for (int mask = 1; mask < N; mask++)
        for (int u = 0; u < n; u++) if ((mask & (1 << u)) != 0)
            for (int v = 0; v < n; v++) if ((mask & (1 << v)) == 0) {
                int next = mask | (1 << v);
                dp[next][v] = Math.min(dp[next][v], dp[mask][u] + dist[u][v]);
            }
    int best = Integer.MAX_VALUE / 4, full = N - 1;
    for (int i = 1; i < n; i++)
        best = Math.min(best, dp[full][i] + dist[i][0]);
    return best;
}`,
    `function tsp(dist) {
  const n = dist.length, N = 1 << n, INF = 1e15;
  const dp = Array.from({ length: N }, () => Array(n).fill(INF));
  dp[1][0] = 0;
  for (let mask = 1; mask < N; mask++) {
    for (let u = 0; u < n; u++) {
      if (!(mask & (1 << u))) continue;
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        const next = mask | (1 << v);
        dp[next][v] = Math.min(dp[next][v], dp[mask][u] + dist[u][v]);
      }
    }
  }
  const full = N - 1;
  let best = INF;
  for (let i = 1; i < n; i++) best = Math.min(best, dp[full][i] + dist[i][0]);
  return best;
}`,
    `static int Tsp(int[][] dist) {
    int n = dist.Length, N = 1 << n;
    var dp = new int[N, n];
    for (int m = 0; m < N; m++)
        for (int i = 0; i < n; i++) dp[m, i] = int.MaxValue / 4;
    dp[1, 0] = 0;
    for (int mask = 1; mask < N; mask++)
        for (int u = 0; u < n; u++) if ((mask & (1 << u)) != 0)
            for (int v = 0; v < n; v++) if ((mask & (1 << v)) == 0) {
                int next = mask | (1 << v);
                dp[next, v] = Math.Min(dp[next, v], dp[mask, u] + dist[u][v]);
            }
    int best = int.MaxValue / 4, full = N - 1;
    for (int i = 1; i < n; i++)
        best = Math.Min(best, dp[full, i] + dist[i][0]);
    return best;
}`,
  ),

  assignment: snippets(
    `int assignment(int n, int** cost) {
    int N = 1 << n;
    int* dp = (int*)malloc(N * sizeof(int));
    for (int m = 0; m < N; m++) dp[m] = 1000000000;
    dp[0] = 0;
    for (int mask = 0; mask < N; mask++) {
        int i = __builtin_popcount(mask);
        if (i >= n || dp[mask] >= 1000000000) continue;
        for (int j = 0; j < n; j++) if (!(mask & (1 << j))) {
            int next = mask | (1 << j);
            int cand = dp[mask] + cost[i][j];
            if (cand < dp[next]) dp[next] = cand;
        }
    }
    int ans = dp[N - 1];
    free(dp);
    return ans;
}`,
    `#include <vector>
#include <climits>
#include <bit>
using namespace std;

int assignment(const vector<vector<int>>& cost) {
    int n = (int)cost.size(), N = 1 << n;
    vector<int> dp(N, INT_MAX / 4);
    dp[0] = 0;
    for (int mask = 0; mask < N; mask++) {
        int i = popcount((unsigned)mask);
        if (i >= n || dp[mask] >= INT_MAX / 4) continue;
        for (int j = 0; j < n; j++) if (!(mask & (1 << j)))
            dp[mask | (1 << j)] = min(dp[mask | (1 << j)], dp[mask] + cost[i][j]);
    }
    return dp[N - 1];
}`,
    `def assignment(cost: list[list[int]]) -> int:
    n = len(cost)
    N = 1 << n
    INF = 10**18
    dp = [INF] * N
    dp[0] = 0
    for mask in range(N):
        i = mask.bit_count()
        if i >= n or dp[mask] == INF:
            continue
        for j in range(n):
            if mask & (1 << j):
                continue
            nxt = mask | (1 << j)
            dp[nxt] = min(dp[nxt], dp[mask] + cost[i][j])
    return dp[N - 1]`,
    `static int assignment(int[][] cost) {
    int n = cost.length, N = 1 << n;
    int[] dp = new int[N];
    Arrays.fill(dp, Integer.MAX_VALUE / 4);
    dp[0] = 0;
    for (int mask = 0; mask < N; mask++) {
        int i = Integer.bitCount(mask);
        if (i >= n || dp[mask] >= Integer.MAX_VALUE / 4) continue;
        for (int j = 0; j < n; j++) if ((mask & (1 << j)) == 0)
            dp[mask | (1 << j)] = Math.min(dp[mask | (1 << j)], dp[mask] + cost[i][j]);
    }
    return dp[N - 1];
}`,
    `function assignment(cost) {
  const n = cost.length, N = 1 << n, INF = 1e15;
  const dp = Array(N).fill(INF);
  dp[0] = 0;
  for (let mask = 0; mask < N; mask++) {
    const i = bitCount(mask);
    if (i >= n || dp[mask] >= INF) continue;
    for (let j = 0; j < n; j++) {
      if (mask & (1 << j)) continue;
      const next = mask | (1 << j);
      dp[next] = Math.min(dp[next], dp[mask] + cost[i][j]);
    }
  }
  return dp[N - 1];
}
function bitCount(x) {
  let c = 0;
  while (x) { c += x & 1; x >>= 1; }
  return c;
}`,
    `static int Assignment(int[][] cost) {
    int n = cost.Length, N = 1 << n;
    var dp = Enumerable.Repeat(int.MaxValue / 4, N).ToArray();
    dp[0] = 0;
    for (int mask = 0; mask < N; mask++) {
        int i = BitOperations.PopCount((uint)mask);
        if (i >= n || dp[mask] >= int.MaxValue / 4) continue;
        for (int j = 0; j < n; j++) if ((mask & (1 << j)) == 0)
            dp[mask | (1 << j)] = Math.Min(dp[mask | (1 << j)], dp[mask] + cost[i][j]);
    }
    return dp[N - 1];
}`,
  ),

  minimax: snippets(
    `int minimax(Node* u, int is_max) {
    if (!u->left && !u->right) return u->val;
    int L = minimax(u->left, !is_max);
    int R = minimax(u->right, !is_max);
    return is_max ? (L > R ? L : R) : (L < R ? L : R);
}`,
    `int minimax(Node* u, bool isMax) {
    if (!u->left && !u->right) return u->val;
    int L = minimax(u->left, !isMax);
    int R = minimax(u->right, !isMax);
    return isMax ? max(L, R) : min(L, R);
}`,
    `def minimax(u, is_max: bool) -> int:
    if u.left is None and u.right is None:
        return u.val
    L = minimax(u.left, not is_max)
    R = minimax(u.right, not is_max)
    return max(L, R) if is_max else min(L, R)`,
    `static int minimax(Node u, boolean isMax) {
    if (u.left == null && u.right == null) return u.val;
    int L = minimax(u.left, !isMax);
    int R = minimax(u.right, !isMax);
    return isMax ? Math.max(L, R) : Math.min(L, R);
}`,
    `function minimax(u, isMax) {
  if (!u.left && !u.right) return u.val;
  const L = minimax(u.left, !isMax);
  const R = minimax(u.right, !isMax);
  return isMax ? Math.max(L, R) : Math.min(L, R);
}`,
    `static int Minimax(Node u, bool isMax) {
    if (u.Left == null && u.Right == null) return u.Val;
    int L = Minimax(u.Left, !isMax);
    int R = Minimax(u.Right, !isMax);
    return isMax ? Math.Max(L, R) : Math.Min(L, R);
}`,
  ),

  "optimal-strategy": snippets(
    `int optimal(const int* a, int n) {
    int** dp = (int**)malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        dp[i] = (int*)calloc(n, sizeof(int));
        dp[i][i] = a[i];
    }
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (len == 2) dp[i][j] = a[i] > a[j] ? a[i] : a[j];
            else {
                int left = a[i] + (dp[i+1][j-1] < dp[i+2][j] ? dp[i+1][j-1] : dp[i+2][j]);
                int right = a[j] + (dp[i][j-2] < dp[i+1][j-1] ? dp[i][j-2] : dp[i+1][j-1]);
                dp[i][j] = left > right ? left : right;
            }
        }
    int ans = dp[0][n-1];
    for (int i = 0; i < n; i++) free(dp[i]);
    free(dp);
    return ans;
}`,
    `#include <vector>
#include <algorithm>
using namespace std;

int optimalStrategy(const vector<int>& a) {
    int n = (int)a.size();
    vector<vector<int>> dp(n, vector<int>(n));
    for (int i = 0; i < n; i++) dp[i][i] = a[i];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (len == 2) dp[i][j] = max(a[i], a[j]);
            else {
                int left = a[i] + min(dp[i+1][j-1], dp[i+2][j]);
                int right = a[j] + min(dp[i][j-2], dp[i+1][j-1]);
                dp[i][j] = max(left, right);
            }
        }
    return dp[0][n-1];
}`,
    `def optimal_strategy(a: list[int]) -> int:
    n = len(a)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = a[i]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if length == 2:
                dp[i][j] = max(a[i], a[j])
            else:
                left = a[i] + min(dp[i + 1][j - 1], dp[i + 2][j])
                right = a[j] + min(dp[i][j - 2], dp[i + 1][j - 1])
                dp[i][j] = max(left, right)
    return dp[0][n - 1]`,
    `static int optimalStrategy(int[] a) {
    int n = a.length;
    int[][] dp = new int[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = a[i];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (len == 2) dp[i][j] = Math.max(a[i], a[j]);
            else {
                int left = a[i] + Math.min(dp[i + 1][j - 1], dp[i + 2][j]);
                int right = a[j] + Math.min(dp[i][j - 2], dp[i + 1][j - 1]);
                dp[i][j] = Math.max(left, right);
            }
        }
    return dp[0][n - 1];
}`,
    `function optimalStrategy(a) {
  const n = a.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = a[i];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (len === 2) dp[i][j] = Math.max(a[i], a[j]);
      else {
        const left = a[i] + Math.min(dp[i + 1][j - 1], dp[i + 2][j]);
        const right = a[j] + Math.min(dp[i][j - 2], dp[i + 1][j - 1]);
        dp[i][j] = Math.max(left, right);
      }
    }
  }
  return dp[0][n - 1];
}`,
    `static int OptimalStrategy(int[] a) {
    int n = a.Length;
    var dp = new int[n, n];
    for (int i = 0; i < n; i++) dp[i, i] = a[i];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (len == 2) dp[i, j] = Math.Max(a[i], a[j]);
            else {
                int left = a[i] + Math.Min(dp[i + 1, j - 1], dp[i + 2, j]);
                int right = a[j] + Math.Min(dp[i, j - 2], dp[i + 1, j - 1]);
                dp[i, j] = Math.Max(left, right);
            }
        }
    return dp[0, n - 1];
}`,
  ),
};
