import { BacktrackingTrace } from "./trace";
import type { BacktrackingFrame, BacktrackingInput, BtRole } from "./types";

function numsOf(input: BacktrackingInput): number[] {
  return input.values.length > 0 ? input.values.slice() : [1, 2, 3];
}

function pathRoles(path: number[], last: BtRole = "choose"): BtRole[] {
  if (path.length === 0) return [];
  return path.map((_, i) => (i === path.length - 1 ? last : "choose"));
}

/** All permutations of the multiset-free array. */
export function permutations(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const nums = numsOf(input);
  const n = nums.length;
  const used = Array.from({ length: n }, () => false);
  const path: number[] = [];
  const found: number[][] = [];

  t.push(nums, t.idle(n), [], "Permutations — try every ordering of the numbers.", {
    depth: 0,
    found,
  });

  const dfs = () => {
    t.calls += 1;
    if (path.length === n) {
      t.solutions += 1;
      found.push(path.slice());
      const roles = t.idle(n);
      for (let i = 0; i < n; i += 1) roles[i] = "solution";
      t.push(nums, roles, path, `Found permutation [${path.join(", ")}].`, {
        pathRoles: path.map(() => "solution" as BtRole),
        depth: path.length,
        found,
      });
      return;
    }

    const open: number[] = [];
    for (let i = 0; i < n; i += 1) if (!used[i]) open.push(i);

    const rolesOpen = t.idle(n);
    for (let j = 0; j < n; j += 1) {
      if (used[j]) rolesOpen[j] = "choose";
      else rolesOpen[j] = "current";
    }
    const optionVals = open.map((i) => nums[i]!);
    t.push(
      nums,
      rolesOpen,
      path,
      `Position ${path.length}: options ${optionVals.join(", ")} (${open.length} left).`,
      {
        pathRoles: pathRoles(path),
        depth: path.length,
        found,
      },
    );

    for (const i of open) {
      const rolesCur = t.idle(n);
      for (let j = 0; j < n; j += 1) {
        if (used[j]) rolesCur[j] = "choose";
        else if (j === i) rolesCur[j] = "current";
        else rolesCur[j] = "idle";
      }
      t.push(nums, rolesCur, path, `Try ${nums[i]} at position ${path.length}.`, {
        pathRoles: pathRoles(path),
        depth: path.length,
        found,
      });

      used[i] = true;
      path.push(nums[i]!);
      t.choices += 1;
      const rolesChoose = t.idle(n);
      for (let j = 0; j < n; j += 1) {
        if (used[j]) rolesChoose[j] = "choose";
        else rolesChoose[j] = "idle";
      }
      t.push(nums, rolesChoose, path, `Choose ${nums[i]} → path [${path.join(", ")}].`, {
        pathRoles: pathRoles(path, "choose"),
        depth: path.length,
        found,
      });

      dfs();

      path.pop();
      used[i] = false;
      t.backtracks += 1;
      const rolesBack = t.idle(n);
      for (let j = 0; j < n; j += 1) {
        if (used[j]) rolesBack[j] = "choose";
        else if (j === i) rolesBack[j] = "backtrack";
        else rolesBack[j] = "idle";
      }
      t.push(
        nums,
        rolesBack,
        path,
        `Backtrack from ${nums[i]} · remaining options still open.`,
        {
          pathRoles: pathRoles(path),
          depth: path.length,
          found,
        },
      );
    }
  };

  dfs();
  const rolesDone = t.idle(n).map(() => "solution" as BtRole);
  t.push(
    nums,
    rolesDone,
    [],
    `Done — all ${found.length} permutation(s): ${found.map((p) => `[${p.join(", ")}]`).join(" · ")}.`,
    { depth: 0, found },
  );
  return t.frames;
}

/** Combinations: choose k numbers from 1..n (or values) in ascending order. */
export function combinations(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const nums = numsOf(input);
  const n = nums.length;
  const k = Math.max(1, Math.min(input.k || 2, n));
  const path: number[] = [];
  const found: number[][] = [];

  t.push(nums, t.idle(n), [], `Combinations — choose ${k} from [${nums.join(", ")}].`, {
    depth: 0,
    found,
  });

  const dfs = (start: number) => {
    t.calls += 1;
    if (path.length === k) {
      t.solutions += 1;
      found.push(path.slice());
      const roles = t.idle(n);
      for (const v of path) {
        const idx = nums.indexOf(v);
        if (idx >= 0) roles[idx] = "solution";
      }
      t.push(nums, roles, path, `Found combination [${path.join(", ")}].`, {
        pathRoles: path.map(() => "solution" as BtRole),
        depth: path.length,
        found,
      });
      return;
    }

    for (let i = start; i < n; i += 1) {
      const remain = k - path.length;
      if (n - i < remain) {
        const rolesSkip = t.idle(n);
        for (const v of path) {
          const idx = nums.indexOf(v);
          if (idx >= 0) rolesSkip[idx] = "choose";
        }
        rolesSkip[i] = "skip";
        t.push(
          nums,
          rolesSkip,
          path,
          `Skip ${nums[i]} — not enough numbers left for ${remain} more.`,
          { pathRoles: pathRoles(path), depth: path.length, found },
        );
        break;
      }

      const rolesCur = t.idle(n);
      for (const v of path) {
        const idx = nums.indexOf(v);
        if (idx >= 0) rolesCur[idx] = "choose";
      }
      rolesCur[i] = "current";
      t.push(nums, rolesCur, path, `Consider ${nums[i]} for slot ${path.length}.`, {
        pathRoles: pathRoles(path),
        depth: path.length,
        found,
      });

      path.push(nums[i]!);
      t.choices += 1;
      const rolesChoose = t.idle(n);
      for (const v of path) {
        const idx = nums.indexOf(v);
        if (idx >= 0) rolesChoose[idx] = "choose";
      }
      t.push(nums, rolesChoose, path, `Choose ${nums[i]} → [${path.join(", ")}].`, {
        pathRoles: pathRoles(path),
        depth: path.length,
        found,
      });

      dfs(i + 1);

      path.pop();
      t.backtracks += 1;
      const rolesBack = t.idle(n);
      for (const v of path) {
        const idx = nums.indexOf(v);
        if (idx >= 0) rolesBack[idx] = "choose";
      }
      rolesBack[i] = "backtrack";
      t.push(nums, rolesBack, path, `Backtrack from ${nums[i]}.`, {
        pathRoles: pathRoles(path),
        depth: path.length,
        found,
      });
    }
  };

  dfs(0);
  t.push(
    nums,
    t.idle(n).map(() => "solution" as BtRole),
    [],
    `Done — ${found.length} combination(s) of size ${k}.`,
    { depth: 0, found },
  );
  return t.frames;
}

/** Power set via include / skip recursion. */
export function subsets(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const nums = numsOf(input);
  const n = nums.length;
  const path: number[] = [];
  const found: number[][] = [];

  t.push(nums, t.idle(n), [], "Subsets — for each element, include or skip.", {
    depth: 0,
    found,
  });

  const dfs = (i: number) => {
    t.calls += 1;
    if (i === n) {
      t.solutions += 1;
      found.push(path.slice());
      const roles = t.idle(n);
      for (const v of path) {
        const idx = nums.indexOf(v);
        if (idx >= 0) roles[idx] = "solution";
      }
      t.push(
        nums,
        roles,
        path,
        path.length === 0
          ? "Found empty subset ∅."
          : `Found subset {${path.join(", ")}}.`,
        {
          pathRoles: path.map(() => "solution" as BtRole),
          depth: path.length,
          found,
        },
      );
      return;
    }

    // Skip branch
    const rolesSkip = t.idle(n);
    for (const v of path) {
      const idx = nums.indexOf(v);
      if (idx >= 0) rolesSkip[idx] = "choose";
    }
    rolesSkip[i] = "skip";
    t.push(nums, rolesSkip, path, `Skip ${nums[i]}.`, {
      pathRoles: pathRoles(path),
      depth: i,
      found,
    });
    dfs(i + 1);

    // Include branch
    const rolesCur = t.idle(n);
    for (const v of path) {
      const idx = nums.indexOf(v);
      if (idx >= 0) rolesCur[idx] = "choose";
    }
    rolesCur[i] = "current";
    t.push(nums, rolesCur, path, `Include ${nums[i]}?`, {
      pathRoles: pathRoles(path),
      depth: i,
      found,
    });

    path.push(nums[i]!);
    t.choices += 1;
    const rolesChoose = t.idle(n);
    for (const v of path) {
      const idx = nums.indexOf(v);
      if (idx >= 0) rolesChoose[idx] = "choose";
    }
    t.push(nums, rolesChoose, path, `Choose ${nums[i]} → [${path.join(", ")}].`, {
      pathRoles: pathRoles(path),
      depth: i + 1,
      found,
    });

    dfs(i + 1);

    path.pop();
    t.backtracks += 1;
    const rolesBack = t.idle(n);
    for (const v of path) {
      const idx = nums.indexOf(v);
      if (idx >= 0) rolesBack[idx] = "choose";
    }
    rolesBack[i] = "backtrack";
    t.push(nums, rolesBack, path, `Backtrack from ${nums[i]}.`, {
      pathRoles: pathRoles(path),
      depth: i,
      found,
    });
  };

  dfs(0);
  t.push(
    nums,
    t.idle(n).map(() => "solution" as BtRole),
    [],
    `Done — ${found.length} subset(s) (2^${n}).`,
    { depth: 0, found },
  );
  return t.frames;
}

/**
 * Combination Sum — unlimited reuse of each candidate; numbers chosen in
 * non-decreasing order so each multiset is found once.
 */
export function combinationSum(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const nums = numsOf(input)
    .slice()
    .sort((a, b) => a - b);
  const n = nums.length;
  const target = Math.max(1, input.target || 8);
  const path: number[] = [];
  const found: number[][] = [];

  t.push(
    nums,
    t.idle(n),
    [],
    `Combination Sum — reach ${target} (reuse allowed, ascending picks).`,
    { depth: 0, found },
  );

  const dfs = (start: number, remain: number) => {
    t.calls += 1;
    if (remain === 0) {
      t.solutions += 1;
      found.push(path.slice());
      const roles = t.idle(n);
      for (const v of path) {
        const idx = nums.indexOf(v);
        if (idx >= 0) roles[idx] = "solution";
      }
      t.push(nums, roles, path, `Found [${path.join(" + ")}] = ${target}.`, {
        pathRoles: path.map(() => "solution" as BtRole),
        depth: path.length,
        found,
      });
      return;
    }

    for (let i = start; i < n; i += 1) {
      const v = nums[i]!;
      if (v > remain) {
        const rolesSkip = t.idle(n);
        for (const p of path) {
          const idx = nums.indexOf(p);
          if (idx >= 0) rolesSkip[idx] = "choose";
        }
        rolesSkip[i] = "skip";
        t.push(nums, rolesSkip, path, `Skip ${v} — larger than remaining ${remain}.`, {
          pathRoles: pathRoles(path),
          depth: path.length,
          found,
        });
        break;
      }

      const rolesCur = t.idle(n);
      for (const p of path) {
        const idx = nums.indexOf(p);
        if (idx >= 0) rolesCur[idx] = "choose";
      }
      rolesCur[i] = "current";
      t.push(nums, rolesCur, path, `Try ${v} (remaining ${remain}).`, {
        pathRoles: pathRoles(path),
        depth: path.length,
        found,
      });

      path.push(v);
      t.choices += 1;
      const rolesChoose = t.idle(n);
      for (const p of path) {
        const idx = nums.indexOf(p);
        if (idx >= 0) rolesChoose[idx] = "choose";
      }
      t.push(
        nums,
        rolesChoose,
        path,
        `Choose ${v} → [${path.join(", ")}] · remain ${remain - v}.`,
        { pathRoles: pathRoles(path), depth: path.length, found },
      );

      dfs(i, remain - v);

      path.pop();
      t.backtracks += 1;
      const rolesBack = t.idle(n);
      for (const p of path) {
        const idx = nums.indexOf(p);
        if (idx >= 0) rolesBack[idx] = "choose";
      }
      rolesBack[i] = "backtrack";
      t.push(nums, rolesBack, path, `Backtrack from ${v}.`, {
        pathRoles: pathRoles(path),
        depth: path.length,
        found,
      });
    }
  };

  dfs(0, target);
  t.push(
    nums,
    t.idle(n).map(() => "solution" as BtRole),
    [],
    `Done — ${found.length} combination(s) summing to ${target}.`,
    { depth: 0, found },
  );
  return t.frames;
}
