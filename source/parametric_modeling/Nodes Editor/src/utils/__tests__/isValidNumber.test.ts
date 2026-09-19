import { describe, expect, it } from 'vitest'

import { isValidNumber } from '../isValidNumber'
import { roundTo } from '../roundTo'
import { toNumber } from '../toNumber'

describe('isValidNumber', () => {
  it('accepts numbers and decimal strings', () => {
    expect(isValidNumber(5)).toBe(true)
    expect(isValidNumber(-0.5)).toBe(true)
    expect(isValidNumber('42')).toBe(true)
    expect(isValidNumber('-3.25')).toBe(true)
    expect(isValidNumber('0')).toBe(true)
  })

  it('rejects everything else', () => {
    expect(isValidNumber(undefined)).toBe(false)
    expect(isValidNumber('')).toBe(false)
    expect(isValidNumber('1.')).toBe(false)
    expect(isValidNumber('01')).toBe(false)
    expect(isValidNumber('1e3')).toBe(false)
    expect(isValidNumber(Number.NaN)).toBe(false)
    expect(isValidNumber(true)).toBe(false)
  })
})

describe('toNumber', () => {
  it('converts valid values and falls back otherwise', () => {
    expect(toNumber('2.5')).toBe(2.5)
    expect(toNumber(7)).toBe(7)
    expect(toNumber(undefined)).toBe(0)
    expect(toNumber('abc', 1)).toBe(1)
  })
})

describe('roundTo', () => {
  it('cleans floating point noise', () => {
    expect(roundTo(0.1 + 0.2)).toBe(0.3)
    expect(roundTo(1.23456789, 3)).toBe(1.235)
  })
})
