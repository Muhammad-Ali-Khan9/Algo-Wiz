import { layoutComplete } from "./layout";
import { TreeTrace, rolesByNodeList } from "./trace";
import type { TreeFrame, TreeInput, TreeNodeRole } from "./types";

function scene(heap: number[], ids: number[]) {
  return layoutComplete(heap.map((value, i) => ({ id: ids[i]!, label: String(value) })));
}

function pushHeap(
  t: TreeTrace,
  heap: number[],
  ids: number[],
  roles: Partial<Record<number, TreeNodeRole>>,
  hint: string,
  frontier: number[] = [],
) {
  const { nodes, edges } = scene(heap, ids);
  const labels = Object.fromEntries(nodes.map((n, i) => [n.id, String(heap[i]!)]));
  t.push(
    nodes,
    edges,
    rolesByNodeList(nodes, roles),
    t.idleEdgeRoles(edges.length),
    hint,
    { labels, frontier },
  );
}

function siftUp(
  t: TreeTrace,
  heap: number[],
  ids: number[],
  index: number,
  maxHeap: boolean,
) {
  let i = index;
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    t.compare();
    const better = maxHeap ? heap[i]! > heap[p]! : heap[i]! < heap[p]!;
    pushHeap(
      t,
      heap,
      ids,
      { [ids[i]!]: "current", [ids[p]!]: "frontier" },
      `Compare ${heap[i]} with parent ${heap[p]}.`,
    );
    if (!better) break;
    t.visit();
    [heap[i], heap[p]] = [heap[p]!, heap[i]!];
    [ids[i], ids[p]] = [ids[p]!, ids[i]!];
    pushHeap(t, heap, ids, { [ids[p]!]: "path" }, "Swap with parent.");
    i = p;
  }
}

function siftDown(
  t: TreeTrace,
  heap: number[],
  ids: number[],
  index: number,
  maxHeap: boolean,
) {
  let i = index;
  const n = heap.length;
  for (;;) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left >= n) break;
    let pick = left;
    if (right < n) {
      t.compare();
      const rightBetter = maxHeap
        ? heap[right]! > heap[left]!
        : heap[right]! < heap[left]!;
      if (rightBetter) pick = right;
    }
    t.compare();
    pushHeap(
      t,
      heap,
      ids,
      { [ids[i]!]: "current", [ids[pick]!]: "frontier" },
      `Compare ${heap[i]} with child ${heap[pick]}.`,
    );
    const better = maxHeap ? heap[pick]! > heap[i]! : heap[pick]! < heap[i]!;
    if (!better) break;
    t.visit();
    [heap[i], heap[pick]] = [heap[pick]!, heap[i]!];
    [ids[i], ids[pick]] = [ids[pick]!, ids[i]!];
    pushHeap(t, heap, ids, { [ids[i]!]: "path" }, "Swap with child.");
    i = pick;
  }
}

export function heapMinInsert(input: TreeInput): TreeFrame[] {
  return heapInsert(input, false);
}

export function heapMaxInsert(input: TreeInput): TreeFrame[] {
  return heapInsert(input, true);
}

function heapInsert(input: TreeInput, maxHeap: boolean): TreeFrame[] {
  const t = new TreeTrace();
  const heap: number[] = [];
  const ids: number[] = [];
  let nextId = 0;
  pushHeap(
    t,
    heap,
    ids,
    {},
    maxHeap
      ? "Max-Heap Insert — bubble larger keys up."
      : "Min-Heap Insert — bubble smaller keys up.",
  );
  for (const value of input.values) {
    heap.push(value);
    ids.push(nextId++);
    t.visit();
    pushHeap(
      t,
      heap,
      ids,
      { [ids[ids.length - 1]!]: "current" },
      `Insert ${value} at the end.`,
    );
    siftUp(t, heap, ids, heap.length - 1, maxHeap);
  }
  pushHeap(t, heap, ids, {}, "Heap insert complete.");
  return t.frames;
}

export function heapExtract(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const maxHeap = input.kind === "maxheap";
  const heap = [...input.values];
  const ids = heap.map((_, i) => i);
  // Build first
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i -= 1) {
    siftDown(t, heap, ids, i, maxHeap);
  }
  // Clear noisy build frames
  t.frames = [];
  pushHeap(
    t,
    heap,
    ids,
    {},
    maxHeap
      ? "Extract Max — swap root with last, sift down."
      : "Extract Min — swap root with last, sift down.",
  );
  while (heap.length) {
    const top = heap[0]!;
    pushHeap(t, heap, ids, { [ids[0]!]: "current" }, `Extract ${top}.`);
    const last = heap.length - 1;
    [heap[0], heap[last]] = [heap[last]!, heap[0]!];
    [ids[0], ids[last]] = [ids[last]!, ids[0]!];
    heap.pop();
    ids.pop();
    if (!heap.length) break;
    pushHeap(t, heap, ids, { [ids[0]!]: "frontier" }, "Move last key to root.");
    siftDown(t, heap, ids, 0, maxHeap);
  }
  pushHeap(t, heap, ids, {}, "Heap emptied.");
  return t.frames;
}

export function heapHeapify(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const maxHeap = input.kind === "maxheap";
  const heap = [...input.values];
  const ids = heap.map((_, i) => i);
  pushHeap(t, heap, ids, {}, "Heapify — sift down from this index (demo on mid node).");
  const start = Math.max(0, Math.floor(heap.length / 2) - 1);
  pushHeap(t, heap, ids, { [ids[start]!]: "current" }, `Sift down from index ${start}.`);
  siftDown(t, heap, ids, start, maxHeap);
  pushHeap(t, heap, ids, {}, "Heapify step done.");
  return t.frames;
}

export function heapBuild(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const maxHeap = input.kind === "maxheap";
  const heap = [...input.values];
  const ids = heap.map((_, i) => i);
  pushHeap(
    t,
    heap,
    ids,
    {},
    maxHeap
      ? "Build Max-Heap — sift down from last parent."
      : "Build Min-Heap — sift down from last parent.",
  );
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i -= 1) {
    pushHeap(t, heap, ids, { [ids[i]!]: "current" }, `Heapify index ${i}.`);
    siftDown(t, heap, ids, i, maxHeap);
  }
  pushHeap(t, heap, ids, {}, "Build-heap complete.");
  return t.frames;
}

export function heapSort(input: TreeInput): TreeFrame[] {
  const t = new TreeTrace();
  const heap = [...input.values];
  const ids = heap.map((_, i) => i);
  pushHeap(t, heap, ids, {}, "Heap Sort — build max-heap, then extract.");
  for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i -= 1) {
    siftDown(t, heap, ids, i, true);
  }
  pushHeap(t, heap, ids, {}, "Max-heap ready — peel off the maximum repeatedly.");
  const sorted: number[] = [];
  for (let end = heap.length - 1; end > 0; end -= 1) {
    pushHeap(
      t,
      heap,
      ids,
      { [ids[0]!]: "current", [ids[end]!]: "goal" },
      `Swap root ${heap[0]} with ${heap[end]}.`,
    );
    [heap[0], heap[end]] = [heap[end]!, heap[0]!];
    [ids[0], ids[end]] = [ids[end]!, ids[0]!];
    sorted.push(heap[end]!);
    // Temporarily treat end as removed for sift
    const saved = heap.splice(end);
    const savedIds = ids.splice(end);
    siftDown(t, heap, ids, 0, true);
    heap.push(...saved);
    ids.push(...savedIds);
    const roles: Partial<Record<number, TreeNodeRole>> = {};
    for (let i = end; i < heap.length; i += 1) roles[ids[i]!] = "path";
    pushHeap(t, heap, ids, roles, `Sorted suffix grows.`);
  }
  sorted.push(heap[0]!);
  const roles: Partial<Record<number, TreeNodeRole>> = {};
  for (const id of ids) roles[id] = "path";
  pushHeap(t, heap, ids, roles, `Heap sort done: [${[...heap].join(", ")}].`);
  return t.frames;
}
