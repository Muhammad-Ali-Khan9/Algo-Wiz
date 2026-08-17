import { BinNode, IdGen, buildBalanced, findNode, sceneFrom } from "./binary-model";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

function pushScene(
  t: TreeTrace,
  root: BinNode | null,
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
) {
  const scene = sceneFrom(root);
  t.push(
    scene.nodes,
    scene.edges,
    rolesByNodeList(scene.nodes, roles),
    t.idleEdgeRoles(scene.edges.length),
    hint,
    { labels: scene.labels, frontier },
  );
}

function makeTree(input: TreeInput): { root: BinNode | null; ids: IdGen } {
  const ids = new IdGen();
  return { root: buildBalanced(input.values, ids), ids };
}

export function btPreorder(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { root } = makeTree(input);
  const order: number[] = [];
  pushScene(t, root, {}, "Preorder — visit root, then left, then right.");

  const walk = (node: BinNode | null) => {
    if (!node) return;
    t.visit();
    order.push(node.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of order) roles[id] = "visited";
    roles[node.id] = "current";
    pushScene(t, root, roles, `Visit ${node.key}.`, order);
    walk(node.left);
    walk(node.right);
  };
  walk(root);
  const roles: Partial<Record<number, TreeNodeRole>> = {};
  for (const id of order) roles[id] = "path";
  pushScene(t, root, roles, "Preorder complete.");
  return t.frames;
}

export function btInorder(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { root } = makeTree(input);
  const order: number[] = [];
  pushScene(t, root, {}, "Inorder — left, root, right (sorted for BST).");

  const walk = (node: BinNode | null) => {
    if (!node) return;
    walk(node.left);
    t.visit();
    order.push(node.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of order) roles[id] = "visited";
    roles[node.id] = "current";
    pushScene(t, root, roles, `Visit ${node.key}.`, order);
    walk(node.right);
  };
  walk(root);
  const roles: Partial<Record<number, TreeNodeRole>> = {};
  for (const id of order) roles[id] = "path";
  pushScene(
    t,
    root,
    roles,
    `Inorder done: ${order
      .map((id) => {
        const n = findById(root, id);
        return n?.key ?? id;
      })
      .join(" → ")}.`,
  );
  return t.frames;
}

export function btPostorder(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { root } = makeTree(input);
  const order: number[] = [];
  pushScene(t, root, {}, "Postorder — left, right, then root.");

  const walk = (node: BinNode | null) => {
    if (!node) return;
    walk(node.left);
    walk(node.right);
    t.visit();
    order.push(node.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of order) roles[id] = "visited";
    roles[node.id] = "current";
    pushScene(t, root, roles, `Visit ${node.key}.`, order);
  };
  walk(root);
  const roles: Partial<Record<number, TreeNodeRole>> = {};
  for (const id of order) roles[id] = "path";
  pushScene(t, root, roles, "Postorder complete.");
  return t.frames;
}

export function btLevelorder(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { root } = makeTree(input);
  pushScene(t, root, {}, "Level-order — BFS across each depth.");
  if (!root) return t.frames;

  const q: BinNode[] = [root];
  const order: number[] = [];
  while (q.length) {
    const node = q.shift()!;
    t.visit();
    order.push(node.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of order) roles[id] = "visited";
    roles[node.id] = "current";
    for (const pending of q) roles[pending.id] = "frontier";
    pushScene(
      t,
      root,
      roles,
      `Dequeue ${node.key}.`,
      q.map((n) => n.id),
    );
    if (node.left) q.push(node.left);
    if (node.right) q.push(node.right);
  }
  const roles: Partial<Record<number, TreeNodeRole>> = {};
  for (const id of order) roles[id] = "path";
  pushScene(t, root, roles, "Level-order complete.");
  return t.frames;
}

export function btHeight(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { root } = makeTree(input);
  pushScene(t, root, {}, "Height — longest root-to-leaf edge count + 1.");

  const heights = new Map<number, number>();
  const walk = (node: BinNode | null): number => {
    if (!node) return 0;
    t.visit();
    pushScene(t, root, { [node.id]: "current" }, `Measure subtree at ${node.key}.`);
    const h = 1 + Math.max(walk(node.left), walk(node.right));
    heights.set(node.id, h);
    const labels = { ...sceneFrom(root).labels };
    for (const [id, value] of heights) labels[Number(id)] = String(value);
    const scene = sceneFrom(root);
    t.push(
      scene.nodes,
      scene.edges,
      rolesByNodeList(scene.nodes, { [node.id]: "visited" }),
      t.idleEdgeRoles(scene.edges.length),
      `Height(${node.key}) = ${h}.`,
      { labels, frontier: [node.id] },
    );
    return h;
  };
  const h = walk(root);
  pushScene(t, root, root ? { [root.id]: "path" } : {}, `Tree height is ${h}.`);
  return t.frames;
}

export function btDepth(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { root } = makeTree(input);
  const target = findNode(root, input.target) ?? root;
  pushScene(
    t,
    root,
    target ? { [target.id]: "goal" } : {},
    `Depth — edges from root down to ${target?.key ?? "?"}.`,
  );
  if (!root || !target) return t.frames;

  let depth = 0;
  let cur: BinNode | null = root;
  const path: number[] = [];
  while (cur) {
    t.visit();
    t.compare();
    path.push(cur.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of path) roles[id] = "path";
    roles[cur.id] = "current";
    roles[target.id] = "goal";
    pushScene(t, root, roles, `At ${cur.key} — depth ${depth}.`, path);
    if (cur.id === target.id) break;
    cur = input.target < cur.key ? cur.left : cur.right;
    depth += 1;
  }
  pushScene(
    t,
    root,
    Object.fromEntries(path.map((id) => [id, "path" as const])),
    `Depth of ${target.key} is ${depth}.`,
  );
  return t.frames;
}

export function btSearch(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const { root } = makeTree(input);
  pushScene(t, root, {}, `Search for ${input.target} in a binary tree (BST walk).`);
  let cur = root;
  const path: number[] = [];
  while (cur) {
    t.visit();
    t.compare();
    path.push(cur.id);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (const id of path) roles[id] = "visited";
    roles[cur.id] = "current";
    pushScene(t, root, roles, `Compare with ${cur.key}.`, path);
    if (cur.key === input.target) {
      roles[cur.id] = "path";
      pushScene(t, root, roles, `Found ${input.target}.`);
      return t.frames;
    }
    cur = input.target < cur.key ? cur.left : cur.right;
  }
  pushScene(t, root, {}, `${input.target} not found.`);
  return t.frames;
}

function findById(root: BinNode | null, id: number): BinNode | null {
  if (!root) return null;
  if (root.id === id) return root;
  return findById(root.left, id) ?? findById(root.right, id);
}
