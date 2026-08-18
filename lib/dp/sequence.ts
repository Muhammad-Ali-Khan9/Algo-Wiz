import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput } from "./types";

function seqOf(input: DpInput): number[] {
  return input.values.length > 0 ? input.values : [3, 1, 4, 1, 5, 9, 2, 6];
}

export function lis(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const nums = seqOf(input);
  const n = nums.length;
  const dp: (number | null)[] = Array.from({ length: n }, () => null);
  const idleInput = (): DpCellRole[] => Array.from({ length: n }, () => "idle");

  t.push(dp, t.idle(n), "LIS — longest increasing subsequence (O(n²) DP).", {
    formula: "dp[i] = 1 + max(dp[j]) for j < i and nums[j] < nums[i]",
    input: nums,
    inputRoles: idleInput(),
  });

  for (let i = 0; i < n; i += 1) {
    dp[i] = 1;
    t.sub();
    const roles = t.idle(n);
    roles[i] = "write";
    const ir = idleInput();
    ir[i] = "current";
    t.push(dp, roles, `Base: only nums[${i}]=${nums[i]} → length 1.`, {
      formula: `dp[${i}] = 1`,
      input: nums,
      inputRoles: ir,
    });
  }

  for (let i = 1; i < n; i += 1) {
    for (let j = 0; j < i; j += 1) {
      const rolesRead = t.idle(n);
      rolesRead[i] = "current";
      rolesRead[j] = "read";
      const ir = idleInput();
      ir[i] = "current";
      ir[j] = "read";

      if (nums[j]! < nums[i]!) {
        const cand = (dp[j] ?? 0) + 1;
        t.push(
          dp,
          rolesRead,
          `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]} — candidate ${cand}.`,
          {
            formula: `dp[${i}] = max(dp[${i}], dp[${j}]+1)`,
            input: nums,
            inputRoles: ir,
          },
        );
        if (cand > (dp[i] ?? 0)) {
          dp[i] = cand;
          t.step();
          const rolesWrite = t.idle(n);
          rolesWrite[i] = "write";
          rolesWrite[j] = "read";
          t.push(dp, rolesWrite, `Update dp[${i}] = ${dp[i]}.`, {
            formula: `dp[${i}] = ${dp[i]}`,
            input: nums,
            inputRoles: ir,
          });
        } else {
          t.step();
          const rolesSkip = t.idle(n);
          rolesSkip[i] = "skip";
          rolesSkip[j] = "read";
          t.push(dp, rolesSkip, `Candidate ${cand} ≤ current ${dp[i]} — keep.`, {
            formula: `dp[${i}] stays ${dp[i]}`,
            input: nums,
            inputRoles: ir,
          });
        }
      } else {
        t.push(
          dp,
          rolesRead,
          `nums[${j}]=${nums[j]} ≱ nums[${i}]=${nums[i]} — cannot extend.`,
          {
            formula: `skip j=${j}`,
            input: nums,
            inputRoles: ir.map((r, idx) => (idx === j ? "skip" : r)),
          },
        );
        t.step();
      }
    }
    t.sub();
  }

  let best = 0;
  let bestIdx = 0;
  for (let i = 0; i < n; i += 1) {
    if ((dp[i] ?? 0) > best) {
      best = dp[i]!;
      bestIdx = i;
    }
  }
  const done = t.idle(n);
  done[bestIdx] = "answer";
  t.push(dp, done, `Answer: LIS length ${best}.`, {
    formula: `max(dp) = ${best}`,
    input: nums,
    inputRoles: idleInput(),
  });
  return t.frames;
}

export function bitonicSubsequence(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const nums = seqOf(input);
  const n = nums.length;
  const lisArr: (number | null)[] = Array.from({ length: n }, () => null);
  const ldsArr: (number | null)[] = Array.from({ length: n }, () => null);
  const snapshot = (): (number | null)[][] => [lisArr.slice(), ldsArr.slice()];
  const rowLabels = ["LIS↑", "LDS↓"];
  const colLabels = nums.map(String);
  const idleInput = (): DpCellRole[] => Array.from({ length: n }, () => "idle");

  t.pushGrid(
    snapshot(),
    t.idleGrid(2, n),
    "Longest Bitonic Subsequence — increase then decrease.",
    {
      formula: "bitonic[i] = lis[i] + lds[i] − 1",
      rowLabels,
      colLabels,
      input: nums,
      inputRoles: idleInput(),
    },
  );

  for (let i = 0; i < n; i += 1) {
    lisArr[i] = 1;
    t.sub();
    const roles = t.idleGrid(2, n);
    roles[0]![i] = "write";
    const ir = idleInput();
    ir[i] = "current";
    t.pushGrid(snapshot(), roles, `LIS↑ base: ending at ${i} alone → 1.`, {
      formula: `lis[${i}] = 1`,
      rowLabels,
      colLabels,
      input: nums,
      inputRoles: ir,
    });
  }

  for (let i = 1; i < n; i += 1) {
    for (let j = 0; j < i; j += 1) {
      const rolesRead = t.idleGrid(2, n);
      rolesRead[0]![i] = "current";
      rolesRead[0]![j] = "read";
      const ir = idleInput();
      ir[i] = "current";
      ir[j] = "read";

      if (nums[j]! < nums[i]!) {
        const cand = (lisArr[j] ?? 0) + 1;
        t.pushGrid(
          snapshot(),
          rolesRead,
          `LIS↑: ${nums[j]} < ${nums[i]} → candidate ${cand}.`,
          {
            formula: `lis[${i}] = max(lis[${i}], lis[${j}]+1)`,
            rowLabels,
            colLabels,
            input: nums,
            inputRoles: ir,
          },
        );
        if (cand > (lisArr[i] ?? 0)) {
          lisArr[i] = cand;
          t.step();
          const rolesWrite = t.idleGrid(2, n);
          rolesWrite[0]![i] = "write";
          rolesWrite[0]![j] = "read";
          t.pushGrid(snapshot(), rolesWrite, `lis[${i}] = ${lisArr[i]}.`, {
            formula: `lis[${i}] = ${lisArr[i]}`,
            rowLabels,
            colLabels,
            input: nums,
            inputRoles: ir,
          });
        } else {
          t.step();
        }
      } else {
        t.pushGrid(snapshot(), rolesRead, `LIS↑: cannot extend from ${j}.`, {
          formula: `skip j=${j}`,
          rowLabels,
          colLabels,
          input: nums,
          inputRoles: ir.map((r, idx) => (idx === j ? "skip" : r)),
        });
        t.step();
      }
    }
    t.sub();
  }

  for (let i = n - 1; i >= 0; i -= 1) {
    ldsArr[i] = 1;
    t.sub();
    const roles = t.idleGrid(2, n);
    roles[1]![i] = "write";
    const ir = idleInput();
    ir[i] = "current";
    t.pushGrid(snapshot(), roles, `LDS↓ base: ending at ${i} alone → 1.`, {
      formula: `lds[${i}] = 1`,
      rowLabels,
      colLabels,
      input: nums,
      inputRoles: ir,
    });
  }

  for (let i = n - 2; i >= 0; i -= 1) {
    for (let j = n - 1; j > i; j -= 1) {
      const rolesRead = t.idleGrid(2, n);
      rolesRead[1]![i] = "current";
      rolesRead[1]![j] = "read";
      const ir = idleInput();
      ir[i] = "current";
      ir[j] = "read";

      if (nums[j]! < nums[i]!) {
        const cand = (ldsArr[j] ?? 0) + 1;
        t.pushGrid(
          snapshot(),
          rolesRead,
          `LDS↓: ${nums[j]} < ${nums[i]} (right side) → candidate ${cand}.`,
          {
            formula: `lds[${i}] = max(lds[${i}], lds[${j}]+1)`,
            rowLabels,
            colLabels,
            input: nums,
            inputRoles: ir,
          },
        );
        if (cand > (ldsArr[i] ?? 0)) {
          ldsArr[i] = cand;
          t.step();
          const rolesWrite = t.idleGrid(2, n);
          rolesWrite[1]![i] = "write";
          rolesWrite[1]![j] = "read";
          t.pushGrid(snapshot(), rolesWrite, `lds[${i}] = ${ldsArr[i]}.`, {
            formula: `lds[${i}] = ${ldsArr[i]}`,
            rowLabels,
            colLabels,
            input: nums,
            inputRoles: ir,
          });
        } else {
          t.step();
        }
      } else {
        t.pushGrid(snapshot(), rolesRead, `LDS↓: cannot extend from ${j}.`, {
          formula: `skip j=${j}`,
          rowLabels,
          colLabels,
          input: nums,
          inputRoles: ir.map((r, idx) => (idx === j ? "skip" : r)),
        });
        t.step();
      }
    }
    t.sub();
  }

  const bitonic: (number | null)[] = Array.from({ length: n }, () => null);
  let best = 0;
  let bestIdx = 0;
  for (let i = 0; i < n; i += 1) {
    bitonic[i] = (lisArr[i] ?? 0) + (ldsArr[i] ?? 0) - 1;
    if ((bitonic[i] ?? 0) > best) {
      best = bitonic[i]!;
      bestIdx = i;
    }
  }

  {
    const roles = t.idleGrid(2, n);
    roles[0]![bestIdx] = "read";
    roles[1]![bestIdx] = "read";
    t.pushGrid(
      snapshot(),
      roles,
      `Peak at index ${bestIdx}: lis=${lisArr[bestIdx]} + lds=${ldsArr[bestIdx]} − 1.`,
      {
        formula: `bitonic[${bestIdx}] = ${lisArr[bestIdx]} + ${ldsArr[bestIdx]} − 1 = ${best}`,
        rowLabels,
        colLabels,
        input: nums,
        inputRoles: idleInput().map((r, i) => (i === bestIdx ? "answer" : r)),
      },
    );
  }

  const done = t.idle(n);
  done[bestIdx] = "answer";
  t.push(bitonic, done, `Answer: longest bitonic subsequence length ${best}.`, {
    formula: `max(lis[i] + lds[i] − 1) = ${best}`,
    input: nums,
    inputRoles: idleInput().map((r, i) => (i === bestIdx ? "answer" : r)),
  });
  return t.frames;
}
