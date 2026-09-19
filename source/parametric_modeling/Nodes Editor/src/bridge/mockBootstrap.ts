import { emptySchema, isCompatibleSchema } from '../schema/schemaId'
import type { SchemaJson } from '../schema/SchemaJson'
import type { Bootstrap } from './Bridge'

export const MOCK_SCHEMA_VERSION = '1.0.0'

export const MOCK_SCHEMA_STORAGE_KEY = 'pmg.nodes-editor.schema'

export function readStoredSchema(): SchemaJson {
  try {
    const stored = localStorage.getItem(MOCK_SCHEMA_STORAGE_KEY)

    if (stored) {
      const candidate: unknown = JSON.parse(stored)

      if (isCompatibleSchema(candidate, MOCK_SCHEMA_VERSION)) {
        return candidate
      }
    }
  } catch {
    // Storage unavailable or corrupted: start from an empty schema.
  }

  return emptySchema(MOCK_SCHEMA_VERSION)
}

/** Data a SketchUp model would provide, for development outside SketchUp. */
export function createMockBootstrap(): Bootstrap {
  return {
    locale: navigator.language || 'en-US',
    sketchupVersion: 23,
    schemaVersion: MOCK_SCHEMA_VERSION,
    translation: {},
    materials: [
      { name: 'Polished Concrete New', display_name: 'Polished Concrete New' },
      { name: 'Wood_Cherry_Original', display_name: 'Wood Cherry Original' },
      { name: 'Metal_Corrugated_Shiny', display_name: 'Metal Corrugated Shiny' },
    ],
    layers: [
      { name: 'Layer0', display_name: 'Untagged' },
      { name: 'Walls', display_name: 'Walls' },
      { name: 'Furniture', display_name: 'Furniture' },
    ],
    schema: readStoredSchema(),
  }
}
