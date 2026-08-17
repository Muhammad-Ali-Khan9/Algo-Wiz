import { Trace } from "./trace";
import type { AuxBucket, SortFrame } from "./types";

function bucketsFrom(lists: number[][], labels?: string[]): AuxBucket[] {
  return lists.map((values, index) => ({
    label: labels?.[index] ?? String(index),
    values,
  }));
}

export function countingSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  const max = t.a.reduce((m, v) => (v > m ? v : m), 0);
  const min = t.a.reduce((m, v) => (v < m ? v : m), max);
  const offset = min;
  const span = max - min + 1;
  const count = Array.from({ length: span }, () => 0);

  t.push(t.idleRoles(), `Starting Counting Sort — tally values from ${min} to ${max}.`, {
    auxBuckets: bucketsFrom(count.map((c) => Array.from({ length: c }, () => 1))),
  });

  for (let i = 0; i < t.n; i += 1) {
    count[t.a[i] - offset] += 1;
    const roles = t.idleRoles();
    roles[i] = "key";
    t.push(roles, `Count ${t.a[i]} → ${count[t.a[i] - offset]}.`, {
      auxBuckets: count.map((c, idx) => ({
        label: String(idx + offset),
        values: Array.from({ length: c }, () => idx + offset),
      })),
    });
  }

  for (let i = 1; i < span; i += 1) {
    count[i] += count[i - 1];
  }
  t.push(t.idleRoles(), "Prefix sums turn counts into output indexes.", {
    auxBuckets: count.map((c, idx) => ({
      label: String(idx + offset),
      values: [c],
    })),
  });

  const output = Array.from({ length: t.n }, () => 0);
  for (let i = t.n - 1; i >= 0; i -= 1) {
    const value = t.a[i];
    const bucket = value - offset;
    count[bucket] -= 1;
    const pos = count[bucket];
    output[pos] = value;
    t.writes += 1;
    const roles = t.idleRoles();
    roles[i] = "key";
    t.push(roles, `Place ${value} into output slot ${pos}.`, {
      auxBuckets: [
        {
          label: "output",
          values: output.filter((v) => v !== 0 || output.indexOf(v) <= pos),
        },
      ],
    });
  }

  for (let i = 0; i < t.n; i += 1) {
    t.writeAt(i, output[i]);
    const roles = t.idleRoles();
    roles[i] = "write";
    t.push(roles, `Copy ${output[i]} back to the array.`);
  }

  t.finish(new Set());
  return t.frames;
}

export function radixSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  const max = t.a.reduce((m, v) => (v > m ? v : m), 0);
  t.push(t.idleRoles(), "Starting Radix Sort — LSD, one digit at a time.");

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const place = exp === 1 ? "ones" : exp === 10 ? "tens" : "hundreds";
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    t.push(t.idleRoles(), `Bucket by the ${place} digit.`, {
      auxBuckets: bucketsFrom(buckets),
    });

    for (let i = 0; i < t.n; i += 1) {
      const digit = Math.floor(t.a[i] / exp) % 10;
      buckets[digit].push(t.a[i]);
      const roles = t.idleRoles();
      roles[i] = "key";
      t.push(roles, `${t.a[i]} → bucket ${digit} (${place}).`, {
        auxBuckets: bucketsFrom(buckets),
      });
    }

    let k = 0;
    for (let d = 0; d < 10; d += 1) {
      for (const value of buckets[d]) {
        t.writeAt(k, value);
        const roles = t.idleRoles();
        roles[k] = "write";
        t.push(roles, `Collect ${value} from bucket ${d}.`, {
          auxBuckets: bucketsFrom(buckets),
        });
        k += 1;
      }
    }
  }

  t.finish(new Set());
  return t.frames;
}

function insertionOn(list: number[]): number[] {
  const a = list.slice();
  for (let i = 1; i < a.length; i += 1) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j -= 1;
    }
    a[j + 1] = key;
  }
  return a;
}

export function bucketSort(values: number[], bucketCount = 8): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  const count = Math.max(1, Math.floor(bucketCount));
  const min = t.a.reduce((m, v) => (v < m ? v : m), t.a[0]);
  const max = t.a.reduce((m, v) => (v > m ? v : m), t.a[0]);
  const span = Math.max(1, max - min + 1);
  const buckets: number[][] = Array.from({ length: count }, () => []);

  t.push(t.idleRoles(), `Starting Bucket Sort — ${count} range buckets.`, {
    auxBuckets: bucketsFrom(buckets),
  });

  for (let i = 0; i < t.n; i += 1) {
    const ratio = (t.a[i] - min) / span;
    const index = Math.min(count - 1, Math.floor(ratio * count));
    buckets[index].push(t.a[i]);
    const roles = t.idleRoles();
    roles[i] = "key";
    t.push(roles, `${t.a[i]} → bucket ${index}.`, {
      auxBuckets: bucketsFrom(buckets),
    });
  }

  for (let b = 0; b < count; b += 1) {
    if (buckets[b].length === 0) continue;
    buckets[b] = insertionOn(buckets[b]);
    t.push(t.idleRoles(), `Insertion-sort bucket ${b}.`, {
      auxBuckets: bucketsFrom(buckets),
    });
  }

  let k = 0;
  for (let b = 0; b < count; b += 1) {
    for (const value of buckets[b]) {
      t.writeAt(k, value);
      const roles = t.idleRoles();
      roles[k] = "write";
      t.push(roles, `Collect ${value} from bucket ${b}.`, {
        auxBuckets: bucketsFrom(buckets),
      });
      k += 1;
    }
  }

  t.finish(new Set());
  return t.frames;
}

export function pigeonholeSort(values: number[]): SortFrame[] {
  const t = new Trace(values.slice());
  if (t.n === 0) return t.frames;

  const min = t.a.reduce((m, v) => (v < m ? v : m), t.a[0]);
  const max = t.a.reduce((m, v) => (v > m ? v : m), t.a[0]);
  const span = max - min + 1;
  const holes: number[][] = Array.from({ length: span }, () => []);
  const holeLabels = holes.map((_, i) => String(i + min));

  t.push(
    t.idleRoles(),
    `Starting Pigeonhole Sort — ${span} holes from ${min} to ${max}.`,
    { auxBuckets: bucketsFrom(holes, holeLabels) },
  );

  for (let i = 0; i < t.n; i += 1) {
    const hole = t.a[i] - min;
    holes[hole].push(t.a[i]);
    const roles = t.idleRoles();
    roles[i] = "key";
    t.push(roles, `${t.a[i]} → hole ${t.a[i]}.`, {
      auxBuckets: bucketsFrom(holes, holeLabels),
    });
  }

  let k = 0;
  for (let h = 0; h < span; h += 1) {
    for (const value of holes[h]) {
      t.writeAt(k, value);
      const roles = t.idleRoles();
      roles[k] = "write";
      t.push(roles, `Collect ${value} from hole ${value}.`, {
        auxBuckets: bucketsFrom(holes, holeLabels),
      });
      k += 1;
    }
  }

  t.finish(new Set());
  return t.frames;
}
