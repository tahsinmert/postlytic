export function scaleScore(value: number, max: number): number {
  const score = Math.round((value / max) * 100);
  return Math.max(0, Math.min(100, score));
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
