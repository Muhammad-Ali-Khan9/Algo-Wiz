import { linearSearch, sentinelLinearSearch } from "./linear";
import {
  binarySearch,
  exponentialSearch,
  fibonacciSearch,
  interpolationSearch,
  jumpSearch,
  ternarySearch,
} from "./ordered";
import type { SearchId, SearchMeta, SearchRunner } from "./types";
import { SEARCH_CODE } from "./snippets";

export const SEARCH_META: SearchMeta[] = [
  {
    id: "linear",
    name: "Linear Search",
    worst: "O(n)",
    average: "O(n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: false,
    definition:
      "Linear search walks the array from left to right and compares each value to the target. It stops at the first match, or after the last index if the target is missing. The array does not need to be ordered.",
    usage:
      "Unsorted lists, tiny n, or a single scan you will not repeat. For a sorted array of any useful size, binary or interpolation search does far fewer probes.",
  },
  {
    id: "binary",
    name: "Binary Search",
    worst: "O(log n)",
    average: "O(log n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: true,
    definition:
      "Binary search keeps a low–high window on a sorted array, probes the midpoint, and throws away the half that cannot contain the target. Each comparison halves the remaining range.",
    usage:
      "The default for sorted arrays, search-in-rotated-array variants, and “first true” predicates on a monotonic space. Do not use it on unsorted data — the discarded half would be wrong.",
  },
  {
    id: "jump",
    name: "Jump Search",
    worst: "O(√n)",
    average: "O(√n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: true,
    definition:
      "Jump search hops forward by √n on a sorted array until the block can contain the target, then linear-scans inside that block. It trades fewer jumps for a short sequential finish.",
    usage:
      "Sorted arrays when jumping is cheaper than random access, or as a stepping stone between linear and binary. Binary search is still faster in ordinary RAM.",
  },
  {
    id: "interpolation",
    name: "Interpolation Search",
    worst: "O(n)",
    average: "O(log log n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: true,
    definition:
      "Interpolation search assumes values are fairly uniform and probes where the target would sit on a straight line between low and high, instead of always using the midpoint. Clustered or adversarial keys degrade toward linear.",
    usage:
      "Uniform integer keys in a known range — IDs, timestamps. Prefer binary search when the distribution is unknown or skewed.",
  },
  {
    id: "exponential",
    name: "Exponential Search",
    worst: "O(log n)",
    average: "O(log n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: true,
    definition:
      "Exponential search doubles an upper bound (1, 2, 4, …) until it overshoots the target, then binary-searches the last interval. Finding the range is logarithmic in the hit index, not only in n.",
    usage:
      "Unbounded or very large sorted streams where you expect an early hit, and unbounded binary search on infinite or unknown-length sequences.",
  },
  {
    id: "fibonacci",
    name: "Fibonacci Search",
    worst: "O(log n)",
    average: "O(log n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: true,
    definition:
      "Fibonacci search splits a sorted array using Fibonacci numbers instead of a midpoint. It only subtracts indexes, which used to matter when division was expensive. The window still shrinks logarithmically.",
    usage:
      "Mostly historical or didactic. Use binary search unless you are on hardware where division is costly and subtraction is not.",
  },
  {
    id: "ternary",
    name: "Ternary Search",
    worst: "O(log₃ n)",
    average: "O(log₃ n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: true,
    definition:
      "Ternary search probes two points that split a sorted window into thirds, then keeps the third that can hold the target. It does more comparisons per step than binary search, so it is usually slower on arrays.",
    usage:
      "Better known for unimodal functions (find a peak) than for arrays. On lists, binary search almost always wins; keep ternary here to see the two-cut window.",
  },
  {
    id: "sentinel",
    name: "Sentinel Linear Search",
    worst: "O(n)",
    average: "O(n)",
    best: "O(1)",
    space: "O(1)",
    sortedInput: false,
    definition:
      "Sentinel linear search copies the target into the last slot, then scans with only an equality test — the loop cannot run off the end because the sentinel is guaranteed to match. After the scan it restores the last value and checks whether the hit was real or only the planted sentinel.",
    usage:
      "A classic micro-optimization of linear search when the extra bound check per step is expensive and you can overwrite one slot. Same O(n) as ordinary linear search; skip it when the array must stay read-only.",
  },
];

export const SEARCH_RUNNERS: Record<SearchId, SearchRunner> = {
  linear: linearSearch,
  binary: binarySearch,
  jump: jumpSearch,
  interpolation: interpolationSearch,
  exponential: exponentialSearch,
  fibonacci: fibonacciSearch,
  ternary: ternarySearch,
  sentinel: sentinelLinearSearch,
};

export function getSearch(id: SearchId): SearchMeta {
  const meta = SEARCH_META.find((item) => item.id === id);
  if (!meta) throw new Error(`Unknown search: ${id}`);
  return { ...meta, code: SEARCH_CODE[id] };
}

export function needsSorted(id: SearchId): boolean {
  return getSearch(id).sortedInput;
}
