import { BacktrackingTrace } from "./trace";
import type { BacktrackingFrame, BacktrackingInput, BtRole } from "./types";

const PHONE: Record<string, string> = {
  "2": "ABC",
  "3": "DEF",
  "4": "GHI",
  "5": "JKL",
  "6": "MNO",
  "7": "PQRS",
  "8": "TUV",
  "9": "WXYZ",
};

function isPalindrome(s: string, lo: number, hi: number): boolean {
  while (lo < hi) {
    if (s[lo] !== s[hi]) return false;
    lo += 1;
    hi -= 1;
  }
  return true;
}

/** Palindrome Partitioning — split s so every piece is a palindrome. */
export function palindromePartition(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const s = (input.words?.[0] ?? "AAB").toUpperCase();
  const n = s.length;
  const parts: string[] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const maxSolutions = 4;
  const letterIds = Array.from({ length: n }, (_, i) => i);

  const letterRoles = (cut = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    let filled = 0;
    for (const p of parts) {
      for (let i = 0; i < p.length; i += 1) roles[filled + i] = "choose";
      filled += p.length;
    }
    if (cut >= 0 && cut < n) roles[cut] = mode;
    return roles;
  };

  t.push(
    letterIds,
    t.idle(n),
    [],
    `Palindrome Partition — split "${s}" into palindromes.`,
    {
      depth: 0,
      found,
      foundLabels,
    },
  );

  const dfs = (start: number): boolean => {
    t.calls += 1;
    if (start === n) {
      t.solutions += 1;
      found.push(parts.map((p) => p.length));
      foundLabels.push(parts.join(" | "));
      t.push(
        letterIds,
        letterRoles(),
        parts.map((p) => p.length),
        `Partition: ${parts.join(" | ")}.`,
        {
          pathRoles: parts.map(() => "solution" as BtRole),
          depth: parts.length,
          found,
          foundLabels,
        },
      );
      return found.length >= maxSolutions;
    }

    for (let end = start; end < n; end += 1) {
      const piece = s.slice(start, end + 1);
      t.push(
        letterIds,
        letterRoles(end, "current"),
        parts.map((p) => p.length),
        `Try piece "${piece}" [${start}..${end}].`,
        {
          depth: parts.length,
          found,
          foundLabels,
        },
      );

      if (!isPalindrome(s, start, end)) {
        t.push(
          letterIds,
          letterRoles(end, "skip"),
          parts.map((p) => p.length),
          `"${piece}" is not a palindrome.`,
          {
            depth: parts.length,
            found,
            foundLabels,
          },
        );
        continue;
      }

      parts.push(piece);
      t.choices += 1;
      t.push(
        letterIds,
        letterRoles(end, "choose"),
        parts.map((p) => p.length),
        `Take "${piece}".`,
        {
          depth: parts.length,
          found,
          foundLabels,
        },
      );

      if (dfs(end + 1)) return true;

      parts.pop();
      t.backtracks += 1;
      t.push(
        letterIds,
        letterRoles(end, "backtrack"),
        parts.map((p) => p.length),
        `Backtrack — drop "${piece}".`,
        {
          depth: parts.length,
          found,
          foundLabels,
        },
      );
    }
    return false;
  };

  dfs(0);
  t.push(letterIds, t.idle(n), [], `Done — ${found.length} partition(s).`, {
    found,
    foundLabels,
  });
  return t.frames;
}

/** Generate Parentheses — all valid strings with n pairs. */
export function generateParentheses(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const n = Math.max(1, Math.min(input.n || 3, 4));
  const path: string[] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const maxSolutions = n <= 2 ? 8 : 5;
  const cand = [0, 1]; // 0 = '(', 1 = ')'

  const pathIds = () => path.map((c) => (c === "(" ? 0 : 1));

  const roles = (
    open: number,
    close: number,
    hi = -1,
    mode: BtRole = "current",
  ): BtRole[] => {
    const r = t.idle(2);
    if (open < n) r[0] = "idle";
    else r[0] = "fixed";
    if (close < open) r[1] = "idle";
    else r[1] = "fixed";
    if (hi >= 0) r[hi] = mode;
    return r;
  };

  t.push(cand, t.idle(2), [], `Generate Parentheses — ${n} pair(s).`, {
    depth: 0,
    found,
    foundLabels,
  });

  const dfs = (open: number, close: number): boolean => {
    t.calls += 1;
    if (path.length === 2 * n) {
      t.solutions += 1;
      found.push(pathIds());
      foundLabels.push(path.join(""));
      t.push(cand, roles(open, close), pathIds(), `Valid: ${path.join("")}.`, {
        pathRoles: path.map(() => "solution" as BtRole),
        depth: path.length,
        found,
        foundLabels,
      });
      return found.length >= maxSolutions;
    }

    if (open < n) {
      t.push(
        cand,
        roles(open, close, 0, "current"),
        pathIds(),
        `Try '(' (${open + 1}/${n} open).`,
        {
          depth: path.length,
          found,
          foundLabels,
        },
      );
      path.push("(");
      t.choices += 1;
      t.push(cand, roles(open + 1, close, 0, "choose"), pathIds(), `Place '('.`, {
        depth: path.length,
        found,
        foundLabels,
      });
      if (dfs(open + 1, close)) return true;
      path.pop();
      t.backtracks += 1;
      t.push(cand, roles(open, close, 0, "backtrack"), pathIds(), `Backtrack '('.`, {
        depth: path.length,
        found,
        foundLabels,
      });
    } else {
      t.push(cand, roles(open, close, 0, "skip"), pathIds(), `Cannot add more '('.`, {
        depth: path.length,
        found,
        foundLabels,
      });
    }

    if (close < open) {
      t.push(
        cand,
        roles(open, close, 1, "current"),
        pathIds(),
        `Try ')' (${close + 1} close).`,
        {
          depth: path.length,
          found,
          foundLabels,
        },
      );
      path.push(")");
      t.choices += 1;
      t.push(cand, roles(open, close + 1, 1, "choose"), pathIds(), `Place ')'.`, {
        depth: path.length,
        found,
        foundLabels,
      });
      if (dfs(open, close + 1)) return true;
      path.pop();
      t.backtracks += 1;
      t.push(cand, roles(open, close, 1, "backtrack"), pathIds(), `Backtrack ')'.`, {
        depth: path.length,
        found,
        foundLabels,
      });
    } else {
      t.push(cand, roles(open, close, 1, "skip"), pathIds(), `Cannot add ')' yet.`, {
        depth: path.length,
        found,
        foundLabels,
      });
    }

    return false;
  };

  dfs(0, 0);
  t.push(cand, t.idle(2), [], `Done — ${found.length} string(s).`, {
    found,
    foundLabels,
  });
  return t.frames;
}

/** Letter Combinations — phone keypad digits → letter strings. */
export function letterCombinations(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const digits = (input.words?.[0] ?? "23").replace(/\D/g, "").slice(0, 4);
  const path: string[] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const maxSolutions = 12;

  const currentLetters = (di: number) => {
    const d = digits[di] ?? "";
    return (PHONE[d] ?? "").split("");
  };

  t.push([], [], [], `Letter Combinations — digits "${digits}".`, {
    depth: 0,
    found,
    foundLabels,
  });

  if (!digits.length) {
    t.push([], [], [], "Empty digits — no combinations.", { found, foundLabels });
    return t.frames;
  }

  const dfs = (di: number): boolean => {
    t.calls += 1;
    if (di === digits.length) {
      t.solutions += 1;
      found.push(path.map((c) => c.charCodeAt(0)));
      foundLabels.push(path.join(""));
      const letters = currentLetters(Math.max(0, di - 1));
      t.push(
        letters.map((ch) => ch.charCodeAt(0)),
        letters.map(() => "solution" as BtRole),
        path.map((c) => c.charCodeAt(0)),
        `Combination: ${path.join("")}.`,
        {
          pathRoles: path.map(() => "solution" as BtRole),
          depth: path.length,
          found,
          foundLabels,
        },
      );
      return found.length >= maxSolutions;
    }

    const letters = currentLetters(di);
    const ids = letters.map((ch) => ch.charCodeAt(0));
    for (let i = 0; i < letters.length; i += 1) {
      const ch = letters[i]!;
      const roles = t.idle(letters.length);
      roles[i] = "current";
      t.push(
        ids,
        roles,
        path.map((c) => c.charCodeAt(0)),
        `Digit ${digits[di]}: try '${ch}'.`,
        {
          depth: path.length,
          found,
          foundLabels,
        },
      );

      path.push(ch);
      t.choices += 1;
      roles[i] = "choose";
      t.push(
        ids,
        roles,
        path.map((c) => c.charCodeAt(0)),
        `Pick '${ch}'.`,
        {
          depth: path.length,
          found,
          foundLabels,
        },
      );

      if (dfs(di + 1)) return true;

      path.pop();
      t.backtracks += 1;
      roles[i] = "backtrack";
      t.push(
        ids,
        roles,
        path.map((c) => c.charCodeAt(0)),
        `Backtrack '${ch}'.`,
        {
          depth: path.length,
          found,
          foundLabels,
        },
      );
    }
    return false;
  };

  dfs(0);
  t.push([], [], [], `Done — ${found.length} combination(s).`, {
    found,
    foundLabels,
  });
  return t.frames;
}

/**
 * Expression Generation — insert + / - / * between digits to hit a target
 * (classic “Expression Add Operators”, teaching-sized).
 */
export function expressionGeneration(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const num = (input.words?.[0] ?? "123").replace(/\D/g, "").slice(0, 5);
  const target = input.target || 6;
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const maxSolutions = 4;
  const ops = ["+", "-", "*"] as const;
  const opIds = [0, 1, 2];

  t.push(
    opIds,
    t.idle(3),
    [],
    `Expression Generation — digits "${num}" → target ${target}.`,
    {
      depth: 0,
      found,
      foundLabels,
    },
  );

  if (!num.length) {
    t.push(opIds, t.idle(3), [], "Empty number string.", { found, foundLabels });
    return t.frames;
  }

  const dfs = (index: number, expr: string, value: number, last: number): boolean => {
    t.calls += 1;
    if (index === num.length) {
      t.push(opIds, t.idle(3), [], `Evaluate ${expr} = ${value} (target ${target}).`, {
        depth: expr.length,
        found,
        foundLabels,
      });
      if (value === target) {
        t.solutions += 1;
        found.push([value]);
        foundLabels.push(`${expr} = ${value}`);
        t.push(
          opIds,
          opIds.map(() => "solution" as BtRole),
          [],
          `Hit target: ${expr}.`,
          {
            depth: expr.length,
            found,
            foundLabels,
          },
        );
        return found.length >= maxSolutions;
      }
      t.push(opIds, t.idle(3), [], `Miss — ${value} ≠ ${target}.`, {
        depth: expr.length,
        found,
        foundLabels,
      });
      return false;
    }

    for (let i = index; i < num.length; i += 1) {
      if (i > index && num[index] === "0") break; // no leading zeros
      const piece = num.slice(index, i + 1);
      const cur = Number(piece);

      if (index === 0) {
        t.push(opIds, t.idle(3), [], `Start with ${piece}.`, {
          depth: 0,
          found,
          foundLabels,
        });
        t.choices += 1;
        if (dfs(i + 1, piece, cur, cur)) return true;
        t.backtracks += 1;
        continue;
      }

      for (let oi = 0; oi < ops.length; oi += 1) {
        const op = ops[oi]!;
        const roles = t.idle(3);
        roles[oi] = "current";
        t.push(opIds, roles, [], `After "${expr}" try ${op}${piece}.`, {
          depth: expr.length,
          found,
          foundLabels,
        });

        let nextVal = value;
        let nextLast = last;
        if (op === "+") {
          nextVal = value + cur;
          nextLast = cur;
        } else if (op === "-") {
          nextVal = value - cur;
          nextLast = -cur;
        } else {
          // *
          nextVal = value - last + last * cur;
          nextLast = last * cur;
        }

        roles[oi] = "choose";
        t.choices += 1;
        t.push(opIds, roles, [], `Commit ${op}${piece} · running ${nextVal}.`, {
          depth: expr.length + 1 + piece.length,
          found,
          foundLabels,
        });

        if (dfs(i + 1, `${expr}${op}${piece}`, nextVal, nextLast)) return true;

        t.backtracks += 1;
        roles[oi] = "backtrack";
        t.push(opIds, roles, [], `Backtrack ${op}${piece}.`, {
          depth: expr.length,
          found,
          foundLabels,
        });
      }
    }
    return false;
  };

  dfs(0, "", 0, 0);
  t.push(opIds, t.idle(3), [], `Done — ${found.length} expression(s).`, {
    found,
    foundLabels,
  });
  return t.frames;
}
