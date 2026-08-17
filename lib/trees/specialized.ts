import { layoutBinary, layoutNary, type LayoutBin, type LayoutNary } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

/* ── Interval Tree ─────────────────────────────────────────── */

type INode = {
  id: number;
  low: number;
  high: number;
  max: number;
  left: INode | null;
  right: INode | null;
};

function iLayout(n: INode | null): LayoutBin | null {
  if (!n) return null;
  return {
    id: n.id,
    key: `${n.low}-${n.high}`,
    extra: `${n.low}-${n.high}|m${n.max}`,
    left: iLayout(n.left),
    right: iLayout(n.right),
  };
}

export function intervalTree(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  let root: INode | null = null;

  const push = (roles: Partial<Record<number, TreeNodeRole>>, hint: string) => {
    const laid = layoutBinary(iLayout(root));
    const labels = Object.fromEntries(laid.nodes.map((n) => [n.id, n.label]));
    t.push(
      laid.nodes,
      laid.edges,
      rolesByNodeList(laid.nodes, roles),
      t.idleEdgeRoles(laid.edges.length),
      hint,
      { labels },
    );
  };

  push({}, "Interval Tree — BST on low endpoint; each node stores subtree max high.");

  const intervals = input.values.map((v, i) => {
    const low = v;
    const high = v + 3 + (i % 5);
    return { low, high };
  });

  for (const { low, high } of intervals) {
    const node: INode = {
      id: nextId++,
      low,
      high,
      max: high,
      left: null,
      right: null,
    };
    if (!root) {
      root = node;
      t.visit();
      push({ [node.id]: "path" }, `Insert [${low},${high}] as root.`);
      continue;
    }
    let cur = root;
    for (;;) {
      t.compare();
      push(
        { [cur.id]: "current" },
        `Insert [${low},${high}] — at [${cur.low},${cur.high}].`,
      );
      cur.max = Math.max(cur.max, high);
      if (low < cur.low) {
        if (!cur.left) {
          cur.left = node;
          break;
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = node;
          break;
        }
        cur = cur.right;
      }
    }
    t.visit();
    push({ [node.id]: "path" }, `Inserted [${low},${high}].`);
  }

  const point = input.target;
  push({}, `Stabbing query — intervals containing ${point}.`);
  const hits: number[] = [];
  const stack: INode[] = root ? [root] : [];
  while (stack.length) {
    const u = stack.pop()!;
    t.compare();
    push(
      {
        [u.id]: "current",
        ...Object.fromEntries(hits.map((id) => [id, "path" as const])),
      },
      `Check [${u.low},${u.high}].`,
    );
    if (u.low <= point && point <= u.high) {
      hits.push(u.id);
      t.visit();
      push(
        Object.fromEntries(hits.map((id) => [id, "path" as const])),
        `Hit [${u.low},${u.high}].`,
      );
    }
    if (u.left && u.left.max >= point) stack.push(u.left);
    if (u.right && u.low <= point) stack.push(u.right);
  }
  push(
    Object.fromEntries(hits.map((id) => [id, "goal" as const])),
    hits.length ? `Found ${hits.length} interval(s).` : `No interval covers ${point}.`,
  );
  return t.frames;
}

/* ── Suffix Tree (naive) ───────────────────────────────────── */

type SNode = {
  id: number;
  edge: string;
  children: SNode[];
};

function sLayout(n: SNode): LayoutNary {
  return {
    id: n.id,
    key: n.edge || "·",
    children: n.children.map(sLayout),
  };
}

export function suffixTree(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  const text = (input.words[0] ?? "banana").slice(0, 8) + "$";
  const root: SNode = { id: nextId++, edge: "", children: [] };

  const push = (roles: Partial<Record<number, TreeNodeRole>>, hint: string) => {
    const { nodes, edges } = layoutNary(sLayout(root));
    const labels = Object.fromEntries(nodes.map((n) => [n.id, n.label]));
    t.push(
      nodes,
      edges,
      rolesByNodeList(nodes, roles),
      t.idleEdgeRoles(edges.length),
      hint,
      { labels },
    );
  };

  push(
    { [root.id]: "start" },
    `Suffix Tree of "${text}" (naive insert of all suffixes).`,
  );

  for (let i = 0; i < text.length; i += 1) {
    const suf = text.slice(i);
    push({}, `Insert suffix "${suf}".`);
    let node = root;
    let rest = suf;
    while (rest) {
      const child = node.children.find((c) => c.edge[0] === rest[0]);
      if (!child) {
        const leaf: SNode = { id: nextId++, edge: rest, children: [] };
        node.children.push(leaf);
        t.visit();
        push({ [leaf.id]: "path" }, `New edge "${rest}".`);
        break;
      }
      let k = 0;
      while (k < child.edge.length && k < rest.length && child.edge[k] === rest[k])
        k += 1;
      t.compare();
      if (k === child.edge.length) {
        rest = rest.slice(k);
        node = child;
        push({ [child.id]: "current" }, `Follow "${child.edge}".`);
        continue;
      }
      const mid: SNode = {
        id: nextId++,
        edge: child.edge.slice(0, k),
        children: [{ ...child, edge: child.edge.slice(k) }],
      };
      const idx = node.children.indexOf(child);
      node.children[idx] = mid;
      t.rotate();
      push({ [mid.id]: "frontier" }, `Split at "${mid.edge}".`);
      const leaf: SNode = { id: nextId++, edge: rest.slice(k), children: [] };
      mid.children.push(leaf);
      t.visit();
      push({ [leaf.id]: "path" }, `Branch "${leaf.edge}".`);
      break;
    }
  }
  push({}, "Suffix tree complete.");
  return t.frames;
}

/* ── Cartesian Tree ────────────────────────────────────────── */

type CNode = {
  id: number;
  key: number;
  left: CNode | null;
  right: CNode | null;
};

function cLayout(n: CNode | null): LayoutBin | null {
  if (!n) return null;
  return {
    id: n.id,
    key: n.key,
    left: cLayout(n.left),
    right: cLayout(n.right),
  };
}

export function cartesian(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const stack: CNode[] = [];
  let root: CNode | null = null;

  const push = (roles: Partial<Record<number, TreeNodeRole>>, hint: string) => {
    const laid = layoutBinary(cLayout(root));
    const labels = Object.fromEntries(laid.nodes.map((n) => [n.id, n.label]));
    t.push(
      laid.nodes,
      laid.edges,
      rolesByNodeList(laid.nodes, roles),
      t.idleEdgeRoles(laid.edges.length),
      hint,
      { labels },
    );
  };

  push({}, "Cartesian Tree — heap on values, BST on positions (stack build).");

  for (let id = 0; id < input.values.length; id += 1) {
    const key = input.values[id]!;
    const node: CNode = { id, key, left: null, right: null };
    let last: CNode | null = null;
    while (stack.length && stack[stack.length - 1]!.key > key) {
      last = stack.pop()!;
      t.compare();
      push({ [last.id]: "frontier", [node.id]: "current" }, `Pop ${last.key} > ${key}.`);
    }
    if (stack.length) {
      stack[stack.length - 1]!.right = node;
    } else {
      root = node;
    }
    node.left = last;
    stack.push(node);
    t.visit();
    push({ [node.id]: "path" }, `Push ${key}.`);
  }
  const startRoles: Partial<Record<number, TreeNodeRole>> = {};
  if (root) startRoles[root.id] = "start";
  push(startRoles, "Cartesian tree complete (min-heap).");
  return t.frames;
}

/* ── KD-Tree ───────────────────────────────────────────────── */

type KNode = {
  id: number;
  point: [number, number];
  left: KNode | null;
  right: KNode | null;
  axis: 0 | 1;
};

function kLayout(n: KNode | null): LayoutBin | null {
  if (!n) return null;
  return {
    id: n.id,
    key: `${n.point[0]},${n.point[1]}`,
    extra: `${n.point[0]},${n.point[1]}|${n.axis === 0 ? "x" : "y"}`,
    left: kLayout(n.left),
    right: kLayout(n.right),
  };
}

export function kdTree(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  const pts: [number, number][] = input.values.map((v, i) => [
    v,
    input.values[(i * 3 + 1) % input.values.length]!,
  ]);

  let root: KNode | null = null;

  const push = (roles: Partial<Record<number, TreeNodeRole>>, hint: string) => {
    const laid = layoutBinary(kLayout(root));
    const labels = Object.fromEntries(laid.nodes.map((n) => [n.id, n.label]));
    t.push(
      laid.nodes,
      laid.edges,
      rolesByNodeList(laid.nodes, roles),
      t.idleEdgeRoles(laid.edges.length),
      hint,
      { labels },
    );
  };

  const buildAnim = (
    points: [number, number][],
    depth: number,
    attach: (node: KNode) => void,
  ): KNode | null => {
    if (!points.length) return null;
    const axis = (depth % 2) as 0 | 1;
    const sorted = [...points].sort((a, b) => a[axis]! - b[axis]!);
    const mid = sorted.length >> 1;
    const node: KNode = {
      id: nextId++,
      point: sorted[mid]!,
      left: null,
      right: null,
      axis,
    };
    attach(node);
    t.visit();
    push(
      { [node.id]: "current" },
      `Split on ${axis === 0 ? "x" : "y"} at (${node.point[0]}, ${node.point[1]}).`,
    );
    buildAnim(sorted.slice(0, mid), depth + 1, (c) => {
      node.left = c;
    });
    buildAnim(sorted.slice(mid + 1), depth + 1, (c) => {
      node.right = c;
    });
    return node;
  };

  push({}, "KD-Tree — alternate splitting on x / y.");
  const built = buildAnim(pts, 0, (n) => {
    root = n;
  });
  root = built;
  {
    const startRoles: Partial<Record<number, TreeNodeRole>> = {};
    if (root) startRoles[root.id] = "start";
    push(startRoles, "KD-Tree build complete.");
  }

  const target: [number, number] = [input.target, input.values[0] ?? input.target];
  push({}, `Walk toward query (${target[0]}, ${target[1]}).`);
  let cur: KNode | null = root;
  while (cur) {
    t.compare();
    push({ [cur.id]: "current" }, `At (${cur.point[0]}, ${cur.point[1]}).`);
    const axis = cur.axis;
    const next = target[axis]! < cur.point[axis]! ? cur.left : cur.right;
    if (!next) {
      push({ [cur.id]: "goal" }, `Leaf region near query.`);
      break;
    }
    cur = next;
  }
  return t.frames;
}
