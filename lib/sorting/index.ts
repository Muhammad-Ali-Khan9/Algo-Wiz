import {
  bubbleSort,
  heapSort,
  insertionSort,
  mergeSort,
  quickSort,
  selectionSort,
  shellSort,
} from "./comparison";
import { bitonicSort, introSort, stoogeSort, timSort } from "./hybrid";
import { bucketSort, countingSort, pigeonholeSort, radixSort } from "./linear";
import type { AlgorithmId, AlgorithmMeta, SortRunner } from "./types";

export { bucketSort };

export const ALGORITHM_META: AlgorithmMeta[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n)",
    space: "O(1)",
    stable: true,
    definition:
      "Bubble sort repeatedly walks adjacent pairs and swaps them when they are out of order. After each pass, the next largest value has bubbled to the end, so the unsorted prefix shrinks by one. A swapped flag can stop early when a pass makes no exchanges.",
    usage:
      "Best as a teaching example of comparisons and swaps. Use it on tiny or already-nearly-sorted lists. For real data, prefer insertion sort on small n or a guaranteed n log n method such as merge or heap sort.",
  },
  {
    id: "selection",
    name: "Selection Sort",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n²)",
    space: "O(1)",
    stable: false,
    definition:
      "Selection sort finds the smallest remaining value in the unsorted suffix and swaps it into the next slot of the sorted prefix. It always makes n − 1 passes and a linear number of writes, even when the array is already ordered.",
    usage:
      "Useful when writes are expensive and you want few swaps. It is simple to reason about, but it is rarely a production choice because every input is quadratic.",
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    worst: "O(n²)",
    average: "O(n²)",
    best: "O(n)",
    space: "O(1)",
    stable: true,
    definition:
      "Insertion sort grows a sorted prefix by taking the next key and shifting larger items one step to the right until the key drops into the correct hole. On already-sorted data it mostly just compares neighbors and moves on.",
    usage:
      "The default for small arrays, nearly-sorted streams, and the inner loop of hybrid sorts such as Timsort and introsort. Online: you can insert arriving items into a list you already keep ordered.",
  },
  {
    id: "merge",
    name: "Merge Sort",
    worst: "O(n log n)",
    average: "O(n log n)",
    best: "O(n log n)",
    space: "O(n)",
    stable: true,
    definition:
      "Merge sort splits the array in half, sorts each half recursively, then merges the two sorted runs into one. The merge walks both runs with two pointers and always writes the smaller head, so the bound does not depend on how scrambled the input was.",
    usage:
      "Choose it when you need a stable sort with a reliable n log n bound — linked lists, external sorting, and any case where worst-case spikes are unacceptable. The cost is extra linear memory for the merge buffer.",
  },
  {
    id: "quick",
    name: "Quick Sort",
    worst: "O(n²)",
    average: "O(n log n)",
    best: "O(n log n)",
    space: "O(log n)",
    stable: false,
    definition:
      "Quick sort picks a pivot, partitions so smaller values sit on the left and larger on the right, then recurses on both sides. Average partitions are balanced; a bad pivot (for example always the edge of a sorted range) yields quadratic work.",
    usage:
      "The usual in-memory sort when average speed and cache behavior matter and you can live with O(log n) stack. Shuffle, median-of-three, or introsort (fallback to heap) to avoid the sorted-input worst case.",
  },
  {
    id: "heap",
    name: "Heap Sort",
    worst: "O(n log n)",
    average: "O(n log n)",
    best: "O(n log n)",
    space: "O(1)",
    stable: false,
    definition:
      "Heap sort first builds a max-heap in place, then repeatedly swaps the root (the current largest) onto the sorted suffix and sifts the hole down. Every extract is logarithmic, so the whole run stays n log n even in the worst case.",
    usage:
      "Use it when you need a hard n log n ceiling and constant extra memory. It is typically a bit slower than well-tuned quicksort because heap sifts jump around in memory.",
  },
  {
    id: "shell",
    name: "Shell Sort",
    worst: "O(n²)",
    average: "O(n^{1.25})",
    best: "O(n log n)",
    space: "O(1)",
    stable: false,
    definition:
      "Shell sort is insertion sort over a shrinking gap: it first sorts items that are far apart, then tighter gaps, until a final gap of 1. Early gapped passes move inversions a long way, so the last insertion pass has less work.",
    usage:
      "A compact in-place option for medium arrays when you want better typical behavior than plain insertion without merge sort's extra buffer. The exact bound depends on the gap sequence.",
  },
  {
    id: "counting",
    name: "Counting Sort",
    worst: "O(n + k)",
    average: "O(n + k)",
    best: "O(n + k)",
    space: "O(k)",
    stable: true,
    definition:
      "Counting sort tallies how often each integer key in a known range 0…k appears, then writes values back from those counts (or from prefix sums, to keep stability). It does not compare items to each other.",
    usage:
      "Integers or objects keyed by small integers when k is not much larger than n — grades, ages, byte values. Do not use it on arbitrary floats or huge key ranges; the count table would dwarf the input.",
  },
  {
    id: "radix",
    name: "Radix Sort",
    worst: "O(d·(n + k))",
    average: "O(d·(n + k))",
    best: "O(d·(n + k))",
    space: "O(n + k)",
    stable: true,
    definition:
      "Radix sort groups numbers by one digit at a time. This visualizer uses least-significant-digit first: a stable bucket pass per digit, from ones toward higher places, so earlier passes stay in order.",
    usage:
      "Fixed-width integers, IDs, or strings when the digit count d is small. It beats comparison sorts on large integer arrays; it is the wrong tool for generic comparable objects with no digit structure.",
  },
  {
    id: "bucket",
    name: "Bucket Sort",
    worst: "O(n²)",
    average: "O(n + k)",
    best: "O(n + k)",
    space: "O(n + k)",
    stable: true,
    definition:
      "Bucket sort spreads values into range buckets, sorts each bucket (here with insertion), then concatenates the buckets. If values are uniform, buckets stay small and the extra insertion work stays cheap.",
    usage:
      "Uniformly distributed numbers in a known interval — hashed keys, normalized scores. If the distribution clumps into one bucket, it degrades toward quadratic insertion sort.",
  },
  {
    id: "pigeonhole",
    name: "Pigeonhole Sort",
    worst: "O(n + k)",
    average: "O(n + k)",
    best: "O(n + k)",
    space: "O(n + k)",
    stable: true,
    definition:
      "Pigeonhole sort makes one hole for every integer from min to max, drops each value into its matching hole (preserving order inside a hole), then concatenates the holes. Unlike counting sort it stores the items themselves, not just tallies.",
    usage:
      "Small integer ranges where k = max − min + 1 is close to n — ranking, exam scores, dense IDs. If the range is huge compared with n, the hole table wastes space; use a comparison sort or radix instead.",
  },
  {
    id: "tim",
    name: "Tim Sort",
    worst: "O(n log n)",
    average: "O(n log n)",
    best: "O(n)",
    space: "O(n)",
    stable: true,
    definition:
      "Timsort finds (or builds) short already-ordered runs, insertion-sorts them to a minimum run length, then merges those runs. This visualizer uses a teaching version: fixed minrun, insertion on each block, then bottom-up merges — not CPython’s galloping merge.",
    usage:
      "Python’s list.sort and Java’s Arrays.sort for objects. Excellent on real-world data that already contains runs. Prefer a simpler merge sort if you only need a stable n log n bound and do not care about nearly-sorted inputs.",
  },
  {
    id: "intro",
    name: "Intro Sort",
    worst: "O(n log n)",
    average: "O(n log n)",
    best: "O(n log n)",
    space: "O(log n)",
    stable: false,
    definition:
      "Introsort starts as quicksort, switches a partition to heapsort if recursion depth exceeds about 2⌊log₂ n⌋, and finishes tiny ranges with insertion sort. That mix keeps quicksort’s typical speed and heap sort’s worst-case ceiling.",
    usage:
      "The usual introspective sort in C++ std::sort. Use it as a drop-in upgrade over naive quicksort when you cannot tolerate a quadratic worst case. It is not stable.",
  },
  {
    id: "bitonic",
    name: "Bitonic Sort",
    worst: "O(n log² n)",
    average: "O(n log² n)",
    best: "O(n log² n)",
    space: "O(1)",
    stable: false,
    definition:
      "Bitonic sort builds bitonic sequences (one half up, the other down) and merges them with a data-independent compare-and-swap network. Merges use the greatest power of two smaller than the current length, so any n works — not only powers of two.",
    usage:
      "Designed for parallel hardware and sorting networks — GPUs, switching fabrics — where the comparison pattern is data-independent. On a sequential CPU it is slower than merge or heap sort; keep it here to see the network, not as a default in-memory sort.",
  },
  {
    id: "stooge",
    name: "Stooge Sort",
    worst: "O(n^{2.71})",
    average: "O(n^{2.71})",
    best: "O(n^{2.71})",
    space: "O(log n)",
    stable: false,
    definition:
      "Stooge sort compares the two ends of a range and swaps them if needed, then recursively sorts the first two-thirds, the last two-thirds, and the first two-thirds again. The triple recursion on 2n/3 yields about n^{log 3 / log 1.5} ≈ n^{2.71} work.",
    usage:
      "A curiosity and a warning: it is slower than bubble sort for any useful n. Step through small arrays to see the overlapping 2/3 passes. Prefer insertion or any n log n algorithm for real data — large sizes here can produce a very long trace.",
  },
];

export const RUNNERS: Record<AlgorithmId, SortRunner> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
  shell: shellSort,
  counting: countingSort,
  radix: radixSort,
  bucket: bucketSort,
  pigeonhole: pigeonholeSort,
  tim: timSort,
  intro: introSort,
  bitonic: bitonicSort,
  stooge: stoogeSort,
};

export function getAlgorithm(id: AlgorithmId): AlgorithmMeta {
  const meta = ALGORITHM_META.find((item) => item.id === id);
  if (!meta) throw new Error(`Unknown algorithm: ${id}`);
  return meta;
}
