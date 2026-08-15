import type { ProbeRole, SearchFrame } from "./types";

export class SearchTrace {
  frames: SearchFrame[] = [];
  comparisons = 0;
  probes = 0;
  readonly n: number;

  constructor(
    public a: number[],
    public target: number,
  ) {
    this.n = a.length;
  }

  idleRoles(): ProbeRole[] {
    return Array.from({ length: this.n }, () => "unsearched");
  }

  markOutside(roles: ProbeRole[], lo: number, hi: number) {
    for (let i = 0; i < this.n; i += 1) {
      if (i < lo || i > hi) roles[i] = "eliminated";
    }
  }

  markRange(roles: ProbeRole[], lo: number, hi: number) {
    if (lo >= 0 && lo < this.n) roles[lo] = "range";
    if (hi >= 0 && hi < this.n && hi !== lo) roles[hi] = "range";
  }

  push(roles: ProbeRole[], hint: string) {
    this.frames.push({
      array: this.a.slice(),
      roles: roles.slice(),
      hint,
      stats: { comparisons: this.comparisons, probes: this.probes },
    });
  }

  probe(roles: ProbeRole[], hint: string) {
    this.probes += 1;
    this.comparisons += 1;
    this.push(roles, hint);
  }

  found(index: number, hint?: string) {
    const roles = this.idleRoles();
    for (let i = 0; i < this.n; i += 1) {
      if (i !== index) roles[i] = "eliminated";
    }
    roles[index] = "found";
    this.push(roles, hint ?? `Found ${this.target} at index ${index}.`);
  }

  missed(hint?: string) {
    const roles = this.idleRoles();
    for (let i = 0; i < this.n; i += 1) {
      roles[i] = "eliminated";
    }
    this.push(roles, hint ?? `${this.target} is not in the array.`);
  }
}
