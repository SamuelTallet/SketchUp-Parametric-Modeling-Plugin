import type { NodeEditor } from 'rete'

import type { Bridge } from '../../bridge/Bridge'
import { serializeSchema } from '../../schema/serializeSchema'
import { controlEvents } from '../controls/controlEvents'
import { runEngine, type Engine } from '../engine/createEngine'
import type { Area } from '../plugins/createArea'
import type { Schemes } from '../types'

export interface SchemaSync {
  /** Allows exports (called once the initial schema is loaded). */
  enable(): void
  /** Sends the current schema to the host; redraw asks SketchUp to rebuild the geometry. */
  exportSchema(redraw: boolean): void
  destroy(): void
}

interface SchemaSyncOptions {
  editor: NodeEditor<Schemes>
  area: Area
  engine: Engine
  bridge: Bridge
  schemaVersion: string
}

const STRUCTURE_EVENTS = new Set([
  'nodecreated',
  'noderemoved',
  'connectioncreated',
  'connectionremoved',
])

/**
 * Keeps the SketchUp model in sync with the editor: every structural change, drag or
 * control edit exports the schema. Exports requested in the same task are merged into
 * one (e.g. "Remove all nodes" triggers one export, not one per removed node).
 */
export function createSchemaSync(options: SchemaSyncOptions): SchemaSync {
  const { editor, area, engine, bridge, schemaVersion } = options
  let enabled = false
  let pending: { redraw: boolean } | null = null

  const flush = () => {
    if (!pending) {
      return
    }

    const { redraw } = pending

    pending = null

    const schema = serializeSchema(
      {
        nodes: editor.getNodes(),
        connections: editor.getConnections(),
        positionOf: (nodeId) => area.nodeViews.get(nodeId)?.position ?? { x: 0, y: 0 },
      },
      schemaVersion
    )

    bridge.exportModelSchema(JSON.stringify(schema), redraw)
  }

  const exportSchema = (redraw: boolean) => {
    if (!enabled) {
      return
    }

    if (pending) {
      pending.redraw = pending.redraw || redraw
      return
    }

    pending = { redraw }
    setTimeout(flush, 0)
  }

  editor.addPipe((context) => {
    if (STRUCTURE_EVENTS.has(context.type)) {
      void runEngine(engine, editor)
      exportSchema(true)
    }

    return context
  })

  area.addPipe((context) => {
    if (context.type === 'nodedragged') {
      exportSchema(false)
    }

    return context
  })

  const unsubscribe = controlEvents.subscribe(({ node }) => {
    void runEngine(engine, editor)
    // Editing a comment doesn't change the geometry.
    exportSchema(node.name !== 'Comment')
  })

  return {
    enable() {
      enabled = true
    },
    exportSchema,
    destroy() {
      unsubscribe()
    },
  }
}
