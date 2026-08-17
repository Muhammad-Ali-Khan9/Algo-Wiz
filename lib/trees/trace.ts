import type {
  TreeEdgeRole,
  TreeFrame,
  TreeNodeRole,
  TreeStats,
  TreeVizEdge,
  TreeVizNode,
} from "./types";

export class TreeTrace {
  frames: TreeFrame[] = [];
  visits = 0;
  compares = 0;
  rotations = 0;

  idleNodeRoles(n: number): TreeNodeRole[] {
    return Array.from({ length: n }, () => "idle");
  }

  idleEdgeRoles(n: number): TreeEdgeRole[] {
    return Array.from({ length: n }, () => "idle");
  }

  stats(): TreeStats {
    return {
      visits: this.visits,
      compares: this.compares,
      rotations: this.rotations,
    };
  }

  push(
    nodes: TreeVizNode[],
    edges: TreeVizEdge[],
    nodeRoles: TreeNodeRole[],
    edgeRoles: TreeEdgeRole[],
    hint: string,
    extra?: {
      labels?: Record<number, string>;
      fills?: Record<number, string>;
      frontier?: number[];
    },
  ) {
    this.frames.push({
      nodes: nodes.map((node) => ({ ...node })),
      edges: edges.map((edge) => ({ ...edge })),
      nodeRoles: nodeRoles.slice(),
      edgeRoles: edgeRoles.slice(),
      labels: { ...(extra?.labels ?? {}) },
      fills: extra?.fills ? { ...extra.fills } : undefined,
      frontier: [...(extra?.frontier ?? [])],
      hint,
      stats: this.stats(),
    });
  }

  visit() {
    this.visits += 1;
  }

  compare() {
    this.compares += 1;
  }

  rotate() {
    this.rotations += 1;
  }
}

export function rolesForIds(
  n: number,
  map: Partial<Record<number, TreeNodeRole>>,
): TreeNodeRole[] {
  const roles: TreeNodeRole[] = Array.from({ length: n }, () => "idle");
  for (const [id, role] of Object.entries(map)) {
    const i = Number(id);
    if (Number.isFinite(i) && role) roles[i] = role;
  }
  return roles;
}

/** Remap roles onto the current node id list (ids may be sparse). */
export function rolesByNodeList(
  nodes: TreeVizNode[],
  map: Partial<Record<number, TreeNodeRole>>,
): TreeNodeRole[] {
  return nodes.map((node) => map[node.id] ?? "idle");
}

export function edgeRolesByList(
  edges: TreeVizEdge[],
  map: Partial<Record<number, TreeEdgeRole>>,
): TreeEdgeRole[] {
  return edges.map((edge) => map[edge.id] ?? "idle");
}
