import { layoutBinary, type LayoutBin } from "@/lib/trees/layout";
import { DpTrace } from "./trace";
import type { DpCellRole, DpFrame, DpInput, DpTreeEdge, DpTreeNode } from "./types";

type GameNode = {
  id: number;
  key: number;
  isMax: boolean;
  left: GameNode | null;
  right: GameNode | null;
  leaf: boolean;
};

function toLayout(node: GameNode | null): LayoutBin | null {
  if (!node) return null;
  return {
    id: node.id,
    key: node.key,
    left: toLayout(node.left),
    right: toLayout(node.right),
  };
}

function scene(
  root: GameNode | null,
  captions: Map<number, string>,
  kinds: Map<number, string>,
): { nodes: DpTreeNode[]; edges: DpTreeEdge[] } {
  const laid = layoutBinary(toLayout(root), {
    top: 10,
    bottom: 82,
    left: 8,
    right: 92,
  });
  return {
    nodes: laid.nodes.map((n) => ({
      id: n.id,
      x: n.x,
      y: n.y,
      label: kinds.get(n.id) ?? String(n.label),
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

function collectIds(node: GameNode | null, out: number[] = []): number[] {
  if (!node) return out;
  out.push(node.id);
  collectIds(node.left, out);
  collectIds(node.right, out);
  return out;
}

/** Build a full binary game tree; leaf scores from values (padded/cycled). */
function buildGameTree(values: number[], depth: number): GameNode {
  let nextId = 0;
  let leafIdx = 0;
  const scores = values.length > 0 ? values : [3, 5, 2, 9, 1, 7, 4, 6];

  const build = (d: number, isMax: boolean): GameNode => {
    const id = nextId++;
    if (d === 0) {
      const key = scores[leafIdx % scores.length]!;
      leafIdx += 1;
      return { id, key, isMax, left: null, right: null, leaf: true };
    }
    const left = build(d - 1, !isMax);
    const right = build(d - 1, !isMax);
    return { id, key: 0, isMax, left, right, leaf: false };
  };

  return build(Math.max(1, depth), true);
}

function pushTree(
  t: DpTrace,
  root: GameNode,
  roles: Record<number, DpCellRole>,
  values: Map<number, number | null>,
  hint: string,
  formula: string,
) {
  const captions = new Map<number, string>();
  const kinds = new Map<number, string>();
  const walk = (node: GameNode | null) => {
    if (!node) return;
    kinds.set(node.id, node.leaf ? String(node.key) : node.isMax ? "MAX" : "MIN");
    const v = values.get(node.id);
    if (v != null) captions.set(node.id, `= ${v}`);
    else if (!node.leaf) captions.set(node.id, "·");
    walk(node.left);
    walk(node.right);
  };
  walk(root);
  const { nodes, edges } = scene(root, captions, kinds);
  t.push([], [], hint, {
    formula,
    treeNodes: nodes,
    treeEdges: edges,
    treeRoles: { ...roles },
  });
}

/** Bottom-up minimax on a small game tree (root is MAX). */
export function minimax(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const depth = Math.max(1, Math.min(input.n || 2, 3));
  const root = buildGameTree(input.values, depth);
  const ids = collectIds(root);
  const values = new Map<number, number | null>();

  pushTree(
    t,
    root,
    idleRoles(ids),
    values,
    "Minimax — MAX root, alternate MIN/MAX; fill from leaves up.",
    "max/min of children",
  );

  // Seed leaves
  const seedLeaves = (node: GameNode | null) => {
    if (!node) return;
    if (node.leaf) {
      values.set(node.id, node.key);
      t.sub();
      const roles = idleRoles(ids);
      roles[node.id] = "write";
      pushTree(t, root, roles, values, `Leaf score ${node.key}.`, `value = ${node.key}`);
      return;
    }
    seedLeaves(node.left);
    seedLeaves(node.right);
  };
  seedLeaves(root);

  const fill = (node: GameNode | null): number => {
    if (!node) return 0;
    if (node.leaf) return values.get(node.id) ?? node.key;

    const rolesEnter = idleRoles(ids);
    rolesEnter[node.id] = "current";
    pushTree(
      t,
      root,
      rolesEnter,
      values,
      `Evaluate ${node.isMax ? "MAX" : "MIN"} node.`,
      node.isMax ? "max(L, R)" : "min(L, R)",
    );

    const L = fill(node.left);
    const R = fill(node.right);
    const rolesRead = idleRoles(ids);
    rolesRead[node.id] = "current";
    if (node.left) rolesRead[node.left.id] = "read";
    if (node.right) rolesRead[node.right.id] = "read";
    pushTree(
      t,
      root,
      rolesRead,
      values,
      `${node.isMax ? "MAX" : "MIN"} of ${L} and ${R}.`,
      node.isMax ? `max(${L}, ${R})` : `min(${L}, ${R})`,
    );
    t.step();

    const v = node.isMax ? Math.max(L, R) : Math.min(L, R);
    values.set(node.id, v);
    t.sub();
    const rolesWrite = idleRoles(ids);
    rolesWrite[node.id] = "write";
    pushTree(
      t,
      root,
      rolesWrite,
      values,
      `${node.isMax ? "MAX" : "MIN"} chooses ${v}.`,
      `value = ${v}`,
    );
    return v;
  };

  const ans = fill(root);
  const rolesAnswer = idleRoles(ids);
  rolesAnswer[root.id] = "answer";
  pushTree(
    t,
    root,
    rolesAnswer,
    values,
    `Answer: minimax value at root = ${ans}.`,
    `root = ${ans}`,
  );
  return t.frames;
}

function potsOf(input: DpInput): number[] {
  return input.values.length > 0 ? input.values : [8, 15, 3, 7];
}

/**
 * Optimal Strategy for a Game — pots in a line; each turn take a left or right end.
 * dp[i][j] = max coins the current player can guarantee from subarray i..j.
 */
export function optimalStrategy(input: DpInput): DpFrame[] {
  const t = new DpTrace();
  const pots = potsOf(input);
  const n = pots.length;
  const dp: (number | null)[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => null),
  );
  const labels = pots.map(String);
  const idleInput = (): DpCellRole[] =>
    Array.from({ length: n }, () => "idle" as DpCellRole);

  t.pushGrid(
    dp,
    t.idleGrid(n, n),
    "Optimal Strategy — take from either end; both play optimally.",
    {
      formula:
        "dp[i][j] = max(a[i]+min(dp[i+1][j-1],dp[i+2][j]), a[j]+min(dp[i][j-2],dp[i+1][j-1]))",
      rowLabels: labels,
      colLabels: labels,
      input: pots,
      inputRoles: idleInput(),
    },
  );

  for (let i = 0; i < n; i += 1) {
    dp[i]![i] = pots[i]!;
    t.sub();
    const roles = t.idleGrid(n, n);
    roles[i]![i] = "write";
    const ir = idleInput();
    ir[i] = "current";
    t.pushGrid(dp, roles, `Single pot ${pots[i]} — take it.`, {
      formula: `dp[${i}][${i}] = ${pots[i]}`,
      rowLabels: labels,
      colLabels: labels,
      input: pots,
      inputRoles: ir,
    });
  }

  for (let len = 2; len <= n; len += 1) {
    for (let i = 0; i + len - 1 < n; i += 1) {
      const j = i + len - 1;
      const rolesCur = t.idleGrid(n, n);
      rolesCur[i]![j] = "current";
      const ir = idleInput();
      ir[i] = "current";
      ir[j] = "current";
      t.pushGrid(
        dp,
        rolesCur,
        `Interval [${i},${j}] — choose left ${pots[i]} or right ${pots[j]}.`,
        {
          formula: `fill dp[${i}][${j}]`,
          rowLabels: labels,
          colLabels: labels,
          input: pots,
          inputRoles: ir,
        },
      );

      // Classic recurrence for coins the current player gets from i..j:
      // dp[i][j] = max(
      //   a[i] + min(dp[i+1][j-1], dp[i+2][j]),
      //   a[j] + min(dp[i][j-2], dp[i+1][j-1])
      // )
      if (len === 2) {
        const rolesRead = t.idleGrid(n, n);
        rolesRead[i]![j] = "current";
        rolesRead[i]![i] = "read";
        rolesRead[j]![j] = "read";
        t.pushGrid(
          dp,
          rolesRead,
          `Two pots: take the larger of ${pots[i]} and ${pots[j]}.`,
          {
            formula: `max(${pots[i]}, ${pots[j]})`,
            rowLabels: labels,
            colLabels: labels,
            input: pots,
            inputRoles: ir,
          },
        );
        dp[i]![j] = Math.max(pots[i]!, pots[j]!);
      } else {
        const leftThen =
          pots[i]! +
          Math.min(
            i + 1 <= j - 1 ? (dp[i + 1]![j - 1] ?? 0) : 0,
            i + 2 <= j ? (dp[i + 2]![j] ?? 0) : 0,
          );
        const rightThen =
          pots[j]! +
          Math.min(
            i <= j - 2 ? (dp[i]![j - 2] ?? 0) : 0,
            i + 1 <= j - 1 ? (dp[i + 1]![j - 1] ?? 0) : 0,
          );
        const rolesRead = t.idleGrid(n, n);
        rolesRead[i]![j] = "current";
        if (i + 1 <= j - 1) rolesRead[i + 1]![j - 1] = "read";
        if (i + 2 <= j) rolesRead[i + 2]![j] = "read";
        if (i <= j - 2) rolesRead[i]![j - 2] = "read";
        t.pushGrid(dp, rolesRead, `Take left → ${leftThen}; take right → ${rightThen}.`, {
          formula: `max(${leftThen}, ${rightThen})`,
          rowLabels: labels,
          colLabels: labels,
          input: pots,
          inputRoles: ir,
        });
        dp[i]![j] = Math.max(leftThen, rightThen);
      }
      t.sub();
      t.step();
      const rolesWrite = t.idleGrid(n, n);
      rolesWrite[i]![j] = "write";
      t.pushGrid(dp, rolesWrite, `dp[${i}][${j}] = ${dp[i]![j]}.`, {
        formula: `dp[${i}][${j}] = ${dp[i]![j]}`,
        rowLabels: labels,
        colLabels: labels,
        input: pots,
        inputRoles: idleInput(),
      });
    }
  }

  const done = t.idleGrid(n, n);
  done[0]![n - 1] = "answer";
  t.pushGrid(dp, done, `Answer: first player can secure ${dp[0]![n - 1]}.`, {
    formula: `dp[0][${n - 1}] = ${dp[0]![n - 1]}`,
    rowLabels: labels,
    colLabels: labels,
    input: pots,
    inputRoles: idleInput(),
  });
  return t.frames;
}
