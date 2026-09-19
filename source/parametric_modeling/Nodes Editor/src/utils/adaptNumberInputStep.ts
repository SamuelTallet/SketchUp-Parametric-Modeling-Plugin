/**
 * Makes the step of a number input match the decimals typed by the user,
 * so the spinner/arrow keys keep the precision of the current value.
 */
export function adaptNumberInputStep(input: HTMLInputElement): void {
  if (input.value === '') {
    input.step = '1'
    return
  }

  if (Number.isNaN(parseFloat(input.step))) {
    input.step = '1'
  }

  const parts = input.value.split('.')

  if (parts.length === 2 && parts[1] !== undefined) {
    const stepCandidate = 1 / parseFloat(`1${'0'.repeat(parts[1].length)}`)

    if (stepCandidate < parseFloat(input.step)) {
      input.step = String(stepCandidate)
    }
  }
}
