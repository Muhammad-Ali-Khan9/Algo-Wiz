# Algorithms Wizard

Interactive algorithm visualizations. Watch classic computer science move — comparisons, swaps, probes, hops, edge relaxations, tree walks, and DP table fills — one step at a time.

**Live sections:** Sorting · Searching · Graphs · Pathfinding · Trees · Dynamic Programming · Backtracking  
**Planned:** String Algorithms

Deployed example: [algorithm-visualizer-rho-three.vercel.app](https://algorithm-visualizer-rho-three.vercel.app)

---

## Stack

| Layer     | Choice                                                           |
| --------- | ---------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router) + React 19         |
| Language  | TypeScript                                                       |
| Styles    | Sass modules + Tailwind CSS v4 (`@apply`, mixins, CSS variables) |
| State     | Local React state + a small theme context                        |
| Tooling   | ESLint, Prettier, Husky, lint-staged                             |

No Redux / Zustand — each visualizer owns its playback state.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script                 | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Local development (webpack)                        |
| `npm run build`        | Production build (webpack; warn 15 MB, fail 20 MB) |
| `npm run start`        | Serve the production build                         |
| `npm run lint`         | ESLint                                             |
| `npm run format`       | Format the repo with Prettier                      |
| `npm run format:check` | Check Prettier without writing                     |
| `npm run prepare`      | Install Husky git hooks (runs on `npm install`)    |

### Git hooks

- **Pre-commit** (Husky + lint-staged): runs Prettier on staged `js/ts/json/md/scss/css/yml` files.
- Config: `.prettierrc.json`, `.prettierignore`, `lint-staged` in `package.json`.
- ESLint is configured with `eslint-config-prettier` so lint and format do not fight.

---

## What’s in the app

### Home (`/`)

Full-viewport intro, then algorithm families as you scroll:

1. **Intro** — product pitch, Made By, socials, map of sections. Math-themed SVG backgrounds tint with the theme.
2. **Sorting** → `/sorting`
3. **Searching** → `/searching`
4. **Graphs** → `/graphs`
5. **Pathfinding** → `/pathfinding`
6. **Trees** → `/trees`
7. **Dynamic Programming** → `/dp`
8. **Backtracking** → `/backtracking`
9. **String Algorithms** — coming soon

Sections **crossfade** in the same viewport (sticky stack + scroll-linked opacity). The global rail stays fixed.

### Global chrome

- **Left rail** — Home, Sorting, Searching, Graphs, Pathfinding, Trees, DP, Backtracking. Theme-aware icons (dark purple-black / light orange).
- **Theme toggle** — capsule at the bottom of the rail (sun / moon). Saved in `localStorage` (`algo-wiz-theme`).
- **Boot script** — applies the saved theme before paint to avoid a flash of the wrong palette.

Mobile: hamburger opens the rail as an overlay; each wiz page also has an **Algorithm** drawer for the algo list.

---

## Sorting (`/sorting`)

Sidebar of algorithms + document-style stage on the right.

### Algorithms (15)

| Algorithm       | Average     | Notes                                                  |
| --------------- | ----------- | ------------------------------------------------------ |
| Bubble Sort     | O(n²)       | Adjacent swaps; early exit if no swaps                 |
| Selection Sort  | O(n²)       | Few writes; always quadratic                           |
| Insertion Sort  | O(n²)       | Fast on nearly-sorted / small n                        |
| Merge Sort      | O(n log n)  | Stable, extra linear memory                            |
| Quick Sort      | O(n log n)  | In-place average case                                  |
| Heap Sort       | O(n log n)  | Worst-case n log n, O(1) extra space                   |
| Shell Sort      | ~O(n^1.25)  | Gapped insertion                                       |
| Counting Sort   | O(n + k)    | Integer keys in a small range                          |
| Radix Sort      | O(d·(n+k))  | LSD digit buckets                                      |
| Bucket Sort     | O(n + k)    | Range buckets + insertion; **bucket count adjustable** |
| Pigeonhole Sort | O(n + k)    | One hole per integer from min to max                   |
| Tim Sort        | O(n log n)  | Teaching Timsort: minrun + merges                      |
| Intro Sort      | O(n log n)  | Quicksort with heap/insertion fallbacks                |
| Bitonic Sort    | O(n log² n) | Sorting network; any length                            |
| Stooge Sort     | O(n^{2.71}) | Recurse on overlapping 2/3 ranges                      |

### Controls & visuals

- Play / Pause / Replay, Step back / Step, Shuffle, Reset
- Size (8–48), Speed; **Buckets** (1–64) for Bucket Sort
- Bar roles: normal, comparing, selected, swapping, sorted
- Auxiliary open containers for counting / radix / bucket / pigeonhole
- Definition · Complexity · Usage · **Code** (C, C++, Python, Java, JavaScript, C#)

### Keyboard (focus not in an input)

| Key   | Action                |
| ----- | --------------------- |
| Space | Play / pause / replay |
| →     | Step ahead            |
| ←     | Step back             |
| R     | Shuffle               |

---

## Searching (`/searching`)

Same chrome pattern as sorting.

### Algorithms (8)

| Algorithm              | Average      | Notes               |
| ---------------------- | ------------ | ------------------- |
| Linear Search          | O(n)         | Unsorted OK         |
| Binary Search          | O(log n)     | Sorted window       |
| Jump Search            | O(√n)        | Hop √n, then scan   |
| Interpolation Search   | O(log log n) | Value-based probe   |
| Exponential Search     | O(log n)     | Bound, then binary  |
| Fibonacci Search       | O(log n)     | Fibonacci splits    |
| Ternary Search         | O(log₃ n)    | Two cuts            |
| Sentinel Linear Search | O(n)         | Sentinel at the end |

Ordered algorithms sort the array on shuffle / when selected. Target, size, and speed are adjustable.

---

## Graphs (`/graphs`)

Node–edge canvas (SVG viewBox) with playback, frontier chips, edge weights when relevant, and multi-language code panels.

### Graph types (generator)

| Type      | Shape                             |
| --------- | --------------------------------- |
| Random    | Lattice with sparse diagonals     |
| Complete  | Every pair linked                 |
| Bipartite | Two columns, cross edges          |
| Tree      | Hierarchical layout (root on top) |
| DAG       | Left-to-right acyclic arcs        |
| Cycle     | Ring                              |
| Grid      | Orthogonal grid                   |

Shuffle regenerates structure, weights, and start/goal from a new seed.

### Algorithms

Grouped in the sidebar. All listed below are **playable**.

#### Traversal

| Algorithm | Notes                                 |
| --------- | ------------------------------------- |
| BFS       | Layer by layer from start toward goal |
| DFS       | Stack / deep-first exploration        |

#### Connectivity & Components

| Algorithm                    | Notes                                   |
| ---------------------------- | --------------------------------------- |
| Connected Components         | Undirected floods; labels `C0`, `C1`, … |
| SCC — Kosaraju               | Finish times, then transpose DFS        |
| SCC — Tarjan                 | Discovery / low-link; pop SCCs          |
| Cycle Detection — Undirected | Back edge to a non-parent               |
| Cycle Detection — Directed   | White / gray / black DFS                |

#### Minimum Spanning Tree

| Algorithm | Notes                                     |
| --------- | ----------------------------------------- |
| Prim      | Grow MST from a seed by lightest cut edge |
| Kruskal   | Sort edges + union–find                   |

#### Ordering

| Algorithm               | Notes                   |
| ----------------------- | ----------------------- |
| Topological Sort — Kahn | Peel in-degree 0        |
| Topological Sort — DFS  | Reverse finishing times |

#### Graph Analysis

| Algorithm              | Notes                       |
| ---------------------- | --------------------------- |
| Bipartite Check        | 2-color A / B               |
| Bridge Finding         | `low[child] > disc[u]`      |
| Articulation Points    | Root / low-link conditions  |
| Degree Calculation     | Undirected degree sequence  |
| In-degree / Out-degree | Directed `↓` / `↑`          |
| Graph Coloring         | Greedy colors `c0`, `c1`, … |

Node colors: idle, frontier, current, visited, path / MST, start, goal. Edge roles: idle, consider, tree, path, rejected.

---

## Pathfinding (`/pathfinding`)

Same graph canvas pattern, focused on **shortest / best route from A to B**. All listed algorithms are **playable**.

| Group       | Algorithm              | Notes                                              |
| ----------- | ---------------------- | -------------------------------------------------- |
| Unweighted  | BFS                    | Shortest hop-path                                  |
| Unweighted  | Bidirectional BFS      | Meet in the middle                                 |
| Weighted    | Dijkstra               | Non-negative weights                               |
| Weighted    | Bellman–Ford           | Negative weights; cycle detection                  |
| Weighted    | Floyd–Warshall         | All-pairs DP over intermediate vertices            |
| Heuristic   | A\*                    | `g` / `h` inside larger nodes; ∞ until reached     |
| Heuristic   | Greedy Best-First      | Expand by `h` alone (fast, not always optimal)     |
| Specialized | Bidirectional Dijkstra | Two-ended Dijkstra with a proven meeting condition |
| Specialized | Bidirectional A\*      | Two-ended A\* with careful optimality conditions   |

A\* and other heuristic algos use a larger node spacing and show metrics inside nodes. Edge weight badges appear on weighted algorithms. Floyd–Warshall and some bidirectional runs use a roomier layout.

---

## Trees (`/trees`)

SVG tree / structure canvas with step playback, node roles, optional captions, and the same definition / complexity / usage / code panels.

Shuffle regenerates keys (and structure-specific inputs) from a new seed. Size and speed are adjustable per algo family.

### Algorithms (by group)

#### Binary Tree

| Algorithm   | Notes                                 |
| ----------- | ------------------------------------- |
| Preorder    | Root → left → right                   |
| Inorder     | Left → root → right                   |
| Postorder   | Left → right → root                   |
| Level-order | BFS by depth                          |
| Height      | Longest root-to-leaf edge count       |
| Depth       | Depth of a chosen node                |
| Search      | Walk for a key in a plain binary tree |

#### BST

| Algorithm   | Notes                        |
| ----------- | ---------------------------- |
| Insert      | Standard BST insert          |
| Search      | Ordered left / right walk    |
| Delete      | Leaf / one-child / successor |
| Min / Max   | Leftmost / rightmost         |
| Predecessor | Inorder predecessor          |
| Successor   | Inorder successor            |

#### AVL

| Algorithm   | Notes                 |
| ----------- | --------------------- |
| Insert      | Insert + rebalance    |
| Delete      | Delete + rebalance    |
| LL Rotation | Single right rotation |
| RR Rotation | Single left rotation  |
| LR Rotation | Left then right       |
| RL Rotation | Right then left       |

#### Red-Black

| Algorithm | Notes                   |
| --------- | ----------------------- |
| Insert    | Color flips + rotations |
| Delete    | Fixup after removal     |

#### Heap

| Algorithm       | Notes                                    |
| --------------- | ---------------------------------------- |
| Min-Heap Insert | Bubble up                                |
| Max-Heap Insert | Bubble up                                |
| Extract Min/Max | Swap root with last, then sift down      |
| Heapify         | Sift down from an index                  |
| Build Heap      | Bottom-up heapify                        |
| Heap Sort       | Repeated extract into sorted order       |
| Binomial Heap   | Forest of binomial trees; link on insert |
| Fibonacci Heap  | Lazy roots; consolidate on extract-min   |

#### Trie

| Algorithm               | Notes                         |
| ----------------------- | ----------------------------- |
| Insert                  | Character path + end mark     |
| Search                  | Walk for a full word          |
| Delete                  | Unmark / prune where safe     |
| Prefix / Autocomplete   | Collect words under a prefix  |
| Radix / Compressed Trie | Edges store substrings        |
| Ternary Search Tree     | Left / mid / right char links |

#### Segment Tree

| Algorithm          | Notes                                               |
| ------------------ | --------------------------------------------------- |
| Build              | Leaves = array; parents combine children            |
| Range Sum          | Canonical O(log n) cover                            |
| Range Minimum      | Same cover with min                                 |
| Range Maximum      | Same cover with max                                 |
| Point Update       | Update leaf and ancestors                           |
| Range Update       | Teaching viz (successive points; lazy in real code) |
| Fenwick Tree (BIT) | Point update + prefix via `i ± i&−i`                |

#### Basic Trees

| Algorithm  | Notes                                |
| ---------- | ------------------------------------ |
| N-ary Tree | Arbitrary children; level-order walk |
| K-ary Tree | Fixed arity (k = 3 in the viz)       |

#### Balanced Search

| Algorithm  | Notes                                       |
| ---------- | ------------------------------------------- |
| 2-3 Tree   | 1–2 keys / 2–3 children; splits             |
| 2-3-4 Tree | 1–3 keys; RB-isomorphic teaching model      |
| B-Tree     | High-fanout splits                          |
| B+ Tree    | Records in leaves; internals are separators |

#### Specialized

| Algorithm      | Notes                                           |
| -------------- | ----------------------------------------------- |
| Interval Tree  | BST on lows + subtree max-high for stabbing     |
| Suffix Tree    | Compressed trie of all suffixes (naive build)   |
| Cartesian Tree | Heap on values + BST on positions (stack build) |
| KD-Tree        | Alternating axis splits for 2D points           |

Node roles follow the shared tree palette (idle, current, visited, path, highlight, and structure-specific accents such as red/black or heap focus).

---

## Dynamic Programming (`/dp`)

Sidebar grouped by DP family + a stage that shows **tables**, **input rows**, **item / word / cost panels**, or **tree / graph scenes**, depending on the algorithm.

Every algorithm below is **playable**, with multi-language code (C, C++, Python, Java, JavaScript, C#), shuffleable random inputs, size/speed controls, and step playback (same keyboard shortcuts as sorting).

### How the stage works

- **1D / sequence tables** — horizontal `dp[]` cells with roles: idle, current, read, write, answer, skip.
- **2D grids** — full DP matrices with optional row/column labels (characters, pots, dimensions, binary masks).
- **Source / items** — knapsack weights & values, dictionary words, cost matrices, input sequences.
- **Tree DP / Minimax** — SVG nodes/edges (same layout helpers as Trees), with captions for heights, gains, or game values.
- **Graph / bitmask scenes** — DAG / tour nodes on the canvas when the algo is graph-shaped.
- **Auto-fit** — cell size and font scale to the viewport; large numbers compact to `k` / `M` so digits stay inside cells.

Cell roles:

| Role    | Meaning                     |
| ------- | --------------------------- |
| Idle    | Not active this frame       |
| Current | Subproblem being considered |
| Read    | Dependency being looked up  |
| Write   | Value just written          |
| Answer  | Final answer cell / node    |
| Skip    | Branch / option not taken   |

### Algorithms (26)

#### 1D DP

| Algorithm       | Average  | Notes                            |
| --------------- | -------- | -------------------------------- |
| Fibonacci       | O(n)     | Bottom-up F(0)…F(n)              |
| Climbing Stairs | O(n)     | Ways with steps of 1 or 2        |
| House Robber    | O(n)     | Max loot without adjacent houses |
| Coin Change     | O(n · k) | Fewest coins for amount `n`      |

#### Grid DP

| Algorithm        | Average  | Notes                                           |
| ---------------- | -------- | ----------------------------------------------- |
| Unique Paths     | O(m · n) | Right/down path counts                          |
| Minimum Path Sum | O(m · n) | Cheapest right/down path                        |
| Dungeon Game     | O(m · n) | Min initial HP; fill backward from the princess |

#### Knapsack

| Algorithm          | Average  | Notes                                   |
| ------------------ | -------- | --------------------------------------- |
| 0/1 Knapsack       | O(n · W) | Each item at most once                  |
| Unbounded Knapsack | O(n · W) | Unlimited copies; 1D left-to-right fill |
| Subset Sum         | O(n · S) | Boolean reachability of exact sum `S`   |

#### String DP

| Algorithm               | Average   | Notes                                     |
| ----------------------- | --------- | ----------------------------------------- |
| LCS                     | O(m · n)  | Longest common subsequence of two strings |
| Edit Distance           | O(m · n)  | Levenshtein insert / delete / replace     |
| Word Break              | O(n² · k) | Segment `s` into dictionary words         |
| Palindromic Subsequence | O(n²)     | Longest palindromic subsequence           |

#### Sequence DP

| Algorithm           | Average | Notes                                          |
| ------------------- | ------- | ---------------------------------------------- |
| LIS                 | O(n²)   | Longest increasing subsequence (classic DP)    |
| Bitonic Subsequence | O(n²)   | Increase then decrease; LIS + LDS at each peak |

#### Interval DP

| Algorithm               | Average | Notes                                            |
| ----------------------- | ------- | ------------------------------------------------ |
| Matrix Chain            | O(n³)   | Min scalar multiplies for a matrix product chain |
| Burst Balloons          | O(n³)   | Max coins; last-burst open-interval DP           |
| Palindrome Partitioning | O(n²)   | Min cuts so every piece is a palindrome          |

#### Tree DP

| Algorithm        | Average | Notes                                          |
| ---------------- | ------- | ---------------------------------------------- |
| Tree Diameter    | O(n)    | Longest path via post-order heights            |
| Maximum Path Sum | O(n)    | Best any-to-any path; gain-style return values |

#### Graph DP

| Algorithm | Average  | Notes                                 |
| --------- | -------- | ------------------------------------- |
| DAG DP    | O(V + E) | Shortest paths in topo order on a DAG |

#### Bitmask DP

| Algorithm  | Average    | Notes                                         |
| ---------- | ---------- | --------------------------------------------- |
| TSP        | O(n² · 2ⁿ) | Held–Karp: `dp[mask][i]`, then close the tour |
| Assignment | O(n² · 2ⁿ) | Min-cost bijection; `dp[mask]` over job bits  |

#### Game DP

| Algorithm        | Average | Notes                                                    |
| ---------------- | ------- | -------------------------------------------------------- |
| Minimax          | O(b^d)  | Bottom-up MAX/MIN game tree; root is optimal play        |
| Optimal Strategy | O(n²)   | Pots of gold: take left or right end; interval guarantee |

### Size control (contextual)

The size slider remaps by family — e.g. grid dimensions, knapsack item count, string length, tree/graph node count, TSP / assignment `n`, minimax **depth**, optimal-strategy **pots**, etc. Shuffle regenerates a fresh seeded input for the current algorithm.

---

## Backtracking (`/backtracking`)

Sidebar grouped by family + a stage that shows **candidates**, the growing **path**, and **solutions found so far**. Roles highlight choose / skip / backtrack as the search tree is explored.

Every algorithm below is **playable**, with multi-language code, shuffleable inputs, size/speed controls, and the same keyboard shortcuts as sorting.

### Cell / chip roles

| Role      | Meaning                           |
| --------- | --------------------------------- |
| Idle      | Not under consideration           |
| Current   | Candidate being decided right now |
| Chosen    | Included in the current path      |
| Skip      | Pruned or deliberately left out   |
| Backtrack | Just undone / path rewound        |
| Solution  | Complete valid answer recorded    |

### Algorithms

#### Combinatorial

| Algorithm       | Average       | Notes                                                       |
| --------------- | ------------- | ----------------------------------------------------------- |
| Permutations    | O(n · n!)     | Every ordering; mark used indices, recurse, then unmark     |
| Combinations    | O(k · C(n,k)) | Choose `k` from `n` without regard to order                 |
| Subsets         | O(n · 2ⁿ)     | Include / skip each element (power set)                     |
| Combination Sum | O(n^{t/min})  | Multisets summing to target; reuse allowed, ascending picks |

#### Constraint Satisfaction

| Algorithm      | Average | Notes                                                 |
| -------------- | ------- | ----------------------------------------------------- |
| N-Queens       | O(n!)   | Place n queens with no shared row/col/diagonal        |
| Sudoku         | O(nⁿ²)  | 4×4 fill with row/col/box uniqueness (teaching-sized) |
| Graph Coloring | O(kⁿ)   | Assign k colors so adjacent nodes differ              |
| Crossword      | O(wˢ)   | Place word-bank entries into across/down slots        |

Size stays small (roughly 3–6 candidates / 4–5 board) so frame counts stay playable. Combinations expose `n · k`; combination sum shows `T` (target); CSP algos show board / node counts.

---

## How traces work

Algorithms are **runners**: pure functions that build an array of frames ahead of time. The UI only indexes into that list.

```
Frame → snapshot of state (bars / cells / nodes / edges / chips)
      → roles per index / cell / node / edge
      → optional labels, captions, frontiers, input rows, paths
      → hint string + formula (DP)
      → visit / relax / compare / write / backtrack stats
```

```
lib/sorting/        comparison, linear, hybrid runners + trace
lib/searching/      linear + ordered search runners + trace
lib/graphs/         traversal, connectivity, mst, ordering, analysis, random
lib/pathfinding/    shortest-path runners (reuses graph types / BFS)
lib/trees/          binary, BST, AVL, RB, heaps, tries, segment, specialized
lib/dp/             1D, grid, knapsack, string, sequence, interval,
                    tree, graph, bitmask, game + shared trace / random
lib/backtracking/   combinatorial + constraint runners + shared trace / random
```

Playback is speed-gated `setTimeout` stepping; Space / arrows / `R` match sorting.

Shared wiz chrome lives under `components/wiz/` (sidebar, preloader, playback helpers, SCSS shell).

### Adding an algorithm

1. Define the id + types (if needed).
2. Implement a pure runner that returns frames.
3. Add multi-language snippets.
4. Register metadata + runner in the section’s `index.ts` (`*_META` / `*_RUNNERS`).
5. Wire UI only if the viz needs a new layout (most reuse the existing wiz).

---

## Project layout

```
app/
  layout.tsx                 Shell, fonts, theme boot script
  page.tsx                   Home
  sorting/page.tsx
  searching/page.tsx
  graphs/page.tsx
  pathfinding/page.tsx
  trees/page.tsx
  dp/page.tsx
  backtracking/page.tsx
  globals.scss               Theme CSS variables
  styles/                    Tokens, mixins, Tailwind entry
components/
  nav/                       App shell + global rail
  theme/                     Light / dark provider
  home/                      Landing + section crossfade
  sorting/ · searching/
  graphs/                    GraphWiz, GraphTypeSelect, SCSS
  pathfinding/               PathfindingWiz
  trees/                     TreesWiz + SCSS
  dp/                        DpWiz + SCSS (tables, grids, tree/graph scenes)
  backtracking/              BacktrackingWiz + SCSS (candidates / path / solutions)
  code/                      CodePanel (language tabs + Prettier-styled UI)
  wiz/                       Shared shell, AlgoSidebar, preloader, playback
  brand/                     AlgoMark mark
lib/
  sorting/ · searching/
  graphs/                    Types, generators, runners, snippets
  pathfinding/               Path meta, shortest-path runners, snippets
  trees/                     Layout, runners by family, snippets, random
  dp/
    index.ts                 Meta + runners registry
    types.ts · trace.ts · random.ts · snippets.ts
    oned.ts · grid.ts · knapsack.ts
    string.ts · sequence.ts · interval.ts
    tree.ts · graph.ts · bitmask.ts · game.ts
  backtracking/
    index.ts · types.ts · trace.ts · random.ts
    combinatorial.ts · constraint.ts · snippets.ts
  code/                      Multi-language snippet helpers
public/
  icons/                     Nav + section icons
  bg/                        Home section backgrounds
.husky/                      Git hooks
.prettierrc.json
eslint.config.mjs
```

Styles: **SCSS modules**. Prefer `@include tw("…")` / `@apply` for utilities; keep theme colors as `var(--accent)`, `var(--muted)`, etc. Avoid `@apply rounded-full` — use `border-radius: 999px`.

---

## More to come

Same pattern as live sections: algo sidebar, step playback, color roles, definition / complexity / usage / code.

### Backtracking (more families)

- Larger Sudoku (9×9), richer crossword banks
- Optional explicit search-tree SVG (in addition to boards / path chips)

### String Algorithms

- KMP, Rabin–Karp; optional Z-algorithm  
  (String **DP** such as LCS / edit distance already lives under `/dp`.)

### Later ideas

- Shareable URL state (algorithm, size, seed, speed)
- Tests for runners (frame invariants)
- True grid-maze pathfinding UI (walls + cells) in addition to abstract graphs

---

## Notes for contributors

- Prefer **CSS variables** over hardcoded violet / zinc so light and dark stay in sync.
- Do not `@apply` custom theme tokens (e.g. `text-ink-muted`) in Sass — use `color: var(--muted)` instead.
- Run `npm run format` before large PRs; pre-commit already formats staged files.
- Keep wiz pages **document-like** (not a dashboard of cards). The algorithm list sidebar is the intentional exception.
- Runners should stay pure: input → frames, no DOM.
- When adding an algorithm: metadata + runner + snippets + wire into `*_META` / `*_RUNNERS`.
- For DP grids, prefer writing fit metrics through DOM / CSS variables rather than ResizeObserver → `setState` loops (avoids update-depth thrash under HMR).

---

## License

Private project (`package.json` `"private": true`). Add a license here if you open the repo.
