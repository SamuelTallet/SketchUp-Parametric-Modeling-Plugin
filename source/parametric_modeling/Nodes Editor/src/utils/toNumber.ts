import { isValidNumber } from './isValidNumber'

/** Converts a control value or a connected input value to a number, or returns the fallback. */
export function toNumber(value: unknown, fallback = 0): number {
  return isValidNumber(value) ? parseFloat(String(value)) : fallback
}
