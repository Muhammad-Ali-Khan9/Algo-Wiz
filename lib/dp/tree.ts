import { layoutBinary, type LayoutBin } from "@/lib/trees/layout";
import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput, DpTreeEdge, DpTreeNode } from "./types";

export type DpBinNode = {
  id: number;
  key: number;
  left: DpBinNode | null;
  right: DpBinNode | null;
};

function toLayout(node: DpBinNode | null): LayoutBin | null {
  if (!node) return null;
  return {
    id: node.id,
    key: node.key,
    left: toLayout(node.left),
    right: toLayout(node.right),
  };
}

function scene(
  root: DpBinNode | null,
  captions: Map<number, string>,
): { nodes: DpTreeNode[]; edges: DpTreeEdge[] } {
  const laid = layoutBinary(toLayout(root), {
    top: 8,
    bottom: 82,
    left: 10,
    right: 90,
  });
  return {
    nodes: laid.nodes.map((n) => ({
      id: n.id,
      x: n.x,
      y: n.y,
      label: String(n.label),
      caption: captions.get(n.id),
    })),
    edges: laid.edges.map((e) => ({ id: e.id, u: e.u, v: e.v })),
  };
}

function idleRoles(ids: number[]): Record<number, DpCellRole> {
  const roles: Record<number, DpCellRole> = {};
  for (const id of ids) roles[id] = "idle";
  return roles;
}

function collectIds(root: DpBinNode | null, out: number[] = []): number[] {
  if (!root) return out;
  out.push(root.id);
  collectIds(root.left, out);
  collectIds(root.right, out);
  return out;
}

/** Build binary tree from values + optional child index arrays. */
export function buildTreeFromInput(input: DpInput): DpBinNode | null {
  const values = input.values.length > 0 ? input.values : [1, 2, 3, 4, 5];
  const left = input.treeLeft;
  const right = input.treeRight;
  const n = values.length;
  if (n === 0) return null;

  const nodes: DpBinNode[] = values.map((key, id) => ({
    id,
    key,
    left: null,
    right: null,
  }));

  if (left.length === n && right.length === n) {
    for (let i = 0; i < n; i += 1) {
      const L = left[i];
      const R = right[i];
      if (L != null && L >= 0 && L < n) nodes[i]!.left = nodes[L]!;
      if (R != null && R >= 0 && R < n) nodes[i]!.right = nodes[R]!;
    }
    return nodes[0]!;
  }

  for (let i = 0; i < n; i += 1) {
    const L = 2 * i + 1;
    const R = 2 * i + 2;
    if (L < n) nodes[i]!.left = nodes[L]!;
    if (R < n) nodes[i]!.right = nodes[R]!;
  }
  return nodes[0]!;
}

function pushTree(
  t: DpTrace,
  root: DpBinNode | null,
  roles: Record<number, DpCellRole>,
  captions: Map<number, string>,
  hint: string,
  formula: string,
) {
  const { nodes, edges } = scene(root, captions);
  t.push([], [], hint, {
    formula,
    treeNodes: nodes,
    treeEdges: edges,
    treeRoles: { ...roles },
  });
}

/** Longest path in a binary tree measured in edges. */
export function treeDiameter(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const root = buildTreeFromInput(input);
  const ids = collectIds(root);
  const heights = new Map<number, number>();
  let best = 0;
  let bestNode = root?.id ?? 0;

  const captions = () => new Map([...heights.entries()].map(([id, h]) => [id, `h=${h}`]));

  pushTree(
    t,
    root,
    idleRoles(ids),
    captions(),
    "Tree Diameter — longest path length (edges) via post-order heights.",
    "at u: diam = max(diam, hL+hR); return 1+max(hL,hR)",
  );

  const dfs = (node: DpBinNode | null): number => {
    if (!node) return 0;

    const rolesEnter = idleRoles(ids);
    rolesEnter[node.id] = "current";
    pushTree(
      t,
      root,
      rolesEnter,
      captions(),
      `Visit node ${node.key} — compute left/right heights.`,
      `dfs(${node.key})`,
    );

    const hL = dfs(node.left);
    const hR = dfs(node.right);
    const through = hL + hR;
    const height = 1 + Math.max(hL, hR);
    heights.set(node.id, height);
    t.sub();
    t.step();

    const rolesRead = idleRoles(ids);
    rolesRead[node.id] = "current";
    if (node.left) rolesRead[node.left.id] = "read";
    if (node.right) rolesRead[node.right.id] = "read";
    pushTree(
      t,
      root,
      rolesRead,
      captions(),
      `At ${node.key}: path through = ${hL}+${hR}=${through}, height=${height}.`,
      `hL=${hL}, hR=${hR}`,
    );

    if (through > best) {
      best = through;
      bestNode = node.id;
      const rolesWrite = idleRoles(ids);
      rolesWrite[node.id] = "write";
      if (node.left) rolesWrite[node.left.id] = "read";
      if (node.right) rolesWrite[node.right.id] = "read";
      pushTree(
        t,
        root,
        rolesWrite,
        captions(),
        `New best diameter ${best} (through ${node.key}).`,
        `diam = ${best}`,
      );
    }

    const rolesDone = idleRoles(ids);
    rolesDone[node.id] = "write";
    pushTree(
      t,
      root,
      rolesDone,
      captions(),
      `Return height ${height} from ${node.key}.`,
      `return ${height}`,
    );
    return height;
  };

  dfs(root);

  const rolesAnswer = idleRoles(ids);
  rolesAnswer[bestNode] = "answer";
  pushTree(
    t,
    root,
    rolesAnswer,
    captions(),
    `Answer: tree diameter = ${best} edge(s).`,
    `diameter = ${best}`,
  );
  return t.frames;
}

/** Maximum path sum in a binary tree (any node-to-node path). */
export function maximumPathSum(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const root = buildTreeFromInput(input);
  const ids = collectIds(root);
  const gains = new Map<number, number>();
  let best = Number.NEGATIVE_INFINITY;
  let bestNode = root?.id ?? 0;

  const captions = () => new Map([...gains.entries()].map(([id, g]) => [id, `↑${g}`]));

  pushTree(
    t,
    root,
    idleRoles(ids),
    captions(),
    "Maximum Path Sum — best node-to-node path (values may be negative).",
    "gain = val+max(0,L,R); best = max(best, val+max(0,L)+max(0,R))",
  );

  const dfs = (node: DpBinNode | null): number => {
    if (!node) return 0;

    const rolesEnter = idleRoles(ids);
    rolesEnter[node.id] = "current";
    pushTree(
      t,
      root,
      rolesEnter,
      captions(),
      `Visit ${node.key} — gather gains from children.`,
      `dfs(${node.key})`,
    );

    const rawL = dfs(node.left);
    const rawR = dfs(node.right);
    const L = Math.max(0, rawL);
    const R = Math.max(0, rawR);
    const through = node.key + L + R;
    const gain = node.key + Math.max(L, R);
    gains.set(node.id, gain);
    t.sub();
    t.step();

    const rolesRead = idleRoles(ids);
    rolesRead[node.id] = "current";
    if (node.left) rolesRead[node.left.id] = "read";
    if (node.right) rolesRead[node.right.id] = "read";
    pushTree(
      t,
      root,
      rolesRead,
      captions(),
      `At ${node.key}: through=${node.key}+${L}+${R}=${through}, upward gain=${gain}.`,
      `L=${L}, R=${R}`,
    );

    if (through > best) {
      best = through;
      bestNode = node.id;
      const rolesWrite = idleRoles(ids);
      rolesWrite[node.id] = "write";
      pushTree(
        t,
        root,
        rolesWrite,
        captions(),
        `New best path sum ${best} (peak at ${node.key}).`,
        `best = ${best}`,
      );
    }

    const rolesDone = idleRoles(ids);
    rolesDone[node.id] = "write";
    pushTree(
      t,
      root,
      rolesDone,
      captions(),
      `Return upward gain ${gain} from ${node.key}.`,
      `return ${gain}`,
    );
    return gain;
  };

  dfs(root);

  const rolesAnswer = idleRoles(ids);
  rolesAnswer[bestNode] = "answer";
  pushTree(
    t,
    root,
    rolesAnswer,
    captions(),
    `Answer: maximum path sum = ${best}.`,
    `maxPathSum = ${best}`,
  );
  return t.frames;
}
