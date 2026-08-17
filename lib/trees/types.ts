import type { CodeSnippets } from "@/lib/code/languages";

export type TreeAlgoId =
  | "bt-preorder"
  | "bt-inorder"
  | "bt-postorder"
  | "bt-levelorder"
  | "bt-height"
  | "bt-depth"
  | "bt-search"
  | "bst-insert"
  | "bst-search"
  | "bst-delete"
  | "bst-minmax"
  | "bst-predecessor"
  | "bst-successor"
  | "avl-insert"
  | "avl-delete"
  | "avl-ll"
  | "avl-rr"
  | "avl-lr"
  | "avl-rl"
  | "rb-insert"
  | "rb-delete"
  | "heap-min-insert"
  | "heap-max-insert"
  | "heap-extract"
  | "heap-heapify"
  | "heap-build"
  | "heap-sort"
  | "trie-insert"
  | "trie-search"
  | "trie-delete"
  | "trie-prefix"
  | "seg-build"
  | "seg-range-sum"
  | "seg-range-min"
  | "seg-range-max"
  | "seg-point-update"
  | "seg-range-update"
  | "nary-tree"
  | "kary-tree"
  | "tt-tree"
  | "ttf-tree"
  | "btree"
  | "bplus"
  | "binomial-heap"
  | "fibonacci-heap"
  | "radix-trie"
  | "tst"
  | "fenwick"
  | "interval-tree"
  | "suffix-tree"
  | "cartesian"
  | "kd-tree";

export type TreeKind =
  "binary" | "bst" | "avl" | "rb" | "minheap" | "maxheap" | "trie" | "segment";

export type TreeNodeRole =
  "idle" | "frontier" | "current" | "visited" | "path" | "start" | "goal";

export type TreeEdgeRole = "idle" | "consider" | "tree" | "path" | "rejected";

export interface TreeVizNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface TreeVizEdge {
  id: number;
  u: number;
  v: number;
}

export interface TreeStats {
  visits: number;
  compares: number;
  rotations: number;
}

export interface TreeFrame {
  nodes: TreeVizNode[];
  edges: TreeVizEdge[];
  nodeRoles: TreeNodeRole[];
  edgeRoles: TreeEdgeRole[];
  labels: Record<number, string>;
  fills?: Record<number, string>;
  frontier: number[];
  hint: string;
  stats: TreeStats;
}

export interface TreeInput {
  kind: TreeKind;
  values: number[];
  target: number;
  words: string[];
  queryWord: string;
  queryL: number;
  queryR: number;
  updateIndex: number;
  updateValue: number;
}

export interface TreeMeta {
  id: TreeAlgoId;
  name: string;
  group: string;
  kind: TreeKind;
  worst: string;
  average: string;
  best: string;
  space: string;
  available: boolean;
  definition: string;
  usage: string;
  code?: CodeSnippets;
}

export type TreeRunner = (input: TreeInput) => TreeFrame[];
