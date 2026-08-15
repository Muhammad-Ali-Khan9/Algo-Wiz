import { SearchTrace } from "./trace";
import type { SearchFrame } from "./types";

export function linearSearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  t.push(t.idleRoles(), `Starting Linear Search — scan left to right for ${target}.`);

  for (let i = 0; i < t.n; i += 1) {
    const roles = t.idleRoles();
    for (let j = 0; j < i; j += 1) roles[j] = "compared";
    roles[i] = "current";
    t.probe(roles, `Compare ${t.a[i]} at index ${i} with ${target}.`);
    if (t.a[i] === target) {
      t.found(i);
      return t.frames;
    }
  }

  t.missed();
  return t.frames;
}

export function sentinelLinearSearch(values: number[], target: number): SearchFrame[] {
  const t = new SearchTrace(values.slice(), target);
  if (t.n === 0) {
    t.missed();
    return t.frames;
  }

  const lastIndex = t.n - 1;
  const last = t.a[lastIndex];

  t.push(
    t.idleRoles(),
    `Starting Sentinel Linear Search — plant ${target} at the end so the scan cannot run past the array.`,
  );

  t.a[lastIndex] = target;
  const planted = t.idleRoles();
  planted[lastIndex] = "range";
  t.push(
    planted,
    `Sentinel: write ${target} over the last slot (was ${last}). The loop only tests equality.`,
  );

  let i = 0;
  while (true) {
    const roles = t.idleRoles();
    for (let j = 0; j < i; j += 1) roles[j] = "compared";
    roles[lastIndex] = "range";
    roles[i] = "current";
    t.probe(roles, `Compare ${t.a[i]} at index ${i} with ${target} — no bound check.`);
    if (t.a[i] === target) break;
    i += 1;
  }

  t.a[lastIndex] = last;
  const restored = t.idleRoles();
  for (let j = 0; j < i; j += 1) restored[j] = "compared";
  restored[lastIndex] = "range";
  if (i < lastIndex) restored[i] = "current";
  t.push(restored, `Restore the last slot to ${last}.`);

  if (i < lastIndex || last === target) {
    t.found(i, `Found ${target} at index ${i} — a real match, not only the sentinel.`);
    return t.frames;
  }

  t.missed(`${target} matched only the sentinel — not in the array.`);
  return t.frames;
}
