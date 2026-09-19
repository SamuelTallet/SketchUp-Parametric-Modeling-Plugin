const NUMBER_PATTERN = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/

/** Whether a value is a number or a string holding a plain decimal number. */
export function isValidNumber(value: unknown): boolean {
  if (typeof value === 'number') {
    return !Number.isNaN(value)
  }

  return typeof value === 'string' && NUMBER_PATTERN.test(value)
}
