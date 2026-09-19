/** Rounds to a number of decimals, compensating floating point noise like `0.1 + 0.2`. */
export function roundTo(value: number, decimals = 6): number {
  const factor = 10 ** decimals

  return Math.round((value + Number.EPSILON) * factor) / factor
}
