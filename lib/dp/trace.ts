import type { DpCellRole, DpFrame, DpStats, DpTreeEdge, DpTreeNode } from "./types";

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
      words?: string[];
      wordRoles?: DpCellRole[];
      colLabels?: string[];
      rowLabels?: string[];
      treeNodes?: DpTreeNode[];
      treeEdges?: DpTreeEdge[];
      treeRoles?: Record<number, DpCellRole>;
      treeEdgeRoles?: Record<number, DpCellRole>;
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
      words: extra?.words ? extra.words.slice() : undefined,
      wordRoles: extra?.wordRoles ? extra.wordRoles.slice() : undefined,
      colLabels: extra?.colLabels ? extra.colLabels.slice() : undefined,
      rowLabels: extra?.rowLabels ? extra.rowLabels.slice() : undefined,
      treeNodes: extra?.treeNodes ? extra.treeNodes.map((n) => ({ ...n })) : undefined,
      treeEdges: extra?.treeEdges ? extra.treeEdges.map((e) => ({ ...e })) : undefined,
      treeRoles: extra?.treeRoles ? { ...extra.treeRoles } : undefined,
      treeEdgeRoles: extra?.treeEdgeRoles ? { ...extra.treeEdgeRoles } : undefined,
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
      words?: string[];
      wordRoles?: DpCellRole[];
      colLabels?: string[];
      rowLabels?: string[];
      input?: number[];
      inputRoles?: DpCellRole[];
    },
  ) {
    this.push([], [], hint, {
      formula: extra?.formula,
      grid,
      gridRoles: roles,
      sourceGrid: extra?.sourceGrid,
      items: extra?.items,
      itemRoles: extra?.itemRoles,
      words: extra?.words,
      wordRoles: extra?.wordRoles,
      colLabels: extra?.colLabels,
      rowLabels: extra?.rowLabels,
      input: extra?.input,
      inputRoles: extra?.inputRoles,
    });
  }

  sub() {
    this.subproblems += 1;
  }

  step() {
    this.transitions += 1;
  }
}
