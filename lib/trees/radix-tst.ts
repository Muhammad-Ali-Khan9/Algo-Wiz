import { layoutNary, type LayoutNary } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

type RadixNode = {
  id: number;
  edge: string;
  children: RadixNode[];
  end: boolean;
};

function toLayout(n: RadixNode): LayoutNary {
  return {
    id: n.id,
    key: n.edge || "·",
    extra: n.end ? `${n.edge || "·"}*` : n.edge || "·",
    children: n.children.map(toLayout),
  };
}

function push(
  t: TreeTrace,
  root: RadixNode,
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
) {
  const { nodes, edges } = layoutNary(toLayout(root));
  const labels = Object.fromEntries(nodes.map((n) => [n.id, n.label]));
  t.push(
    nodes,
    edges,
    rolesByNodeList(nodes, roles),
    t.idleEdgeRoles(edges.length),
    hint,
    { labels },
  );
}

function commonPrefix(a: string, b: string) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return i;
}

export function radixTrie(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  const root: RadixNode = { id: nextId++, edge: "", children: [], end: false };
  push(
    t,
    root,
    { [root.id]: "start" },
    "Radix / Compressed Trie — edges hold substrings.",
  );

  for (const word of input.words) {
    push(t, root, {}, `Insert "${word}".`);
    let node = root;
    let rest = word;
    for (;;) {
      const child = node.children.find((c) => c.edge[0] === rest[0]);
      if (!child) {
        const leaf: RadixNode = {
          id: nextId++,
          edge: rest,
          children: [],
          end: true,
        };
        node.children.push(leaf);
        t.visit();
        push(t, root, { [leaf.id]: "path" }, `New compressed edge "${rest}".`);
        break;
      }
      const k = commonPrefix(child.edge, rest);
      t.compare();
      if (k === child.edge.length) {
        rest = rest.slice(k);
        node = child;
        push(t, root, { [child.id]: "current" }, `Follow "${child.edge}".`);
        if (!rest) {
          child.end = true;
          push(t, root, { [child.id]: "goal" }, `Mark end of "${word}".`);
          break;
        }
        continue;
      }
      // split edge
      const splitEdge = child.edge.slice(0, k);
      const remain = child.edge.slice(k);
      const mid: RadixNode = {
        id: nextId++,
        edge: splitEdge,
        children: [{ ...child, edge: remain }],
        end: false,
      };
      const idx = node.children.indexOf(child);
      node.children[idx] = mid;
      t.rotate();
      push(t, root, { [mid.id]: "frontier" }, `Split edge at "${splitEdge}".`);
      rest = rest.slice(k);
      if (!rest) {
        mid.end = true;
        push(t, root, { [mid.id]: "goal" }, `Word ends at split.`);
      } else {
        const leaf: RadixNode = {
          id: nextId++,
          edge: rest,
          children: [],
          end: true,
        };
        mid.children.push(leaf);
        t.visit();
        push(t, root, { [leaf.id]: "path" }, `Branch "${rest}".`);
      }
      break;
    }
  }
  push(t, root, {}, "Radix trie insert complete.");
  return t.frames;
}

type TstNode = {
  id: number;
  ch: string;
  left: TstNode | null;
  mid: TstNode | null;
  right: TstNode | null;
  end: boolean;
};

function tstToLayout(n: TstNode | null): LayoutNary | null {
  if (!n) return null;
  const children: LayoutNary[] = [];
  const L = tstToLayout(n.left);
  const M = tstToLayout(n.mid);
  const R = tstToLayout(n.right);
  if (L) children.push(L);
  if (M) children.push(M);
  if (R) children.push(R);
  return {
    id: n.id,
    key: n.ch,
    extra: n.end ? `${n.ch}*` : n.ch,
    children,
  };
}

export function ternarySearchTree(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  let nextId = 0;
  let root: TstNode | null = null;

  const pushT = (roles: Partial<Record<number, TreeNodeRole>>, hint: string) => {
    if (!root) {
      t.push([], [], [], [], hint, { labels: {} });
      return;
    }
    const laid = tstToLayout(root)!;
    const { nodes, edges } = layoutNary(laid);
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

  pushT({}, "Ternary Search Tree — left < char < right; mid = next character.");

  for (const word of input.words) {
    pushT({}, `Insert "${word}".`);
    if (!root) {
      root = {
        id: nextId++,
        ch: word[0]!,
        left: null,
        mid: null,
        right: null,
        end: word.length === 1,
      };
      let cur = root;
      for (let i = 1; i < word.length; i += 1) {
        cur.mid = {
          id: nextId++,
          ch: word[i]!,
          left: null,
          mid: null,
          right: null,
          end: i === word.length - 1,
        };
        cur = cur.mid;
      }
      t.visit();
      pushT({ [root.id]: "path" }, `Created chain for "${word}".`);
      continue;
    }

    let cur: TstNode = root;
    let i = 0;
    while (i < word.length) {
      const ch = word[i]!;
      t.compare();
      pushT({ [cur.id]: "current" }, `Compare '${ch}' with '${cur.ch}'.`);
      if (ch < cur.ch) {
        if (!cur.left) {
          cur.left = { id: nextId++, ch, left: null, mid: null, right: null, end: false };
          t.visit();
        }
        cur = cur.left!;
      } else if (ch > cur.ch) {
        if (!cur.right) {
          cur.right = {
            id: nextId++,
            ch,
            left: null,
            mid: null,
            right: null,
            end: false,
          };
          t.visit();
        }
        cur = cur.right!;
      } else {
        i += 1;
        if (i === word.length) {
          cur.end = true;
          pushT({ [cur.id]: "goal" }, `Marked end of "${word}".`);
          break;
        }
        if (!cur.mid) {
          cur.mid = {
            id: nextId++,
            ch: word[i]!,
            left: null,
            mid: null,
            right: null,
            end: false,
          };
          t.visit();
          // continue from mid with same i (will match)
          cur = cur.mid;
          continue;
        }
        cur = cur.mid;
      }
    }
  }

  // Search demo
  const q = input.queryWord || input.words[0] || "";
  if (root && q) {
    pushT({}, `Search "${q}".`);
    let cur: TstNode | null = root;
    let i = 0;
    while (cur && i < q.length) {
      t.compare();
      pushT({ [cur.id]: "current" }, `At '${cur.ch}' seeking '${q[i]}'.`);
      if (q[i]! < cur.ch) cur = cur.left;
      else if (q[i]! > cur.ch) cur = cur.right;
      else {
        i += 1;
        if (i === q.length) {
          pushT(
            { [cur.id]: cur.end ? "path" : "frontier" },
            cur.end ? `Found "${q}".` : `"${q}" is only a prefix.`,
          );
          return t.frames;
        }
        cur = cur.mid;
      }
    }
    pushT({}, `"${q}" not found.`);
  }
  return t.frames;
}
