import { snippets, type CodeSnippets } from "@/lib/code/languages";
import type { SearchId } from "./types";

export const SEARCH_CODE: Record<SearchId, CodeSnippets> = {
  linear: snippets(
    `int linear_search(int a[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (a[i] == target) return i;
    return -1;
}`,
    `int linear_search(const vector<int>& a, int target) {
    for (int i = 0; i < (int)a.size(); i++)
        if (a[i] == target) return i;
    return -1;
}`,
    `def linear_search(a, target):
    for i, x in enumerate(a):
        if x == target:
            return i
    return -1`,
    `static int linearSearch(int[] a, int target) {
    for (int i = 0; i < a.length; i++)
        if (a[i] == target) return i;
    return -1;
}`,
    `function linearSearch(a, target) {
  for (let i = 0; i < a.length; i++)
    if (a[i] === target) return i;
  return -1;
}`,
    `static int LinearSearch(int[] a, int target) {
    for (int i = 0; i < a.Length; i++)
        if (a[i] == target) return i;
    return -1;
}`,
  ),

  binary: snippets(
    `int binary_search(int a[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    `int binary_search(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    `def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    `static int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    `function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    `static int BinarySearch(int[] a, int target) {
    int lo = 0, hi = a.Length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
  ),

  jump: snippets(
    `int jump_search(int a[], int n, int target) {
    int step = (int)sqrt(n), prev = 0;
    while (a[(step < n ? step : n) - 1] < target) {
        prev = step;
        step += (int)sqrt(n);
        if (prev >= n) return -1;
    }
    while (a[prev] < target) {
        if (++prev == (step < n ? step : n)) return -1;
    }
    return a[prev] == target ? prev : -1;
}`,
    `int jump_search(const vector<int>& a, int target) {
    int n = (int)a.size(), step = (int)sqrt(n), prev = 0;
    while (a[min(step, n) - 1] < target) {
        prev = step; step += (int)sqrt(n);
        if (prev >= n) return -1;
    }
    while (a[prev] < target)
        if (++prev == min(step, n)) return -1;
    return a[prev] == target ? prev : -1;
}`,
    `import math
def jump_search(a, target):
    n, step, prev = len(a), int(math.sqrt(len(a))), 0
    while a[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    while a[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    return prev if a[prev] == target else -1`,
    `static int jumpSearch(int[] a, int target) {
    int n = a.length, step = (int)Math.sqrt(n), prev = 0;
    while (a[Math.min(step, n) - 1] < target) {
        prev = step; step += (int)Math.sqrt(n);
        if (prev >= n) return -1;
    }
    while (a[prev] < target)
        if (++prev == Math.min(step, n)) return -1;
    return a[prev] == target ? prev : -1;
}`,
    `function jumpSearch(a, target) {
  const n = a.length;
  let step = Math.floor(Math.sqrt(n)), prev = 0;
  while (a[Math.min(step, n) - 1] < target) {
    prev = step; step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (a[prev] < target)
    if (++prev === Math.min(step, n)) return -1;
  return a[prev] === target ? prev : -1;
}`,
    `static int JumpSearch(int[] a, int target) {
    int n = a.Length, step = (int)Math.Sqrt(n), prev = 0;
    while (a[Math.Min(step, n) - 1] < target) {
        prev = step; step += (int)Math.Sqrt(n);
        if (prev >= n) return -1;
    }
    while (a[prev] < target)
        if (++prev == Math.Min(step, n)) return -1;
    return a[prev] == target ? prev : -1;
}`,
  ),

  interpolation: snippets(
    `int interpolation_search(int a[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi && target >= a[lo] && target <= a[hi]) {
        if (lo == hi) return a[lo] == target ? lo : -1;
        int span = a[hi] - a[lo];
        int pos = span == 0 ? lo : lo + (int)(((long)(target - a[lo]) * (hi - lo)) / span);
        if (a[pos] == target) return pos;
        if (a[pos] < target) lo = pos + 1;
        else hi = pos - 1;
    }
    return -1;
}`,
    `int interpolation_search(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi && target >= a[lo] && target <= a[hi]) {
        if (lo == hi) return a[lo] == target ? lo : -1;
        int span = a[hi] - a[lo];
        int pos = span == 0 ? lo : lo + (int)((long long)(target - a[lo]) * (hi - lo) / span);
        if (a[pos] == target) return pos;
        if (a[pos] < target) lo = pos + 1;
        else hi = pos - 1;
    }
    return -1;
}`,
    `def interpolation_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi and a[lo] <= target <= a[hi]:
        if lo == hi:
            return lo if a[lo] == target else -1
        span = a[hi] - a[lo]
        pos = lo if span == 0 else lo + (target - a[lo]) * (hi - lo) // span
        if a[pos] == target:
            return pos
        if a[pos] < target:
            lo = pos + 1
        else:
            hi = pos - 1
    return -1`,
    `static int interpolationSearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi && target >= a[lo] && target <= a[hi]) {
        if (lo == hi) return a[lo] == target ? lo : -1;
        int span = a[hi] - a[lo];
        int pos = span == 0 ? lo : lo + (int)((long)(target - a[lo]) * (hi - lo) / span);
        if (a[pos] == target) return pos;
        if (a[pos] < target) lo = pos + 1;
        else hi = pos - 1;
    }
    return -1;
}`,
    `function interpolationSearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi && target >= a[lo] && target <= a[hi]) {
    if (lo === hi) return a[lo] === target ? lo : -1;
    const span = a[hi] - a[lo];
    const pos = span === 0 ? lo : lo + Math.floor(((target - a[lo]) * (hi - lo)) / span);
    if (a[pos] === target) return pos;
    if (a[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
    `static int InterpolationSearch(int[] a, int target) {
    int lo = 0, hi = a.Length - 1;
    while (lo <= hi && target >= a[lo] && target <= a[hi]) {
        if (lo == hi) return a[lo] == target ? lo : -1;
        int span = a[hi] - a[lo];
        int pos = span == 0 ? lo : lo + (int)((long)(target - a[lo]) * (hi - lo) / span);
        if (a[pos] == target) return pos;
        if (a[pos] < target) lo = pos + 1;
        else hi = pos - 1;
    }
    return -1;
}`,
  ),

  exponential: snippets(
    `int exponential_search(int a[], int n, int target) {
    if (n == 0) return -1;
    if (a[0] == target) return 0;
    int bound = 1;
    while (bound < n && a[bound] <= target) bound *= 2;
    int lo = bound / 2, hi = bound < n ? bound : n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    `int exponential_search(const vector<int>& a, int target) {
    int n = (int)a.size();
    if (n == 0) return -1;
    if (a[0] == target) return 0;
    int bound = 1;
    while (bound < n && a[bound] <= target) bound *= 2;
    return binary_search_range(a, target, bound / 2, min(bound, n - 1));
}`,
    `def exponential_search(a, target):
    if not a:
        return -1
    if a[0] == target:
        return 0
    bound = 1
    while bound < len(a) and a[bound] <= target:
        bound *= 2
    return binary_search_range(a, target, bound // 2, min(bound, len(a) - 1))`,
    `static int exponentialSearch(int[] a, int target) {
    if (a.length == 0) return -1;
    if (a[0] == target) return 0;
    int bound = 1;
    while (bound < a.length && a[bound] <= target) bound *= 2;
    return binarySearchRange(a, target, bound / 2, Math.min(bound, a.length - 1));
}`,
    `function exponentialSearch(a, target) {
  if (!a.length) return -1;
  if (a[0] === target) return 0;
  let bound = 1;
  while (bound < a.length && a[bound] <= target) bound *= 2;
  return binarySearchRange(a, target, Math.floor(bound / 2), Math.min(bound, a.length - 1));
}`,
    `static int ExponentialSearch(int[] a, int target) {
    if (a.Length == 0) return -1;
    if (a[0] == target) return 0;
    int bound = 1;
    while (bound < a.Length && a[bound] <= target) bound *= 2;
    return BinarySearchRange(a, target, bound / 2, Math.Min(bound, a.Length - 1));
}`,
  ),

  fibonacci: snippets(
    `int fibonacci_search(int a[], int n, int target) {
    int f2 = 0, f1 = 1, f = f1 + f2;
    while (f < n) { f2 = f1; f1 = f; f = f1 + f2; }
    int offset = -1;
    while (f > 1) {
        int i = offset + f2 < n - 1 ? offset + f2 : n - 1;
        if (a[i] < target) { f = f1; f1 = f2; f2 = f - f1; offset = i; }
        else if (a[i] > target) { f = f2; f1 = f1 - f2; f2 = f - f1; }
        else return i;
    }
    if (f1 && offset + 1 < n && a[offset + 1] == target) return offset + 1;
    return -1;
}`,
    `int fibonacci_search(const vector<int>& a, int target) {
    int n = (int)a.size(), f2 = 0, f1 = 1, f = 1, offset = -1;
    while (f < n) { f2 = f1; f1 = f; f = f1 + f2; }
    while (f > 1) {
        int i = min(offset + f2, n - 1);
        if (a[i] < target) { f = f1; f1 = f2; f2 = f - f1; offset = i; }
        else if (a[i] > target) { f = f2; f1 = f1 - f2; f2 = f - f1; }
        else return i;
    }
    return (f1 && offset + 1 < n && a[offset + 1] == target) ? offset + 1 : -1;
}`,
    `def fibonacci_search(a, target):
    n = len(a)
    f2, f1, f = 0, 1, 1
    while f < n:
        f2, f1, f = f1, f, f1 + f2
    offset = -1
    while f > 1:
        i = min(offset + f2, n - 1)
        if a[i] < target:
            f, f1, f2, offset = f1, f2, f1 - f2, i
        elif a[i] > target:
            f, f1, f2 = f2, f1 - f2, f2 - (f1 - f2)
        else:
            return i
    if f1 and offset + 1 < n and a[offset + 1] == target:
        return offset + 1
    return -1`,
    `static int fibonacciSearch(int[] a, int target) {
    int n = a.length, f2 = 0, f1 = 1, f = 1, offset = -1;
    while (f < n) { f2 = f1; f1 = f; f = f1 + f2; }
    while (f > 1) {
        int i = Math.min(offset + f2, n - 1);
        if (a[i] < target) { f = f1; f1 = f2; f2 = f - f1; offset = i; }
        else if (a[i] > target) { f = f2; f1 = f1 - f2; f2 = f - f1; }
        else return i;
    }
    return (f1 != 0 && offset + 1 < n && a[offset + 1] == target) ? offset + 1 : -1;
}`,
    `function fibonacciSearch(a, target) {
  const n = a.length;
  let f2 = 0, f1 = 1, f = 1, offset = -1;
  while (f < n) { f2 = f1; f1 = f; f = f1 + f2; }
  while (f > 1) {
    const i = Math.min(offset + f2, n - 1);
    if (a[i] < target) { f = f1; f1 = f2; f2 = f - f1; offset = i; }
    else if (a[i] > target) { f = f2; f1 = f1 - f2; f2 = f - f1; }
    else return i;
  }
  return f1 && offset + 1 < n && a[offset + 1] === target ? offset + 1 : -1;
}`,
    `static int FibonacciSearch(int[] a, int target) {
    int n = a.Length, f2 = 0, f1 = 1, f = 1, offset = -1;
    while (f < n) { f2 = f1; f1 = f; f = f1 + f2; }
    while (f > 1) {
        int i = Math.Min(offset + f2, n - 1);
        if (a[i] < target) { f = f1; f1 = f2; f2 = f - f1; offset = i; }
        else if (a[i] > target) { f = f2; f1 = f1 - f2; f2 = f - f1; }
        else return i;
    }
    return f1 != 0 && offset + 1 < n && a[offset + 1] == target ? offset + 1 : -1;
}`,
  ),

  ternary: snippets(
    `int ternary_search(int a[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int third = (hi - lo) / 3;
        int m1 = lo + third, m2 = hi - third;
        if (a[m1] == target) return m1;
        if (a[m2] == target) return m2;
        if (target < a[m1]) hi = m1 - 1;
        else if (target > a[m2]) lo = m2 + 1;
        else { lo = m1 + 1; hi = m2 - 1; }
    }
    return -1;
}`,
    `int ternary_search(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int third = (hi - lo) / 3;
        int m1 = lo + third, m2 = hi - third;
        if (a[m1] == target) return m1;
        if (a[m2] == target) return m2;
        if (target < a[m1]) hi = m1 - 1;
        else if (target > a[m2]) lo = m2 + 1;
        else { lo = m1 + 1; hi = m2 - 1; }
    }
    return -1;
}`,
    `def ternary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        third = (hi - lo) // 3
        m1, m2 = lo + third, hi - third
        if a[m1] == target:
            return m1
        if a[m2] == target:
            return m2
        if target < a[m1]:
            hi = m1 - 1
        elif target > a[m2]:
            lo = m2 + 1
        else:
            lo, hi = m1 + 1, m2 - 1
    return -1`,
    `static int ternarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int third = (hi - lo) / 3;
        int m1 = lo + third, m2 = hi - third;
        if (a[m1] == target) return m1;
        if (a[m2] == target) return m2;
        if (target < a[m1]) hi = m1 - 1;
        else if (target > a[m2]) lo = m2 + 1;
        else { lo = m1 + 1; hi = m2 - 1; }
    }
    return -1;
}`,
    `function ternarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const third = Math.floor((hi - lo) / 3);
    const m1 = lo + third, m2 = hi - third;
    if (a[m1] === target) return m1;
    if (a[m2] === target) return m2;
    if (target < a[m1]) hi = m1 - 1;
    else if (target > a[m2]) lo = m2 + 1;
    else { lo = m1 + 1; hi = m2 - 1; }
  }
  return -1;
}`,
    `static int TernarySearch(int[] a, int target) {
    int lo = 0, hi = a.Length - 1;
    while (lo <= hi) {
        int third = (hi - lo) / 3;
        int m1 = lo + third, m2 = hi - third;
        if (a[m1] == target) return m1;
        if (a[m2] == target) return m2;
        if (target < a[m1]) hi = m1 - 1;
        else if (target > a[m2]) lo = m2 + 1;
        else { lo = m1 + 1; hi = m2 - 1; }
    }
    return -1;
}`,
  ),

  sentinel: snippets(
    `int sentinel_linear_search(int a[], int n, int target) {
    if (n == 0) return -1;
    int last = a[n - 1];
    a[n - 1] = target;
    int i = 0;
    while (a[i] != target) i++;
    a[n - 1] = last;
    if (i < n - 1 || last == target) return i;
    return -1;
}`,
    `int sentinel_linear_search(vector<int>& a, int target) {
    if (a.empty()) return -1;
    int n = (int)a.size(), last = a.back();
    a.back() = target;
    int i = 0;
    while (a[i] != target) i++;
    a.back() = last;
    return (i < n - 1 || last == target) ? i : -1;
}`,
    `def sentinel_linear_search(a, target):
    if not a:
        return -1
    last = a[-1]
    a[-1] = target
    i = 0
    while a[i] != target:
        i += 1
    a[-1] = last
    return i if i < len(a) - 1 or last == target else -1`,
    `static int sentinelLinearSearch(int[] a, int target) {
    if (a.length == 0) return -1;
    int last = a[a.length - 1];
    a[a.length - 1] = target;
    int i = 0;
    while (a[i] != target) i++;
    a[a.length - 1] = last;
    return (i < a.length - 1 || last == target) ? i : -1;
}`,
    `function sentinelLinearSearch(a, target) {
  if (!a.length) return -1;
  const last = a[a.length - 1];
  a[a.length - 1] = target;
  let i = 0;
  while (a[i] !== target) i++;
  a[a.length - 1] = last;
  return i < a.length - 1 || last === target ? i : -1;
}`,
    `static int SentinelLinearSearch(int[] a, int target) {
    if (a.Length == 0) return -1;
    int last = a[^1];
    a[^1] = target;
    int i = 0;
    while (a[i] != target) i++;
    a[^1] = last;
    return i < a.Length - 1 || last == target ? i : -1;
}`,
  ),
};
