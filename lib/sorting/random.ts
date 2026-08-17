export function randomArray(length: number, min = 8, max = 96): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function patternedArray(length: number, min = 8, max = 96): number[] {
  const span = max - min + 1;
  return Array.from({ length }, (_, i) => min + ((i * 47 + 13) % span));
}

export function arrayMax(values: number[]): number {
  return values.reduce((max, value) => (value > max ? value : max), 1);
}
