import { snippets, type CodeSnippets } from "@/lib/code/languages";
import type { AlgorithmId } from "./types";

export const SORT_CODE_HYBRID: Record<
  Extract<AlgorithmId, "tim" | "intro" | "bitonic" | "stooge">,
  CodeSnippets
> = {
  tim: snippets(
    `void insertion_range(int a[], int lo, int hi) {
    for (int i = lo + 1; i <= hi; i++) {
        int key = a[i], j = i - 1;
        while (j >= lo && a[j] > key) { a[j + 1] = a[j]; j--; }
        a[j + 1] = key;
    }
}
void tim_sort(int a[], int n) {
    int run = n < 8 ? n : 8;
    for (int i = 0; i < n; i += run)
        insertion_range(a, i, i + run - 1 < n - 1 ? i + run - 1 : n - 1);
    for (int size = run; size < n; size *= 2)
        for (int left = 0; left < n; left += size * 2) {
            int mid = left + size - 1;
            int right = left + size * 2 - 1 < n - 1 ? left + size * 2 - 1 : n - 1;
            if (mid < right) merge(a, left, mid, right);
        }
}`,
    `void tim_sort(vector<int>& a) {
    int n = (int)a.size(), run = min(8, n);
    for (int i = 0; i < n; i += run)
        insertion_range(a, i, min(i + run - 1, n - 1));
    for (int size = run; size < n; size *= 2)
        for (int left = 0; left < n; left += size * 2) {
            int mid = left + size - 1;
            int right = min(left + size * 2 - 1, n - 1);
            if (mid < right) merge(a, left, mid, right);
        }
}`,
    `def insertion_range(a, lo, hi):
    for i in range(lo + 1, hi + 1):
        key, j = a[i], i - 1
        while j >= lo and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key

def tim_sort(a):
    n, run = len(a), min(8, len(a))
    for start in range(0, n, run):
        insertion_range(a, start, min(start + run - 1, n - 1))
    size = run
    while size < n:
        for left in range(0, n, size * 2):
            mid, right = left + size - 1, min(left + size * 2 - 1, n - 1)
            if mid < right:
                a[left:right + 1] = sorted(a[left:right + 1])
        size *= 2`,
    `static void timSort(int[] a) {
    int n = a.length, run = Math.min(8, n);
    for (int i = 0; i < n; i += run)
        insertionRange(a, i, Math.min(i + run - 1, n - 1));
    for (int size = run; size < n; size *= 2)
        for (int left = 0; left < n; left += size * 2) {
            int mid = left + size - 1;
            int right = Math.min(left + size * 2 - 1, n - 1);
            if (mid < right) merge(a, left, mid, right);
        }
}`,
    `function timSort(a) {
  const n = a.length, run = Math.min(8, n);
  for (let i = 0; i < n; i += run) insertionRange(a, i, Math.min(i + run - 1, n - 1));
  for (let size = run; size < n; size *= 2) {
    for (let left = 0; left < n; left += size * 2) {
      const mid = left + size - 1;
      const right = Math.min(left + size * 2 - 1, n - 1);
      if (mid < right) mergeRange(a, left, mid, right);
    }
  }
}`,
    `static void TimSort(int[] a) {
    int n = a.Length, run = Math.Min(8, n);
    for (int i = 0; i < n; i += run)
        InsertionRange(a, i, Math.Min(i + run - 1, n - 1));
    for (int size = run; size < n; size *= 2)
        for (int left = 0; left < n; left += size * 2) {
            int mid = left + size - 1;
            int right = Math.Min(left + size * 2 - 1, n - 1);
            if (mid < right) Merge(a, left, mid, right);
        }
}`,
  ),

  intro: snippets(
    `void intro_sort(int a[], int lo, int hi, int depth) {
    int size = hi - lo + 1;
    if (size <= 1) return;
    if (size <= 8) { insertion_range(a, lo, hi); return; }
    if (depth <= 0) { heap_sort_range(a, lo, hi); return; }
    int p = partition(a, lo, hi);
    intro_sort(a, lo, p - 1, depth - 1);
    intro_sort(a, p + 1, hi, depth - 1);
}
void intro_sort(int a[], int n) {
    int depth = 0, t = n;
    while (t > 1) { t /= 2; depth++; }
    intro_sort(a, 0, n - 1, 2 * depth);
}`,
    `void intro_sort(vector<int>& a, int lo, int hi, int depth) {
    int size = hi - lo + 1;
    if (size <= 1) return;
    if (size <= 8) { insertion_range(a, lo, hi); return; }
    if (depth <= 0) { heap_sort_range(a, lo, hi); return; }
    int p = partition(a, lo, hi);
    intro_sort(a, lo, p - 1, depth - 1);
    intro_sort(a, p + 1, hi, depth - 1);
}`,
    `def intro_sort(a, lo=0, hi=None, depth=None):
    if hi is None:
        hi = len(a) - 1
        depth = 2 * (len(a).bit_length() - 1)
    size = hi - lo + 1
    if size <= 1:
        return
    if size <= 8:
        insertion_range(a, lo, hi); return
    if depth <= 0:
        heap_sort_range(a, lo, hi); return
    p = partition(a, lo, hi)
    intro_sort(a, lo, p - 1, depth - 1)
    intro_sort(a, p + 1, hi, depth - 1)`,
    `static void introSort(int[] a, int lo, int hi, int depth) {
    int size = hi - lo + 1;
    if (size <= 1) return;
    if (size <= 8) { insertionRange(a, lo, hi); return; }
    if (depth <= 0) { heapSortRange(a, lo, hi); return; }
    int p = partition(a, lo, hi);
    introSort(a, lo, p - 1, depth - 1);
    introSort(a, p + 1, hi, depth - 1);
}`,
    `function introSort(a, lo = 0, hi = a.length - 1, depth = 2 * Math.floor(Math.log2(a.length))) {
  const size = hi - lo + 1;
  if (size <= 1) return;
  if (size <= 8) { insertionRange(a, lo, hi); return; }
  if (depth <= 0) { heapSortRange(a, lo, hi); return; }
  const p = partition(a, lo, hi);
  introSort(a, lo, p - 1, depth - 1);
  introSort(a, p + 1, hi, depth - 1);
}`,
    `static void IntroSort(int[] a, int lo, int hi, int depth) {
    int size = hi - lo + 1;
    if (size <= 1) return;
    if (size <= 8) { InsertionRange(a, lo, hi); return; }
    if (depth <= 0) { HeapSortRange(a, lo, hi); return; }
    int p = Partition(a, lo, hi);
    IntroSort(a, lo, p - 1, depth - 1);
    IntroSort(a, p + 1, hi, depth - 1);
}`,
  ),

  bitonic: snippets(
    `int gp2(int n) { int k = 1; while (k < n) k <<= 1; return k >> 1; }
void bitonic_merge(int a[], int lo, int n, int up) {
    if (n <= 1) return;
    int step = gp2(n);
    for (int i = lo; i < lo + n - step; i++)
        if ((up && a[i] > a[i + step]) || (!up && a[i] < a[i + step])) {
            int t = a[i]; a[i] = a[i + step]; a[i + step] = t;
        }
    bitonic_merge(a, lo, step, up);
    bitonic_merge(a, lo + step, n - step, up);
}
void bitonic_sort(int a[], int lo, int n, int up) {
    if (n <= 1) return;
    int mid = n / 2;
    bitonic_sort(a, lo, mid, !up);
    bitonic_sort(a, lo + mid, n - mid, up);
    bitonic_merge(a, lo, n, up);
}`,
    `int gp2(int n) { int k = 1; while (k < n) k <<= 1; return k >> 1; }
void bitonic_merge(vector<int>& a, int lo, int n, bool up) {
    if (n <= 1) return;
    int step = gp2(n);
    for (int i = lo; i < lo + n - step; i++)
        if ((up && a[i] > a[i + step]) || (!up && a[i] < a[i + step]))
            swap(a[i], a[i + step]);
    bitonic_merge(a, lo, step, up);
    bitonic_merge(a, lo + step, n - step, up);
}
void bitonic_sort(vector<int>& a, int lo, int n, bool up = true) {
    if (n <= 1) return;
    int mid = n / 2;
    bitonic_sort(a, lo, mid, !up);
    bitonic_sort(a, lo + mid, n - mid, up);
    bitonic_merge(a, lo, n, up);
}`,
    `def gp2(n):
    k = 1
    while k < n:
        k <<= 1
    return k >> 1

def bitonic_merge(a, lo, n, up):
    if n <= 1:
        return
    step = gp2(n)
    for i in range(lo, lo + n - step):
        if (up and a[i] > a[i + step]) or (not up and a[i] < a[i + step]):
            a[i], a[i + step] = a[i + step], a[i]
    bitonic_merge(a, lo, step, up)
    bitonic_merge(a, lo + step, n - step, up)

def bitonic_sort(a, lo=0, n=None, up=True):
    if n is None:
        n = len(a)
    if n <= 1:
        return
    mid = n // 2
    bitonic_sort(a, lo, mid, not up)
    bitonic_sort(a, lo + mid, n - mid, up)
    bitonic_merge(a, lo, n, up)`,
    `static int gp2(int n) { int k = 1; while (k < n) k <<= 1; return k >> 1; }
static void bitonicMerge(int[] a, int lo, int n, boolean up) {
    if (n <= 1) return;
    int step = gp2(n);
    for (int i = lo; i < lo + n - step; i++)
        if ((up && a[i] > a[i + step]) || (!up && a[i] < a[i + step])) {
            int t = a[i]; a[i] = a[i + step]; a[i + step] = t;
        }
    bitonicMerge(a, lo, step, up);
    bitonicMerge(a, lo + step, n - step, up);
}
static void bitonicSort(int[] a, int lo, int n, boolean up) {
    if (n <= 1) return;
    int mid = n / 2;
    bitonicSort(a, lo, mid, !up);
    bitonicSort(a, lo + mid, n - mid, up);
    bitonicMerge(a, lo, n, up);
}`,
    `function gp2(n) {
  let k = 1;
  while (k < n) k <<= 1;
  return k >> 1;
}
function bitonicMerge(a, lo, n, up) {
  if (n <= 1) return;
  const step = gp2(n);
  for (let i = lo; i < lo + n - step; i++)
    if ((up && a[i] > a[i + step]) || (!up && a[i] < a[i + step]))
      [a[i], a[i + step]] = [a[i + step], a[i]];
  bitonicMerge(a, lo, step, up);
  bitonicMerge(a, lo + step, n - step, up);
}
function bitonicSort(a, lo = 0, n = a.length, up = true) {
  if (n <= 1) return;
  const mid = Math.floor(n / 2);
  bitonicSort(a, lo, mid, !up);
  bitonicSort(a, lo + mid, n - mid, up);
  bitonicMerge(a, lo, n, up);
}`,
    `static int Gp2(int n) { int k = 1; while (k < n) k <<= 1; return k >> 1; }
static void BitonicMerge(int[] a, int lo, int n, bool up) {
    if (n <= 1) return;
    int step = Gp2(n);
    for (int i = lo; i < lo + n - step; i++)
        if ((up && a[i] > a[i + step]) || (!up && a[i] < a[i + step]))
            (a[i], a[i + step]) = (a[i + step], a[i]);
    BitonicMerge(a, lo, step, up);
    BitonicMerge(a, lo + step, n - step, up);
}
static void BitonicSort(int[] a, int lo, int n, bool up) {
    if (n <= 1) return;
    int mid = n / 2;
    BitonicSort(a, lo, mid, !up);
    BitonicSort(a, lo + mid, n - mid, up);
    BitonicMerge(a, lo, n, up);
}`,
  ),

  stooge: snippets(
    `void stooge_sort(int a[], int lo, int hi) {
    if (lo >= hi) return;
    if (a[lo] > a[hi]) {
        int t = a[lo]; a[lo] = a[hi]; a[hi] = t;
    }
    int len = hi - lo + 1;
    if (len < 3) return;
    int third = len / 3;
    stooge_sort(a, lo, hi - third);
    stooge_sort(a, lo + third, hi);
    stooge_sort(a, lo, hi - third);
}`,
    `void stooge_sort(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    if (a[lo] > a[hi]) swap(a[lo], a[hi]);
    int len = hi - lo + 1;
    if (len < 3) return;
    int third = len / 3;
    stooge_sort(a, lo, hi - third);
    stooge_sort(a, lo + third, hi);
    stooge_sort(a, lo, hi - third);
}`,
    `def stooge_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return
    if a[lo] > a[hi]:
        a[lo], a[hi] = a[hi], a[lo]
    length = hi - lo + 1
    if length < 3:
        return
    third = length // 3
    stooge_sort(a, lo, hi - third)
    stooge_sort(a, lo + third, hi)
    stooge_sort(a, lo, hi - third)`,
    `static void stoogeSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    if (a[lo] > a[hi]) {
        int t = a[lo]; a[lo] = a[hi]; a[hi] = t;
    }
    int len = hi - lo + 1;
    if (len < 3) return;
    int third = len / 3;
    stoogeSort(a, lo, hi - third);
    stoogeSort(a, lo + third, hi);
    stoogeSort(a, lo, hi - third);
}`,
    `function stoogeSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  if (a[lo] > a[hi]) [a[lo], a[hi]] = [a[hi], a[lo]];
  const len = hi - lo + 1;
  if (len < 3) return;
  const third = Math.floor(len / 3);
  stoogeSort(a, lo, hi - third);
  stoogeSort(a, lo + third, hi);
  stoogeSort(a, lo, hi - third);
}`,
    `static void StoogeSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    if (a[lo] > a[hi]) (a[lo], a[hi]) = (a[hi], a[lo]);
    int len = hi - lo + 1;
    if (len < 3) return;
    int third = len / 3;
    StoogeSort(a, lo, hi - third);
    StoogeSort(a, lo + third, hi);
    StoogeSort(a, lo, hi - third);
}`,
  ),
};
