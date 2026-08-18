import { dungeonGame, minPathSum, uniquePaths } from "./grid";
import { knapsack01, knapsackUnbounded, subsetSum } from "./knapsack";
import { climbingStairs, coinChange, fibonacci, houseRobber } from "./oned";
import { DP_CODE } from "./snippets";
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
};

export function getDpAlgo(id: DpAlgoId): DpMeta {
  const item = DP_META.find((m) => m.id === id);
  if (!item) throw new Error(`Unknown DP algorithm: ${id}`);
  return item;
}

export function runDpAlgo(id: DpAlgoId, input: DpInput) {
  return DP_RUNNERS[id](input);
}
