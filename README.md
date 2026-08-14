# Algorithms Wizard

Interactive algorithm visualizations. Watch classic computer science move — comparisons, swaps, probes, and hops — one step at a time.

The first section is **sorting**. Searching, graphs, and pathfinding are planned next.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- TypeScript
- Sass modules with Tailwind CSS v4 (`@apply`, mixins, tokens)
- No extra state library — local React state and a small theme context

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script        | Purpose              |
| ------------- | -------------------- |
| `npm run dev`   | Local development  |
| `npm run build` | Production build   |
| `npm run start` | Serve the build    |
| `npm run lint`  | ESLint             |

## What’s in the app today

### Home

The landing page is a full-viewport intro, then algorithm families as you scroll:

1. **Intro** — what Algorithms Wizard is, how playback works, and a map of sections. Math-themed SVG backgrounds (grid, curves, formulas, spiral, geometry) tint with the current theme.
2. **Sorting** — live; links to `/sorting`.
3. **Searching**, **Graphs**, **Pathfinding** — coming soon, each with its own background art.

Sections **crossfade** in the same viewport as you scroll (sticky stack + scroll-linked opacity). The grey global rail stays put.

### Global chrome

- **Left rail** — Home and Sorting. The rail color does not change with theme.
- **Theme toggle** — capsule at the bottom of the rail: sun (light) and crescent (dark), with a circle on the active option. Choice is saved in `localStorage` (`algo-wiz-theme`).
- **Light theme** — white and orange shades.
- **Dark theme** — black with purple shades.

A small script runs before paint so the saved theme does not flash the wrong colors.

### Sorting visualizer (`/sorting`)

A page layout (not a dashboard of cards): algorithm list on the left, document-style content on the right.

**Algorithms (10)**

| Algorithm      | Average     | Notes                                      |
| -------------- | ----------- | ------------------------------------------ |
| Bubble Sort    | O(n²)       | Adjacent swaps; early exit if no swaps     |
| Selection Sort | O(n²)       | Few writes; always quadratic               |
| Insertion Sort | O(n²)       | Fast on nearly-sorted / small n            |
| Merge Sort     | O(n log n)  | Stable, extra linear memory                |
| Quick Sort     | O(n log n)  | In-place average case                      |
| Heap Sort      | O(n log n)  | Worst-case n log n, O(1) extra space       |
| Shell Sort     | ~O(n^1.25)  | Gapped insertion                           |
| Counting Sort  | O(n + k)    | Integer keys in a small range              |
| Radix Sort     | O(d·(n+k))  | LSD digit buckets                          |
| Bucket Sort    | O(n + k)    | Range buckets + insertion; **bucket count is adjustable** |

**Playback**

- Play / Pause / Replay
- Step back / Step ahead
- Shuffle and Reset
- Size (8–48) and Speed sliders
- **Buckets** slider (1–64) when Bucket Sort is selected

**Visualization**

- Bars colored by role: normal (green), comparing (yellow), selected (blue), swapping (red), sorted (purple)
- Values sit on top of each bar (bold Poppins)
- Live hint, progress, comparison/write counts, and step index
- Below the run: **Definition**, **Complexity** (best / average / worst / space / stable), and **Usage** for the current algorithm

**Bucket / radix / counting extras**

- Auxiliary structures render as **open containers**
- New entries **drop in** with a short pop (existing items stay still)

**Preloader**

- Centered spinning circular bar
- Fades in and out on first load and when switching algorithms

**Keyboard** (when focus is not in an input)

| Key           | Action        |
| ------------- | ------------- |
| Space         | Play / pause  |
| Right arrow   | Step ahead    |
| Left arrow    | Step back     |
| R             | Shuffle       |

## How sorting traces work

Each algorithm is a **runner** that yields an array of frames — not a live mutation of the React tree during the sort.

```
lib/sorting/
  types.ts        Frame, roles, algorithm metadata
  trace.ts        Shared recorder (compares, swaps, writes, hints)
  comparison.ts   Bubble, selection, insertion, merge, quick, heap, shell
  linear.ts       Counting, radix, bucket
  random.ts       Shuffle / patterned arrays
  index.ts        Metadata, runners, definitions, usage copy
```

A frame holds:

- the array snapshot
- a role per index (idle, compare, swap, sorted, pivot/key/min/write)
- a human-readable hint
- comparison / write stats
- optional auxiliary buckets

The UI steps through that list at the chosen speed.

## Project layout

```
app/
  layout.tsx              Shell, fonts, theme boot script
  page.tsx                Home
  sorting/page.tsx        Sorting visualizer
  globals.scss            Theme CSS variables
  styles/                 Tokens, mixins, Tailwind entry
components/
  nav/                    App shell + global rail
  theme/                  Light / dark provider
  home/                   Landing + section crossfade
  sorting/                Sorting page + SCSS module
lib/sorting/              Algorithm traces
public/
  icons/                  Nav and theme SVGs
  bg/                     Math and section background SVGs
```

Styles live in **SCSS modules**. Tailwind is used via `@apply` and a `tw()` mixin for utilities that need `/` or `:`. Theme colors go through CSS variables (`--accent`, `--background`, …) so Sass `@apply` of custom tokens does not drop styles.

## More to come

These are sketched on the home page and intended to follow the same pattern: sidebar of algorithms, step-through playback, color roles, and definition / complexity / usage under the visualization.

### Searching

- Linear and binary search on a sorted array
- Binary search tree insert / find
- Optional: interpolation search, jump search

Show the shrinking window (low / mid / high) and tree descent, not just a final index.

### Graphs

- BFS and DFS on an undirected / directed graph
- Weighted searches (Dijkstra, optionally Bellman–Ford)
- Frontier vs visited vs current edge, with a small adjacency drawing

### Pathfinding

- Grid with walls, start, and goal
- Dijkstra and A* (and a greedy baseline for contrast)
- Expand cells, then paint the reconstructed path

### Later ideas

- More sorts (Timsort sketch, introsort, pancake)
- Linked-list and tree rotations as first-class visuals
- Shareable URL state (algorithm, size, seed, speed)
- A short “why this comparison happened” aside tied to the current frame
- Tests for runners (frame invariants: permutation preserved, sorted suffix grows, etc.)

Nav entries for Searching, Graphs, and Pathfinding should appear on the global rail when those routes exist.

## Notes for contributors

- Prefer **CSS variables** over hardcoded violet/zinc in modules so light and dark stay in sync.
- Do not `@apply` custom theme tokens (for example `text-ink-muted`) in Sass — those rules can vanish after compilation. Use `color: var(--muted)` or core utilities (`text-zinc-400`) instead.
- Avoid `@apply rounded-full` in this setup; use `border-radius: 999px`.
- The global sidebar must stay grey in both themes.
- Sorting content should stay **zoneless** (no glass dashboard cards). The algorithm list sidebar is the exception.

## License

Private project (`package.json` `"private": true`). Add a license here if you open the repo.
