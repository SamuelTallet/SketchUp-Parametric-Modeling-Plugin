import type { Bridge } from './Bridge'

/** Forwards every call to the `sketchup` object injected by `UI::HtmlDialog`. */
export class SketchUpBridge implements Bridge {
  ready(): void {
    sketchup.ready()
  }

  exportModelSchema(schemaJson: string, redraw: boolean): void {
    sketchup.exportModelSchema(schemaJson, redraw)
  }

  importSchemaFromFile(): void {
    sketchup.importSchemaFromFile()
  }

  exportSchemaToFile(): void {
    sketchup.exportSchemaToFile()
  }

  freezeParametricEntities(): void {
    sketchup.freezeParametricEntities()
  }

  accessOnlineHelp(): void {
    sketchup.accessOnlineHelp()
  }
}
