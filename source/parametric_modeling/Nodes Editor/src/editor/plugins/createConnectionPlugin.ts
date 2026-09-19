import type { NodeEditor } from 'rete'
import {
  ClassicFlow,
  ConnectionPlugin,
  getSourceTarget,
  type SocketData,
} from 'rete-connection-plugin'

import type { BaseSocket } from '../sockets/BaseSocket'
import { BaseConnection } from '../BaseConnection'
import type { AreaExtra, Schemes } from '../types'
import type { Area } from './createArea'

function socketOf(editor: NodeEditor<Schemes>, data: SocketData): BaseSocket | undefined {
  const node = editor.getNode(data.nodeId)

  if (!node) {
    return undefined
  }

  return data.side === 'input' ? node.inputs[data.key]?.socket : node.outputs[data.key]?.socket
}

function inputIsOccupied(editor: NodeEditor<Schemes>, nodeId: string, inputKey: string): boolean {
  return editor
    .getConnections()
    .some((connection) => connection.target === nodeId && connection.targetInput === inputKey)
}

/**
 * Whether a connection may be created: same socket kind on both ends
 * and a free input (inputs accept a single connection, as in Rete.js v1).
 */
export function canCreateConnection(
  editor: NodeEditor<Schemes>,
  connection: Pick<BaseConnection, 'source' | 'sourceOutput' | 'target' | 'targetInput'>
): boolean {
  const sourceNode = editor.getNode(connection.source)
  const targetNode = editor.getNode(connection.target)
  const sourceSocket = sourceNode?.outputs[connection.sourceOutput]?.socket
  const targetSocket = targetNode?.inputs[connection.targetInput]?.socket

  if (!sourceSocket || !targetSocket || !sourceSocket.isCompatibleWith(targetSocket)) {
    return false
  }

  return !inputIsOccupied(editor, connection.target, connection.targetInput)
}

/** Lets the user create and remove connections by dragging from sockets. */
export function createConnectionPlugin(area: Area, editor: NodeEditor<Schemes>): void {
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()

  connection.addPreset(
    () =>
      new ClassicFlow<Schemes, [AreaExtra]>({
        canMakeConnection(from, to) {
          const [source, target] = getSourceTarget(from, to) ?? [null, null]
          const sourceSocket = source ? socketOf(editor, source) : undefined
          const targetSocket = target ? socketOf(editor, target) : undefined
          const allowed = Boolean(
            source &&
            target &&
            sourceSocket &&
            targetSocket &&
            sourceSocket.isCompatibleWith(targetSocket) &&
            !inputIsOccupied(editor, target.nodeId, target.key)
          )

          const sameSocket =
            from.nodeId === to.nodeId && from.side === to.side && from.key === to.key

          if (!allowed && !sameSocket) {
            // The flow keeps its pseudo-connection when a drop is refused: remove it.
            // (Releasing on the picked socket itself is a click: the wire must stay and
            // follow the pointer until a click on another socket.)
            setTimeout(() => connection.drop(), 0)
          }

          return allowed
        },
        makeConnection(from, to, context) {
          const [source, target] = getSourceTarget(from, to) ?? [null, null]
          const sourceNode = source ? context.editor.getNode(source.nodeId) : undefined
          const targetNode = target ? context.editor.getNode(target.nodeId) : undefined

          if (!source || !target || !sourceNode || !targetNode) {
            return undefined
          }

          void context.editor.addConnection(
            new BaseConnection(sourceNode, source.key, targetNode, target.key)
          )

          return true
        },
      })
  )

  // Safety net for programmatic additions.
  editor.addPipe((context) => {
    if (context.type === 'connectioncreate' && !canCreateConnection(editor, context.data)) {
      return undefined
    }

    return context
  })

  area.use(connection)
}
