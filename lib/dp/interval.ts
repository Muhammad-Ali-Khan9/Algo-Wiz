import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput } from "./types";

const INF = 1_000_000_000;

function emptyDp(n: number): (number | null)[][] {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => null));
}

function dimsOf(input: DpInput): number[] {
  if (input.values.length >= 3) return input.values;
  return [10, 20, 30, 40, 30];
}

function balloonsOf(input: DpInput): number[] {
  return input.values.length > 0 ? input.values : [3, 1, 5, 8];
}

/** Matrix Chain Multiplication — dims[i-1]×dims[i] is matrix i. */
export function matrixChain(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const dims = dimsOf(input);
  const n = dims.length - 1; // number of matrices
  const dp = emptyDp(n);
  const labels = Array.from({ length: n }, (_, i) => `M${i}`);
  const idleInput = (): DpCellRole[] =>
    Array.from({ length: dims.length }, () => "idle" as DpCellRole);

  t.pushGrid(
    dp,
    t.idleGrid(n, n),
    "Matrix Chain — min scalar multiplies for M0…M" + (n - 1) + ".",
    {
      formula: "dp[i][j] = min_k dp[i][k]+dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]",
      rowLabels: labels,
      colLabels: labels,
      input: dims,
      inputRoles: idleInput(),
    },
  );

  for (let i = 0; i < n; i += 1) {
    dp[i]![i] = 0;
    t.sub();
    const roles = t.idleGrid(n, n);
    roles[i]![i] = "write";
    t.pushGrid(dp, roles, `Single matrix M${i} — no multiply cost.`, {
      formula: `dp[${i}][${i}] = 0`,
      rowLabels: labels,
      colLabels: labels,
      input: dims,
      inputRoles: idleInput(),
    });
  }

  for (let len = 2; len <= n; len += 1) {
    for (let i = 0; i + len - 1 < n; i += 1) {
      const j = i + len - 1;
      let best = INF;
      const rolesCur = t.idleGrid(n, n);
      rolesCur[i]![j] = "current";
      t.pushGrid(dp, rolesCur, `Interval M${i}…M${j} — try every split k.`, {
        formula: `fill dp[${i}][${j}]`,
        rowLabels: labels,
        colLabels: labels,
        input: dims,
        inputRoles: idleInput(),
      });

      for (let k = i; k < j; k += 1) {
        const left = dp[i]![k] ?? 0;
        const right = dp[k + 1]![j] ?? 0;
        const cost = dims[i]! * dims[k + 1]! * dims[j + 1]!;
        const total = left + right + cost;
        const rolesRead = t.idleGrid(n, n);
        rolesRead[i]![j] = "current";
        rolesRead[i]![k] = "read";
        rolesRead[k + 1]![j] = "read";
        const ir = idleInput();
        ir[i] = "read";
        ir[k + 1] = "read";
        ir[j + 1] = "read";
        t.pushGrid(
          dp,
          rolesRead,
          `Split after M${k}: ${left}+${right}+${dims[i]}·${dims[k + 1]}·${dims[j + 1]}=${total}.`,
          {
            formula: `cost = ${left}+${right}+${cost}`,
            rowLabels: labels,
            colLabels: labels,
            input: dims,
            inputRoles: ir,
          },
        );
        t.step();
        if (total < best) {
          best = total;
          dp[i]![j] = total;
          const rolesWrite = t.idleGrid(n, n);
          rolesWrite[i]![j] = "write";
          rolesWrite[i]![k] = "read";
          rolesWrite[k + 1]![j] = "read";
          t.pushGrid(dp, rolesWrite, `Best so far for [${i},${j}]: ${total}.`, {
            formula: `dp[${i}][${j}] = ${total}`,
            rowLabels: labels,
            colLabels: labels,
            input: dims,
            inputRoles: ir,
          });
        }
      }
      t.sub();
    }
  }

  const done = t.idleGrid(n, n);
  done[0]![n - 1] = "answer";
  t.pushGrid(dp, done, `Answer: min cost ${dp[0]![n - 1]}.`, {
    formula: `dp[0][${n - 1}] = ${dp[0]![n - 1]}`,
    rowLabels: labels,
    colLabels: labels,
    input: dims,
    inputRoles: idleInput(),
  });
  return t.frames;
}

/** Burst Balloons — max coins with padded boundaries of 1. */
export function burstBalloons(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const raw = balloonsOf(input);
  const nums = [1, ...raw, 1];
  const m = nums.length;
  const dp = emptyDp(m);
  const labels = nums.map(String);
  const idleInput = (): DpCellRole[] =>
    Array.from({ length: raw.length }, () => "idle" as DpCellRole);

  t.pushGrid(
    dp,
    t.idleGrid(m, m),
    "Burst Balloons — max coins; last burst in (L,R) is the open interval.",
    {
      formula: "dp[L][R] = max_i nums[L]*nums[i]*nums[R] + dp[L][i]+dp[i][R]",
      rowLabels: labels,
      colLabels: labels,
      input: raw,
      inputRoles: idleInput(),
    },
  );

  for (let i = 0; i < m; i += 1) {
    dp[i]![i] = 0;
  }
  {
    const roles = t.idleGrid(m, m);
    for (let i = 0; i < m; i += 1) roles[i]![i] = "write";
    t.pushGrid(dp, roles, "Empty open interval (i,i) — nothing to burst.", {
      formula: "dp[i][i] = 0",
      rowLabels: labels,
      colLabels: labels,
      input: raw,
      inputRoles: idleInput(),
    });
  }

  for (let len = 2; len < m; len += 1) {
    for (let L = 0; L + len < m; L += 1) {
      const R = L + len;
      dp[L]![R] = 0;
      const rolesCur = t.idleGrid(m, m);
      rolesCur[L]![R] = "current";
      t.pushGrid(dp, rolesCur, `Open interval (${L},${R}) — try last balloon i.`, {
        formula: `fill dp[${L}][${R}]`,
        rowLabels: labels,
        colLabels: labels,
        input: raw,
        inputRoles: idleInput(),
      });

      for (let i = L + 1; i < R; i += 1) {
        const gain = nums[L]! * nums[i]! * nums[R]!;
        const total = gain + (dp[L]![i] ?? 0) + (dp[i]![R] ?? 0);
        const rolesRead = t.idleGrid(m, m);
        rolesRead[L]![R] = "current";
        rolesRead[L]![i] = "read";
        rolesRead[i]![R] = "read";
        const ir = idleInput();
        // map i to raw index when inside balloons
        if (i >= 1 && i <= raw.length) ir[i - 1] = "current";
        t.pushGrid(
          dp,
          rolesRead,
          `Last burst ${nums[i]} at i=${i}: ${nums[L]}·${nums[i]}·${nums[R]} + sides = ${total}.`,
          {
            formula: `${gain} + dp[${L}][${i}] + dp[${i}][${R}]`,
            rowLabels: labels,
            colLabels: labels,
            input: raw,
            inputRoles: ir,
          },
        );
        t.step();
        if (total > (dp[L]![R] ?? 0)) {
          dp[L]![R] = total;
          const rolesWrite = t.idleGrid(m, m);
          rolesWrite[L]![R] = "write";
          rolesWrite[L]![i] = "read";
          rolesWrite[i]![R] = "read";
          t.pushGrid(dp, rolesWrite, `Best for (${L},${R}): ${total}.`, {
            formula: `dp[${L}][${R}] = ${total}`,
            rowLabels: labels,
            colLabels: labels,
            input: raw,
            inputRoles: ir,
          });
        }
      }
      t.sub();
    }
  }

  const done = t.idleGrid(m, m);
  done[0]![m - 1] = "answer";
  t.pushGrid(dp, done, `Answer: max coins ${dp[0]![m - 1]}.`, {
    formula: `dp[0][${m - 1}] = ${dp[0]![m - 1]}`,
    rowLabels: labels,
    colLabels: labels,
    input: raw,
    inputRoles: idleInput(),
  });
  return t.frames;
}

/** Palindrome Partitioning — minimum cuts so every part is a palindrome. */
export function palindromePartitioning(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const s = (input.textA || "aab").toLowerCase();
  const n = s.length;
  const isPal = emptyDp(n);
  const labels = s.split("");
  const chars = s.split("").map((ch) => ch.charCodeAt(0) - 96);

  t.pushGrid(
    isPal,
    t.idleGrid(n, n),
    `Palindrome Partitioning — min cuts for "${s}". First build isPal.`,
    {
      formula: "isPal[i][j] = s[i]==s[j] && (j-i<2 || isPal[i+1][j-1])",
      rowLabels: labels,
      colLabels: labels,
      input: chars,
      inputRoles: t.idle(n),
    },
  );

  for (let i = 0; i < n; i += 1) {
    isPal[i]![i] = 1;
    t.sub();
    const roles = t.idleGrid(n, n);
    roles[i]![i] = "write";
    t.pushGrid(isPal, roles, `Single char '${s[i]}' is a palindrome.`, {
      formula: `isPal[${i}][${i}] = true`,
      rowLabels: labels,
      colLabels: labels,
      input: chars,
      inputRoles: t.idle(n),
    });
  }

  for (let len = 2; len <= n; len += 1) {
    for (let i = 0; i + len - 1 < n; i += 1) {
      const j = i + len - 1;
      const rolesRead = t.idleGrid(n, n);
      rolesRead[i]![j] = "current";
      if (len > 2) rolesRead[i + 1]![j - 1] = "read";
      const endsMatch = s[i] === s[j];
      const inner = len === 2 ? true : (isPal[i + 1]![j - 1] ?? 0) === 1;
      const ok = endsMatch && inner;
      t.pushGrid(
        isPal,
        rolesRead,
        ok
          ? `'${s[i]}'…'${s[j]}' is a palindrome.`
          : `'${s[i]}'…'${s[j]}' is not a palindrome.`,
        {
          formula: endsMatch
            ? len === 2
              ? "ends match, length 2"
              : `ends match && isPal[${i + 1}][${j - 1}]`
            : "ends differ",
          rowLabels: labels,
          colLabels: labels,
          input: chars,
          inputRoles: t.idle(n).map((r, idx) => (idx === i || idx === j ? "current" : r)),
        },
      );
      isPal[i]![j] = ok ? 1 : 0;
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(n, n);
      rolesWrite[i]![j] = "write";
      t.pushGrid(isPal, rolesWrite, `isPal[${i}][${j}] = ${ok ? "T" : "F"}.`, {
        formula: `isPal[${i}][${j}] = ${ok}`,
        rowLabels: labels,
        colLabels: labels,
        input: chars,
        inputRoles: t.idle(n),
      });
    }
  }

  const cuts: (number | null)[] = Array.from({ length: n }, () => null);
  t.push(cuts, t.idle(n), "Now compute min cuts for each prefix.", {
    formula: "cuts[i] = min over palindrome endings at i",
    input: chars,
    inputRoles: t.idle(n),
  });

  for (let i = 0; i < n; i += 1) {
    if ((isPal[0]![i] ?? 0) === 1) {
      cuts[i] = 0;
      t.sub();
      const roles = t.idle(n);
      roles[i] = "write";
      t.push(cuts, roles, `s[0..${i}] is already a palindrome — 0 cuts.`, {
        formula: `cuts[${i}] = 0`,
        input: chars,
        inputRoles: t.idle(n).map((r, idx) => (idx <= i ? "current" : r)),
      });
      continue;
    }

    cuts[i] = INF;
    let best = INF;
    const rolesCur = t.idle(n);
    rolesCur[i] = "current";
    t.push(cuts, rolesCur, `Prefix ending at ${i} — try last cut before a palindrome.`, {
      formula: `fill cuts[${i}]`,
      input: chars,
      inputRoles: t.idle(n),
    });

    for (let j = 1; j <= i; j += 1) {
      if ((isPal[j]![i] ?? 0) !== 1) {
        t.step();
        continue;
      }
      const cand = (cuts[j - 1] ?? 0) + 1;
      const rolesRead = t.idle(n);
      rolesRead[i] = "current";
      rolesRead[j - 1] = "read";
      t.push(cuts, rolesRead, `s[${j}..${i}] palindrome → cuts[${j - 1}]+1 = ${cand}.`, {
        formula: `cuts[${i}] = min(cuts[${i}], cuts[${j - 1}]+1)`,
        input: chars,
        inputRoles: t
          .idle(n)
          .map((r, idx) =>
            idx >= j && idx <= i ? "current" : idx === j - 1 ? "read" : r,
          ),
      });
      t.step();
      if (cand < best) {
        best = cand;
        cuts[i] = cand;
        const rolesWrite = t.idle(n);
        rolesWrite[i] = "write";
        rolesWrite[j - 1] = "read";
        t.push(cuts, rolesWrite, `cuts[${i}] = ${cand}.`, {
          formula: `cuts[${i}] = ${cand}`,
          input: chars,
          inputRoles: t.idle(n),
        });
      }
    }
    t.sub();
  }

  const done = t.idle(n);
  done[n - 1] = "answer";
  t.push(cuts, done, `Answer: ${cuts[n - 1]} cut(s) for "${s}".`, {
    formula: `cuts[${n - 1}] = ${cuts[n - 1]}`,
    input: chars,
    inputRoles: t.idle(n),
  });
  return t.frames;
}
