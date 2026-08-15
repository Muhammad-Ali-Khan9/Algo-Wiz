import { SearchTrace } from "./trace";
import type { ProbeRole, SearchFrame } from "./types";

function windowRoles(t: SearchTrace, lo: number, hi: number, extras?: Record<number, ProbeRole>) {
  const roles = t.idleRoles();
  t.markOutside(roles, lo, hi);
  t.markRange(roles, lo, hi);
  if (extras) {
    for (const [index, role] of Object.entries(extras)) {
      const i = Number(index);
      if (i >= 0 && i < t.n) roles[i] = role;
    }
  }
  return roles;
}

function binaryRange(
  t: SearchTrace,
  lo0: number,
  hi0: number,
): number | null {
  let lo = lo0;
  let hi = hi0;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const roles = windowRoles(t, lo, hi, { [mid]: "current" });
    t.probe(
      roles,
      `Mid ${t.a[mid]} at ${mid} vs ${t.target}. Window [${lo}…${hi}].`,
    );

    if (t.a[mid] === t.target) return mid;
    if (t.a[mid] < t.target) {
      lo = mid + 1;
      const drop = windowRoles(t, lo, hi);
      t.push(drop, `${t.a[mid]} is smaller — drop the left half.`);
    } else {
      hi = mid - 1;
      const drop = windowRoles(t, lo, hi);
      t.push(drop, `${t.a[mid]} is larger — drop the right half.`);
    }
  }

  return null;
}

export function binarySearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  t.push(
    t.idleRoles(),
    `Starting Binary Search — look for ${target} by halving the window.`,
  );
  const hit = binaryRange(t, 0, t.n - 1);
  if (hit === null) t.missed();
  else t.found(hit);
  return t.frames;
}

export function jumpSearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  if (t.n === 0) {
    t.missed();
    return t.frames;
  }

  const stepSize = Math.max(1, Math.floor(Math.sqrt(t.n)));
  t.push(
    t.idleRoles(),
    `Starting Jump Search — blocks of ${stepSize} for ${target}.`,
  );

  let prev = 0;
  let step = stepSize;

  while (true) {
    const probe = Math.min(step, t.n) - 1;
    const roles = t.idleRoles();
    t.markOutside(roles, prev, probe);
    t.markRange(roles, prev, probe);
    roles[probe] = "current";
    t.probe(roles, `Jump to index ${probe} (${t.a[probe]}) vs ${target}.`);

    if (t.a[probe] === target) {
      t.found(probe);
      return t.frames;
    }
    if (t.a[probe] >= target || step >= t.n) break;

    prev = step;
    step += stepSize;
    if (prev >= t.n) {
      t.missed();
      return t.frames;
    }
  }

  const end = Math.min(step, t.n);
  for (let i = prev; i < end; i += 1) {
    const roles = t.idleRoles();
    t.markOutside(roles, prev, end - 1);
    t.markRange(roles, prev, end - 1);
    for (let j = prev; j < i; j += 1) roles[j] = "compared";
    roles[i] = "current";
    t.probe(roles, `Linear scan ${t.a[i]} at ${i} vs ${target}.`);
    if (t.a[i] === target) {
      t.found(i);
      return t.frames;
    }
  }

  t.missed();
  return t.frames;
}

export function interpolationSearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  t.push(
    t.idleRoles(),
    `Starting Interpolation Search — probe where ${target} should sit if values are uniform.`,
  );

  let lo = 0;
  let hi = t.n - 1;

  while (lo <= hi && target >= t.a[lo] && target <= t.a[hi]) {
    if (lo === hi) {
      const roles = windowRoles(t, lo, hi, { [lo]: "current" });
      t.probe(roles, `Only index ${lo} left (${t.a[lo]}) vs ${target}.`);
      if (t.a[lo] === target) t.found(lo);
      else t.missed();
      return t.frames;
    }

    const span = t.a[hi] - t.a[lo];
    const pos =
      span === 0
        ? lo
        : lo + Math.floor(((target - t.a[lo]) * (hi - lo)) / span);
    const clamped = Math.min(hi, Math.max(lo, pos));

    const roles = windowRoles(t, lo, hi, { [clamped]: "current" });
    t.probe(
      roles,
      `Interpolate to ${clamped} (${t.a[clamped]}) vs ${target}. Window [${lo}…${hi}].`,
    );

    if (t.a[clamped] === target) {
      t.found(clamped);
      return t.frames;
    }
    if (t.a[clamped] < target) {
      lo = clamped + 1;
      t.push(windowRoles(t, lo, hi), `${t.a[clamped]} is smaller — search right.`);
    } else {
      hi = clamped - 1;
      t.push(windowRoles(t, lo, hi), `${t.a[clamped]} is larger — search left.`);
    }
  }

  t.missed();
  return t.frames;
}

export function exponentialSearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  if (t.n === 0) {
    t.missed();
    return t.frames;
  }

  t.push(
    t.idleRoles(),
    `Starting Exponential Search — double the bound, then binary-search for ${target}.`,
  );

  const first = t.idleRoles();
  first[0] = "current";
  t.probe(first, `Check index 0 (${t.a[0]}) vs ${target}.`);
  if (t.a[0] === target) {
    t.found(0);
    return t.frames;
  }

  let bound = 1;
  while (bound < t.n && t.a[bound] <= target) {
    const roles = t.idleRoles();
    t.markOutside(roles, Math.floor(bound / 2), Math.min(bound, t.n - 1));
    t.markRange(roles, Math.floor(bound / 2), Math.min(bound, t.n - 1));
    const prevBound = Math.floor(bound / 2);
    if (prevBound > 0 && prevBound < t.n) roles[prevBound] = "compared";
    roles[bound] = "current";
    t.probe(roles, `Bound ${bound} holds ${t.a[bound]} vs ${target}.`);
    if (t.a[bound] === target) {
      t.found(bound);
      return t.frames;
    }
    bound *= 2;
  }

  if (bound < t.n) {
    const roles = t.idleRoles();
    roles[bound] = "current";
    t.probe(
      roles,
      `Bound ${bound} (${t.a[bound]}) overshoots — binary-search the range.`,
    );
  }

  const lo = Math.floor(bound / 2);
  const hi = Math.min(bound, t.n - 1);
  t.push(windowRoles(t, lo, hi), `Binary-search [${lo}…${hi}].`);
  const hit = binaryRange(t, lo, hi);
  if (hit === null) t.missed();
  else t.found(hit);
  return t.frames;
}

export function fibonacciSearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  t.push(
    t.idleRoles(),
    `Starting Fibonacci Search — split with Fibonacci indexes for ${target}.`,
  );

  let fibMm2 = 0;
  let fibMm1 = 1;
  let fibM = fibMm1 + fibMm2;
  while (fibM < t.n) {
    fibMm2 = fibMm1;
    fibMm1 = fibM;
    fibM = fibMm1 + fibMm2;
  }

  let offset = -1;
  while (fibM > 1) {
    const i = Math.min(offset + fibMm2, t.n - 1);
    const lo = offset + 1;
    const hi = t.n - 1;
    const roles = windowRoles(t, lo, hi, { [i]: "current" });
    t.probe(roles, `Fib index ${i} (${t.a[i]}) vs ${target}.`);

    if (t.a[i] === target) {
      t.found(i);
      return t.frames;
    }
    if (t.a[i] < target) {
      fibM = fibMm1;
      fibMm1 = fibMm2;
      fibMm2 = fibM - fibMm1;
      offset = i;
      t.push(
        windowRoles(t, offset + 1, hi),
        `${t.a[i]} is smaller — drop the left Fibonacci slice.`,
      );
    } else {
      fibM = fibMm2;
      fibMm1 = fibMm1 - fibMm2;
      fibMm2 = fibM - fibMm1;
      t.push(
        windowRoles(t, lo, i - 1),
        `${t.a[i]} is larger — drop the right Fibonacci slice.`,
      );
    }
  }

  const last = offset + 1;
  if (fibMm1 && last < t.n) {
    const roles = t.idleRoles();
    t.markOutside(roles, last, last);
    t.markRange(roles, last, last);
    roles[last] = "current";
    t.probe(roles, `Check remaining index ${last} (${t.a[last]}) vs ${target}.`);
    if (t.a[last] === target) {
      t.found(last);
      return t.frames;
    }
  }

  t.missed();
  return t.frames;
}

export function ternarySearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  t.push(
    t.idleRoles(),
    `Starting Ternary Search — split the window into thirds for ${target}.`,
  );

  let lo = 0;
  let hi = t.n - 1;

  while (lo <= hi) {
    const third = Math.floor((hi - lo) / 3);
    const mid1 = lo + third;
    const mid2 = hi - third;

    const roles = windowRoles(t, lo, hi, { [mid1]: "current", [mid2]: "current" });
    t.probe(
      roles,
      `Thirds ${t.a[mid1]} @ ${mid1} and ${t.a[mid2]} @ ${mid2} vs ${target}.`,
    );
    if (mid1 !== mid2) t.comparisons += 1;

    if (t.a[mid1] === target) {
      t.found(mid1);
      return t.frames;
    }
    if (t.a[mid2] === target) {
      t.found(mid2);
      return t.frames;
    }

    if (target < t.a[mid1]) {
      hi = mid1 - 1;
      t.push(windowRoles(t, lo, hi), `${target} is left of the first third.`);
    } else if (target > t.a[mid2]) {
      lo = mid2 + 1;
      t.push(windowRoles(t, lo, hi), `${target} is right of the last third.`);
    } else {
      lo = mid1 + 1;
      hi = mid2 - 1;
      t.push(windowRoles(t, lo, hi), `${target} sits in the middle third.`);
    }
  }

  t.missed();
  return t.frames;
}
