import { afterEach, describe, expect, it, vi } from 'vitest'

import { controlEvents } from '../../controls/controlEvents'
import { createNode } from '../registry'

describe('preview computations', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Number outputs its control value as a number, 0 when empty', () => {
    expect(createNode('Number', { number: '2.5' }).data({})).toEqual({ number: 2.5 })
    expect(createNode('Number').data({})).toEqual({ number: 0 })
  })

  it('Add sums its inputs without floating point noise and previews the result', () => {
    const node = createNode('Add', { number1: '0.1', number2: '0.2' })

    expect(node.data({})).toEqual({ number: 0.3 })
    expect(node.values.preview).toBe(0.3)
  })

  it('prefers a connected value over the control value', () => {
    const node = createNode('Add', { number1: '1', number2: '0.5' })

    expect(node.data({ number1: [5] })).toEqual({ number: 5.5 })
  })

  it('updates the preview silently (no editor-level change event)', () => {
    const listener = vi.fn()
    const unsubscribe = controlEvents.subscribe(listener)

    createNode('Add', { number1: '1', number2: '2' }).data({})
    unsubscribe()

    expect(listener).not.toHaveBeenCalled()
  })

  it('Subtract and Multiply', () => {
    expect(createNode('Subtract', { number1: '1', number2: '0.9' }).data({})).toEqual({
      number: 0.1,
    })
    expect(createNode('Multiply', { number1: '3', number2: '4' }).data({})).toEqual({
      number: 12,
    })
  })

  it('Divide gives quotient and remainder, with a divisor of 1 by default', () => {
    expect(createNode('Divide', { dividend: '7', divisor: '2' }).data({})).toEqual({
      quotient: 3.5,
      remainder: 1,
    })
    expect(createNode('Divide', { dividend: '7' }).data({})).toEqual({
      quotient: 7,
      remainder: 0,
    })
  })

  it('Calculate evaluates its formula with the variable inputs', () => {
    const node = createNode('Calculate', { formula: 'round(a) * b', a: '2.4' })

    expect(node.data({ b: [3] })).toEqual({ number: 6 })
  })

  it('Calculate yields 0 for a missing or broken formula', () => {
    expect(createNode('Calculate').data({})).toEqual({ number: 0 })
    expect(createNode('Calculate', { formula: 'a +' }).data({})).toEqual({ number: 0 })
  })
})
