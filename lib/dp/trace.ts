import type { DpCellRole, DpFrame, DpStats } from "./types";

function cloneGrid<T>(grid: T[][]): T[][] {
  return grid.map((row) => row.slice());
}

export class DpTrace {
  frames: DpFrame[] = [];
  subproblems = 0;
  transitions = 0;

  stats(): DpStats {
    return {
      subproblems: this.subproblems,
      transitions: this.transitions,
    };
  }

  idle(n: number): DpCellRole[] {
    return Array.from({ length: n }, () => "idle");
  }

  idleGrid(rows: number, cols: number): DpCellRole[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "idle" as DpCellRole),
    );
  }

  push(
    table: (number | null)[],
    roles: DpCellRole[],
    hint: string,
    extra?: {
      formula?: string;
      input?: number[];
      inputRoles?: DpCellRole[];
      grid?: (number | null)[][];
      gridRoles?: DpCellRole[][];
      sourceGrid?: number[][];
      items?: { weight: number; value: number }[];
      itemRoles?: DpCellRole[];
      colLabels?: string[];
      rowLabels?: string[];
    },
  ) {
    this.frames.push({
      table: table.slice(),
      roles: roles.slice(),
      input: extra?.input ? extra.input.slice() : undefined,
      inputRoles: extra?.inputRoles ? extra.inputRoles.slice() : undefined,
      grid: extra?.grid ? cloneGrid(extra.grid) : undefined,
      gridRoles: extra?.gridRoles ? cloneGrid(extra.gridRoles) : undefined,
      sourceGrid: extra?.sourceGrid ? cloneGrid(extra.sourceGrid) : undefined,
      items: extra?.items ? extra.items.map((item) => ({ ...item })) : undefined,
      itemRoles: extra?.itemRoles ? extra.itemRoles.slice() : undefined,
      colLabels: extra?.colLabels ? extra.colLabels.slice() : undefined,
      rowLabels: extra?.rowLabels ? extra.rowLabels.slice() : undefined,
      hint,
      formula: extra?.formula,
      stats: this.stats(),
    });
  }

  pushGrid(
    grid: (number | null)[][],
    roles: DpCellRole[][],
    hint: string,
    extra?: {
      formula?: string;
      sourceGrid?: number[][];
      items?: { weight: number; value: number }[];
      itemRoles?: DpCellRole[];
      colLabels?: string[];
      rowLabels?: string[];
    },
  ) {
    this.push([], [], hint, {
      formula: extra?.formula,
      grid,
      gridRoles: roles,
      sourceGrid: extra?.sourceGrid,
      items: extra?.items,
      itemRoles: extra?.itemRoles,
      colLabels: extra?.colLabels,
      rowLabels: extra?.rowLabels,
    });
  }

  sub() {
    this.subproblems += 1;
  }

  step() {
    this.transitions += 1;
  }
}
