import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput } from "./types";

const INF = 1_000_000_000;

function popcount(mask: number): number {
  let c = 0;
  let m = mask;
  while (m) {
    c += m & 1;
    m >>= 1;
  }
  return c;
}

function costMatrix(input: DpInput): number[][] {
  if (input.grid.length > 0) {
    const n = Math.min(input.grid.length, input.grid[0]?.length ?? 0);
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => input.grid[i]![j] ?? 0),
    );
  }
  return [
    [9, 2, 7],
    [6, 4, 3],
    [5, 8, 1],
  ];
}

function maskLabel(mask: number, n: number): string {
  return mask.toString(2).padStart(n, "0");
}

/** Min-cost assignment via bitmask DP (n people × n jobs). */
export function assignment(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const cost = costMatrix(input);
  const n = cost.length;
  const N = 1 << n;
  const dp: (number | null)[] = Array.from({ length: N }, () => null);
  const colLabels = Array.from({ length: N }, (_, m) => maskLabel(m, n));

  const idleCostRoles = (): DpCellRole[][] =>
    Array.from({ length: n }, () =>
      Array.from({ length: n }, () => "idle" as DpCellRole),
    );

  const push = (
    roles: DpCellRole[],
    hint: string,
    formula: string,
    costRoles: DpCellRole[][],
  ) => {
    t.push(dp, roles, hint, {
      formula,
      sourceGrid: cost,
      // Reuse gridRoles slot for cost-matrix highlights even without a DP grid.
      gridRoles: costRoles,
      colLabels,
      rowLabels: Array.from({ length: n }, (_, i) => `P${i}`),
    });
  };

  t.push(dp, t.idle(N), "Assignment — each person gets one distinct job (min cost).", {
    formula: "dp[mask|1<<j] = min(..., dp[mask] + cost[i][j]), i = |mask|",
    sourceGrid: cost,
    gridRoles: idleCostRoles(),
    colLabels,
    rowLabels: Array.from({ length: n }, (_, i) => `P${i}`),
  });

  dp[0] = 0;
  t.sub();
  push(
    (() => {
      const roles = t.idle(N);
      roles[0] = "write";
      return roles;
    })(),
    "Base: empty job-set → cost 0.",
    "dp[0] = 0",
    idleCostRoles(),
  );

  for (let mask = 0; mask < N; mask += 1) {
    const cur = dp[mask];
    if (cur == null || cur >= INF / 2) continue;
    const i = popcount(mask);
    if (i >= n) continue;

    const rolesMask = t.idle(N);
    rolesMask[mask] = "current";
    push(
      rolesMask,
      `Person P${i} choosing a free job — mask ${maskLabel(mask, n)}.`,
      `i = popcount = ${i}`,
      idleCostRoles(),
    );

    for (let j = 0; j < n; j += 1) {
      if (mask & (1 << j)) continue;
      const next = mask | (1 << j);
      const cand = cur + cost[i]![j]!;
      const costRoles = idleCostRoles();
      costRoles[i]![j] = "current";
      const rolesRead = t.idle(N);
      rolesRead[mask] = "read";
      rolesRead[next] = "current";
      push(
        rolesRead,
        `Try P${i}→J${j}: ${cur}+${cost[i]![j]}=${cand}.`,
        `dp[${maskLabel(next, n)}] ? ${cand}`,
        costRoles,
      );
      t.step();

      if (dp[next] == null || cand < (dp[next] ?? INF)) {
        dp[next] = cand;
        t.sub();
        const rolesWrite = t.idle(N);
        rolesWrite[next] = "write";
        rolesWrite[mask] = "read";
        const writeRoles = idleCostRoles();
        writeRoles[i]![j] = "write";
        push(
          rolesWrite,
          `Update dp[${maskLabel(next, n)}] = ${cand}.`,
          `dp[${maskLabel(next, n)}] = ${cand}`,
          writeRoles,
        );
      }
    }
  }

  const full = N - 1;
  const done = t.idle(N);
  done[full] = "answer";
  push(
    done,
    `Answer: minimum assignment cost ${dp[full]}.`,
    `dp[${maskLabel(full, n)}] = ${dp[full]}`,
    idleCostRoles(),
  );
  return t.frames;
}
