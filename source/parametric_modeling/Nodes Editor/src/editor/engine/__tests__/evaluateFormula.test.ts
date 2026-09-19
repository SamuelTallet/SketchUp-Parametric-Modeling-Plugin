import { describe, expect, it } from 'vitest'

import { evaluateFormula, type FormulaVariables } from '../evaluateFormula'

const variables: FormulaVariables = {
  a: 2.4,
  b: 3,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  g: 0,
  h: 0,
  i: 0,
  j: 0,
  k: 0,
  l: 0,
}

describe('evaluateFormula', () => {
  it('evaluates arithmetic on variables', () => {
    expect(evaluateFormula('round(a) * b', variables)).toBe(6)
    expect(evaluateFormula('a + b', variables)).toBeCloseTo(5.4)
  })

  it('exposes the math functions and pi', () => {
    expect(evaluateFormula('max(a, b) + min(a, b)', variables)).toBeCloseTo(5.4)
    expect(evaluateFormula('sqrt(b * b)', variables)).toBe(3)
    expect(evaluateFormula('cos(deg(180))', variables)).toBe(-1)
    expect(evaluateFormula('pi', variables)).toBe(Math.PI)
    expect(evaluateFormula('floor(a) + ceil(a)', variables)).toBe(5)
  })

  it('returns 0 for empty, invalid or non-numeric formulas', () => {
    expect(evaluateFormula('', variables)).toBe(0)
    expect(evaluateFormula('a +', variables)).toBe(0)
    expect(evaluateFormula('"text"', variables)).toBe(0)
    expect(evaluateFormula('1 / 0', variables)).toBe(0)
    expect(evaluateFormula('unknownName', variables)).toBe(0)
  })
})
