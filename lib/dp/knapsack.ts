import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput } from "./types";

function itemsOf(input: DpInput) {
  const weights = input.weights.length > 0 ? input.weights : [2, 3, 4, 5];
  const profits =
    input.profits.length > 0 ? input.profits : weights.map((w, i) => w + 1 + i);
  const n = Math.min(weights.length, profits.length);
  return {
    weights: weights.slice(0, n),
    profits: profits.slice(0, n),
    capacity: input.capacity || 8,
  };
}

export function knapsack01(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const { weights, profits, capacity: W } = itemsOf(input);
  const n = weights.length;
  const items = weights.map((weight, i) => ({ weight, value: profits[i]! }));
  const dp: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: W + 1 }, () => null),
  );
  const colLabels = Array.from({ length: W + 1 }, (_, w) => String(w));
  const rowLabels = ["∅", ...items.map((_, i) => `i${i}`)];

  t.pushGrid(dp, t.idleGrid(n + 1, W + 1), "0/1 Knapsack — each item at most once.", {
    formula: "dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt] + val)",
    items,
    itemRoles: Array.from({ length: n }, () => "idle"),
    colLabels,
    rowLabels,
  });

  for (let w = 0; w <= W; w += 1) {
    dp[0]![w] = 0;
  }
  t.sub();
  {
    const roles = t.idleGrid(n + 1, W + 1);
    for (let w = 0; w <= W; w += 1) roles[0]![w] = "write";
    t.pushGrid(dp, roles, "Base row: no items → value 0 for every capacity.", {
      formula: "dp[0][w] = 0",
      items,
      itemRoles: Array.from({ length: n }, () => "idle"),
      colLabels,
      rowLabels,
    });
  }

  for (let i = 1; i <= n; i += 1) {
    const wt = weights[i - 1]!;
    const val = profits[i - 1]!;
    const itemRoles = Array.from({ length: n }, () => "idle" as DpCellRole);
    itemRoles[i - 1] = "current";

    for (let w = 0; w <= W; w += 1) {
      const rolesRead = t.idleGrid(n + 1, W + 1);
      rolesRead[i]![w] = "current";
      rolesRead[i - 1]![w] = "read";
      if (w >= wt) rolesRead[i - 1]![w - wt] = "read";

      if (w < wt) {
        t.pushGrid(
          dp,
          rolesRead,
          `Item ${i - 1} (w=${wt}, v=${val}): capacity ${w} too small — skip.`,
          {
            formula: `dp[${i}][${w}] = dp[${i - 1}][${w}]`,
            items,
            itemRoles: itemRoles.map((r, idx) => (idx === i - 1 ? "skip" : r)),
            colLabels,
            rowLabels,
          },
        );
        dp[i]![w] = dp[i - 1]![w] ?? 0;
      } else {
        const skip = dp[i - 1]![w] ?? 0;
        const take = (dp[i - 1]![w - wt] ?? 0) + val;
        t.pushGrid(dp, rolesRead, `Item ${i - 1}: skip=${skip} vs take=${take}.`, {
          formula: `dp[${i}][${w}] = max(${skip}, ${take})`,
          items,
          itemRoles,
          colLabels,
          rowLabels,
        });
        dp[i]![w] = Math.max(skip, take);
      }
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(n + 1, W + 1);
      rolesWrite[i]![w] = "write";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${w}] = ${dp[i]![w]}.`, {
        formula: `dp[${i}][${w}] = ${dp[i]![w]}`,
        items,
        itemRoles,
        colLabels,
        rowLabels,
      });
    }
  }

  const done = t.idleGrid(n + 1, W + 1);
  done[n]![W] = "answer";
  t.pushGrid(dp, done, `Answer: max value = ${dp[n]![W]} with capacity ${W}.`, {
    formula: `dp[${n}][${W}] = ${dp[n]![W]}`,
    items,
    itemRoles: Array.from({ length: n }, () => "idle"),
    colLabels,
    rowLabels,
  });
  return t.frames;
}

export function knapsackUnbounded(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const { weights, profits, capacity: W } = itemsOf(input);
  const n = weights.length;
  const items = weights.map((weight, i) => ({ weight, value: profits[i]! }));
  const dp: (number | null)[] = Array.from({ length: W + 1 }, () => null);

  t.push(dp, t.idle(W + 1), "Unbounded Knapsack — unlimited copies of each item.", {
    formula: "dp[w] = max(dp[w], dp[w - wt] + val)",
    items,
    itemRoles: Array.from({ length: n }, () => "idle"),
  });

  dp[0] = 0;
  t.sub();
  t.step();
  {
    const roles = t.idle(W + 1);
    roles[0] = "write";
    t.push(dp, roles, "Base: capacity 0 → value 0.", {
      formula: "dp[0] = 0",
      items,
      itemRoles: Array.from({ length: n }, () => "idle"),
    });
  }

  for (let w = 1; w <= W; w += 1) {
    dp[w] = 0;
    const rolesInit = t.idle(W + 1);
    rolesInit[w] = "current";
    t.push(dp, rolesInit, `Fill capacity ${w}.`, {
      formula: `dp[${w}] starts at 0`,
      items,
      itemRoles: Array.from({ length: n }, () => "idle"),
    });

    for (let i = 0; i < n; i += 1) {
      const wt = weights[i]!;
      const val = profits[i]!;
      const itemRoles = Array.from({ length: n }, () => "idle" as DpCellRole);
      itemRoles[i] = "read";
      if (w < wt) {
        const roles = t.idle(W + 1);
        roles[w] = "current";
        t.push(dp, roles, `Item ${i} (w=${wt}) too heavy for ${w}.`, {
          formula: `skip item ${i}`,
          items,
          itemRoles: itemRoles.map((r, idx) => (idx === i ? "skip" : r)),
        });
        continue;
      }
      const candidate = (dp[w - wt] ?? 0) + val;
      const rolesRead = t.idle(W + 1);
      rolesRead[w] = "current";
      rolesRead[w - wt] = "read";
      t.push(
        dp,
        rolesRead,
        `Try item ${i}: dp[${w - wt}] + ${val} = ${candidate} vs dp[${w}] = ${dp[w]}.`,
        {
          formula: `dp[${w}] = max(dp[${w}], dp[${w - wt}] + ${val})`,
          items,
          itemRoles,
        },
      );
      if (candidate > (dp[w] ?? 0)) {
        dp[w] = candidate;
        t.step();
        const rolesWrite = t.idle(W + 1);
        rolesWrite[w] = "write";
        rolesWrite[w - wt] = "read";
        itemRoles[i] = "write";
        t.push(dp, rolesWrite, `Update dp[${w}] = ${candidate}.`, {
          formula: `dp[${w}] = ${candidate}`,
          items,
          itemRoles,
        });
      }
    }
    t.sub();
  }

  const done = t.idle(W + 1);
  done[W] = "answer";
  t.push(dp, done, `Answer: max value = ${dp[W]} with capacity ${W}.`, {
    formula: `dp[${W}] = ${dp[W]}`,
    items,
    itemRoles: Array.from({ length: n }, () => "idle"),
  });
  return t.frames;
}

export function subsetSum(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const nums =
    input.weights.length > 0
      ? input.weights
      : input.values.length > 0
        ? input.values
        : [3, 34, 4, 12, 5, 2];
  const target = input.capacity || input.amount || 9;
  const n = nums.length;
  const items = nums.map((weight) => ({ weight, value: weight }));
  // dp[i][s] = 1 if achievable, 0 otherwise (null = unfilled)
  const dp: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: target + 1 }, () => null),
  );
  const colLabels = Array.from({ length: target + 1 }, (_, s) => String(s));
  const rowLabels = ["∅", ...nums.map((_, i) => `a${i}`)];

  t.pushGrid(
    dp,
    t.idleGrid(n + 1, target + 1),
    `Subset Sum — can we pick a subset summing to ${target}?`,
    {
      formula: "dp[i][s] = dp[i-1][s] OR dp[i-1][s - a[i-1]]",
      items,
      itemRoles: Array.from({ length: n }, () => "idle"),
      colLabels,
      rowLabels,
    },
  );

  dp[0]![0] = 1;
  for (let s = 1; s <= target; s += 1) dp[0]![s] = 0;
  t.sub();
  {
    const roles = t.idleGrid(n + 1, target + 1);
    roles[0]![0] = "write";
    for (let s = 1; s <= target; s += 1) roles[0]![s] = "write";
    t.pushGrid(dp, roles, "Base: empty subset makes 0 only.", {
      formula: "dp[0][0]=1, dp[0][s]=0",
      items,
      itemRoles: Array.from({ length: n }, () => "idle"),
      colLabels,
      rowLabels,
    });
  }

  for (let i = 1; i <= n; i += 1) {
    const a = nums[i - 1]!;
    const itemRoles = Array.from({ length: n }, () => "idle" as DpCellRole);
    itemRoles[i - 1] = "current";
    for (let s = 0; s <= target; s += 1) {
      const rolesRead = t.idleGrid(n + 1, target + 1);
      rolesRead[i]![s] = "current";
      rolesRead[i - 1]![s] = "read";
      const without = dp[i - 1]![s] === 1;
      let withItem = false;
      if (s >= a) {
        rolesRead[i - 1]![s - a] = "read";
        withItem = dp[i - 1]![s - a] === 1;
      }
      t.pushGrid(
        dp,
        rolesRead,
        s < a
          ? `a[${i - 1}]=${a} > ${s} — only skip.`
          : `Sum ${s}: skip=${without ? "yes" : "no"}, take=${withItem ? "yes" : "no"}.`,
        {
          formula:
            s < a
              ? `dp[${i}][${s}] = dp[${i - 1}][${s}]`
              : `dp[${i}][${s}] = dp[${i - 1}][${s}] ∨ dp[${i - 1}][${s - a}]`,
          items,
          itemRoles,
          colLabels,
          rowLabels,
        },
      );
      dp[i]![s] = without || withItem ? 1 : 0;
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(n + 1, target + 1);
      rolesWrite[i]![s] = "write";
      t.pushGrid(
        dp,
        rolesWrite,
        `dp[${i}][${s}] = ${dp[i]![s] === 1 ? "true" : "false"}.`,
        {
          formula: `dp[${i}][${s}] = ${dp[i]![s]}`,
          items,
          itemRoles,
          colLabels,
          rowLabels,
        },
      );
    }
  }

  const ok = dp[n]![target] === 1;
  const done = t.idleGrid(n + 1, target + 1);
  done[n]![target] = "answer";
  t.pushGrid(
    dp,
    done,
    ok
      ? `Answer: yes — a subset sums to ${target}.`
      : `Answer: no subset sums to ${target}.`,
    {
      formula: `dp[${n}][${target}] = ${ok ? 1 : 0}`,
      items,
      itemRoles: Array.from({ length: n }, () => "idle"),
      colLabels,
      rowLabels,
    },
  );
  return t.frames;
}
