import type { NodeEditor } from 'rete'
import { Cancelled, DataflowEngine } from 'rete-engine'

import type { Schemes } from '../types'

export type Engine = DataflowEngine<Schemes>

export function createEngine(editor: NodeEditor<Schemes>): Engine {
  const engine = new DataflowEngine<Schemes>()

  editor.use(engine)

  return engine
}

/**
 * Recomputes every node so that the preview controls (Add, Subtract, …) are up to date.
 * A run cancelled by a newer run, or interrupted by nodes being removed meanwhile
 * (e.g. "Remove all nodes"), is silently ignored.
 */
export async function runEngine(engine: Engine, editor: NodeEditor<Schemes>): Promise<void> {
  engine.reset()

  for (const node of editor.getNodes()) {
    try {
      await engine.fetch(node.id)
    } catch (error) {
      if (error instanceof Cancelled || !editor.getNode(node.id)) {
        continue
      }

      throw error
    }
  }
}
