import { Trace } from "./trace";
import type { BarRole, SortFrame } from "./types";

export function bubbleSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  const sorted = new Set<number>();

  t.push(t.idleRoles(), "Starting Bubble Sort — adjacent pairs will bubble up.");

  for (let pass = 0; pass < t.n - 1; pass += 1) {
    let swapped = false;

    for (let j = 0; j < t.n - 1 - pass; j += 1) {
      const roles = t.idleRoles();
      t.markSorted(roles, sorted);
      roles[j] = "compare";
      roles[j + 1] = "compare";
      t.compare(roles, `Compare ${t.a[j]} and ${t.a[j + 1]}.`);

      if (t.a[j] > t.a[j + 1]) {
        t.swap(j, j + 1);
        swapped = true;
        const swapRoles = t.idleRoles();
        t.markSorted(swapRoles, sorted);
        swapRoles[j] = "swap";
        swapRoles[j + 1] = "swap";
        t.push(swapRoles, `Swap ${t.a[j + 1]} and ${t.a[j]}.`);
      }
    }

    sorted.add(t.n - 1 - pass);
    const passRoles = t.idleRoles();
    t.markSorted(passRoles, sorted);
    t.push(passRoles, `${t.a[t.n - 1 - pass]} settled at the end of this pass.`);

    if (!swapped) break;
  }

  t.finish(sorted);
  return t.frames;
}

export function selectionSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  const sorted = new Set<number>();

  t.push(t.idleRoles(), "Starting Selection Sort — find the minimum for each prefix.");

  for (let i = 0; i < t.n - 1; i += 1) {
    let min = i;

    for (let j = i + 1; j < t.n; j += 1) {
      const roles = t.idleRoles();
      t.markSorted(roles, sorted);
      roles[i] = "key";
      roles[min] = "min";
      roles[j] = "compare";
      t.compare(roles, `Scan ${t.a[j]} against current min ${t.a[min]}.`);

      if (t.a[j] < t.a[min]) {
        min = j;
        const minRoles = t.idleRoles();
        t.markSorted(minRoles, sorted);
        minRoles[i] = "key";
        minRoles[min] = "min";
        t.push(minRoles, `New minimum ${t.a[min]}.`);
      }
    }

    if (min !== i) {
      t.swap(i, min);
      const swapRoles = t.idleRoles();
      t.markSorted(swapRoles, sorted);
      swapRoles[i] = "swap";
      swapRoles[min] = "swap";
      t.push(swapRoles, `Place ${t.a[i]} at index ${i}.`);
    }

    sorted.add(i);
  }

  t.finish(sorted);
  return t.frames;
}

export function insertionSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  const sorted = new Set<number>([0]);

  t.push(t.idleRoles(), "Starting Insertion Sort — grow a sorted prefix.");
  if (t.n > 0) {
    const first = t.idleRoles();
    first[0] = "sorted";
    t.push(first, "First element is already a sorted prefix.");
  }

  for (let i = 1; i < t.n; i += 1) {
    const key = t.a[i];
    let j = i - 1;
    const pick = t.idleRoles();
    t.markSorted(pick, sorted);
    pick[i] = "key";
    t.push(pick, `Pick key ${key}.`);

    while (j >= 0) {
      const roles = t.idleRoles();
      t.markSorted(roles, sorted);
      roles[j] = "compare";
      roles[j + 1] = "key";
      t.compare(roles, `Compare ${t.a[j]} with key ${key}.`);
      if (t.a[j] <= key) break;
      t.writeAt(j + 1, t.a[j]);
      const shift = t.idleRoles();
      t.markSorted(shift, sorted);
      shift[j] = "swap";
      shift[j + 1] = "write";
      t.push(shift, `Shift ${t.a[j]} one slot to the right.`);
      j -= 1;
    }

    t.writeAt(j + 1, key);
    sorted.add(i);
    const placed = t.idleRoles();
    t.markSorted(placed, sorted);
    placed[j + 1] = "write";
    t.push(placed, `Insert ${key} at index ${j + 1}.`);
  }

  t.finish(sorted);
  return t.frames;
}

export function shellSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  t.push(t.idleRoles(), "Starting Shell Sort — insertion sort over shrinking gaps.");

  for (let gap = Math.floor(t.n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    const gapRoles = t.idleRoles();
    t.push(gapRoles, `Gap size ${gap}.`);

    for (let i = gap; i < t.n; i += 1) {
      const key = t.a[i];
      let j = i;
      const pick = t.idleRoles();
      pick[i] = "key";
      t.push(pick, `Pick ${key} with gap ${gap}.`);

      while (j >= gap) {
        const roles = t.idleRoles();
        roles[j] = "key";
        roles[j - gap] = "compare";
        t.compare(roles, `Compare ${t.a[j - gap]} with key ${key}.`);
        if (t.a[j - gap] <= key) break;
        t.writeAt(j, t.a[j - gap]);
        const shift = t.idleRoles();
        shift[j] = "write";
        shift[j - gap] = "swap";
        t.push(shift, `Move ${t.a[j - gap]} forward by ${gap}.`);
        j -= gap;
      }

      t.writeAt(j, key);
      const placed = t.idleRoles();
      placed[j] = "write";
      t.push(placed, `Place ${key} at index ${j}.`);
    }
  }

  t.finish(new Set());
  return t.frames;
}

function fillRange(roles: BarRole[], lo: number, hi: number, role: BarRole) {
  for (let i = lo; i <= hi; i += 1) {
    if (roles[i] === "idle") roles[i] = role;
  }
}

export function mergeSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  t.push(t.idleRoles(), "Starting Merge Sort — divide, then merge sorted halves.");

  const merge = (lo: number, mid: number, hi: number) => {
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
      const leftIndex = lo + i;
      const rightIndex = mid + 1 + j;
      roles[leftIndex] = "compare";
      roles[rightIndex] = "compare";
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
      t.push(write, `Write ${t.a[k]} into position ${k}.`);
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
  };

  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  };

  sort(0, t.n - 1);
  t.finish(new Set());
  return t.frames;
}

export function quickSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  const sorted = new Set<number>();
  t.push(t.idleRoles(), "Starting Quick Sort — partition around a pivot.");

  const partition = (lo: number, hi: number): number => {
    const pivot = t.a[hi];
    let i = lo;
    const showPivot = t.idleRoles();
    t.markSorted(showPivot, sorted);
    showPivot[hi] = "pivot";
    t.push(showPivot, `Pivot is ${pivot}.`);

    for (let j = lo; j < hi; j += 1) {
      const roles = t.idleRoles();
      t.markSorted(roles, sorted);
      roles[hi] = "pivot";
      roles[j] = "compare";
      roles[i] = "key";
      t.compare(roles, `Compare ${t.a[j]} with pivot ${pivot}.`);

      if (t.a[j] < pivot) {
        t.swap(i, j);
        const swapRoles = t.idleRoles();
        t.markSorted(swapRoles, sorted);
        swapRoles[hi] = "pivot";
        swapRoles[i] = "swap";
        swapRoles[j] = "swap";
        t.push(swapRoles, `Move ${t.a[i]} left of the pivot.`);
        i += 1;
      }
    }

    t.swap(i, hi);
    const placed = t.idleRoles();
    t.markSorted(placed, sorted);
    placed[i] = "pivot";
    t.push(placed, `Pivot ${pivot} is in its final slot.`);
    sorted.add(i);
    return i;
  };

  const sort = (lo: number, hi: number) => {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.add(lo);
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  };

  sort(0, t.n - 1);
  t.finish(sorted);
  return t.frames;
}

export function heapSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  const sorted = new Set<number>();
  t.push(t.idleRoles(), "Starting Heap Sort — build a max-heap, then extract.");

  const siftDown = (start: number, end: number, building: boolean) => {
    let root = start;
    while (true) {
      const left = root * 2 + 1;
      const right = left + 1;
      if (left >= end) break;

      let largest = root;
      const roles = t.idleRoles();
      t.markSorted(roles, sorted);
      roles[root] = "key";
      roles[left] = "compare";
      if (right < end) roles[right] = "compare";

      t.compare(roles, building ? "Heapify children." : "Sift the new root down.");
      if (t.a[left] > t.a[largest]) largest = left;
      if (right < end && t.a[right] > t.a[largest]) largest = right;
      if (largest === root) break;

      t.swap(root, largest);
      const swapRoles = t.idleRoles();
      t.markSorted(swapRoles, sorted);
      swapRoles[root] = "swap";
      swapRoles[largest] = "swap";
      t.push(swapRoles, `Swap ${t.a[largest]} with ${t.a[root]}.`);
      root = largest;
    }
  };

  for (let i = Math.floor(t.n / 2) - 1; i >= 0; i -= 1) {
    siftDown(i, t.n, true);
  }
  t.push(t.idleRoles(), "Max-heap is built.");

  for (let end = t.n - 1; end > 0; end -= 1) {
    t.swap(0, end);
    const extract = t.idleRoles();
    t.markSorted(extract, sorted);
    extract[0] = "swap";
    extract[end] = "swap";
    t.push(extract, `Move max ${t.a[end]} to the end.`);
    sorted.add(end);
    siftDown(0, end, false);
  }

  t.finish(sorted);
  return t.frames;
}
