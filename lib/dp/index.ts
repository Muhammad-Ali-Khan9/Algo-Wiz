import { assignment } from "./bitmask";
import { minimax, optimalStrategy } from "./game";
import { dungeonGame, minPathSum, uniquePaths } from "./grid";
import { dagDp, tsp } from "./graph";
import { burstBalloons, matrixChain, palindromePartitioning } from "./interval";
import { knapsack01, knapsackUnbounded, subsetSum } from "./knapsack";
import { climbingStairs, coinChange, fibonacci, houseRobber } from "./oned";
import { bitonicSubsequence, lis } from "./sequence";
import { DP_CODE } from "./snippets";
import { editDistance, lcs, palindromicSubsequence, wordBreak } from "./string";
import { maximumPathSum, treeDiameter } from "./tree";
import type { DpAlgoId, DpInput, DpMeta, DpRunner } from "./types";

export type { DpAlgoId, DpFrame, DpInput, DpMeta } from "./types";
export { generateDpInput, shuffleSeed } from "./random";
export { isUnreachable } from "./oned";

function meta(partial: Omit<DpMeta, "code"> & { id: DpAlgoId }): DpMeta {
  return { ...partial, code: DP_CODE[partial.id] };
}

export const DP_META: DpMeta[] = [
  meta({
    id: "fibonacci",
    name: "Fibonacci",
    group: "1D DP",
    worst: "O(n)",
    average: "O(n)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Build F(0)…F(n) bottom-up. Each value is the sum of the two preceding subproblems, so every index is solved once.",
    usage: "Teaching 1D DP, recurrence relations, and rolling-array optimizations.",
  }),
  meta({
    id: "climbing-stairs",
    name: "Climbing Stairs",
    group: "1D DP",
    worst: "O(n)",
    average: "O(n)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Number of ways to reach step n taking 1 or 2 steps. Same recurrence as Fibonacci with different bases.",
    usage: "Path-counting on a line; interview classic for introducing DP.",
  }),
  meta({
    id: "house-robber",
    name: "House Robber",
    group: "1D DP",
    worst: "O(n)",
    average: "O(n)",
    best: "O(n)",
    space: "O(n)",
    available: true,
    definition:
      "Maximize loot from a row of houses without robbing two adjacent ones: at each house, skip or take + dp[i−2].",
    usage: "Independent-set style decisions on a path graph.",
  }),
  meta({
    id: "coin-change",
    name: "Coin Change",
    group: "1D DP",
    worst: "O(n · k)",
    average: "O(n · k)",
    best: "O(n · k)",
    space: "O(n)",
    available: true,
    definition:
      "Fewest coins to make amount n. For each amount x, try every coin c and take min(dp[x], dp[x−c] + 1).",
    usage:
      "Unbounded knapsack / making change with unlimited supply of each denomination.",
  }),
  meta({
    id: "unique-paths",
    name: "Unique Paths",
    group: "Grid DP",
    worst: "O(m · n)",
    average: "O(m · n)",
    best: "O(m · n)",
    space: "O(m · n)",
    available: true,
    definition:
      "Count paths from the top-left to the bottom-right of an m×n grid moving only right or down. Each cell sums ways from above and left.",
    usage: "Lattice path counting and as a base for obstacle / weighted grid DP.",
  }),
  meta({
    id: "min-path-sum",
    name: "Minimum Path Sum",
    group: "Grid DP",
    worst: "O(m · n)",
    average: "O(m · n)",
    best: "O(m · n)",
    space: "O(m · n)",
    available: true,
    definition:
      "Find a right/down path from start to end with minimum total cell cost. dp[i][j] = grid[i][j] + min(from above, from left).",
    usage: "Cheapest route on a grid DAG; intro to weighted path DP.",
  }),
  meta({
    id: "dungeon-game",
    name: "Dungeon Game",
    group: "Grid DP",
    worst: "O(m · n)",
    average: "O(m · n)",
    best: "O(m · n)",
    space: "O(m · n)",
    available: true,
    definition:
      "Minimum initial HP to reach the princess. Fill from the bottom-right: you must survive each cell, so dp stores HP needed on entry.",
    usage: "Backward DP when the constraint is surviving a future state.",
  }),
  meta({
    id: "knapsack-01",
    name: "0/1 Knapsack",
    group: "Knapsack",
    worst: "O(n · W)",
    average: "O(n · W)",
    best: "O(n · W)",
    space: "O(n · W)",
    available: true,
    definition:
      "Maximize value with capacity W when each item may be taken at most once. dp[i][w] chooses skip vs take using the previous row.",
    usage: "Resource allocation, packing, and many NP-hard approximations via DP.",
  }),
  meta({
    id: "knapsack-unbounded",
    name: "Unbounded Knapsack",
    group: "Knapsack",
    worst: "O(n · W)",
    average: "O(n · W)",
    best: "O(n · W)",
    space: "O(W)",
    available: true,
    definition:
      "Same as 0/1 but each item can be used any number of times. Fill a 1D dp[w] left-to-right so copies reuse updated values.",
    usage: "Coin combinations for max value, rod cutting, and unlimited supply packing.",
  }),
  meta({
    id: "subset-sum",
    name: "Subset Sum",
    group: "Knapsack",
    worst: "O(n · S)",
    average: "O(n · S)",
    best: "O(n · S)",
    space: "O(n · S)",
    available: true,
    definition:
      "Decide whether any subset of the numbers adds exactly to target S. Boolean DP: skip the item or take it if s ≥ a[i].",
    usage: "Partition problems, meet-in-the-middle warmups, and knapsack feasibility.",
  }),
  meta({
    id: "lcs",
    name: "LCS",
    group: "String DP",
    worst: "O(m · n)",
    average: "O(m · n)",
    best: "O(m · n)",
    space: "O(m · n)",
    available: true,
    definition:
      "Longest common subsequence of two strings. Matching characters extend the diagonal; otherwise take the max of skipping either side.",
    usage: "Diff tools, DNA alignment, and as a building block for edit scripts.",
  }),
  meta({
    id: "edit-distance",
    name: "Edit Distance",
    group: "String DP",
    worst: "O(m · n)",
    average: "O(m · n)",
    best: "O(m · n)",
    space: "O(m · n)",
    available: true,
    definition:
      "Minimum inserts, deletes, and replaces to turn A into B (Levenshtein). Each cell takes the cheapest of the three edits.",
    usage: "Spell-check, fuzzy matching, and sequence alignment with costs.",
  }),
  meta({
    id: "word-break",
    name: "Word Break",
    group: "String DP",
    worst: "O(n² · k)",
    average: "O(n² · k)",
    best: "O(n · Σ|w|)",
    space: "O(n)",
    available: true,
    definition:
      "Whether s can be segmented into dictionary words. dp[i] is true if some word ends at i and the prefix before it is breakable.",
    usage: "Tokenization, dictionary matching, and segmentation problems.",
  }),
  meta({
    id: "palindromic-subsequence",
    name: "Palindromic Subsequence",
    group: "String DP",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n²)",
    space: "O(n²)",
    available: true,
    definition:
      "Longest palindromic subsequence of one string. Expand by length: matching ends wrap an inner LPS; else drop one endpoint.",
    usage: "Palindrome problems, string symmetry, and related interval DP.",
  }),
  meta({
    id: "lis",
    name: "LIS",
    group: "Sequence DP",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n²)",
    space: "O(n)",
    available: true,
    definition:
      "Longest increasing subsequence. dp[i] is the best length ending at i: extend any earlier smaller element, or start fresh at 1.",
    usage:
      "Patience sorting warmups, patience-based O(n log n) intros, and sequence structure.",
  }),
  meta({
    id: "bitonic-subsequence",
    name: "Bitonic Subsequence",
    group: "Sequence DP",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n²)",
    space: "O(n)",
    available: true,
    definition:
      "Longest subsequence that increases then decreases. Combine LIS from the left with LDS from the right at each peak.",
    usage: "Unimodal sequences, mountain arrays, and peak-centered DP.",
  }),
  meta({
    id: "matrix-chain",
    name: "Matrix Chain",
    group: "Interval DP",
    worst: "O(n³)",
    average: "O(n³)",
    best: "O(n³)",
    space: "O(n²)",
    available: true,
    definition:
      "Minimum scalar multiplies to multiply a chain of matrices. For each interval, try every split and add the merge cost from the three dimensions.",
    usage:
      "Classic interval DP; compiler matrix scheduling and associative product costs.",
  }),
  meta({
    id: "burst-balloons",
    name: "Burst Balloons",
    group: "Interval DP",
    worst: "O(n³)",
    average: "O(n³)",
    best: "O(n³)",
    space: "O(n²)",
    available: true,
    definition:
      "Maximize coins bursting balloons. dp[L][R] assumes balloons L and R stay; try each last burst i inside (L,R) and add nums[L]*nums[i]*nums[R].",
    usage: "Open-interval DP, game scoring, and reverse-thinking fill order.",
  }),
  meta({
    id: "palindrome-partitioning",
    name: "Palindrome Partitioning",
    group: "Interval DP",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n²)",
    space: "O(n²)",
    available: true,
    definition:
      "Minimum cuts so every substring is a palindrome. Precompute isPal[i][j], then cuts[i] is the best last-palindrome ending at i.",
    usage: "String cuts, palindrome checks, and prefix DP over intervals.",
  }),
  meta({
    id: "tree-diameter",
    name: "Tree Diameter",
    group: "Tree DP",
    worst: "O(n)",
    average: "O(n)",
    best: "O(n)",
    space: "O(h)",
    available: true,
    definition:
      "Longest path in a tree (edge count). Post-order: combine left/right heights through each node and track the global max.",
    usage: "Tree metrics, network farthest-pair warmups, and rerooting intros.",
  }),
  meta({
    id: "maximum-path-sum",
    name: "Maximum Path Sum",
    group: "Tree DP",
    worst: "O(n)",
    average: "O(n)",
    best: "O(n)",
    space: "O(h)",
    available: true,
    definition:
      "Highest-sum path between any two nodes. Each node returns the best upward gain and updates a global best using both children.",
    usage: "Binary tree path problems and gain-style tree DP with negative values.",
  }),
  meta({
    id: "dag-dp",
    name: "DAG DP",
    group: "Graph DP",
    worst: "O(V + E)",
    average: "O(V + E)",
    best: "O(V + E)",
    space: "O(V)",
    available: true,
    definition:
      "Shortest paths on a DAG: process nodes in topological order and relax edges so each dp[v] sees final predecessor values once.",
    usage: "Scheduling DAGs, critical paths, and any DP on acyclic dependency graphs.",
  }),
  meta({
    id: "tsp",
    name: "TSP",
    group: "Bitmask DP",
    worst: "O(n² · 2ⁿ)",
    average: "O(n² · 2ⁿ)",
    best: "O(n² · 2ⁿ)",
    space: "O(n · 2ⁿ)",
    available: true,
    definition:
      "Held-Karp DP: dp[mask][i] is the cheapest way to visit the cities in mask and end at i, then close the tour back to the start.",
    usage: "Exact TSP on tiny graphs and the classic bitmask DP template.",
  }),
  meta({
    id: "assignment",
    name: "Assignment",
    group: "Bitmask DP",
    worst: "O(n² · 2ⁿ)",
    average: "O(n² · 2ⁿ)",
    best: "O(n² · 2ⁿ)",
    space: "O(2ⁿ)",
    available: true,
    definition:
      "Minimum-cost bijection of n people to n jobs. dp[mask] is the best cost after assigning the first |mask| people to the jobs in mask.",
    usage: "Matching, scheduling, and the standard “assign one item per bit” DP pattern.",
  }),
  meta({
    id: "minimax",
    name: "Minimax",
    group: "Game DP",
    worst: "O(b^d)",
    average: "O(b^d)",
    best: "O(b^d)",
    space: "O(b^d)",
    available: true,
    definition:
      "Bottom-up game-tree search: MAX nodes take the better child, MIN nodes take the worse, so the root value is optimal play.",
    usage: "Two-player zero-sum games, adversarial search, and alpha-beta warmups.",
  }),
  meta({
    id: "optimal-strategy",
    name: "Optimal Strategy",
    group: "Game DP",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n²)",
    space: "O(n²)",
    available: true,
    definition:
      "Pots in a line: each turn take a left or right end. Interval DP stores what the player to move can guarantee from every subarray.",
    usage: "Classic “pots of gold” / stone-game style optimal play on an array.",
  }),
];

export const DP_RUNNERS: Record<DpAlgoId, DpRunner> = {
  fibonacci,
  "climbing-stairs": climbingStairs,
  "house-robber": houseRobber,
  "coin-change": coinChange,
  "unique-paths": uniquePaths,
  "min-path-sum": minPathSum,
  "dungeon-game": dungeonGame,
  "knapsack-01": knapsack01,
  "knapsack-unbounded": knapsackUnbounded,
  "subset-sum": subsetSum,
  lcs,
  "edit-distance": editDistance,
  "word-break": wordBreak,
  "palindromic-subsequence": palindromicSubsequence,
  lis,
  "bitonic-subsequence": bitonicSubsequence,
  "matrix-chain": matrixChain,
  "burst-balloons": burstBalloons,
  "palindrome-partitioning": palindromePartitioning,
  "tree-diameter": treeDiameter,
  "maximum-path-sum": maximumPathSum,
  "dag-dp": dagDp,
  tsp,
  assignment,
  minimax,
  "optimal-strategy": optimalStrategy,
};

export function getDpAlgo(id: DpAlgoId): DpMeta {
  const item = DP_META.find((m) => m.id === id);
  if (!item) throw new Error(`Unknown DP algorithm: ${id}`);
  return item;
}

export function runDpAlgo(id: DpAlgoId, input: DpInput) {
  return DP_RUNNERS[id](input);
}
