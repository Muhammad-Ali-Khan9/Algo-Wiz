import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

function pushBit(
  t: TreeTrace,
  bit: number[],
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
) {
  const n = bit.length - 1;
  const values = Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    label: String(bit[i + 1] ?? 0),
  }));
  const edges = [];
  let eid = 0;
  for (let i = 1; i <= n; i += 1) {
    const p = i + (i & -i);
    if (p <= n) edges.push({ id: eid++, u: i, v: p });
  }
  const laid = values.map((value) => {
    const i = value.id;
    const lsb = i & -i;
    const depth = lsb > 0 ? Math.log2(lsb) : 0;
    const x = 8 + ((i - 1) / Math.max(n - 1, 1)) * 84;
    const y = 12 + (depth / Math.max(Math.log2(n), 1)) * 70;
    return { id: i, x, y, label: value.label };
  });
  const labels = Object.fromEntries(
    laid.map((node) => [node.id, String(bit[node.id] ?? 0)]),
  );
  t.push(laid, edges, rolesByNodeList(laid, roles), t.idleEdgeRoles(edges.length), hint, {
    labels,
    frontier,
  });
}

export function fenwick(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const arr = input.values;
  const n = arr.length;
  const bit = Array.from({ length: n + 1 }, () => 0);
  pushBit(t, bit, {}, "Fenwick Tree (BIT) — point add & prefix sums via i += i&-i.");

  const add = (index: number, delta: number) => {
    let i = index;
    while (i <= n) {
      bit[i] = bit[i]! + delta;
      t.visit();
      pushBit(t, bit, { [i]: "current" }, `add(${index}, ${delta}) — update index ${i}.`);
      i += i & -i;
    }
  };

  for (let i = 0; i < n; i += 1) {
    pushBit(t, bit, {}, `Build — place a[${i}]=${arr[i]}.`);
    add(i + 1, arr[i]!);
  }
  pushBit(t, bit, {}, "Build complete.");

  // Prefix sum to queryR
  const r = Math.min(input.queryR + 1, n);
  let sum = 0;
  let i = r;
  pushBit(t, bit, {}, `Prefix sum(1..${r}).`);
  while (i > 0) {
    sum += bit[i]!;
    t.compare();
    pushBit(t, bit, { [i]: "path" }, `Add bit[${i}]=${bit[i]}. Sum=${sum}.`);
    i -= i & -i;
  }
  pushBit(t, bit, {}, `prefix(${r}) = ${sum}.`);

  // Point update
  const ui = Math.min(input.updateIndex + 1, n);
  const delta = input.updateValue;
  pushBit(t, bit, { [ui]: "goal" }, `Point update index ${ui} += ${delta}.`);
  add(ui, delta);
  pushBit(t, bit, {}, "Fenwick update complete.");
  return t.frames;
}
