import { layoutComplete } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

type SegMode = "sum" | "min" | "max";

function combine(mode: SegMode, a: number, b: number) {
  if (mode === "sum") return a + b;
  if (mode === "min") return Math.min(a, b);
  return Math.max(a, b);
}

function identity(mode: SegMode) {
  if (mode === "sum") return 0;
  if (mode === "min") return Number.POSITIVE_INFINITY;
  return Number.NEGATIVE_INFINITY;
}

function pushSeg(
  t: TreeTrace,
  tree: number[],
  ids: number[],
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
  labelsExtra?: Record<number, string>,
) {
  const values = tree.map((v, i) => ({
    id: ids[i]!,
    label: Number.isFinite(v) ? String(v) : "∅",
  }));
  // Only show used segment nodes (non-empty build uses full 4n typically — we use compact 4*n)
  const used = values.filter((_, i) => Number.isFinite(tree[i]!));
  // layoutComplete expects contiguous heap indexing — keep full array but blank unused
  const { nodes, edges } = layoutComplete(
    tree.map((v, i) => ({
      id: ids[i]!,
      label: Number.isFinite(v) ? String(Math.round(v * 10) / 10) : "·",
    })),
  );
  const labels = {
    ...Object.fromEntries(
      nodes.map((n, i) => [
        n.id,
        Number.isFinite(tree[i]!) ? String(Math.round(tree[i]! * 10) / 10) : "·",
      ]),
    ),
    ...(labelsExtra ?? {}),
  };
  void used;
  t.push(
    nodes,
    edges,
    rolesByNodeList(nodes, roles),
    t.idleEdgeRoles(edges.length),
    hint,
    { labels, frontier },
  );
}

function buildTree(
  arr: number[],
  mode: SegMode,
  t?: TreeTrace,
  ids?: number[],
): { tree: number[]; ids: number[] } {
  const n = arr.length;
  const size = 2 * n;
  const tree = Array.from({ length: size }, () => identity(mode));
  const idArr = ids ?? Array.from({ length: size }, (_, i) => i);
  for (let i = 0; i < n; i += 1) tree[n + i] = arr[i]!;
  for (let i = n - 1; i > 0; i -= 1) {
    tree[i] = combine(mode, tree[i * 2]!, tree[i * 2 + 1]!);
    if (t && ids) {
      t.visit();
      pushSeg(
        t,
        tree,
        idArr,
        { [idArr[i]!]: "current" },
        `Build node ${i} = ${tree[i]}.`,
      );
    }
  }
  return { tree, ids: idArr };
}

export function segBuild(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const arr = input.values;
  const n = arr.length;
  const size = 2 * n;
  const tree = Array.from({ length: size }, () => Number.NaN);
  const ids = Array.from({ length: size }, (_, i) => i);
  pushSeg(
    t,
    tree,
    ids,
    {},
    "Segment Tree Build — leaves hold the array, parents combine.",
  );
  for (let i = 0; i < n; i += 1) {
    tree[n + i] = arr[i]!;
    t.visit();
    pushSeg(t, tree, ids, { [ids[n + i]!]: "current" }, `Leaf [${i}] = ${arr[i]}.`);
  }
  for (let i = n - 1; i > 0; i -= 1) {
    const L = tree[i * 2];
    const R = tree[i * 2 + 1];
    tree[i] = (Number.isFinite(L!) ? L! : 0) + (Number.isFinite(R!) ? R! : 0);
    t.visit();
    pushSeg(t, tree, ids, { [ids[i]!]: "path" }, `Parent ${i} sum = ${tree[i]}.`);
  }
  pushSeg(t, tree, ids, {}, "Build complete (range-sum tree).");
  return t.frames;
}

function rangeQuery(input: TreeInput, mode: SegMode, title: string): TreeFrame[] {
  const t = new TreeTrace();
  const { tree, ids } = buildTree(input.values, mode);
  const n = input.values.length;
  let l = input.queryL + n;
  let r = input.queryR + n + 1; // exclusive
  pushSeg(t, tree, ids, {}, `${title} — query [${input.queryL}, ${input.queryR}].`);
  let acc = identity(mode);
  while (l < r) {
    if (l & 1) {
      t.visit();
      acc = combine(mode, acc, tree[l]!);
      pushSeg(
        t,
        tree,
        ids,
        { [ids[l]!]: "current" },
        `Take node ${l} (${tree[l]}). Acc=${fmt(acc)}.`,
      );
      l += 1;
    }
    if (r & 1) {
      r -= 1;
      t.visit();
      acc = combine(mode, acc, tree[r]!);
      pushSeg(
        t,
        tree,
        ids,
        { [ids[r]!]: "current" },
        `Take node ${r} (${tree[r]}). Acc=${fmt(acc)}.`,
      );
    }
    l >>= 1;
    r >>= 1;
    pushSeg(t, tree, ids, {}, `Climb. Acc=${fmt(acc)}.`);
  }
  pushSeg(t, tree, ids, {}, `${title} result: ${fmt(acc)}.`);
  return t.frames;
}

function fmt(value: number) {
  return Number.isFinite(value) ? String(Math.round(value * 10) / 10) : "∅";
}

export function segRangeSum(input: TreeInput) {
  return rangeQuery(input, "sum", "Range Sum");
}
export function segRangeMin(input: TreeInput) {
  return rangeQuery(input, "min", "Range Minimum");
}
export function segRangeMax(input: TreeInput) {
  return rangeQuery(input, "max", "Range Maximum");
}

export function segPointUpdate(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { tree, ids } = buildTree(input.values, "sum");
  const n = input.values.length;
  const i = Math.min(input.updateIndex, n - 1);
  const value = input.updateValue;
  pushSeg(t, tree, ids, {}, `Point Update — set index ${i} to ${value}.`);
  let p = n + i;
  tree[p] = value;
  t.visit();
  pushSeg(t, tree, ids, { [ids[p]!]: "current" }, `Leaf ${i} := ${value}.`);
  p >>= 1;
  while (p >= 1) {
    tree[p] = tree[p * 2]! + tree[p * 2 + 1]!;
    t.visit();
    pushSeg(t, tree, ids, { [ids[p]!]: "path" }, `Update parent ${p} := ${tree[p]}.`);
    p >>= 1;
  }
  pushSeg(t, tree, ids, {}, "Point update complete.");
  return t.frames;
}

export function segRangeUpdate(input: TreeInput): TreeFrame[] {
  // Visualized as repeated point updates for clarity (lazy prop deferred).
  const t = new TreeTrace();
  const { tree, ids } = buildTree(input.values, "sum");
  const n = input.values.length;
  const l = input.queryL;
  const r = input.queryR;
  const delta = input.updateValue;
  pushSeg(
    t,
    tree,
    ids,
    {},
    `Range Update [${l}, ${r}] += ${delta} (shown as successive point updates).`,
  );
  for (let i = l; i <= r; i += 1) {
    let p = n + i;
    tree[p] = tree[p]! + delta;
    t.visit();
    pushSeg(t, tree, ids, { [ids[p]!]: "current" }, `Index ${i} += ${delta}.`);
    p >>= 1;
    while (p >= 1) {
      tree[p] = tree[p * 2]! + tree[p * 2 + 1]!;
      p >>= 1;
    }
    pushSeg(t, tree, ids, {}, `Propagated update for index ${i}.`);
  }
  pushSeg(t, tree, ids, {}, "Range update complete.");
  return t.frames;
}
