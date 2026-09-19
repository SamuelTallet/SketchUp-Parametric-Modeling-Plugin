import { isCompatibleSchema } from '../schema/schemaId'
import type { Bridge } from './Bridge'
import { createMockBootstrap, MOCK_SCHEMA_STORAGE_KEY, MOCK_SCHEMA_VERSION } from './mockBootstrap'

const ONLINE_HELP_URL =
  'https://github.com/SamuelTallet/SketchUp-Parametric-Modeling-Plugin/wiki/Nodes-Editor'

/**
 * Stand-in for SketchUp when the page runs in a regular browser (`npm run dev`).
 * The schema is persisted in `localStorage` instead of the SketchUp model.
 */
export class MockBridge implements Bridge {
  ready(): void {
    console.info('[PMG] Running outside SketchUp: using the mock bridge.')

    // Deliver the payload asynchronously, like SketchUp's `execute_script` would.
    setTimeout(() => {
      window.PMG?.NodesEditor.boot(createMockBootstrap())
    }, 0)
  }

  exportModelSchema(schemaJson: string, redraw: boolean): void {
    localStorage.setItem(MOCK_SCHEMA_STORAGE_KEY, schemaJson)
    console.info(`[PMG] exportModelSchema(redraw: ${String(redraw)})`, JSON.parse(schemaJson))
  }

  importSchemaFromFile(): void {
    const input = document.createElement('input')

    input.type = 'file'
    input.accept = '.schema,application/json'

    input.addEventListener('change', () => {
      const file = input.files?.[0]

      if (!file) {
        return
      }

      void file.text().then((text) => {
        try {
          const candidate: unknown = JSON.parse(text)

          if (!isCompatibleSchema(candidate, MOCK_SCHEMA_VERSION)) {
            alert('Error: Nodes Editor schema is incompatible.')
            return
          }

          localStorage.setItem(MOCK_SCHEMA_STORAGE_KEY, text)
          // SketchUp reloads the whole dialog after an import: do the same.
          window.location.reload()
        } catch {
          alert('Error: Nodes Editor schema is invalid.')
        }
      })
    })

    input.click()
  }

  exportSchemaToFile(): void {
    const stored = localStorage.getItem(MOCK_SCHEMA_STORAGE_KEY)
    const schema: unknown = stored ? JSON.parse(stored) : createMockBootstrap().schema
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'Untitled model.schema'
    link.click()

    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  freezeParametricEntities(): void {
    console.info('[PMG] freezeParametricEntities()')
  }

  accessOnlineHelp(): void {
    window.open(ONLINE_HELP_URL, '_blank')
  }
}
