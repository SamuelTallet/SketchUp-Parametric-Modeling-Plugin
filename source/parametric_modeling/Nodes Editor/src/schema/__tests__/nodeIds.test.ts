import { describe, expect, it } from 'vitest'

import { NodeIdAllocator } from '../nodeIds'

describe('NodeIdAllocator', () => {
  it('starts at 1 and counts up', () => {
    const allocator = new NodeIdAllocator()

    expect(allocator.allocate()).toBe('1')
    expect(allocator.allocate()).toBe('2')
  })

  it('continues after reserved ids', () => {
    const allocator = new NodeIdAllocator()

    allocator.reserve(41)
    allocator.reserve('7')

    expect(allocator.allocate()).toBe('42')
  })

  it('ignores invalid reservations', () => {
    const allocator = new NodeIdAllocator()

    allocator.reserve('abc')

    expect(allocator.allocate()).toBe('1')
  })
})
