export function delayForSpeed(speed: number) {
  return Math.round(480 * Math.pow(0.955, speed));
}

export const PRELOAD_FADE_MS = 450;
export const BOOT_HOLD_MS = 900;
