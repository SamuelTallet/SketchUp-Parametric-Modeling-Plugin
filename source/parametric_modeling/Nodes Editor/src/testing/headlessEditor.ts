import { NodeEditor } from 'rete'

import { createNode } from '../editor/nodes/registry'
import type { NodeName } from '../editor/nodes/nodeNames'
import type { NodeValues, BaseNode } from '../editor/nodes/BaseNode'
import { BaseConnection } from '../editor/BaseConnection'
import type { SocketKind } from '../editor/sockets/BaseSocket'
import type { Schemes } from '../editor/types'

/** A Rete editor without area nor renderer: enough to test the data model and behaviours. */
export function createHeadlessEditor(): NodeEditor<Schemes> {
  return new NodeEditor<Schemes>()
}

let nextId = 1

/** Creates a node with a fresh integer id and adds it to the editor. */
export async function addNode(
  editor: NodeEditor<Schemes>,
  name: NodeName,
  values?: NodeValues
): Promise<BaseNode> {
  const node = createNode(name, values)

  node.id = String(nextId++)
  await editor.addNode(node)

  return node
}

export async function connect(
  editor: NodeEditor<Schemes>,
  source: BaseNode,
  outputKey: string,
  target: BaseNode,
  inputKey: string
): Promise<BaseConnection> {
  const connection = new BaseConnection(source, outputKey, target, inputKey)

  await editor.addConnection(connection)

  return connection
}

/** Key of the first input of the given socket kind (throws if the node has none). */
export function inputOfKind(node: BaseNode, kind: SocketKind): string {
  const entry = Object.entries(node.inputs).find(([, input]) => input?.socket.kind === kind)

  if (!entry) {
    throw new Error(`${node.name} has no ${kind} input`)
  }

  return entry[0]
}

/** Key of the first output of the given socket kind (throws if the node has none). */
export function outputOfKind(node: BaseNode, kind: SocketKind): string {
  const entry = Object.entries(node.outputs).find(([, output]) => output?.socket.kind === kind)

  if (!entry) {
    throw new Error(`${node.name} has no ${kind} output`)
  }

  return entry[0]
}
