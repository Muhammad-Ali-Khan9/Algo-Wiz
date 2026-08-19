import type {
  BacktrackingFrame,
  BacktrackingStats,
  BtGraphEdge,
  BtGraphNode,
  BtRole,
} from "./types";

function cloneBoard(board: (string | null)[][]): (string | null)[][] {
  return board.map((row) => row.slice());
}

function cloneRoles(roles: BtRole[][]): BtRole[][] {
  return roles.map((row) => row.slice());
}

export class BacktrackingTrace {
  frames: BacktrackingFrame[] = [];
  calls = 0;
  choices = 0;
  backtracks = 0;
  solutions = 0;

  stats(): BacktrackingStats {
    return {
      calls: this.calls,
      choices: this.choices,
      backtracks: this.backtracks,
      solutions: this.solutions,
    };
  }

  idle(n: number): BtRole[] {
    return Array.from({ length: n }, () => "idle" as BtRole);
  }

  idleBoard(rows: number, cols: number): BtRole[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "idle" as BtRole),
    );
  }

  push(
    candidates: number[],
    roles: BtRole[],
    path: number[],
    hint: string,
    extra?: {
      pathRoles?: BtRole[];
      depth?: number;
      found?: number[][];
      foundLabels?: string[];
      board?: (string | null)[][];
      boardRoles?: BtRole[][];
      nodes?: BtGraphNode[];
      edges?: BtGraphEdge[];
      nodeRoles?: BtRole[];
    },
  ) {
    this.frames.push({
      candidates: candidates.slice(),
      roles: roles.slice(),
      path: path.slice(),
      pathRoles: extra?.pathRoles
        ? extra.pathRoles.slice()
        : Array.from({ length: path.length }, () => "choose" as BtRole),
      depth: extra?.depth ?? path.length,
      found: (extra?.found ?? []).map((s) => s.slice()),
      foundLabels: extra?.foundLabels ? extra.foundLabels.slice() : [],
      hint,
      stats: this.stats(),
      board: extra?.board ? cloneBoard(extra.board) : undefined,
      boardRoles: extra?.boardRoles ? cloneRoles(extra.boardRoles) : undefined,
      nodes: extra?.nodes ? extra.nodes.map((n) => ({ ...n })) : undefined,
      edges: extra?.edges ? extra.edges.map((e) => ({ ...e })) : undefined,
      nodeRoles: extra?.nodeRoles ? extra.nodeRoles.slice() : undefined,
    });
  }
}
