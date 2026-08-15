import { snippets, type CodeSnippets } from "@/lib/code/languages";
import type { AlgorithmId } from "./types";

type ComparisonId = Extract<
  AlgorithmId,
  "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap" | "shell"
>;

export const SORT_CODE: Record<ComparisonId, CodeSnippets> = {
  bubble: snippets(
    `void bubble_sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`,
    `void bubble_sort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    `def bubble_sort(a):
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break`,
    `static void bubbleSort(int[] a) {
    for (int i = 0; i < a.length - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < a.length - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    `function bubbleSort(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
    `static void BubbleSort(int[] a) {
    for (int i = 0; i < a.Length - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < a.Length - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                (a[j], a[j + 1]) = (a[j + 1], a[j]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  ),

  selection: snippets(
    `void selection_sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
    }
}`,
    `void selection_sort(vector<int>& a) {
    for (int i = 0; i + 1 < (int)a.size(); i++) {
        int min = i;
        for (int j = i + 1; j < (int)a.size(); j++)
            if (a[j] < a[min]) min = j;
        swap(a[i], a[min]);
    }
}`,
    `def selection_sort(a):
    for i in range(len(a) - 1):
        m = i
        for j in range(i + 1, len(a)):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]`,
    `static void selectionSort(int[] a) {
    for (int i = 0; i < a.length - 1; i++) {
        int min = i;
        for (int j = i + 1; j < a.length; j++)
            if (a[j] < a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
    }
}`,
    `function selectionSort(a) {
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++)
      if (a[j] < a[min]) min = j;
    [a[i], a[min]] = [a[min], a[i]];
  }
}`,
    `static void SelectionSort(int[] a) {
    for (int i = 0; i < a.Length - 1; i++) {
        int min = i;
        for (int j = i + 1; j < a.Length; j++)
            if (a[j] < a[min]) min = j;
        (a[i], a[min]) = (a[min], a[i]);
    }
}`,
  ),

  insertion: snippets(
    `void insertion_sort(int a[], int n) {
    for (int i = 1; i < n; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,
    `void insertion_sort(vector<int>& a) {
    for (int i = 1; i < (int)a.size(); i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,
    `def insertion_sort(a):
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key`,
    `static void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,
    `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
}`,
    `static void InsertionSort(int[] a) {
    for (int i = 1; i < a.Length; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,
  ),

  merge: snippets(
    `void merge(int a[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = a[l + i];
    for (int j = 0; j < n2; j++) R[j] = a[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2)
        a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < n1) a[k++] = L[i++];
    while (j < n2) a[k++] = R[j++];
}
void merge_sort(int a[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    merge_sort(a, l, m);
    merge_sort(a, m + 1, r);
    merge(a, l, m, r);
}`,
    `void merge(vector<int>& a, int l, int m, int r) {
    vector<int> L(a.begin() + l, a.begin() + m + 1);
    vector<int> R(a.begin() + m + 1, a.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < (int)L.size() && j < (int)R.size())
        a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < (int)L.size()) a[k++] = L[i++];
    while (j < (int)R.size()) a[k++] = R[j++];
}
void merge_sort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    merge_sort(a, l, m);
    merge_sort(a, m + 1, r);
    merge(a, l, m, r);
}`,
    `def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    i = j = 0
    out = []
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]`,
    `static void merge(int[] a, int l, int m, int r) {
    int[] L = Arrays.copyOfRange(a, l, m + 1);
    int[] R = Arrays.copyOfRange(a, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < L.length && j < R.length)
        a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < L.length) a[k++] = L[i++];
    while (j < R.length) a[k++] = R[j++];
}
static void mergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
}`,
    `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = Math.floor(a.length / 2);
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i), right.slice(j));
}`,
    `static void Merge(int[] a, int l, int m, int r) {
    int[] L = a[l..(m + 1)];
    int[] R = a[(m + 1)..(r + 1)];
    int i = 0, j = 0, k = l;
    while (i < L.Length && j < R.Length)
        a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < L.Length) a[k++] = L[i++];
    while (j < R.Length) a[k++] = R[j++];
}
static void MergeSort(int[] a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    MergeSort(a, l, m);
    MergeSort(a, m + 1, r);
    Merge(a, l, m, r);
}`,
  ),

  quick: snippets(
    `int partition(int a[], int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] < pivot) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
            i++;
        }
    }
    int t = a[i]; a[i] = a[hi]; a[hi] = t;
    return i;
}
void quick_sort(int a[], int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quick_sort(a, lo, p - 1);
    quick_sort(a, p + 1, hi);
}`,
    `int partition(vector<int>& a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) swap(a[i++], a[j]);
    swap(a[i], a[hi]);
    return i;
}
void quick_sort(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quick_sort(a, lo, p - 1);
    quick_sort(a, p + 1, hi);
}`,
    `def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)`,
    `static int partition(int[] a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] < pivot) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
            i++;
        }
    }
    int t = a[i]; a[i] = a[hi]; a[hi] = t;
    return i;
}
static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}`,
    `function quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  quickSort(a, lo, i - 1);
  quickSort(a, i + 1, hi);
}`,
    `static int Partition(int[] a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) { (a[i], a[j]) = (a[j], a[i]); i++; }
    (a[i], a[hi]) = (a[hi], a[i]);
    return i;
}
static void QuickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = Partition(a, lo, hi);
    QuickSort(a, lo, p - 1);
    QuickSort(a, p + 1, hi);
}`,
  ),

  heap: snippets(
    `void sift_down(int a[], int n, int i) {
    while (1) {
        int l = 2 * i + 1, r = l + 1, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) break;
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        i = largest;
    }
}
void heap_sort(int a[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) sift_down(a, n, i);
    for (int end = n - 1; end > 0; end--) {
        int t = a[0]; a[0] = a[end]; a[end] = t;
        sift_down(a, end, 0);
    }
}`,
    `void sift_down(vector<int>& a, int n, int i) {
    while (true) {
        int l = 2 * i + 1, r = l + 1, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) break;
        swap(a[i], a[largest]);
        i = largest;
    }
}
void heap_sort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = n / 2 - 1; i >= 0; i--) sift_down(a, n, i);
    for (int end = n - 1; end > 0; end--) {
        swap(a[0], a[end]);
        sift_down(a, end, 0);
    }
}`,
    `def sift_down(a, n, i):
    while True:
        l, r, largest = 2 * i + 1, 2 * i + 2, i
        if l < n and a[l] > a[largest]:
            largest = l
        if r < n and a[r] > a[largest]:
            largest = r
        if largest == i:
            break
        a[i], a[largest] = a[largest], a[i]
        i = largest

def heap_sort(a):
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(a, n, i)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift_down(a, end, 0)`,
    `static void siftDown(int[] a, int n, int i) {
    while (true) {
        int l = 2 * i + 1, r = l + 1, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) break;
        int t = a[i]; a[i] = a[largest]; a[largest] = t;
        i = largest;
    }
}
static void heapSort(int[] a) {
    for (int i = a.length / 2 - 1; i >= 0; i--) siftDown(a, a.length, i);
    for (int end = a.length - 1; end > 0; end--) {
        int t = a[0]; a[0] = a[end]; a[end] = t;
        siftDown(a, end, 0);
    }
}`,
    `function siftDown(a, n, i) {
  while (true) {
    const l = 2 * i + 1, r = l + 1;
    let largest = i;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest === i) break;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}
function heapSort(a) {
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) siftDown(a, a.length, i);
  for (let end = a.length - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(a, end, 0);
  }
}`,
    `static void SiftDown(int[] a, int n, int i) {
    while (true) {
        int l = 2 * i + 1, r = l + 1, largest = i;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest == i) break;
        (a[i], a[largest]) = (a[largest], a[i]);
        i = largest;
    }
}
static void HeapSort(int[] a) {
    for (int i = a.Length / 2 - 1; i >= 0; i--) SiftDown(a, a.Length, i);
    for (int end = a.Length - 1; end > 0; end--) {
        (a[0], a[end]) = (a[end], a[0]);
        SiftDown(a, end, 0);
    }
}`,
  ),

  shell: snippets(
    `void shell_sort(int a[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int key = a[i], j = i;
            while (j >= gap && a[j - gap] > key) {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = key;
        }
    }
}`,
    `void shell_sort(vector<int>& a) {
    int n = (int)a.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int key = a[i], j = i;
            while (j >= gap && a[j - gap] > key) {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = key;
        }
    }
}`,
    `def shell_sort(a):
    gap = len(a) // 2
    while gap > 0:
        for i in range(gap, len(a)):
            key, j = a[i], i
            while j >= gap and a[j - gap] > key:
                a[j] = a[j - gap]
                j -= gap
            a[j] = key
        gap //= 2`,
    `static void shellSort(int[] a) {
    for (int gap = a.length / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < a.length; i++) {
            int key = a[i], j = i;
            while (j >= gap && a[j - gap] > key) {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = key;
        }
    }
}`,
    `function shellSort(a) {
  for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < a.length; i++) {
      const key = a[i];
      let j = i;
      while (j >= gap && a[j - gap] > key) {
        a[j] = a[j - gap];
        j -= gap;
      }
      a[j] = key;
    }
  }
}`,
    `static void ShellSort(int[] a) {
    for (int gap = a.Length / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < a.Length; i++) {
            int key = a[i], j = i;
            while (j >= gap && a[j - gap] > key) {
                a[j] = a[j - gap];
                j -= gap;
            }
            a[j] = key;
        }
    }
}`,
  ),
};
