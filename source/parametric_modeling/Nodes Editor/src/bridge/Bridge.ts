import type { SchemaJson } from '../schema/SchemaJson'

export interface MaterialInfo {
  name: string
  display_name: string
}

export interface LayerInfo {
  name: string
  display_name: string
}

/** Payload sent by the host (SketchUp or the dev mock) in answer to `ready()`. */
export interface Bootstrap {
  locale: string
  sketchupVersion: number
  schemaVersion: string
  translation: Record<string, string>
  materials: MaterialInfo[]
  layers: LayerInfo[]
  schema: SchemaJson
}

/**
 * Action callbacks registered by the Ruby side with `UI::HtmlDialog#add_action_callback`.
 * SketchUp exposes them as methods of the global `sketchup` object.
 */
export interface SketchUpCallbacks {
  /** The page is loaded and waits for its bootstrap payload. */
  ready(): void
  /** Saves the schema in the active model and optionally redraws the parametric entities. */
  exportModelSchema(schemaJson: string, redraw: boolean): void
  importSchemaFromFile(): void
  exportSchemaToFile(): void
  freezeParametricEntities(): void
  accessOnlineHelp(): void
}

export type Bridge = SketchUpCallbacks
