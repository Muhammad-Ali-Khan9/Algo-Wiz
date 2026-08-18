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
};
