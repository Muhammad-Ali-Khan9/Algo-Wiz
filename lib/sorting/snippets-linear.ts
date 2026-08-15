import { snippets, type CodeSnippets } from "@/lib/code/languages";
import type { AlgorithmId } from "./types";

export const SORT_CODE_LINEAR: Record<
  Extract<AlgorithmId, "counting" | "radix" | "bucket" | "pigeonhole">,
  CodeSnippets
> = {
  counting: snippets(
    `void counting_sort(int a[], int n) {
    int mn = a[0], mx = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < mn) mn = a[i];
        if (a[i] > mx) mx = a[i];
    }
    int k = mx - mn + 1, count[k], out[n];
    for (int i = 0; i < k; i++) count[i] = 0;
    for (int i = 0; i < n; i++) count[a[i] - mn]++;
    for (int i = 1; i < k; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        count[a[i] - mn]--;
        out[count[a[i] - mn]] = a[i];
    }
    for (int i = 0; i < n; i++) a[i] = out[i];
}`,
    `void counting_sort(vector<int>& a) {
    int mn = *min_element(a.begin(), a.end());
    int mx = *max_element(a.begin(), a.end());
    vector<int> count(mx - mn + 1), out(a.size());
    for (int x : a) count[x - mn]++;
    for (size_t i = 1; i < count.size(); i++) count[i] += count[i - 1];
    for (int i = (int)a.size() - 1; i >= 0; i--)
        out[--count[a[i] - mn]] = a[i];
    a = out;
}`,
    `def counting_sort(a):
    mn, mx = min(a), max(a)
    count = [0] * (mx - mn + 1)
    for x in a:
        count[x - mn] += 1
    i = 0
    for v, c in enumerate(count):
        for _ in range(c):
            a[i] = v + mn
            i += 1`,
    `static void countingSort(int[] a) {
    int mn = a[0], mx = a[0];
    for (int x : a) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
    int[] count = new int[mx - mn + 1], out = new int[a.length];
    for (int x : a) count[x - mn]++;
    for (int i = 1; i < count.length; i++) count[i] += count[i - 1];
    for (int i = a.length - 1; i >= 0; i--)
        out[--count[a[i] - mn]] = a[i];
    System.arraycopy(out, 0, a, 0, a.length);
}`,
    `function countingSort(a) {
  const mn = Math.min(...a), mx = Math.max(...a);
  const count = Array(mx - mn + 1).fill(0);
  const out = Array(a.length);
  for (const x of a) count[x - mn]++;
  for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
  for (let i = a.length - 1; i >= 0; i--)
    out[--count[a[i] - mn]] = a[i];
  for (let i = 0; i < a.length; i++) a[i] = out[i];
}`,
    `static void CountingSort(int[] a) {
    int mn = a.Min(), mx = a.Max();
    int[] count = new int[mx - mn + 1], output = new int[a.Length];
    foreach (int x in a) count[x - mn]++;
    for (int i = 1; i < count.Length; i++) count[i] += count[i - 1];
    for (int i = a.Length - 1; i >= 0; i--)
        output[--count[a[i] - mn]] = a[i];
    Array.Copy(output, a, a.Length);
}`,
  ),

  radix: snippets(
    `void counting_by_digit(int a[], int n, int exp) {
    int out[n], count[10] = {0};
    for (int i = 0; i < n; i++) count[(a[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int d = (a[i] / exp) % 10;
        out[--count[d]] = a[i];
    }
    for (int i = 0; i < n; i++) a[i] = out[i];
}
void radix_sort(int a[], int n) {
    int mx = a[0];
    for (int i = 1; i < n; i++) if (a[i] > mx) mx = a[i];
    for (int exp = 1; mx / exp > 0; exp *= 10)
        counting_by_digit(a, n, exp);
}`,
    `void counting_by_digit(vector<int>& a, int exp) {
    vector<int> out(a.size()), count(10);
    for (int x : a) count[(x / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = (int)a.size() - 1; i >= 0; i--)
        out[--count[(a[i] / exp) % 10]] = a[i];
    a = out;
}
void radix_sort(vector<int>& a) {
    int mx = *max_element(a.begin(), a.end());
    for (int exp = 1; mx / exp > 0; exp *= 10)
        counting_by_digit(a, exp);
}`,
    `def counting_by_digit(a, exp):
    count, out = [0] * 10, [0] * len(a)
    for x in a:
        count[(x // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for x in reversed(a):
        d = (x // exp) % 10
        count[d] -= 1
        out[count[d]] = x
    a[:] = out

def radix_sort(a):
    mx = max(a)
    exp = 1
    while mx // exp > 0:
        counting_by_digit(a, exp)
        exp *= 10`,
    `static void countingByDigit(int[] a, int exp) {
    int[] out = new int[a.length], count = new int[10];
    for (int x : a) count[(x / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = a.length - 1; i >= 0; i--)
        out[--count[(a[i] / exp) % 10]] = a[i];
    System.arraycopy(out, 0, a, 0, a.length);
}
static void radixSort(int[] a) {
    int mx = a[0];
    for (int x : a) mx = Math.max(mx, x);
    for (int exp = 1; mx / exp > 0; exp *= 10)
        countingByDigit(a, exp);
}`,
    `function countingByDigit(a, exp) {
  const count = Array(10).fill(0), out = Array(a.length);
  for (const x of a) count[Math.floor(x / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = a.length - 1; i >= 0; i--)
    out[--count[Math.floor(a[i] / exp) % 10]] = a[i];
  for (let i = 0; i < a.length; i++) a[i] = out[i];
}
function radixSort(a) {
  const mx = Math.max(...a);
  for (let exp = 1; Math.floor(mx / exp) > 0; exp *= 10)
    countingByDigit(a, exp);
}`,
    `static void CountingByDigit(int[] a, int exp) {
    int[] output = new int[a.Length], count = new int[10];
    foreach (int x in a) count[(x / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = a.Length - 1; i >= 0; i--)
        output[--count[(a[i] / exp) % 10]] = a[i];
    Array.Copy(output, a, a.Length);
}
static void RadixSort(int[] a) {
    int mx = a.Max();
    for (int exp = 1; mx / exp > 0; exp *= 10)
        CountingByDigit(a, exp);
}`,
  ),

  bucket: snippets(
    `void insertion(int a[], int n) {
    for (int i = 1; i < n; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
        a[j + 1] = key;
    }
}
void bucket_sort(int a[], int n, int buckets) {
    int mn = a[0], mx = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < mn) mn = a[i];
        if (a[i] > mx) mx = a[i];
    }
    int span = mx - mn + 1;
    int counts[buckets];
    for (int b = 0; b < buckets; b++) counts[b] = 0;
    for (int i = 0; i < n; i++) {
        int idx = (a[i] - mn) * buckets / span;
        if (idx >= buckets) idx = buckets - 1;
        counts[idx]++;
    }
    int *bkt[buckets], fill[buckets];
    for (int b = 0; b < buckets; b++) {
        bkt[b] = malloc(counts[b] * sizeof(int));
        fill[b] = 0;
    }
    for (int i = 0; i < n; i++) {
        int idx = (a[i] - mn) * buckets / span;
        if (idx >= buckets) idx = buckets - 1;
        bkt[idx][fill[idx]++] = a[i];
    }
    int k = 0;
    for (int b = 0; b < buckets; b++) {
        insertion(bkt[b], fill[b]);
        for (int i = 0; i < fill[b]; i++) a[k++] = bkt[b][i];
        free(bkt[b]);
    }
}`,
    `void bucket_sort(vector<int>& a, int buckets = 8) {
    int mn = *min_element(a.begin(), a.end());
    int mx = *max_element(a.begin(), a.end());
    int span = max(1, mx - mn + 1);
    vector<vector<int>> b(buckets);
    for (int x : a) {
        int i = min(buckets - 1, (x - mn) * buckets / span);
        b[i].push_back(x);
    }
    a.clear();
    for (auto& bucket : b) {
        sort(bucket.begin(), bucket.end());
        a.insert(a.end(), bucket.begin(), bucket.end());
    }
}`,
    `def bucket_sort(a, buckets=8):
    mn, mx = min(a), max(a)
    span = max(1, mx - mn + 1)
    b = [[] for _ in range(buckets)]
    for x in a:
        i = min(buckets - 1, (x - mn) * buckets // span)
        b[i].append(x)
    i = 0
    for bucket in b:
        bucket.sort()
        for x in bucket:
            a[i] = x
            i += 1`,
    `static void bucketSort(int[] a, int buckets) {
    int mn = a[0], mx = a[0];
    for (int x : a) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
    int span = Math.max(1, mx - mn + 1);
    List<Integer>[] b = new ArrayList[buckets];
    for (int i = 0; i < buckets; i++) b[i] = new ArrayList<>();
    for (int x : a) {
        int i = Math.min(buckets - 1, (x - mn) * buckets / span);
        b[i].add(x);
    }
    int k = 0;
    for (List<Integer> bucket : b) {
        Collections.sort(bucket);
        for (int x : bucket) a[k++] = x;
    }
}`,
    `function bucketSort(a, buckets = 8) {
  const mn = Math.min(...a), mx = Math.max(...a);
  const span = Math.max(1, mx - mn + 1);
  const b = Array.from({ length: buckets }, () => []);
  for (const x of a) {
    const i = Math.min(buckets - 1, Math.floor(((x - mn) * buckets) / span));
    b[i].push(x);
  }
  let k = 0;
  for (const bucket of b) {
    bucket.sort((x, y) => x - y);
    for (const x of bucket) a[k++] = x;
  }
}`,
    `static void BucketSort(int[] a, int buckets = 8) {
    int mn = a.Min(), mx = a.Max();
    int span = Math.Max(1, mx - mn + 1);
    var b = Enumerable.Range(0, buckets).Select(_ => new List<int>()).ToArray();
    foreach (int x in a) {
        int i = Math.Min(buckets - 1, (x - mn) * buckets / span);
        b[i].Add(x);
    }
    int k = 0;
    foreach (var bucket in b) {
        bucket.Sort();
        foreach (int x in bucket) a[k++] = x;
    }
}`,
  ),

  pigeonhole: snippets(
    `void pigeonhole_sort(int a[], int n) {
    int mn = a[0], mx = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < mn) mn = a[i];
        if (a[i] > mx) mx = a[i];
    }
    int span = mx - mn + 1;
    int* hole_sz = calloc(span, sizeof(int));
    for (int i = 0; i < n; i++) hole_sz[a[i] - mn]++;
    int k = 0;
    for (int h = 0; h < span; h++)
        while (hole_sz[h]--) a[k++] = h + mn;
    free(hole_sz);
}`,
    `void pigeonhole_sort(vector<int>& a) {
    int mn = *min_element(a.begin(), a.end());
    int mx = *max_element(a.begin(), a.end());
    vector<vector<int>> holes(mx - mn + 1);
    for (int x : a) holes[x - mn].push_back(x);
    int k = 0;
    for (auto& hole : holes)
        for (int x : hole) a[k++] = x;
}`,
    `def pigeonhole_sort(a):
    mn, mx = min(a), max(a)
    holes = [[] for _ in range(mx - mn + 1)]
    for x in a:
        holes[x - mn].append(x)
    i = 0
    for hole in holes:
        for x in hole:
            a[i] = x
            i += 1`,
    `static void pigeonholeSort(int[] a) {
    int mn = a[0], mx = a[0];
    for (int x : a) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
    List<Integer>[] holes = new ArrayList[mx - mn + 1];
    for (int i = 0; i < holes.length; i++) holes[i] = new ArrayList<>();
    for (int x : a) holes[x - mn].add(x);
    int k = 0;
    for (List<Integer> hole : holes)
        for (int x : hole) a[k++] = x;
}`,
    `function pigeonholeSort(a) {
  const mn = Math.min(...a), mx = Math.max(...a);
  const holes = Array.from({ length: mx - mn + 1 }, () => []);
  for (const x of a) holes[x - mn].push(x);
  let k = 0;
  for (const hole of holes)
    for (const x of hole) a[k++] = x;
}`,
    `static void PigeonholeSort(int[] a) {
    int mn = a.Min(), mx = a.Max();
    var holes = Enumerable.Range(0, mx - mn + 1).Select(_ => new List<int>()).ToArray();
    foreach (int x in a) holes[x - mn].Add(x);
    int k = 0;
    foreach (var hole in holes)
        foreach (int x in hole) a[k++] = x;
}`,
  ),
};
