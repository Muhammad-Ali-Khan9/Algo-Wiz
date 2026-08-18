import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput } from "./types";

function emptyDp(rows: number, cols: number): (number | null)[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
}

function pairOf(input: DpInput): { a: string; b: string } {
  const a = (input.textA || "abc").toLowerCase();
  const b = (input.textB || "ac").toLowerCase();
  return { a, b };
}

export function lcs(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const { a, b } = pairOf(input);
  const m = a.length;
  const n = b.length;
  const dp = emptyDp(m + 1, n + 1);
  const rowLabels = ["∅", ...a.split("")];
  const colLabels = ["∅", ...b.split("")];

  t.pushGrid(
    dp,
    t.idleGrid(m + 1, n + 1),
    `LCS — longest common subsequence of "${a}" and "${b}".`,
    {
      formula: "if a[i-1]==b[j-1]: dp[i][j]=dp[i-1][j-1]+1 else max(up, left)",
      rowLabels,
      colLabels,
    },
  );

  for (let i = 0; i <= m; i += 1) dp[i]![0] = 0;
  for (let j = 0; j <= n; j += 1) dp[0]![j] = 0;
  {
    const roles = t.idleGrid(m + 1, n + 1);
    for (let i = 0; i <= m; i += 1) roles[i]![0] = "write";
    for (let j = 0; j <= n; j += 1) roles[0]![j] = "write";
    t.pushGrid(dp, roles, "Base: empty prefix → LCS length 0.", {
      formula: "dp[i][0] = dp[0][j] = 0",
      rowLabels,
      colLabels,
    });
  }

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const rolesRead = t.idleGrid(m + 1, n + 1);
      rolesRead[i]![j] = "current";
      if (a[i - 1] === b[j - 1]) {
        rolesRead[i - 1]![j - 1] = "read";
        t.pushGrid(
          dp,
          rolesRead,
          `Match '${a[i - 1]}' at (${i},${j}) — extend diagonal.`,
          {
            formula: `dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1`,
            rowLabels,
            colLabels,
          },
        );
        dp[i]![j] = (dp[i - 1]![j - 1] ?? 0) + 1;
      } else {
        rolesRead[i - 1]![j] = "read";
        rolesRead[i]![j - 1] = "read";
        t.pushGrid(
          dp,
          rolesRead,
          `'${a[i - 1]}' ≠ '${b[j - 1]}' — take max of skip-a / skip-b.`,
          {
            formula: `dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}])`,
            rowLabels,
            colLabels,
          },
        );
        dp[i]![j] = Math.max(dp[i - 1]![j] ?? 0, dp[i]![j - 1] ?? 0);
      }
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(m + 1, n + 1);
      rolesWrite[i]![j] = "write";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${j}] = ${dp[i]![j]}.`, {
        formula: `dp[${i}][${j}] = ${dp[i]![j]}`,
        rowLabels,
        colLabels,
      });
    }
  }

  const done = t.idleGrid(m + 1, n + 1);
  done[m]![n] = "answer";
  t.pushGrid(dp, done, `Answer: LCS length ${dp[m]![n]}.`, {
    formula: `LCS("${a}", "${b}") = ${dp[m]![n]}`,
    rowLabels,
    colLabels,
  });
  return t.frames;
}

export function editDistance(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const { a, b } = pairOf(input);
  const m = a.length;
  const n = b.length;
  const dp = emptyDp(m + 1, n + 1);
  const rowLabels = ["∅", ...a.split("")];
  const colLabels = ["∅", ...b.split("")];

  t.pushGrid(
    dp,
    t.idleGrid(m + 1, n + 1),
    `Edit Distance — min inserts/deletes/replaces to turn "${a}" into "${b}".`,
    {
      formula: "dp[i][j] = min(del, ins, replace-or-match)",
      rowLabels,
      colLabels,
    },
  );

  for (let i = 0; i <= m; i += 1) dp[i]![0] = i;
  for (let j = 0; j <= n; j += 1) dp[0]![j] = j;
  {
    const roles = t.idleGrid(m + 1, n + 1);
    for (let i = 0; i <= m; i += 1) roles[i]![0] = "write";
    for (let j = 0; j <= n; j += 1) roles[0]![j] = "write";
    t.pushGrid(dp, roles, "Base: empty string needs i deletes or j inserts.", {
      formula: "dp[i][0]=i, dp[0][j]=j",
      rowLabels,
      colLabels,
    });
  }

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const rolesRead = t.idleGrid(m + 1, n + 1);
      rolesRead[i]![j] = "current";
      rolesRead[i - 1]![j] = "read";
      rolesRead[i]![j - 1] = "read";
      rolesRead[i - 1]![j - 1] = "read";
      const del = (dp[i - 1]![j] ?? 0) + 1;
      const ins = (dp[i]![j - 1] ?? 0) + 1;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const rep = (dp[i - 1]![j - 1] ?? 0) + cost;
      t.pushGrid(
        dp,
        rolesRead,
        a[i - 1] === b[j - 1]
          ? `Match '${a[i - 1]}' — replace cost 0.`
          : `Mismatch '${a[i - 1]}'≠'${b[j - 1]}' — del=${del}, ins=${ins}, replace=${rep}.`,
        {
          formula:
            a[i - 1] === b[j - 1]
              ? `dp[${i}][${j}] = dp[${i - 1}][${j - 1}]`
              : `min(${del}, ${ins}, ${rep})`,
          rowLabels,
          colLabels,
        },
      );
      dp[i]![j] = Math.min(del, ins, rep);
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(m + 1, n + 1);
      rolesWrite[i]![j] = "write";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${j}] = ${dp[i]![j]}.`, {
        formula: `dp[${i}][${j}] = ${dp[i]![j]}`,
        rowLabels,
        colLabels,
      });
    }
  }

  const done = t.idleGrid(m + 1, n + 1);
  done[m]![n] = "answer";
  t.pushGrid(dp, done, `Answer: edit distance ${dp[m]![n]}.`, {
    formula: `lev("${a}", "${b}") = ${dp[m]![n]}`,
    rowLabels,
    colLabels,
  });
  return t.frames;
}

export function wordBreak(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const s = (input.textA || "leetcode").toLowerCase();
  const dict =
    input.words.length > 0 ? input.words.map((w) => w.toLowerCase()) : ["leet", "code"];
  const n = s.length;
  const dp: (number | null)[] = Array.from({ length: n + 1 }, () => null);
  const chars = s.split("").map((ch) => ch.charCodeAt(0) - 96);

  t.push(dp, t.idle(n + 1), `Word Break — can "${s}" be segmented with the dictionary?`, {
    formula: "dp[i] = true if some word ends at i and dp[i-len]",
    input: chars,
    inputRoles: t.idle(n),
    words: dict,
    wordRoles: Array.from({ length: dict.length }, () => "idle"),
  });

  dp[0] = 1;
  t.sub();
  {
    const roles = t.idle(n + 1);
    roles[0] = "write";
    t.push(dp, roles, "Base: empty prefix is always breakable.", {
      formula: "dp[0] = true",
      input: chars,
      inputRoles: t.idle(n),
      words: dict,
      wordRoles: Array.from({ length: dict.length }, () => "idle"),
    });
  }

  for (let i = 1; i <= n; i += 1) {
    dp[i] = 0;
    let found = false;
    for (let w = 0; w < dict.length; w += 1) {
      const word = dict[w]!;
      const len = word.length;
      if (i < len) continue;
      const start = i - len;
      const slice = s.slice(start, i);
      const wordRoles = Array.from({ length: dict.length }, () => "idle" as DpCellRole);
      wordRoles[w] = "current";
      const rolesRead = t.idle(n + 1);
      rolesRead[i] = "current";
      rolesRead[start] = "read";
      const inputRoles = t.idle(n);
      for (let k = start; k < i; k += 1) inputRoles[k] = "current";

      if (slice === word && (dp[start] ?? 0) === 1) {
        t.push(
          dp,
          rolesRead,
          `Match "${word}" ending at ${i} and dp[${start}] is true.`,
          {
            formula: `dp[${i}] ← true via "${word}"`,
            input: chars,
            inputRoles,
            words: dict,
            wordRoles: wordRoles.map((r, idx) => (idx === w ? "write" : r)),
          },
        );
        dp[i] = 1;
        found = true;
        t.sub();
        t.step();
        break;
      }

      t.push(
        dp,
        rolesRead,
        slice === word
          ? `"${word}" matches but dp[${start}] is false — skip.`
          : `Try "${word}" at [${start},${i}): got "${slice}" — no match.`,
        {
          formula: `check s[${start}:${i}] == "${word}"`,
          input: chars,
          inputRoles,
          words: dict,
          wordRoles: wordRoles.map((r, idx) => (idx === w ? "skip" : r)),
        },
      );
      t.step();
    }

    if (!found) {
      const roles = t.idle(n + 1);
      roles[i] = "write";
      t.push(dp, roles, `No dictionary word ends at ${i} with a valid prefix.`, {
        formula: `dp[${i}] = false`,
        input: chars,
        inputRoles: t.idle(n),
        words: dict,
        wordRoles: Array.from({ length: dict.length }, () => "idle"),
      });
      t.sub();
    } else {
      const roles = t.idle(n + 1);
      roles[i] = "write";
      t.push(dp, roles, `dp[${i}] = true.`, {
        formula: `dp[${i}] = true`,
        input: chars,
        inputRoles: t.idle(n),
        words: dict,
        wordRoles: Array.from({ length: dict.length }, () => "idle"),
      });
    }
  }

  const done = t.idle(n + 1);
  done[n] = "answer";
  t.push(
    dp,
    done,
    dp[n] === 1
      ? `Answer: yes — "${s}" can be segmented.`
      : `Answer: no — "${s}" cannot be segmented.`,
    {
      formula: `dp[${n}] = ${dp[n] === 1 ? "true" : "false"}`,
      input: chars,
      inputRoles: t.idle(n),
      words: dict,
      wordRoles: Array.from({ length: dict.length }, () => "idle"),
    },
  );
  return t.frames;
}

export function palindromicSubsequence(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const s = (input.textA || "bbbab").toLowerCase();
  const n = s.length;
  const dp = emptyDp(n, n);
  const labels = s.split("");

  t.pushGrid(dp, t.idleGrid(n, n), `Longest Palindromic Subsequence of "${s}".`, {
    formula: "if s[i]==s[j]: dp[i][j]=dp[i+1][j-1]+2 else max(skip-left, skip-right)",
    rowLabels: labels,
    colLabels: labels,
  });

  for (let i = 0; i < n; i += 1) {
    dp[i]![i] = 1;
    t.sub();
    const roles = t.idleGrid(n, n);
    roles[i]![i] = "write";
    t.pushGrid(dp, roles, `Single char '${s[i]}' is a palindrome of length 1.`, {
      formula: `dp[${i}][${i}] = 1`,
      rowLabels: labels,
      colLabels: labels,
    });
  }

  for (let len = 2; len <= n; len += 1) {
    for (let i = 0; i + len - 1 < n; i += 1) {
      const j = i + len - 1;
      const rolesRead = t.idleGrid(n, n);
      rolesRead[i]![j] = "current";
      if (s[i] === s[j]) {
        if (len === 2) {
          t.pushGrid(dp, rolesRead, `Pair '${s[i]}${s[j]}' — length 2 palindrome.`, {
            formula: `dp[${i}][${j}] = 2`,
            rowLabels: labels,
            colLabels: labels,
          });
          dp[i]![j] = 2;
        } else {
          rolesRead[i + 1]![j - 1] = "read";
          t.pushGrid(dp, rolesRead, `Match '${s[i]}'…'${s[j]}' — wrap inner LPS.`, {
            formula: `dp[${i}][${j}] = dp[${i + 1}][${j - 1}] + 2`,
            rowLabels: labels,
            colLabels: labels,
          });
          dp[i]![j] = (dp[i + 1]![j - 1] ?? 0) + 2;
        }
      } else {
        rolesRead[i + 1]![j] = "read";
        rolesRead[i]![j - 1] = "read";
        t.pushGrid(dp, rolesRead, `'${s[i]}' ≠ '${s[j]}' — drop one end.`, {
          formula: `dp[${i}][${j}] = max(dp[${i + 1}][${j}], dp[${i}][${j - 1}])`,
          rowLabels: labels,
          colLabels: labels,
        });
        dp[i]![j] = Math.max(dp[i + 1]![j] ?? 0, dp[i]![j - 1] ?? 0);
      }
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(n, n);
      rolesWrite[i]![j] = "write";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${j}] = ${dp[i]![j]}.`, {
        formula: `dp[${i}][${j}] = ${dp[i]![j]}`,
        rowLabels: labels,
        colLabels: labels,
      });
    }
  }

  const done = t.idleGrid(n, n);
  done[0]![n - 1] = "answer";
  t.pushGrid(dp, done, `Answer: LPS length ${dp[0]![n - 1]}.`, {
    formula: `LPS("${s}") = ${dp[0]![n - 1]}`,
    rowLabels: labels,
    colLabels: labels,
  });
  return t.frames;
}
