import { Trace } from "./trace";
import type { BarRole, SortFrame } from "./types";

function fillRange(roles: BarRole[], lo: number, hi: number, role: BarRole) {
  const start = Math.max(0, lo);
  const end = Math.min(hi, roles.length - 1);
  for (let i = start; i <= end; i += 1) {
    if (roles[i] === "idle") roles[i] = role;
  }
}

function insertionRange(t: Trace, lo: number, hi: number) {
  for (let i = lo + 1; i <= hi; i += 1) {
    const key = t.a[i];
    let j = i - 1;
    const pick = t.idleRoles();
    fillRange(pick, lo, hi, "key");
    pick[i] = "key";
    t.push(pick, `Insert ${key} into [${lo}…${i}].`);

    while (j >= lo) {
      const roles = t.idleRoles();
      fillRange(roles, lo, hi, "key");
      roles[j] = "compare";
      roles[j + 1] = "key";
      t.compare(roles, `Compare ${t.a[j]} with key ${key}.`);
      if (t.a[j] <= key) break;
      t.writeAt(j + 1, t.a[j]);
      const shift = t.idleRoles();
      fillRange(shift, lo, hi, "key");
      shift[j] = "swap";
      shift[j + 1] = "write";
      t.push(shift, `Shift ${t.a[j]} right.`);
      j -= 1;
    }

    t.writeAt(j + 1, key);
    const placed = t.idleRoles();
    fillRange(placed, lo, hi, "key");
    placed[j + 1] = "write";
    t.push(placed, `Place ${key} at index ${j + 1}.`);
  }
}

function mergeRange(t: Trace, lo: number, mid: number, hi: number) {
  const left = t.a.slice(lo, mid + 1);
  const right = t.a.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;

  const start = t.idleRoles();
  fillRange(start, lo, hi, "key");
  t.push(start, `Merge [${lo}…${mid}] with [${mid + 1}…${hi}].`);

  while (i < left.length && j < right.length) {
    const roles = t.idleRoles();
    fillRange(roles, lo, hi, "key");
    roles[lo + i] = "compare";
    roles[mid + 1 + j] = "compare";
    t.compare(roles, `Compare ${left[i]} and ${right[j]}.`);

    if (left[i] <= right[j]) {
      t.writeAt(k, left[i]);
      i += 1;
    } else {
      t.writeAt(k, right[j]);
      j += 1;
    }
    const write = t.idleRoles();
    fillRange(write, lo, hi, "key");
    write[k] = "write";
    t.push(write, `Write ${t.a[k]} at ${k}.`);
    k += 1;
  }

  while (i < left.length) {
    t.writeAt(k, left[i]);
    const write = t.idleRoles();
    fillRange(write, lo, hi, "key");
    write[k] = "write";
    t.push(write, `Copy remaining ${left[i]}.`);
    i += 1;
    k += 1;
  }

  while (j < right.length) {
    t.writeAt(k, right[j]);
    const write = t.idleRoles();
    fillRange(write, lo, hi, "key");
    write[k] = "write";
    t.push(write, `Copy remaining ${right[j]}.`);
    j += 1;
    k += 1;
  }
}

function heapSortRange(t: Trace, lo: number, hi: number) {
  const n = hi - lo + 1;
  const at = (heapIndex: number) => lo + heapIndex;

  const siftDown = (start: number, end: number) => {
    let root = start;
    while (true) {
      const left = root * 2 + 1;
      const right = left + 1;
      if (left >= end) break;

      let largest = root;
      const roles = t.idleRoles();
      fillRange(roles, lo, hi, "key");
      roles[at(root)] = "key";
      roles[at(left)] = "compare";
      if (right < end) roles[at(right)] = "compare";
      t.compare(roles, "Sift the heap in this range.");

      if (t.a[at(left)] > t.a[at(largest)]) largest = left;
      if (right < end && t.a[at(right)] > t.a[at(largest)]) largest = right;
      if (largest === root) break;

      t.swap(at(root), at(largest));
      const swapRoles = t.idleRoles();
      fillRange(swapRoles, lo, hi, "key");
      swapRoles[at(root)] = "swap";
      swapRoles[at(largest)] = "swap";
      t.push(swapRoles, `Heap swap ${t.a[at(largest)]} and ${t.a[at(root)]}.`);
      root = largest;
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    siftDown(i, n);
  }

  for (let end = n - 1; end > 0; end -= 1) {
    t.swap(at(0), at(end));
    const extract = t.idleRoles();
    fillRange(extract, lo, hi, "key");
    extract[at(0)] = "swap";
    extract[at(end)] = "swap";
    t.push(extract, `Extract ${t.a[at(end)]} in this heap range.`);
    siftDown(0, end);
  }
}

export function timSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  const run = Math.max(2, Math.min(8, t.n));
  t.push(t.idleRoles(), `Starting Tim Sort — insertion runs of ${run}, then merges.`);

  for (let start = 0; start < t.n; start += run) {
    const end = Math.min(start + run - 1, t.n - 1);
    const mark = t.idleRoles();
    fillRange(mark, start, end, "key");
    t.push(mark, `Insertion-sort run [${start}…${end}].`);
    insertionRange(t, start, end);
  }

  for (let size = run; size < t.n; size *= 2) {
    for (let left = 0; left < t.n; left += size * 2) {
      const mid = left + size - 1;
      const right = Math.min(left + size * 2 - 1, t.n - 1);
      if (mid >= right) continue;
      mergeRange(t, left, mid, right);
    }
  }

  t.finish(new Set());
  return t.frames;
}

export function introSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  const maxDepth = 2 * Math.floor(Math.log2(Math.max(t.n, 2)));
  const leaf = 8;
  t.push(
    t.idleRoles(),
    `Starting Intro Sort — quicksort, heap after depth ${maxDepth}, insertion under ${leaf}.`,
  );

  const partition = (lo: number, hi: number): number => {
    const pivot = t.a[hi];
    let i = lo;
    const show = t.idleRoles();
    fillRange(show, lo, hi, "key");
    show[hi] = "pivot";
    t.push(show, `Pivot ${pivot} in [${lo}…${hi}].`);

    for (let j = lo; j < hi; j += 1) {
      const roles = t.idleRoles();
      fillRange(roles, lo, hi, "key");
      roles[hi] = "pivot";
      roles[j] = "compare";
      roles[i] = "min";
      t.compare(roles, `Compare ${t.a[j]} with pivot ${pivot}.`);
      if (t.a[j] < pivot) {
        t.swap(i, j);
        const swapRoles = t.idleRoles();
        fillRange(swapRoles, lo, hi, "key");
        swapRoles[hi] = "pivot";
        swapRoles[i] = "swap";
        swapRoles[j] = "swap";
        t.push(swapRoles, `Move ${t.a[i]} left of the pivot.`);
        i += 1;
      }
    }

    t.swap(i, hi);
    const placed = t.idleRoles();
    fillRange(placed, lo, hi, "key");
    placed[i] = "pivot";
    t.push(placed, `Pivot ${pivot} sits at ${i}.`);
    return i;
  };

  const sort = (lo: number, hi: number, depth: number) => {
    const size = hi - lo + 1;
    if (size <= 1) return;

    if (size <= leaf) {
      const mark = t.idleRoles();
      fillRange(mark, lo, hi, "key");
      t.push(mark, `Small range [${lo}…${hi}] — insertion sort.`);
      insertionRange(t, lo, hi);
      return;
    }

    if (depth <= 0) {
      const mark = t.idleRoles();
      fillRange(mark, lo, hi, "key");
      t.push(mark, `Depth limit — heap-sort [${lo}…${hi}].`);
      heapSortRange(t, lo, hi);
      return;
    }

    const p = partition(lo, hi);
    sort(lo, p - 1, depth - 1);
    sort(p + 1, hi, depth - 1);
  };

  sort(0, t.n - 1, maxDepth);
  t.finish(new Set());
  return t.frames;
}

export function bitonicSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  t.push(
    t.idleRoles(),
    "Starting Bitonic Sort — build bitonic sequences, then merge up.",
  );

  const greatestPowerOfTwoLessThan = (n: number) => {
    let k = 1;
    while (k < n) k <<= 1;
    return k >> 1;
  };

  const compSwap = (i: number, j: number, up: boolean) => {
    const roles = t.idleRoles();
    roles[i] = "compare";
    roles[j] = "compare";
    t.compare(
      roles,
      `Compare ${t.a[i]} and ${t.a[j]} (${up ? "ascending" : "descending"}).`,
    );
    const outOfOrder = up ? t.a[i] > t.a[j] : t.a[i] < t.a[j];
    if (!outOfOrder) return;
    t.swap(i, j);
    const swapRoles = t.idleRoles();
    swapRoles[i] = "swap";
    swapRoles[j] = "swap";
    t.push(swapRoles, `Swap ${t.a[j]} and ${t.a[i]}.`);
  };

  const bitonicMerge = (lo: number, count: number, up: boolean) => {
    if (count <= 1) return;
    const step = greatestPowerOfTwoLessThan(count);
    for (let i = lo; i < lo + count - step; i += 1) {
      compSwap(i, i + step, up);
    }
    bitonicMerge(lo, step, up);
    bitonicMerge(lo + step, count - step, up);
  };

  const sort = (lo: number, count: number, up: boolean) => {
    if (count <= 1) return;
    const mid = Math.floor(count / 2);
    sort(lo, mid, !up);
    sort(lo + mid, count - mid, up);
    const mark = t.idleRoles();
    fillRange(mark, lo, lo + count - 1, "key");
    t.push(mark, `Bitonic merge [${lo}…${lo + count - 1}] ${up ? "up" : "down"}.`);
    bitonicMerge(lo, count, up);
  };

  sort(0, t.n, true);
  t.finish(new Set());
  return t.frames;
}

export function stoogeSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  t.push(
    t.idleRoles(),
    "Starting Stooge Sort — swap ends, then the first 2/3, last 2/3, first 2/3 again.",
  );

  const stooge = (lo: number, hi: number) => {
    if (lo >= hi) return;

    const roles = t.idleRoles();
    fillRange(roles, lo, hi, "key");
    roles[lo] = "compare";
    roles[hi] = "compare";
    t.compare(roles, `Compare ends ${t.a[lo]} and ${t.a[hi]}.`);

    if (t.a[lo] > t.a[hi]) {
      t.swap(lo, hi);
      const swapRoles = t.idleRoles();
      fillRange(swapRoles, lo, hi, "key");
      swapRoles[lo] = "swap";
      swapRoles[hi] = "swap";
      t.push(swapRoles, `Swap ${t.a[hi]} and ${t.a[lo]}.`);
    }

    const len = hi - lo + 1;
    if (len < 3) return;

    const third = Math.floor(len / 3);
    stooge(lo, hi - third);
    stooge(lo + third, hi);
    stooge(lo, hi - third);
  };

  stooge(0, t.n - 1);
  t.finish(new Set());
  return t.frames;
}
