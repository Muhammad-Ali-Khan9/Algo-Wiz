import { layoutNary, type LayoutNary } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

type BinHeapNode = {
  id: number;
  key: number;
  order: number;
  children: BinHeapNode[];
};

function toLayout(n: BinHeapNode): LayoutNary {
  return {
    id: n.id,
    key: n.key,
    extra: `${n.key}|B${n.order}`,
    children: n.children.map(toLayout),
  };
}

function pushForest(
  t: TreeTrace,
  roots: BinHeapNode[],
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
) {
  // Synthetic super-root for forest layout
  const superRoot: LayoutNary = {
    id: -1,
    key: "H",
    children: roots.map(toLayout),
  };
  const { nodes, edges } = layoutNary(superRoot);
  const visible = nodes.filter((n) => n.id >= 0);
  const visibleEdges = edges.filter((e) => e.u >= 0 && e.v >= 0);
  const labels = Object.fromEntries(visible.map((n) => [n.id, n.label]));
  t.push(
    visible,
    visibleEdges,
    rolesByNodeList(visible, roles),
    t.idleEdgeRoles(visibleEdges.length),
    hint,
    { labels },
  );
}

function mergeTrees(a: BinHeapNode, b: BinHeapNode): BinHeapNode {
  if (a.key <= b.key) {
    a.children.push(b);
    a.order += 1;
    return a;
  }
  b.children.push(a);
  b.order += 1;
  return b;
}

/** Binomial heap insert with linking same-order trees. */
export function binomialHeap(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  let roots: BinHeapNode[] = [];
  pushForest(t, roots, {}, "Binomial Heap — insert creates B0, then link equal orders.");

  for (const key of input.values) {
    let carry: BinHeapNode | null = {
      id: nextId++,
      key,
      order: 0,
      children: [],
    };
    t.visit();
    pushForest(t, [...roots, carry], { [carry.id]: "current" }, `Insert ${key} as B₀.`);

    const next: BinHeapNode[] = [];
    for (const r of roots) {
      if (!carry) {
        next.push(r);
        continue;
      }
      if (r.order === carry.order) {
        t.rotate();
        carry = mergeTrees(r, carry);
        pushForest(
          t,
          [...next, carry],
          { [carry.id]: "path" },
          `Link two B${carry.order - 1} → B${carry.order}.`,
        );
      } else if (r.order < carry.order) {
        next.push(r);
      } else {
        next.push(carry);
        carry = r;
      }
    }
    if (carry) next.push(carry);
    roots = next.sort((a, b) => a.order - b.order);
    pushForest(t, roots, {}, `Heap after inserting ${key}.`);
  }
  pushForest(t, roots, {}, "Binomial heap insert complete.");
  return t.frames;
}

type FibNode = {
  id: number;
  key: number;
  degree: number;
  children: FibNode[];
};

/** Fibonacci heap: inserts as roots; consolidate on extract-min demo. */
export function fibonacciHeap(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  let roots: FibNode[] = [];
  let min: FibNode | null = null;

  const pushFib = (roles: Partial<Record<number, TreeNodeRole>>, hint: string) => {
    const superRoot: LayoutNary = {
      id: -1,
      key: "F",
      children: roots.map((n) => ({
        id: n.id,
        key: n.key,
        extra: String(n.key),
        children: n.children.map(function map(c): LayoutNary {
          return {
            id: c.id,
            key: c.key,
            extra: String(c.key),
            children: c.children.map(map),
          };
        }),
      })),
    };
    const { nodes, edges } = layoutNary(superRoot);
    const visible = nodes.filter((n) => n.id >= 0);
    const visibleEdges = edges.filter((e) => e.u >= 0 && e.v >= 0);
    const labels = Object.fromEntries(visible.map((n) => [n.id, n.label]));
    t.push(
      visible,
      visibleEdges,
      rolesByNodeList(visible, roles),
      t.idleEdgeRoles(visibleEdges.length),
      hint,
      { labels },
    );
  };

  pushFib({}, "Fibonacci Heap — lazy insert; consolidate when extracting min.");

  for (const key of input.values) {
    const node: FibNode = { id: nextId++, key, degree: 0, children: [] };
    roots.push(node);
    if (!min || key < min.key) min = node;
    t.visit();
    pushFib(
      { [node.id]: "current", ...(min ? { [min.id]: "goal" } : {}) },
      `Insert ${key} into root list. Min=${min?.key}.`,
    );
  }

  if (!roots.length) return t.frames;
  pushFib(
    min ? { [min.id]: "goal" } : {},
    `Extract-min ${min?.key} — consolidate roots by degree.`,
  );

  // Remove min and promote children
  if (min) {
    roots = roots.filter((r) => r.id !== min!.id);
    roots.push(...min.children);
  }

  // Consolidate
  const byDeg = new Map<number, FibNode>();
  for (const r of [...roots]) {
    let x = r;
    while (byDeg.has(x.degree)) {
      let y = byDeg.get(x.degree)!;
      byDeg.delete(x.degree);
      if (y.key < x.key) [x, y] = [y, x];
      x.children.push(y);
      x.degree += 1;
      t.rotate();
      pushFib(
        { [x.id]: "path", [y.id]: "frontier" },
        `Link degree-${x.degree - 1} trees.`,
      );
    }
    byDeg.set(x.degree, x);
  }
  roots = [...byDeg.values()];
  min = roots.reduce<FibNode | null>((m, r) => (!m || r.key < m.key ? r : m), null);
  pushFib(min ? { [min.id]: "goal" } : {}, `Consolidated. New min=${min?.key ?? "∅"}.`);
  return t.frames;
}
