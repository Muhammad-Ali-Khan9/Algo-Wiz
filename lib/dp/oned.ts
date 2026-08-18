import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput } from "./types";

export function fibonacci(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const n = input.n;
  const dp: (number | null)[] = Array.from({ length: n + 1 }, () => null);
  t.push(dp, t.idle(n + 1), `Fibonacci — compute F(0)…F(${n}) bottom-up.`, {
    formula: "F(i) = F(i-1) + F(i-2)",
  });

  dp[0] = 0;
  t.sub();
  t.step();
  {
    const roles = t.idle(n + 1);
    roles[0] = "write";
    t.push(dp, roles, "Base: F(0) = 0.", { formula: "F(0) = 0" });
  }

  if (n >= 1) {
    dp[1] = 1;
    t.sub();
    t.step();
    const roles = t.idle(n + 1);
    roles[0] = "idle";
    roles[1] = "write";
    t.push(dp, roles, "Base: F(1) = 1.", { formula: "F(1) = 1" });
  }

  for (let i = 2; i <= n; i += 1) {
    const rolesRead = t.idle(n + 1);
    rolesRead[i - 1] = "read";
    rolesRead[i - 2] = "read";
    rolesRead[i] = "current";
    t.push(dp, rolesRead, `Need F(${i - 1}) and F(${i - 2}) to fill F(${i}).`, {
      formula: `F(${i}) = F(${i - 1}) + F(${i - 2})`,
    });
    dp[i] = (dp[i - 1] ?? 0) + (dp[i - 2] ?? 0);
    t.sub();
    t.step();
    const rolesWrite = t.idle(n + 1);
    rolesWrite[i - 1] = "read";
    rolesWrite[i - 2] = "read";
    rolesWrite[i] = "write";
    t.push(dp, rolesWrite, `F(${i}) = ${dp[i]}.`, {
      formula: `F(${i}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
    });
  }

  const done = t.idle(n + 1);
  done[n] = "answer";
  t.push(dp, done, `Answer: F(${n}) = ${dp[n]}.`, {
    formula: `F(${n}) = ${dp[n]}`,
  });
  return t.frames;
}

export function climbingStairs(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const n = input.n;
  const dp: (number | null)[] = Array.from({ length: n + 1 }, () => null);
  t.push(
    dp,
    t.idle(n + 1),
    `Climbing Stairs — ways to reach step ${n} (1 or 2 at a time).`,
    { formula: "dp[i] = dp[i-1] + dp[i-2]" },
  );

  dp[0] = 1;
  t.sub();
  t.step();
  {
    const roles = t.idle(n + 1);
    roles[0] = "write";
    t.push(dp, roles, "Base: 1 way to stay at step 0.", { formula: "dp[0] = 1" });
  }

  if (n >= 1) {
    dp[1] = 1;
    t.sub();
    t.step();
    const roles = t.idle(n + 1);
    roles[1] = "write";
    t.push(dp, roles, "Base: one single step to reach 1.", { formula: "dp[1] = 1" });
  }

  for (let i = 2; i <= n; i += 1) {
    const rolesRead = t.idle(n + 1);
    rolesRead[i - 1] = "read";
    rolesRead[i - 2] = "read";
    rolesRead[i] = "current";
    t.push(
      dp,
      rolesRead,
      `Reach ${i} from ${i - 1} (last step +1) or ${i - 2} (last step +2).`,
      { formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}]` },
    );
    dp[i] = (dp[i - 1] ?? 0) + (dp[i - 2] ?? 0);
    t.sub();
    t.step();
    const rolesWrite = t.idle(n + 1);
    rolesWrite[i] = "write";
    t.push(dp, rolesWrite, `dp[${i}] = ${dp[i]} ways.`, {
      formula: `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
    });
  }

  const done = t.idle(n + 1);
  done[n] = "answer";
  t.push(dp, done, `Answer: ${dp[n]} ways to climb ${n} stairs.`, {
    formula: `dp[${n}] = ${dp[n]}`,
  });
  return t.frames;
}

export function houseRobber(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const houses = input.values.length ? input.values : [2, 7, 9, 3, 1];
  const n = houses.length;
  const dp: (number | null)[] = Array.from({ length: n }, () => null);
  const inputRoles = (): DpCellRole[] => Array.from({ length: n }, () => "idle");

  t.push(dp, t.idle(n), "House Robber — max loot with no two adjacent houses.", {
    formula: "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
    input: houses,
    inputRoles: inputRoles(),
  });

  if (n === 0) {
    t.push(dp, t.idle(0), "No houses — answer 0.");
    return t.frames;
  }

  dp[0] = houses[0]!;
  t.sub();
  t.step();
  {
    const roles = t.idle(n);
    roles[0] = "write";
    const ir = inputRoles();
    ir[0] = "read";
    t.push(dp, roles, `Only house 0 → take ${houses[0]}.`, {
      formula: `dp[0] = ${houses[0]}`,
      input: houses,
      inputRoles: ir,
    });
  }

  if (n === 1) {
    const done = t.idle(n);
    done[0] = "answer";
    t.push(dp, done, `Answer: ${dp[0]}.`, { input: houses, inputRoles: inputRoles() });
    return t.frames;
  }

  dp[1] = Math.max(houses[0]!, houses[1]!);
  t.sub();
  t.step();
  {
    const roles = t.idle(n);
    roles[0] = "read";
    roles[1] = "write";
    const ir = inputRoles();
    ir[0] = "read";
    ir[1] = "read";
    t.push(dp, roles, `dp[1] = max(${houses[0]}, ${houses[1]}) = ${dp[1]}.`, {
      formula: `dp[1] = max(nums[0], nums[1])`,
      input: houses,
      inputRoles: ir,
    });
  }

  for (let i = 2; i < n; i += 1) {
    const skip = dp[i - 1] ?? 0;
    const take = (dp[i - 2] ?? 0) + houses[i]!;
    const rolesRead = t.idle(n);
    rolesRead[i - 1] = "read";
    rolesRead[i - 2] = "read";
    rolesRead[i] = "current";
    const ir = inputRoles();
    ir[i] = "read";
    t.push(
      dp,
      rolesRead,
      `House ${i}: skip → ${skip}, or rob → ${dp[i - 2]} + ${houses[i]} = ${take}.`,
      {
        formula: `dp[${i}] = max(dp[${i - 1}], dp[${i - 2}] + nums[${i}])`,
        input: houses,
        inputRoles: ir,
      },
    );
    dp[i] = Math.max(skip, take);
    t.sub();
    t.step();
    const rolesWrite = t.idle(n);
    rolesWrite[i] = "write";
    if (take >= skip) {
      rolesWrite[i - 2] = "read";
      ir[i] = "write";
    } else {
      rolesWrite[i - 1] = "read";
      ir[i] = "skip";
    }
    t.push(
      dp,
      rolesWrite,
      `Choose ${take >= skip ? "rob" : "skip"} → dp[${i}] = ${dp[i]}.`,
      {
        formula: `dp[${i}] = ${dp[i]}`,
        input: houses,
        inputRoles: ir,
      },
    );
  }

  const done = t.idle(n);
  done[n - 1] = "answer";
  t.push(dp, done, `Answer: maximum loot = ${dp[n - 1]}.`, {
    formula: `dp[${n - 1}] = ${dp[n - 1]}`,
    input: houses,
    inputRoles: inputRoles(),
  });
  return t.frames;
}

export function coinChange(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const coins = input.coins.length ? input.coins : [1, 2, 5];
  const amount = input.amount || input.n || 11;
  const INF = amount + 1;
  const dp: (number | null)[] = Array.from({ length: amount + 1 }, () => null);

  t.push(
    dp,
    t.idle(amount + 1),
    `Coin Change — fewest coins to make ${amount} from [${coins.join(", ")}].`,
    {
      formula: "dp[x] = min(dp[x], dp[x - coin] + 1)",
      input: coins,
      inputRoles: Array.from({ length: coins.length }, () => "idle"),
    },
  );

  dp[0] = 0;
  t.sub();
  t.step();
  {
    const roles = t.idle(amount + 1);
    roles[0] = "write";
    t.push(dp, roles, "Base: 0 coins to make amount 0.", {
      formula: "dp[0] = 0",
      input: coins,
      inputRoles: Array.from({ length: coins.length }, () => "idle"),
    });
  }

  for (let x = 1; x <= amount; x += 1) {
    dp[x] = INF;
    const rolesInit = t.idle(amount + 1);
    rolesInit[x] = "current";
    t.push(dp, rolesInit, `Initialize dp[${x}] = ∞ (unreachable so far).`, {
      formula: `dp[${x}] = ∞`,
      input: coins,
      inputRoles: Array.from({ length: coins.length }, () => "idle"),
    });

    for (let c = 0; c < coins.length; c += 1) {
      const coin = coins[c]!;
      const ir = Array.from({ length: coins.length }, () => "idle" as DpCellRole);
      ir[c] = "read";
      if (x < coin) {
        const roles = t.idle(amount + 1);
        roles[x] = "current";
        t.push(dp, roles, `Coin ${coin} > ${x} — skip.`, {
          formula: `coin ${coin} too big`,
          input: coins,
          inputRoles: ir,
        });
        continue;
      }
      const prev = dp[x - coin];
      if (prev == null || prev >= INF) {
        const roles = t.idle(amount + 1);
        roles[x] = "current";
        roles[x - coin] = "skip";
        t.push(dp, roles, `dp[${x - coin}] unreachable — cannot use coin ${coin}.`, {
          formula: `dp[${x - coin}] = ∞`,
          input: coins,
          inputRoles: ir,
        });
        continue;
      }
      const candidate = prev + 1;
      const rolesRead = t.idle(amount + 1);
      rolesRead[x] = "current";
      rolesRead[x - coin] = "read";
      t.push(
        dp,
        rolesRead,
        `Try coin ${coin}: dp[${x - coin}] + 1 = ${candidate} vs dp[${x}] = ${dp[x] === INF ? "∞" : dp[x]}.`,
        {
          formula: `dp[${x}] = min(dp[${x}], dp[${x - coin}] + 1)`,
          input: coins,
          inputRoles: ir,
        },
      );
      if (candidate < (dp[x] ?? INF)) {
        dp[x] = candidate;
        t.step();
        const rolesWrite = t.idle(amount + 1);
        rolesWrite[x] = "write";
        rolesWrite[x - coin] = "read";
        ir[c] = "write";
        t.push(dp, rolesWrite, `Update dp[${x}] = ${candidate}.`, {
          formula: `dp[${x}] = ${candidate}`,
          input: coins,
          inputRoles: ir,
        });
      }
    }
    t.sub();
  }

  const ans = dp[amount]!;
  const done = t.idle(amount + 1);
  done[amount] = "answer";
  t.push(
    dp,
    done,
    ans >= INF
      ? `Impossible to make ${amount}.`
      : `Answer: ${ans} coin(s) to make ${amount}.`,
    {
      formula: ans >= INF ? "impossible" : `dp[${amount}] = ${ans}`,
      input: coins,
      inputRoles: Array.from({ length: coins.length }, () => "idle"),
    },
  );
  return t.frames;
}

/** Sentinel used by coin-change for unreachable amounts. */
export function isUnreachable(value: number | null, amount: number) {
  return value != null && value > amount;
}
