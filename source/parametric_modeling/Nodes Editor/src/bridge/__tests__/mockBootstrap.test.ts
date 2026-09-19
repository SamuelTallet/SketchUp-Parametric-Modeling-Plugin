// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'

import { emptySchema } from '../../schema/schemaId'
import { createMockBootstrap, MOCK_SCHEMA_STORAGE_KEY, readStoredSchema } from '../mockBootstrap'

describe('readStoredSchema', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts empty', () => {
    expect(readStoredSchema()).toEqual(emptySchema('1.0.0'))
  })

  it('returns a stored compatible schema', () => {
    const schema = {
      id: 'ParametricModeling@1.0.0',
      nodes: {
        '1': { id: 1, data: {}, inputs: {}, outputs: {}, position: [1, 2], name: 'Number' },
      },
    }

    localStorage.setItem(MOCK_SCHEMA_STORAGE_KEY, JSON.stringify(schema))

    expect(readStoredSchema()).toEqual(schema)
    expect(createMockBootstrap().schema).toEqual(schema)
  })

  it('falls back to empty on corrupted or incompatible storage', () => {
    localStorage.setItem(MOCK_SCHEMA_STORAGE_KEY, '{not json')
    expect(readStoredSchema()).toEqual(emptySchema('1.0.0'))

    localStorage.setItem(
      MOCK_SCHEMA_STORAGE_KEY,
      JSON.stringify({ id: 'ParametricModeling@0.1.0', nodes: {} })
    )
    expect(readStoredSchema()).toEqual(emptySchema('1.0.0'))
  })
})
