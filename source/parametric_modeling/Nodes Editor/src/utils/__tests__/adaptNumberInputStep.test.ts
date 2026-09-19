// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'

import { adaptNumberInputStep } from '../adaptNumberInputStep'

function input(value: string, step = ''): HTMLInputElement {
  const element = document.createElement('input')

  element.type = 'number'
  element.step = step
  element.value = value

  return element
}

describe('adaptNumberInputStep', () => {
  it('uses a step of 1 for an empty or integer value', () => {
    const empty = input('')
    const integer = input('42')

    adaptNumberInputStep(empty)
    adaptNumberInputStep(integer)

    expect(empty.step).toBe('1')
    expect(integer.step).toBe('1')
  })

  it('matches the decimals of the value', () => {
    const element = input('1.25')

    adaptNumberInputStep(element)

    expect(element.step).toBe('0.01')
  })

  it('only refines the step, never coarsens it', () => {
    const element = input('1.5', '0.001')

    adaptNumberInputStep(element)

    expect(element.step).toBe('0.001')
  })
})
