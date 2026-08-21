import { BacktrackingTrace } from "./trace";
import type { BacktrackingFrame, BacktrackingInput, BtRole } from "./types";

const DIRS: { d: string; dr: number; dc: number }[] = [
  { d: "D", dr: 1, dc: 0 },
  { d: "L", dr: 0, dc: -1 },
  { d: "R", dr: 0, dc: 1 },
  { d: "U", dr: -1, dc: 0 },
];

function parseGrid(input: BacktrackingInput, fallback: string[][]): string[][] {
  if (input.grid?.length) return input.grid.map((row) => row.map((c) => String(c)));
  return fallback.map((row) => row.slice());
}

function cloneStr(board: string[][]): string[][] {
  return board.map((row) => row.slice());
}

function isWall(cell: string | null | undefined): boolean {
  return cell === "#" || cell === "0";
}

/** Rat in a Maze — (0,0) → (n-1,n-1) on open cells; record D/L/R/U path. */
export function ratInAMaze(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const template = parseGrid(input, [
    ["1", "0", "0", "0"],
    ["1", "1", "0", "1"],
    ["0", "1", "0", "0"],
    ["1", "1", "1", "1"],
  ]);
  const rows = template.length;
  const cols = template[0]?.length ?? 0;
  const maze = cloneStr(template);
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );
  const path: string[] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const dirIds = DIRS.map((_, i) => i);
  const maxSolutions = 2;

  const boardFrom = (focusR = -1, focusC = -1): (string | null)[][] => {
    const board: (string | null)[][] = maze.map((row) =>
      row.map((cell) => (isWall(cell) ? "#" : ".")),
    );
    let r = 0;
    let c = 0;
    if (!isWall(maze[0]?.[0])) board[0]![0] = "S";
    for (const move of path) {
      const dir = DIRS.find((x) => x.d === move)!;
      r += dir.dr;
      c += dir.dc;
      if (board[r]) board[r]![c] = move;
    }
    if (focusR >= 0 && focusC >= 0 && focusR < rows && focusC < cols && board[focusR]) {
      if (board[focusR]![focusC] === ".") board[focusR]![focusC] = "?";
    }
    const er = rows - 1;
    const ec = cols - 1;
    if (board[er]?.[ec] === ".") board[er]![ec] = "E";
    return board;
  };

  const rolesFrom = (focusR = -1, focusC = -1, mode: BtRole = "current"): BtRole[][] => {
    const roles = t.idleBoard(rows, cols);
    for (let r = 0; r < rows; r += 1)
      for (let c = 0; c < cols; c += 1) {
        if (isWall(maze[r]![c])) roles[r]![c] = "fixed";
        else if (visited[r]![c]) roles[r]![c] = "choose";
      }
    if (focusR >= 0 && focusC >= 0 && focusR < rows && focusC < cols) {
      roles[focusR]![focusC] = mode;
    }
    return roles;
  };

  const dirRoles = (hi = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(4);
    for (const move of path) {
      const idx = DIRS.findIndex((x) => x.d === move);
      if (idx >= 0) roles[idx] = "choose";
    }
    if (hi >= 0) roles[hi] = mode;
    return roles;
  };

  const pathIds = () => path.map((d) => DIRS.findIndex((x) => x.d === d));

  t.push(
    dirIds,
    t.idle(4),
    [],
    `Rat in a Maze — go from (0,0) to (${rows - 1},${cols - 1}).`,
    {
      depth: 0,
      found,
      foundLabels,
      board: boardFrom(),
      boardRoles: rolesFrom(),
    },
  );

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols;

  const dfs = (r: number, c: number): boolean => {
    t.calls += 1;
    if (r === rows - 1 && c === cols - 1) {
      t.solutions += 1;
      found.push(pathIds());
      foundLabels.push(path.join("") || "(stay)");
      t.push(dirIds, dirRoles(), pathIds(), `Path found: ${path.join("") || "∅"}.`, {
        pathRoles: path.map(() => "solution" as BtRole),
        depth: path.length,
        found,
        foundLabels,
        board: boardFrom(r, c),
        boardRoles: rolesFrom(r, c, "solution"),
      });
      return found.length >= maxSolutions;
    }

    for (let i = 0; i < DIRS.length; i += 1) {
      const { d, dr, dc } = DIRS[i]!;
      const nr = r + dr;
      const nc = c + dc;
      t.push(
        dirIds,
        dirRoles(i, "current"),
        pathIds(),
        `At (${r},${c}) try ${d} → (${nr},${nc}).`,
        {
          depth: path.length,
          found,
          foundLabels,
          board: boardFrom(nr, nc),
          boardRoles: rolesFrom(nr, nc, "current"),
        },
      );

      if (!inBounds(nr, nc) || isWall(maze[nr]![nc]) || visited[nr]![nc]) {
        t.push(
          dirIds,
          dirRoles(i, "skip"),
          pathIds(),
          `Skip ${d} — blocked or visited.`,
          {
            depth: path.length,
            found,
            foundLabels,
            board: boardFrom(nr, nc),
            boardRoles: rolesFrom(nr, nc, "skip"),
          },
        );
        continue;
      }

      visited[nr]![nc] = true;
      path.push(d);
      t.choices += 1;
      t.push(dirIds, dirRoles(i, "choose"), pathIds(), `Move ${d} to (${nr},${nc}).`, {
        depth: path.length,
        found,
        foundLabels,
        board: boardFrom(nr, nc),
        boardRoles: rolesFrom(nr, nc, "choose"),
      });

      if (dfs(nr, nc)) return true;

      path.pop();
      visited[nr]![nc] = false;
      t.backtracks += 1;
      t.push(
        dirIds,
        dirRoles(i, "backtrack"),
        pathIds(),
        `Backtrack from (${nr},${nc}).`,
        {
          depth: path.length,
          found,
          foundLabels,
          board: boardFrom(nr, nc),
          boardRoles: rolesFrom(nr, nc, "backtrack"),
        },
      );
    }
    return false;
  };

  if (!isWall(maze[0]?.[0])) {
    visited[0]![0] = true;
    dfs(0, 0);
  }

  t.push(dirIds, t.idle(4), [], `Done — ${found.length} path(s).`, {
    found,
    foundLabels,
    board: boardFrom(),
    boardRoles: rolesFrom(),
  });
  return t.frames;
}

/** Maze Solver — DFS from S to E through open cells; walls are #. */
export function mazeSolver(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const template = parseGrid(input, [
    ["S", ".", "#", "."],
    [".", ".", ".", "#"],
    ["#", ".", "#", "."],
    [".", ".", ".", "E"],
  ]);
  const rows = template.length;
  const cols = template[0]?.length ?? 0;
  const maze = cloneStr(template);
  let sr = 0;
  let sc = 0;
  let er = rows - 1;
  let ec = cols - 1;
  for (let r = 0; r < rows; r += 1)
    for (let c = 0; c < cols; c += 1) {
      if (maze[r]![c] === "S") {
        sr = r;
        sc = c;
      }
      if (maze[r]![c] === "E") {
        er = r;
        ec = c;
      }
    }

  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );
  const trail: [number, number][] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const dirIds = DIRS.map((_, i) => i);

  const boardFrom = (focusR = -1, focusC = -1): (string | null)[][] => {
    const board: (string | null)[][] = maze.map((row) =>
      row.map((cell) => {
        if (cell === "#") return "#";
        if (cell === "S") return "S";
        if (cell === "E") return "E";
        return ".";
      }),
    );
    for (const [r, c] of trail) {
      if (board[r]![c] === "." || board[r]![c] === "S") board[r]![c] = "·";
    }
    if (trail.length) {
      const [lr, lc] = trail[trail.length - 1]!;
      if (board[lr]![lc] !== "E") board[lr]![lc] = "●";
    }
    if (
      focusR >= 0 &&
      focusC >= 0 &&
      focusR < rows &&
      focusC < cols &&
      board[focusR]?.[focusC] === "."
    ) {
      board[focusR]![focusC] = "?";
    }
    return board;
  };

  const rolesFrom = (focusR = -1, focusC = -1, mode: BtRole = "current"): BtRole[][] => {
    const roles = t.idleBoard(rows, cols);
    for (let r = 0; r < rows; r += 1)
      for (let c = 0; c < cols; c += 1) {
        if (maze[r]![c] === "#") roles[r]![c] = "fixed";
        else if (visited[r]![c]) roles[r]![c] = "choose";
      }
    if (focusR >= 0 && focusC >= 0 && focusR < rows && focusC < cols) {
      roles[focusR]![focusC] = mode;
    }
    return roles;
  };

  const dirRoles = (hi = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(4);
    if (hi >= 0) roles[hi] = mode;
    return roles;
  };

  const pathIds = () => trail.map(([rr, cc]) => rr * cols + cc);

  t.push(
    dirIds,
    t.idle(4),
    [],
    `Maze Solver — find a path from S (${sr},${sc}) to E (${er},${ec}).`,
    {
      depth: 0,
      found,
      foundLabels,
      board: boardFrom(),
      boardRoles: rolesFrom(),
    },
  );

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols;

  const dfs = (r: number, c: number): boolean => {
    t.calls += 1;
    trail.push([r, c]);
    visited[r]![c] = true;

    if (r === er && c === ec) {
      t.solutions += 1;
      found.push(pathIds());
      foundLabels.push(trail.map(([rr, cc]) => `(${rr},${cc})`).join(" → "));
      t.push(dirIds, t.idle(4), pathIds(), "Reached the exit.", {
        pathRoles: trail.map(() => "solution" as BtRole),
        depth: trail.length,
        found,
        foundLabels,
        board: boardFrom(r, c),
        boardRoles: rolesFrom(r, c, "solution"),
      });
      return true;
    }

    for (let i = 0; i < DIRS.length; i += 1) {
      const { d, dr, dc } = DIRS[i]!;
      const nr = r + dr;
      const nc = c + dc;
      t.push(dirIds, dirRoles(i, "current"), pathIds(), `From (${r},${c}) try ${d}.`, {
        depth: trail.length,
        found,
        foundLabels,
        board: boardFrom(nr, nc),
        boardRoles: rolesFrom(nr, nc, "current"),
      });

      if (!inBounds(nr, nc) || maze[nr]![nc] === "#" || visited[nr]![nc]) {
        t.push(dirIds, dirRoles(i, "skip"), pathIds(), `Cannot go ${d}.`, {
          depth: trail.length,
          found,
          foundLabels,
          board: boardFrom(nr, nc),
          boardRoles: rolesFrom(nr, nc, "skip"),
        });
        continue;
      }

      t.choices += 1;
      if (dfs(nr, nc)) return true;

      t.backtracks += 1;
      t.push(
        dirIds,
        dirRoles(i, "backtrack"),
        pathIds(),
        `Dead end — backtrack to (${r},${c}).`,
        {
          depth: trail.length,
          found,
          foundLabels,
          board: boardFrom(nr, nc),
          boardRoles: rolesFrom(nr, nc, "backtrack"),
        },
      );
    }

    trail.pop();
    visited[r]![c] = false;
    return false;
  };

  dfs(sr, sc);

  t.push(dirIds, t.idle(4), [], `Done — ${found.length ? "path found" : "no path"}.`, {
    found,
    foundLabels,
    board: boardFrom(),
    boardRoles: rolesFrom(),
  });
  return t.frames;
}

/** Word Search — match a word by walking adjacent cells (no reuse). */
export function wordSearch(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const template = parseGrid(input, [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"],
  ]);
  const word = (input.words?.[0] ?? "ABCCED").toUpperCase();
  const rows = template.length;
  const cols = template[0]?.length ?? 0;
  const grid = cloneStr(template).map((row) => row.map((c) => c.toUpperCase()));
  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );
  const trail: [number, number][] = [];
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const letterIds = Array.from({ length: word.length }, (_, i) => i);

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols;

  const boardFrom = (focusR = -1, focusC = -1): (string | null)[][] => {
    const out: (string | null)[][] = grid.map((row) => row.slice());
    for (const [r, c] of trail) out[r]![c] = `*${grid[r]![c]}`;
    if (focusR >= 0 && focusC >= 0 && inBounds(focusR, focusC)) {
      out[focusR]![focusC] = `?${grid[focusR]![focusC]}`;
    }
    return out;
  };

  const rolesFrom = (focusR = -1, focusC = -1, mode: BtRole = "current"): BtRole[][] => {
    const roles = t.idleBoard(rows, cols);
    for (const [r, c] of trail) roles[r]![c] = "choose";
    if (focusR >= 0 && focusC >= 0 && inBounds(focusR, focusC)) {
      roles[focusR]![focusC] = mode;
    }
    return roles;
  };

  const letterRoles = (matched: number, hi = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(word.length);
    for (let i = 0; i < matched; i += 1) roles[i] = "choose";
    if (hi >= 0 && hi < word.length) roles[hi] = mode;
    return roles;
  };

  const pathIds = () => trail.map(([rr, cc]) => rr * cols + cc);

  t.push(
    letterIds,
    t.idle(word.length),
    [],
    `Word Search — find "${word}" in the grid.`,
    {
      depth: 0,
      found,
      foundLabels,
      board: boardFrom(),
      boardRoles: rolesFrom(),
    },
  );

  const dfs = (r: number, c: number, k: number): boolean => {
    t.calls += 1;

    if (!inBounds(r, c) || visited[r]![c] || grid[r]![c] !== word[k]) {
      t.push(
        letterIds,
        letterRoles(k, k, "skip"),
        pathIds(),
        `Reject (${r},${c}) for '${word[k]}'.`,
        {
          depth: k,
          found,
          foundLabels,
          board: boardFrom(r, c),
          boardRoles: rolesFrom(r, c, "skip"),
        },
      );
      return false;
    }

    visited[r]![c] = true;
    trail.push([r, c]);
    t.choices += 1;
    t.push(
      letterIds,
      letterRoles(k + 1, k, "choose"),
      pathIds(),
      `Match (${r},${c}) = '${word[k]}' (${k + 1}/${word.length}).`,
      {
        depth: k + 1,
        found,
        foundLabels,
        board: boardFrom(r, c),
        boardRoles: rolesFrom(r, c, "choose"),
      },
    );

    if (k + 1 === word.length) {
      t.solutions += 1;
      found.push(pathIds());
      foundLabels.push(word);
      t.push(letterIds, letterRoles(word.length), pathIds(), `Found "${word}".`, {
        pathRoles: trail.map(() => "solution" as BtRole),
        depth: word.length,
        found,
        foundLabels,
        board: boardFrom(r, c),
        boardRoles: rolesFrom(r, c, "solution"),
      });
      return true;
    }

    for (const { d, dr, dc } of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      t.push(
        letterIds,
        letterRoles(k + 1, k, "current"),
        pathIds(),
        `Need '${word[k + 1]}' — try ${d}.`,
        {
          depth: k + 1,
          found,
          foundLabels,
          board: boardFrom(nr, nc),
          boardRoles: rolesFrom(nr, nc, "current"),
        },
      );
      if (dfs(nr, nc, k + 1)) return true;
    }

    trail.pop();
    visited[r]![c] = false;
    t.backtracks += 1;
    t.push(
      letterIds,
      letterRoles(k, k, "backtrack"),
      pathIds(),
      `Backtrack from (${r},${c}).`,
      {
        depth: k,
        found,
        foundLabels,
        board: boardFrom(r, c),
        boardRoles: rolesFrom(r, c, "backtrack"),
      },
    );
    return false;
  };

  outer: for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      t.push(
        letterIds,
        letterRoles(0, 0, "current"),
        [],
        `Try starting at (${r},${c}).`,
        {
          depth: 0,
          found,
          foundLabels,
          board: boardFrom(r, c),
          boardRoles: rolesFrom(r, c, "current"),
        },
      );
      if (dfs(r, c, 0)) break outer;
    }
  }

  t.push(
    letterIds,
    t.idle(word.length),
    [],
    `Done — ${found.length ? "found" : "not found"}.`,
    {
      found,
      foundLabels,
      board: boardFrom(),
      boardRoles: rolesFrom(),
    },
  );
  return t.frames;
}

/** Flood Fill — DFS paint all 4-connected cells matching the start color. */
export function floodFill(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const template = parseGrid(input, [
    ["1", "1", "1"],
    ["1", "1", "0"],
    ["1", "0", "1"],
  ]);
  const rows = template.length;
  const cols = template[0]?.length ?? 0;
  const grid = cloneStr(template);
  const sr = Math.max(0, Math.min(input.startRow ?? 1, rows - 1));
  const sc = Math.max(0, Math.min(input.startCol ?? 1, cols - 1));
  const newColor = (input.words?.[0] ?? "2").slice(0, 1);
  const oldColor = grid[sr]![sc]!;
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const painted: [number, number][] = [];

  const boardFrom = (focusR = -1, focusC = -1): (string | null)[][] => {
    const out: (string | null)[][] = grid.map((row) => row.slice());
    if (focusR >= 0 && focusC >= 0 && focusR < rows && focusC < cols) {
      out[focusR]![focusC] = `·${out[focusR]![focusC]}`;
    }
    return out;
  };

  const rolesFrom = (focusR = -1, focusC = -1, mode: BtRole = "current"): BtRole[][] => {
    const roles = t.idleBoard(rows, cols);
    for (const [r, c] of painted) roles[r]![c] = "choose";
    if (focusR >= 0 && focusC >= 0 && focusR < rows && focusC < cols) {
      roles[focusR]![focusC] = mode;
    }
    return roles;
  };

  const pathIds = () => painted.map(([rr, cc]) => rr * cols + cc);

  t.push(
    [],
    [],
    [],
    `Flood Fill — replace '${oldColor}' from (${sr},${sc}) with '${newColor}'.`,
    {
      depth: 0,
      found,
      foundLabels,
      board: boardFrom(),
      boardRoles: rolesFrom(),
    },
  );

  if (oldColor === newColor) {
    t.solutions += 1;
    foundLabels.push("Already filled");
    t.push([], [], [], "Start color equals fill color — nothing to do.", {
      found,
      foundLabels,
      board: boardFrom(),
      boardRoles: rolesFrom(sr, sc, "solution"),
    });
    return t.frames;
  }

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols;

  const dfs = (r: number, c: number) => {
    t.calls += 1;
    t.push([], [], pathIds(), `Visit (${r},${c}).`, {
      depth: painted.length,
      found,
      foundLabels,
      board: boardFrom(r, c),
      boardRoles: rolesFrom(r, c, "current"),
    });

    if (!inBounds(r, c) || grid[r]![c] !== oldColor) {
      t.push([], [], pathIds(), `Skip (${r},${c}) — not '${oldColor}'.`, {
        depth: painted.length,
        found,
        foundLabels,
        board: boardFrom(r, c),
        boardRoles: rolesFrom(r, c, "skip"),
      });
      return;
    }

    grid[r]![c] = newColor;
    painted.push([r, c]);
    t.choices += 1;
    t.push([], [], pathIds(), `Paint (${r},${c}) → '${newColor}'.`, {
      depth: painted.length,
      found,
      foundLabels,
      board: boardFrom(r, c),
      boardRoles: rolesFrom(r, c, "choose"),
    });

    for (const { d, dr, dc } of DIRS) {
      t.push([], [], pathIds(), `From (${r},${c}) recurse ${d}.`, {
        depth: painted.length,
        found,
        foundLabels,
        board: boardFrom(r + dr, c + dc),
        boardRoles: rolesFrom(r + dr, c + dc, "current"),
      });
      dfs(r + dr, c + dc);
    }
  };

  dfs(sr, sc);
  t.solutions += 1;
  found.push(pathIds());
  foundLabels.push(`Painted ${painted.length} cell(s)`);
  t.push([], [], pathIds(), `Fill complete — ${painted.length} cells.`, {
    pathRoles: painted.map(() => "solution" as BtRole),
    depth: painted.length,
    found,
    foundLabels,
    board: boardFrom(),
    boardRoles: t
      .idleBoard(rows, cols)
      .map((row, r) =>
        row.map((_, c) =>
          painted.some(([pr, pc]) => pr === r && pc === c)
            ? ("solution" as BtRole)
            : ("idle" as BtRole),
        ),
      ),
  });
  return t.frames;
}
