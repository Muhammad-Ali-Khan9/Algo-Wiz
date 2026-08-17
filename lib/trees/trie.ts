import { layoutNary, type LayoutNary } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

type TrieNode = {
  id: number;
  ch: string;
  children: Map<string, TrieNode>;
  end: boolean;
};

function toLayout(node: TrieNode): LayoutNary {
  return {
    id: node.id,
    key: node.ch || "·",
    extra: node.end ? `${node.ch || "·"}*` : node.ch || "·",
    children: [...node.children.values()].map(toLayout),
  };
}

function pushTrie(
  t: TreeTrace,
  root: TrieNode,
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
) {
  const { nodes, edges } = layoutNary(toLayout(root));
  const labels = Object.fromEntries(nodes.map((n) => [n.id, n.label]));
  t.push(
    nodes,
    edges,
    rolesByNodeList(nodes, roles),
    t.idleEdgeRoles(edges.length),
    hint,
    { labels, frontier },
  );
}

function createRoot(ids: { n: number }): TrieNode {
  return { id: ids.n++, ch: "", children: new Map(), end: false };
}

export function trieInsert(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = { n: 0 };
  const root = createRoot(ids);
  pushTrie(
    t,
    root,
    { [root.id]: "start" },
    "Trie Insert — follow / create character edges.",
  );
  for (const word of input.words) {
    let cur = root;
    pushTrie(t, root, { [cur.id]: "current" }, `Insert "${word}".`);
    for (const ch of word) {
      t.compare();
      let next = cur.children.get(ch);
      if (!next) {
        next = { id: ids.n++, ch, children: new Map(), end: false };
        cur.children.set(ch, next);
        t.visit();
        pushTrie(t, root, { [next.id]: "path" }, `Create edge '${ch}'.`);
      } else {
        pushTrie(t, root, { [next.id]: "current" }, `Follow existing '${ch}'.`);
      }
      cur = next;
    }
    cur.end = true;
    pushTrie(t, root, { [cur.id]: "goal" }, `Mark end of "${word}".`);
  }
  pushTrie(t, root, {}, "Trie insert complete.");
  return t.frames;
}

function buildTrie(words: string[], ids: { n: number }): TrieNode {
  const root = createRoot(ids);
  for (const word of words) {
    let cur = root;
    for (const ch of word) {
      let next = cur.children.get(ch);
      if (!next) {
        next = { id: ids.n++, ch, children: new Map(), end: false };
        cur.children.set(ch, next);
      }
      cur = next;
    }
    cur.end = true;
  }
  return root;
}

export function trieSearch(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = { n: 0 };
  const root = buildTrie(input.words, ids);
  const word = input.queryWord || input.words[0] || "";
  pushTrie(t, root, {}, `Trie Search for "${word}".`);
  let cur: TrieNode | null = root;
  for (const ch of word) {
    if (!cur) break;
    t.compare();
    const next: TrieNode | null = cur.children.get(ch) ?? null;
    if (!next) {
      pushTrie(t, root, { [cur.id]: "current" }, `"${word}" not found.`);
      return t.frames;
    }
    t.visit();
    pushTrie(t, root, { [next.id]: "current" }, `Match '${ch}'.`);
    cur = next;
  }
  if (cur?.end) {
    pushTrie(t, root, { [cur.id]: "path" }, `Found word "${word}".`);
  } else {
    pushTrie(
      t,
      root,
      cur ? { [cur.id]: "frontier" } : {},
      `"${word}" is only a prefix, not a word.`,
    );
  }
  return t.frames;
}

export function trieDelete(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = { n: 0 };
  const root = buildTrie(input.words, ids);
  const word = input.words[0] ?? input.queryWord;
  pushTrie(t, root, {}, `Trie Delete — unmark / prune "${word}".`);

  const stack: { node: TrieNode; ch: string }[] = [];
  let cur: TrieNode | null = root;
  for (const ch of word) {
    if (!cur) break;
    t.compare();
    const next = cur.children.get(ch);
    if (!next) {
      pushTrie(t, root, {}, `"${word}" not present.`);
      return t.frames;
    }
    stack.push({ node: cur, ch });
    cur = next;
    pushTrie(t, root, { [cur.id]: "current" }, `Walk '${ch}'.`);
  }
  if (!cur?.end) {
    pushTrie(t, root, {}, `"${word}" is not a stored word.`);
    return t.frames;
  }
  cur.end = false;
  t.visit();
  pushTrie(t, root, { [cur.id]: "path" }, `Clear end mark on "${word}".`);

  // prune unused chain
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const { node, ch } = stack[i]!;
    const child = node.children.get(ch)!;
    if (!child.end && child.children.size === 0) {
      node.children.delete(ch);
      pushTrie(t, root, { [node.id]: "current" }, `Prune unused '${ch}'.`);
    } else break;
  }
  pushTrie(t, root, {}, `Deleted "${word}".`);
  return t.frames;
}

export function triePrefix(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const ids = { n: 0 };
  const root = buildTrie(input.words, ids);
  const prefix =
    input.queryWord ||
    (input.words[0] ? input.words[0].slice(0, Math.min(2, input.words[0].length)) : "");
  pushTrie(t, root, {}, `Prefix Search / autocomplete for "${prefix}".`);

  let cur: TrieNode | null = root;
  for (const ch of prefix) {
    if (!cur) break;
    t.compare();
    const next: TrieNode | null = cur.children.get(ch) ?? null;
    if (!next) {
      pushTrie(t, root, { [cur.id]: "current" }, `No words with prefix "${prefix}".`);
      return t.frames;
    }
    t.visit();
    pushTrie(t, root, { [next.id]: "current" }, `Follow '${ch}'.`);
    cur = next;
  }
  if (!cur) return t.frames;

  const matches: string[] = [];
  const dfs = (node: TrieNode, built: string) => {
    if (node.end) matches.push(built);
    for (const [ch, child] of node.children) dfs(child, built + ch);
  };
  dfs(cur, prefix);

  const mark: Partial<Record<number, TreeNodeRole>> = { [cur.id]: "frontier" };
  const paint = (node: TrieNode) => {
    if (node.end) mark[node.id] = "path";
    for (const child of node.children.values()) paint(child);
  };
  paint(cur);
  pushTrie(
    t,
    root,
    mark,
    matches.length
      ? `Autocomplete: ${matches.slice(0, 6).join(", ")}${matches.length > 6 ? "…" : ""}`
      : `Prefix exists but no completed words.`,
    matches.length ? [cur.id] : [],
  );
  return t.frames;
}
