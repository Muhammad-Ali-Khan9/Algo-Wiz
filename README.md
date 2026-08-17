# Algorithms Wizard

Interactive algorithm visualizations. Watch classic computer science move — comparisons, swaps, probes, hops, and edge relaxations — one step at a time.

**Live sections:** Sorting · Searching · Graphs · Pathfinding  
**Planned:** Trees · Dynamic Programming · Backtracking · String Algorithms

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

| Script                 | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Local development (Turbopack)                   |
| `npm run build`        | Production build                                |
| `npm run start`        | Serve the production build                      |
| `npm run lint`         | ESLint                                          |
| `npm run format`       | Format the repo with Prettier                   |
| `npm run format:check` | Check Prettier without writing                  |
| `npm run prepare`      | Install Husky git hooks (runs on `npm install`) |

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
6. **Trees**, **Dynamic Programming**, **Backtracking**, **String Algorithms** — coming soon

Sections **crossfade** in the same viewport (sticky stack + scroll-linked opacity). The global rail stays fixed.

### Global chrome

- **Left rail** — Home, Sorting, Searching, Graphs, Pathfinding. Theme-aware icons (dark purple-black / light orange).
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

Same graph canvas pattern, focused on **shortest / best route from A to B**.

### Live algorithms

| Group      | Algorithm | Notes                                          |
| ---------- | --------- | ---------------------------------------------- |
| Unweighted | BFS       | Shortest hop-path                              |
| Weighted   | Dijkstra  | Non-negative weights                           |
| Heuristic  | A*        | `g` / `h` inside larger nodes; ∞ until reached |

### Catalogued (Soon)

Bidirectional BFS · Bellman–Ford · Floyd–Warshall · Greedy Best-First · Bidirectional Dijkstra · Bidirectional A*

A* uses a larger node spacing and shows heuristic metrics inside nodes. Edge weight badges appear on weighted algorithms.

---

## How traces work

Algorithms are **runners**: pure functions that build an array of frames ahead of time. The UI only indexes into that list.

```
Frame → snapshot of nodes/edges (or bars)
      → roles per node / edge (or index)
      → optional labels (distances, components, g/h, …)
      → frontier list
      → hint string
      → visit / relax (or compare / write) stats
```

```
lib/sorting/     comparison, linear, hybrid runners + trace
lib/searching/   linear + ordered search runners + trace
lib/graphs/      traversal, connectivity, mst, ordering, analysis, random
lib/pathfinding/ shortest (Dijkstra, A*) + reuses graph types / BFS
```

Playback is speed-gated `setTimeout` stepping; Space / arrows / `R` match sorting.

Shared wiz chrome lives under `components/wiz/` (sidebar, preloader, playback helpers, SCSS shell).

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
  globals.scss               Theme CSS variables
  styles/                    Tokens, mixins, Tailwind entry
components/
  nav/                       App shell + global rail
  theme/                     Light / dark provider
  home/                      Landing + section crossfade
  sorting/ · searching/
  graphs/                    GraphWiz, GraphTypeSelect, SCSS
  pathfinding/               PathfindingWiz
  code/                      CodePanel (language tabs + Prettier-styled UI)
  wiz/                       Shared shell, AlgoSidebar, preloader, playback
lib/
  sorting/ · searching/
  graphs/                    Types, generators, runners, snippets
  pathfinding/               Path meta, Dijkstra / A*, snippets
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

### Trees

- BST insert / find; preorder / inorder / postorder / level-order
- Optional AVL or red-black rotations

### Dynamic Programming

- 1D / 2D tables (knapsack, LCS, coin change)
- Highlight dependencies, then reconstruct the answer

### Backtracking

- N-queens, permutations / subsets
- Grow, fail, rewind — show the search tree

### String Algorithms

- KMP, Rabin–Karp; optional Z-algorithm

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
- Graph / pathfinding runners should stay pure: input graph → frames, no DOM.
- When adding an algorithm: metadata + runner + snippets + wire into `*_META` / `*_RUNNERS`.

---

## License

Private project (`package.json` `"private": true`). Add a license here if you open the repo.
