import { BacktrackingTrace } from "./trace";
import type {
  BacktrackingFrame,
  BacktrackingInput,
  BtGraphEdge,
  BtGraphNode,
  BtRole,
} from "./types";

function pathRoles(path: number[], last: BtRole = "choose"): BtRole[] {
  if (path.length === 0) return [];
  return path.map((_, i) => (i === path.length - 1 ? last : "choose"));
}

function emptyBoard(n: number): (string | null)[][] {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => null));
}

/** N-Queens — place n queens so none share row, column, or diagonal. */
export function nQueens(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const n = Math.max(4, Math.min(input.n || 4, 5));
  const cols = Array.from({ length: n }, () => -1);
  const colUsed = Array.from({ length: n }, () => false);
  const diag1 = Array.from({ length: 2 * n }, () => false);
  const diag2 = Array.from({ length: 2 * n }, () => false);
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const maxSolutions = n <= 4 ? 3 : 1;

  const boardFrom = (): (string | null)[][] => {
    const board = emptyBoard(n);
    for (let r = 0; r < n; r += 1) {
      if (cols[r]! >= 0) board[r]![cols[r]!] = "♛";
    }
    return board;
  };

  const rolesFrom = (focusR = -1, focusC = -1, mode: BtRole = "current"): BtRole[][] => {
    const roles = t.idleBoard(n, n);
    for (let r = 0; r < n; r += 1) {
      if (cols[r]! >= 0) roles[r]![cols[r]!] = "choose";
    }
    if (focusR >= 0 && focusC >= 0) roles[focusR]![focusC] = mode;
    return roles;
  };

  t.push([], [], [], `N-Queens on ${n}×${n} — place one queen per row.`, {
    depth: 0,
    found,
    foundLabels,
    board: emptyBoard(n),
    boardRoles: t.idleBoard(n, n),
  });

  const dfs = (row: number): boolean => {
    t.calls += 1;
    if (row === n) {
      t.solutions += 1;
      found.push(cols.slice());
      foundLabels.push(cols.map((c, r) => `(${r},${c})`).join(" "));
      t.push([], [], cols.slice(), `Found solution ${found.length}.`, {
        pathRoles: cols.map(() => "solution" as BtRole),
        depth: n,
        found,
        foundLabels,
        board: boardFrom(),
        boardRoles: t
          .idleBoard(n, n)
          .map((rowRoles) => rowRoles.map(() => "solution" as BtRole)),
      });
      return found.length >= maxSolutions;
    }

    for (let c = 0; c < n; c += 1) {
      const d1 = row + c;
      const d2 = row - c + n;
      t.push(
        [],
        [],
        cols.filter((x) => x >= 0),
        `Row ${row}: try column ${c}.`,
        {
          pathRoles: pathRoles(cols.filter((x) => x >= 0)),
          depth: row,
          found,
          foundLabels,
          board: boardFrom(),
          boardRoles: rolesFrom(row, c, "current"),
        },
      );

      if (colUsed[c] || diag1[d1] || diag2[d2]) {
        t.push(
          [],
          [],
          cols.filter((x) => x >= 0),
          `Reject column ${c} — attacks an earlier queen.`,
          {
            depth: row,
            found,
            foundLabels,
            board: boardFrom(),
            boardRoles: rolesFrom(row, c, "skip"),
          },
        );
        continue;
      }

      cols[row] = c;
      colUsed[c] = true;
      diag1[d1] = true;
      diag2[d2] = true;
      t.choices += 1;
      t.push(
        [],
        [],
        cols.filter((x) => x >= 0),
        `Place queen at (${row}, ${c}).`,
        {
          depth: row + 1,
          found,
          foundLabels,
          board: boardFrom(),
          boardRoles: rolesFrom(row, c, "choose"),
        },
      );

      if (dfs(row + 1)) return true;

      cols[row] = -1;
      colUsed[c] = false;
      diag1[d1] = false;
      diag2[d2] = false;
      t.backtracks += 1;
      t.push(
        [],
        [],
        cols.filter((x) => x >= 0),
        `Backtrack — remove queen from (${row}, ${c}).`,
        {
          depth: row,
          found,
          foundLabels,
          board: boardFrom(),
          boardRoles: rolesFrom(row, c, "backtrack"),
        },
      );
    }
    return false;
  };

  dfs(0);
  const endBoard =
    found.length > 0
      ? (() => {
          const board = emptyBoard(n);
          const last = found[found.length - 1]!;
          for (let r = 0; r < n; r += 1) board[r]![last[r]!] = "♛";
          return board;
        })()
      : emptyBoard(n);
  t.push([], [], [], `Done — ${found.length} solution(s) shown.`, {
    depth: 0,
    found,
    foundLabels,
    board: endBoard,
    boardRoles: t.idleBoard(n, n).map((r) => r.map(() => "solution" as BtRole)),
  });
  return t.frames;
}

function parseGrid(input: BacktrackingInput, fallback: string[][]): string[][] {
  if (input.grid?.length) return input.grid.map((row) => row.slice());
  return fallback.map((row) => row.slice());
}

/** 4×4 Sudoku (Shidoku) — digits 1–4, 2×2 boxes. */
export function sudoku(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const puzzle = parseGrid(input, [
    ["1", ".", ".", "4"],
    [".", ".", "1", "."],
    [".", "3", ".", "."],
    ["2", ".", ".", "3"],
  ]);
  const n = puzzle.length;
  const box = Math.round(Math.sqrt(n));
  const board: (string | null)[][] = puzzle.map((row) =>
    row.map((cell) => (cell === "." || cell === "" ? null : cell)),
  );
  const fixed = board.map((row) => row.map((cell) => cell != null));
  const found: number[][] = [];
  const foundLabels: string[] = [];

  const baseRoles = (): BtRole[][] => {
    const roles = t.idleBoard(n, n);
    for (let r = 0; r < n; r += 1)
      for (let c = 0; c < n; c += 1) {
        if (fixed[r]![c]) roles[r]![c] = "fixed";
        else if (board[r]![c] != null) roles[r]![c] = "choose";
      }
    return roles;
  };

  const ok = (r: number, c: number, ch: string): boolean => {
    for (let i = 0; i < n; i += 1) {
      if (board[r]![i] === ch || board[i]![c] === ch) return false;
    }
    const br = Math.floor(r / box) * box;
    const bc = Math.floor(c / box) * box;
    for (let i = 0; i < box; i += 1)
      for (let j = 0; j < box; j += 1) if (board[br + i]![bc + j] === ch) return false;
    return true;
  };

  const nextEmpty = (): [number, number] | null => {
    for (let r = 0; r < n; r += 1)
      for (let c = 0; c < n; c += 1) if (board[r]![c] == null) return [r, c];
    return null;
  };

  t.push([], [], [], `${n}×${n} Sudoku — fill empties; respect rows, cols, boxes.`, {
    depth: 0,
    found,
    foundLabels,
    board: board.map((row) => row.slice()),
    boardRoles: baseRoles(),
  });

  const dfs = (): boolean => {
    t.calls += 1;
    const cell = nextEmpty();
    if (!cell) {
      t.solutions += 1;
      const flat = board.flatMap((row) => row.map((v) => Number(v)));
      found.push(flat);
      foundLabels.push(board.map((row) => row.join("")).join(" / "));
      t.push([], [], [], "Board complete — valid Sudoku.", {
        depth: n * n,
        found,
        foundLabels,
        board: board.map((row) => row.slice()),
        boardRoles: t.idleBoard(n, n).map((row) => row.map(() => "solution" as BtRole)),
      });
      return true;
    }
    const [r, c] = cell;
    for (let d = 1; d <= n; d += 1) {
      const ch = String(d);
      const roles = baseRoles();
      roles[r]![c] = "current";
      t.push([], [], [], `Cell (${r},${c}): try ${ch}.`, {
        depth: found.length,
        found,
        foundLabels,
        board: board.map((row) => row.slice()),
        boardRoles: roles,
      });
      if (!ok(r, c, ch)) {
        roles[r]![c] = "skip";
        t.push([], [], [], `${ch} conflicts at (${r},${c}).`, {
          found,
          foundLabels,
          board: board.map((row) => row.slice()),
          boardRoles: roles,
        });
        continue;
      }
      board[r]![c] = ch;
      t.choices += 1;
      const placed = baseRoles();
      placed[r]![c] = "choose";
      t.push([], [], [], `Place ${ch} at (${r},${c}).`, {
        found,
        foundLabels,
        board: board.map((row) => row.slice()),
        boardRoles: placed,
      });
      if (dfs()) return true;
      board[r]![c] = null;
      t.backtracks += 1;
      const rolesBack = baseRoles();
      rolesBack[r]![c] = "backtrack";
      t.push([], [], [], `Backtrack — clear (${r},${c}).`, {
        found,
        foundLabels,
        board: board.map((row) => row.slice()),
        boardRoles: rolesBack,
      });
    }
    return false;
  };

  dfs();
  t.push([], [], [], `Done — ${found.length ? "solved" : "no solution in search"}.`, {
    found,
    foundLabels,
    board: board.map((row) => row.slice()),
    boardRoles: baseRoles(),
  });
  return t.frames;
}

function layoutCycle(n: number): BtGraphNode[] {
  const cx = 50;
  const cy = 48;
  const radius = n <= 4 ? 28 : 32;
  return Array.from({ length: n }, (_, i) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      id: i,
      x: cx + radius * Math.cos(ang),
      y: cy + radius * Math.sin(ang),
      label: String.fromCharCode(65 + i),
    };
  });
}

/** Graph k-coloring — assign colors so adjacent nodes differ. */
export function graphColoring(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const n = Math.max(3, Math.min(input.n || 4, 5));
  const k = Math.max(2, Math.min(input.k || 3, 4));
  const pairs: [number, number][] = input.pairs?.length
    ? input.pairs
    : Array.from({ length: n }, (_, i) => [i, (i + 1) % n] as [number, number]);
  const nodes = layoutCycle(n);
  const edges: BtGraphEdge[] = pairs.map(([u, v], i) => ({ id: i, u, v }));
  const color = Array.from({ length: n }, () => -1);
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const colorName = (c: number) => ["R", "G", "B", "Y"][c] ?? String(c);

  const nodeRoles = (focus = -1, mode: BtRole = "current"): BtRole[] => {
    const roles = t.idle(n);
    for (let i = 0; i < n; i += 1) {
      if (color[i]! >= 0) roles[i] = "choose";
    }
    if (focus >= 0) roles[focus] = mode;
    return roles;
  };

  const labeledNodes = (): BtGraphNode[] =>
    nodes.map((node, i) => ({
      ...node,
      label: color[i]! >= 0 ? `${node.label}:${colorName(color[i]!)}` : node.label,
    }));

  t.push([], [], [], `Color ${n} nodes with ${k} colors — neighbors must differ.`, {
    depth: 0,
    found,
    foundLabels,
    nodes: labeledNodes(),
    edges,
    nodeRoles: t.idle(n),
  });

  const safe = (u: number, c: number) => {
    for (const [a, b] of pairs) {
      const v = a === u ? b : b === u ? a : -1;
      if (v < 0) continue;
      if (color[v] === c) return false;
    }
    return true;
  };

  const dfs = (u: number): boolean => {
    t.calls += 1;
    if (u === n) {
      t.solutions += 1;
      found.push(color.slice());
      foundLabels.push(
        color.map((c, i) => `${nodes[i]!.label}=${colorName(c)}`).join(" "),
      );
      t.push([], [], color.slice(), "Valid coloring found.", {
        pathRoles: color.map(() => "solution" as BtRole),
        depth: n,
        found,
        foundLabels,
        nodes: labeledNodes(),
        edges,
        nodeRoles: Array.from({ length: n }, () => "solution" as BtRole),
      });
      return true;
    }

    for (let c = 0; c < k; c += 1) {
      t.push(
        [],
        [],
        color.filter((x) => x >= 0),
        `Node ${nodes[u]!.label}: try ${colorName(c)}.`,
        {
          depth: u,
          found,
          foundLabels,
          nodes: labeledNodes(),
          edges,
          nodeRoles: nodeRoles(u, "current"),
        },
      );
      if (!safe(u, c)) {
        t.push(
          [],
          [],
          color.filter((x) => x >= 0),
          `${colorName(c)} conflicts with a neighbor.`,
          {
            found,
            foundLabels,
            nodes: labeledNodes(),
            edges,
            nodeRoles: nodeRoles(u, "skip"),
          },
        );
        continue;
      }
      color[u] = c;
      t.choices += 1;
      t.push(
        [],
        [],
        color.filter((x) => x >= 0),
        `Color ${nodes[u]!.label} = ${colorName(c)}.`,
        {
          depth: u + 1,
          found,
          foundLabels,
          nodes: labeledNodes(),
          edges,
          nodeRoles: nodeRoles(u, "choose"),
        },
      );
      if (dfs(u + 1)) return true;
      color[u] = -1;
      t.backtracks += 1;
      t.push(
        [],
        [],
        color.filter((x) => x >= 0),
        `Backtrack — uncolor ${nodes[u]!.label}.`,
        {
          depth: u,
          found,
          foundLabels,
          nodes: labeledNodes(),
          edges,
          nodeRoles: nodeRoles(u, "backtrack"),
        },
      );
    }
    return false;
  };

  dfs(0);
  t.push([], [], [], `Done — ${found.length ? "colored" : "failed"}.`, {
    found,
    foundLabels,
    nodes: labeledNodes(),
    edges,
    nodeRoles: found.length
      ? Array.from({ length: n }, () => "solution" as BtRole)
      : t.idle(n),
  });
  return t.frames;
}

type Slot = { id: number; cells: [number, number][]; across: boolean };

/** Tiny crossword — place a small word bank into slotted grid. */
export function crossword(input: BacktrackingInput): BacktrackingFrame[] {
  const t = new BacktrackingTrace();
  const template = parseGrid(input, [
    [".", "."],
    [".", "."],
  ]);
  const rows = template.length;
  const cols = template[0]?.length ?? 0;
  const board: (string | null)[][] = template.map((row) =>
    row.map((cell) => (cell === "#" ? "#" : null)),
  );
  const words = (input.words?.length ? input.words : ["AT", "ME", "AM", "TE"]).map((w) =>
    w.toUpperCase(),
  );
  const found: number[][] = [];
  const foundLabels: string[] = [];
  const usedWord = Array.from({ length: words.length }, () => false);

  const slots: Slot[] = [];
  for (let r = 0; r < rows; r += 1) {
    let c = 0;
    while (c < cols) {
      while (c < cols && template[r]![c] === "#") c += 1;
      const start = c;
      const cells: [number, number][] = [];
      while (c < cols && template[r]![c] !== "#") {
        cells.push([r, c]);
        c += 1;
      }
      if (cells.length >= 2) slots.push({ id: slots.length, cells, across: true });
      if (c === start) c += 1;
    }
  }
  for (let c = 0; c < cols; c += 1) {
    let r = 0;
    while (r < rows) {
      while (r < rows && template[r]![c] === "#") r += 1;
      const start = r;
      const cells: [number, number][] = [];
      while (r < rows && template[r]![c] !== "#") {
        cells.push([r, c]);
        r += 1;
      }
      if (cells.length >= 2) slots.push({ id: slots.length, cells, across: false });
      if (r === start) r += 1;
    }
  }

  const wordIds = words.map((_, i) => i);

  const baseRoles = (): BtRole[][] => {
    const roles = t.idleBoard(rows, cols);
    for (let r = 0; r < rows; r += 1)
      for (let c = 0; c < cols; c += 1) {
        if (board[r]![c] === "#") roles[r]![c] = "fixed";
        else if (board[r]![c] != null) roles[r]![c] = "choose";
      }
    return roles;
  };

  const fits = (slot: Slot, word: string): boolean => {
    if (word.length !== slot.cells.length) return false;
    for (let i = 0; i < slot.cells.length; i += 1) {
      const [r, c] = slot.cells[i]!;
      const cur = board[r]![c];
      if (cur != null && cur !== "#" && cur !== word[i]) return false;
    }
    return true;
  };

  const place = (slot: Slot, word: string): boolean[] => {
    const wrote: boolean[] = [];
    for (let i = 0; i < slot.cells.length; i += 1) {
      const [r, c] = slot.cells[i]!;
      if (board[r]![c] == null) {
        board[r]![c] = word[i]!;
        wrote.push(true);
      } else wrote.push(false);
    }
    return wrote;
  };

  const unplace = (slot: Slot, wrote: boolean[]) => {
    for (let i = 0; i < slot.cells.length; i += 1) {
      if (!wrote[i]) continue;
      const [r, c] = slot.cells[i]!;
      board[r]![c] = null;
    }
  };

  t.push(
    wordIds,
    t.idle(words.length),
    [],
    `Crossword — place words into ${slots.length} slots.`,
    {
      depth: 0,
      found,
      foundLabels,
      board: board.map((row) => row.slice()),
      boardRoles: baseRoles(),
    },
  );

  const order = slots
    .map((_, i) => i)
    .sort((a, b) => slots[b]!.cells.length - slots[a]!.cells.length);

  const solve = (si: number): boolean => {
    t.calls += 1;
    if (si === order.length) {
      t.solutions += 1;
      found.push([1]);
      foundLabels.push(
        board
          .map((row) => row.map((c) => (c === "#" ? "■" : (c ?? "·"))).join(""))
          .join(" / "),
      );
      const roles = t.idleBoard(rows, cols);
      for (let r = 0; r < rows; r += 1)
        for (let c = 0; c < cols; c += 1)
          roles[r]![c] = board[r]![c] === "#" ? "fixed" : "solution";
      t.push(
        wordIds,
        usedWord.map((u) => (u ? "solution" : "idle")),
        [],
        "All slots filled.",
        {
          found,
          foundLabels,
          board: board.map((row) => row.slice()),
          boardRoles: roles,
        },
      );
      return true;
    }

    const slot = slots[order[si]!]!;
    const dir = slot.across ? "across" : "down";
    for (let wi = 0; wi < words.length; wi += 1) {
      if (usedWord[wi]) continue;
      const word = words[wi]!;
      const wordRoles = usedWord.map((u) => (u ? ("choose" as BtRole) : "idle"));
      wordRoles[wi] = "current";
      const rolesTry = baseRoles();
      for (const [r, c] of slot.cells) rolesTry[r]![c] = "current";
      t.push(wordIds, wordRoles, [], `Slot ${slot.id} (${dir}): try "${word}".`, {
        depth: si,
        found,
        foundLabels,
        board: board.map((row) => row.slice()),
        boardRoles: rolesTry,
      });

      if (!fits(slot, word)) {
        const rolesSkip = baseRoles();
        for (const [r, c] of slot.cells) rolesSkip[r]![c] = "skip";
        wordRoles[wi] = "skip";
        t.push(wordIds, wordRoles, [], `"${word}" does not fit this slot.`, {
          found,
          foundLabels,
          board: board.map((row) => row.slice()),
          boardRoles: rolesSkip,
        });
        continue;
      }

      const wrote = place(slot, word);
      usedWord[wi] = true;
      t.choices += 1;
      const rolesPlace = baseRoles();
      for (const [r, c] of slot.cells) rolesPlace[r]![c] = "choose";
      t.push(
        wordIds,
        usedWord.map((u) => (u ? "choose" : "idle")),
        [],
        `Place "${word}" ${dir}.`,
        {
          depth: si + 1,
          found,
          foundLabels,
          board: board.map((row) => row.slice()),
          boardRoles: rolesPlace,
        },
      );

      if (solve(si + 1)) return true;

      unplace(slot, wrote);
      usedWord[wi] = false;
      t.backtracks += 1;
      const rolesBack = baseRoles();
      for (const [r, c] of slot.cells) rolesBack[r]![c] = "backtrack";
      t.push(
        wordIds,
        usedWord.map((u) => (u ? "choose" : "idle")),
        [],
        `Backtrack — remove "${word}".`,
        {
          depth: si,
          found,
          foundLabels,
          board: board.map((row) => row.slice()),
          boardRoles: rolesBack,
        },
      );
    }
    return false;
  };

  solve(0);
  t.push(
    wordIds,
    t.idle(words.length),
    [],
    `Done — ${found.length ? "filled" : "no fill found"}.`,
    {
      found,
      foundLabels,
      board: board.map((row) => row.slice()),
      boardRoles: baseRoles(),
    },
  );
  return t.frames;
}
