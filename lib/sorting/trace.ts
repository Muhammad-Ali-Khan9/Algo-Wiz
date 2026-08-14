import type { AuxBucket, BarRole, SortFrame } from "./types";

export class Trace {
  frames: SortFrame[] = [];
  comparisons = 0;
  writes = 0;
  readonly n: number;

  constructor(public a: number[]) {
    this.n = a.length;
  }

  idleRoles(): BarRole[] {
    return Array.from({ length: this.n }, () => "idle");
  }

  push(
    roles: BarRole[],
    hint: string,
    extra?: { auxBuckets?: AuxBucket[] },
  ): void {
    this.frames.push({
      array: this.a.slice(),
      roles: roles.slice(),
      hint,
      stats: { comparisons: this.comparisons, writes: this.writes },
      auxBuckets: extra?.auxBuckets?.map((bucket) => ({
        label: bucket.label,
        values: bucket.values.slice(),
      })),
    });
  }

  compare(roles: BarRole[], hint: string, extra?: { auxBuckets?: AuxBucket[] }) {
    this.comparisons += 1;
    this.push(roles, hint, extra);
  }

  writeAt(index: number, value: number) {
    this.a[index] = value;
    this.writes += 1;
  }

  swap(i: number, j: number) {
    if (i === j) return;
    const tmp = this.a[i];
    this.a[i] = this.a[j];
    this.a[j] = tmp;
    this.writes += 2;
  }

  markSorted(roles: BarRole[], sorted: Set<number>) {
    for (const index of sorted) {
      roles[index] = "sorted";
    }
  }

  finish(sorted: Set<number>, hint = "Array is sorted.") {
    const roles = this.idleRoles();
    for (let i = 0; i < this.n; i += 1) {
      roles[i] = "sorted";
      sorted.add(i);
    }
    this.push(roles, hint);
  }
}
