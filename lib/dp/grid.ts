import { DpTrace } from "./trace";
import type { DpFrame, DpInput } from "./types";

function emptyDp(rows: number, cols: number): (number | null)[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
}

export function uniquePaths(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const m = Math.max(2, input.rows || 3);
  const n = Math.max(2, input.cols || 3);
  const dp = emptyDp(m, n);

  t.pushGrid(
    dp,
    t.idleGrid(m, n),
    `Unique Paths — ways from (0,0) to (${m - 1},${n - 1}).`,
    {
      formula: "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
    },
  );

  for (let i = 0; i < m; i += 1) {
    dp[i]![0] = 1;
    t.sub();
    t.step();
    const roles = t.idleGrid(m, n);
    roles[i]![0] = "write";
    t.pushGrid(dp, roles, `First column: only one way down to (${i},0).`, {
      formula: "dp[i][0] = 1",
    });
  }
  for (let j = 1; j < n; j += 1) {
    dp[0]![j] = 1;
    t.sub();
    t.step();
    const roles = t.idleGrid(m, n);
    roles[0]![j] = "write";
    t.pushGrid(dp, roles, `First row: only one way right to (0,${j}).`, {
      formula: "dp[0][j] = 1",
    });
  }

  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      const rolesRead = t.idleGrid(m, n);
      rolesRead[i]![j] = "current";
      rolesRead[i - 1]![j] = "read";
      rolesRead[i]![j - 1] = "read";
      t.pushGrid(dp, rolesRead, `Cell (${i},${j}): come from above or left.`, {
        formula: `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i}][${j - 1}]`,
      });
      dp[i]![j] = (dp[i - 1]![j] ?? 0) + (dp[i]![j - 1] ?? 0);
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(m, n);
      rolesWrite[i]![j] = "write";
      rolesWrite[i - 1]![j] = "read";
      rolesWrite[i]![j - 1] = "read";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${j}] = ${dp[i]![j]} ways.`, {
        formula: `dp[${i}][${j}] = ${dp[i - 1]![j]} + ${dp[i]![j - 1]} = ${dp[i]![j]}`,
      });
    }
  }

  const done = t.idleGrid(m, n);
  done[m - 1]![n - 1] = "answer";
  t.pushGrid(dp, done, `Answer: ${dp[m - 1]![n - 1]} unique paths.`, {
    formula: `dp[${m - 1}][${n - 1}] = ${dp[m - 1]![n - 1]}`,
  });
  return t.frames;
}

export function minPathSum(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const grid =
    input.grid.length > 0
      ? input.grid
      : [
          [1, 3, 1],
          [1, 5, 1],
          [4, 2, 1],
        ];
  const m = grid.length;
  const n = grid[0]!.length;
  const dp = emptyDp(m, n);

  t.pushGrid(dp, t.idleGrid(m, n), "Minimum Path Sum — only right/down moves.", {
    formula: "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
    sourceGrid: grid,
  });

  dp[0]![0] = grid[0]![0]!;
  t.sub();
  t.step();
  {
    const roles = t.idleGrid(m, n);
    roles[0]![0] = "write";
    t.pushGrid(dp, roles, `Start: dp[0][0] = ${grid[0]![0]}.`, {
      formula: "dp[0][0] = grid[0][0]",
      sourceGrid: grid,
    });
  }

  for (let j = 1; j < n; j += 1) {
    const rolesRead = t.idleGrid(m, n);
    rolesRead[0]![j] = "current";
    rolesRead[0]![j - 1] = "read";
    t.pushGrid(dp, rolesRead, `Top row: must come from the left.`, {
      formula: `dp[0][${j}] = grid[0][${j}] + dp[0][${j - 1}]`,
      sourceGrid: grid,
    });
    dp[0]![j] = (dp[0]![j - 1] ?? 0) + grid[0]![j]!;
    t.sub();
    t.step();
    const rolesWrite = t.idleGrid(m, n);
    rolesWrite[0]![j] = "write";
    t.pushGrid(dp, rolesWrite, `dp[0][${j}] = ${dp[0]![j]}.`, {
      formula: `dp[0][${j}] = ${dp[0]![j]}`,
      sourceGrid: grid,
    });
  }

  for (let i = 1; i < m; i += 1) {
    const rolesRead = t.idleGrid(m, n);
    rolesRead[i]![0] = "current";
    rolesRead[i - 1]![0] = "read";
    t.pushGrid(dp, rolesRead, `Left column: must come from above.`, {
      formula: `dp[${i}][0] = grid[${i}][0] + dp[${i - 1}][0]`,
      sourceGrid: grid,
    });
    dp[i]![0] = (dp[i - 1]![0] ?? 0) + grid[i]![0]!;
    t.sub();
    t.step();
    const rolesWrite = t.idleGrid(m, n);
    rolesWrite[i]![0] = "write";
    t.pushGrid(dp, rolesWrite, `dp[${i}][0] = ${dp[i]![0]}.`, {
      formula: `dp[${i}][0] = ${dp[i]![0]}`,
      sourceGrid: grid,
    });
  }

  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      const up = dp[i - 1]![j] ?? 0;
      const left = dp[i]![j - 1] ?? 0;
      const rolesRead = t.idleGrid(m, n);
      rolesRead[i]![j] = "current";
      rolesRead[i - 1]![j] = "read";
      rolesRead[i]![j - 1] = "read";
      t.pushGrid(
        dp,
        rolesRead,
        `Cell (${i},${j}): min(up=${up}, left=${left}) + ${grid[i]![j]}.`,
        {
          formula: `dp[${i}][${j}] = grid[${i}][${j}] + min(dp[${i - 1}][${j}], dp[${i}][${j - 1}])`,
          sourceGrid: grid,
        },
      );
      dp[i]![j] = grid[i]![j]! + Math.min(up, left);
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(m, n);
      rolesWrite[i]![j] = "write";
      if (up <= left) rolesWrite[i - 1]![j] = "read";
      else rolesWrite[i]![j - 1] = "read";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${j}] = ${dp[i]![j]}.`, {
        formula: `dp[${i}][${j}] = ${dp[i]![j]}`,
        sourceGrid: grid,
      });
    }
  }

  const done = t.idleGrid(m, n);
  done[m - 1]![n - 1] = "answer";
  t.pushGrid(dp, done, `Answer: minimum path sum = ${dp[m - 1]![n - 1]}.`, {
    formula: `dp[${m - 1}][${n - 1}] = ${dp[m - 1]![n - 1]}`,
    sourceGrid: grid,
  });
  return t.frames;
}

export function dungeonGame(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const dungeon =
    input.grid.length > 0
      ? input.grid
      : [
          [-2, -3, 3],
          [-5, -10, 1],
          [10, 30, -5],
        ];
  const m = dungeon.length;
  const n = dungeon[0]!.length;
  const dp = emptyDp(m, n);
  const INF = 1e9;

  t.pushGrid(
    dp,
    t.idleGrid(m, n),
    "Dungeon Game — min HP to reach the princess (bottom-right). Fill bottom-up from the end.",
    {
      formula: "dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])",
      sourceGrid: dungeon,
    },
  );

  // Need sentinel for out of bounds — use local helpers
  const need = (i: number, j: number) => {
    if (i >= m || j >= n) return INF;
    return dp[i]![j] ?? INF;
  };

  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      const rolesRead = t.idleGrid(m, n);
      rolesRead[i]![j] = "current";
      if (i + 1 < m) rolesRead[i + 1]![j] = "read";
      if (j + 1 < n) rolesRead[i]![j + 1] = "read";

      if (i === m - 1 && j === n - 1) {
        t.pushGrid(
          dp,
          rolesRead,
          `Princess cell: need enough HP to survive ${dungeon[i]![j]}.`,
          {
            formula: `dp[${i}][${j}] = max(1, 1 - dungeon[${i}][${j}])`,
            sourceGrid: dungeon,
          },
        );
        dp[i]![j] = Math.max(1, 1 - dungeon[i]![j]!);
      } else {
        const down = need(i + 1, j);
        const right = need(i, j + 1);
        const best = Math.min(down, right);
        t.pushGrid(
          dp,
          rolesRead,
          `From (${i},${j}): next needs min(down=${down === INF ? "—" : down}, right=${right === INF ? "—" : right}).`,
          {
            formula: `dp[${i}][${j}] = max(1, next - dungeon[${i}][${j}])`,
            sourceGrid: dungeon,
          },
        );
        dp[i]![j] = Math.max(1, best - dungeon[i]![j]!);
      }

      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(m, n);
      rolesWrite[i]![j] = "write";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${j}] = ${dp[i]![j]} HP required on entry.`, {
        formula: `dp[${i}][${j}] = ${dp[i]![j]}`,
        sourceGrid: dungeon,
      });
    }
  }

  const done = t.idleGrid(m, n);
  done[0]![0] = "answer";
  t.pushGrid(dp, done, `Answer: start with at least ${dp[0]![0]} HP.`, {
    formula: `dp[0][0] = ${dp[0]![0]}`,
    sourceGrid: dungeon,
  });
  return t.frames;
}
