import { describe, expect, it } from 'vitest'

import { classNames } from '../classNames'
import { degreesToRadians } from '../degreesToRadians'
import { kebabCase } from '../kebabCase'

describe('kebabCase', () => {
  it('turns node names into class names', () => {
    expect(kebabCase('Draw box')).toBe('draw-box')
    expect(kebabCase('Push/Pull')).toBe('push-pull')
    expect(kebabCase(' Get points ')).toBe('get-points')
  })
})

describe('classNames', () => {
  it('joins truthy names only', () => {
    expect(classNames('node', false, null, undefined, 'selected')).toBe('node selected')
    expect(classNames()).toBe('')
  })
})

describe('degreesToRadians', () => {
  it('converts', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI)
    expect(degreesToRadians(0)).toBe(0)
  })
})
