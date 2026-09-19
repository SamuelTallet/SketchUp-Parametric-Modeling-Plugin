import { NodeEditor } from 'rete'

import type { Bootstrap } from '../bridge/Bridge'
import { bridge } from '../bridge'
import { deserializeSchema } from '../schema/deserializeSchema'
import { NodeIdAllocator } from '../schema/nodeIds'
import { isCompatibleSchema } from '../schema/schemaId'
import { createConnectionSelection } from './behaviours/connectionSelection'
import { createFollowPointer } from './behaviours/followPointer'
import { createInvalidNodes } from './behaviours/invalidNodes'
import { measureNodes } from './behaviours/measureNodes'
import { createSchemaSync } from './behaviours/schemaSync'
import { trackSocketUsage } from './behaviours/socketUsage'
import type { EditorHandle } from './EditorHandle'
import { createEngine, runEngine } from './engine/createEngine'
import type { NodeName } from './nodes/nodeNames'
import { type NodeValues } from './nodes/BaseNode'
import { createNode } from './nodes/registry'
import { createArea } from './plugins/createArea'
import { createConnectionPlugin } from './plugins/createConnectionPlugin'
import { createContextMenu } from './plugins/createContextMenu'
import { createMinimap } from './plugins/createMinimap'
import { createRenderer } from './plugins/createRenderer'
import type { Schemes } from './types'

/** Builds the whole Nodes Editor inside `container` and loads the bootstrap schema. */
export async function createEditor(
  container: HTMLElement,
  bootstrap: Bootstrap
): Promise<EditorHandle> {
  const editor = new NodeEditor<Schemes>()
  const { area } = createArea(container, editor)
  const engine = createEngine(editor)
  const idAllocator = new NodeIdAllocator()

  createRenderer(area)
  createConnectionPlugin(area, editor)

  const minimap = createMinimap(area)
  const followPointer = createFollowPointer(area)
  const connectionSelection = createConnectionSelection(editor, area)
  const invalidNodes = createInvalidNodes(editor, area)
  const schemaSync = createSchemaSync({
    editor,
    area,
    engine,
    bridge,
    schemaVersion: bootstrap.schemaVersion,
  })

  trackSocketUsage(editor, area)
  measureNodes(editor, area)

  const addNode = async (name: NodeName, values?: NodeValues) => {
    const node = createNode(name, values)

    node.id = idAllocator.allocate()

    // Started before the awaits below: creating a node takes long enough for the user to
    // press meanwhile, and that press has to drop the node instead of being missed. Moving
    // a node Rete has not rendered yet does nothing, so starting this early is safe.
    followPointer.start(node.id)

    await editor.addNode(node)
    await area.translate(node.id, { ...area.area.pointer })
  }

  createContextMenu(area, editor, {
    toggleMinimap: () => minimap.toggle(),
    addCommentNode: () => addNode('Comment'),
  })

  if (isCompatibleSchema(bootstrap.schema, bootstrap.schemaVersion)) {
    await deserializeSchema(
      bootstrap.schema,
      {
        async addNode(node, position) {
          await editor.addNode(node)
          await area.translate(node.id, position)
        },
        async addConnection(connection) {
          await editor.addConnection(connection)
        },
      },
      idAllocator
    )
  }

  await runEngine(engine, editor)
  schemaSync.enable()

  return {
    addNode,
    tagNodesAsValid: () => invalidNodes.tagNodesAsValid(),
    tagNodeAsInvalid: (nodeId) => invalidNodes.tagNodeAsInvalid(nodeId),
    toggleMinimap: () => minimap.toggle(),
    destroy() {
      schemaSync.destroy()
      followPointer.destroy()
      connectionSelection.destroy()
      area.destroy()
    },
  }
}
