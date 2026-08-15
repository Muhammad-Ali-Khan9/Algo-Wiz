import { randomArray } from "@/lib/sorting/random";

export function searchArray(length: number, sorted: boolean): number[] {
  const values = randomArray(length);
  return sorted ? values.slice().sort((a, b) => a - b) : values;
}

export function pickTarget(values: number[]): number {
  if (values.length === 0) return 0;
  return values[Math.floor(Math.random() * values.length)]!;
}
