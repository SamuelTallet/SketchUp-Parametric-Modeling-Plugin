import type { NodeEditor } from 'rete'
import { ContextMenuPlugin } from 'rete-context-menu-plugin'

import { bridge } from '../../bridge'
import { t } from '../../i18n/translate'
import type { BaseNode } from '../nodes/BaseNode'
import type { Schemes } from '../types'
import type { Area } from './createArea'

export interface ContextMenuActions {
  toggleMinimap(): void
  addCommentNode(): Promise<void>
}

/** Removes a node after its connections (Rete.js v2 refuses to remove a connected node). */
export async function removeNode(editor: NodeEditor<Schemes>, nodeId: string): Promise<void> {
  const connections = editor
    .getConnections()
    .filter((connection) => connection.source === nodeId || connection.target === nodeId)

  for (const connection of connections) {
    await editor.removeConnection(connection.id)
  }

  await editor.removeNode(nodeId)
}

/** Right-click menus: global actions on the background, "Remove this node" on a node. */
export function createContextMenu(
  area: Area,
  editor: NodeEditor<Schemes>,
  actions: ContextMenuActions
): void {
  const rootItems = () => [
    {
      key: 'import',
      label: t('Import schema from a file'),
      handler: () => bridge.importSchemaFromFile(),
    },
    {
      key: 'export',
      label: t('Export schema to a file'),
      handler: () => bridge.exportSchemaToFile(),
    },
    {
      key: 'freeze',
      label: t('Freeze parametric entities'),
      handler: () => bridge.freezeParametricEntities(),
    },
    { key: 'minimap', label: t('Show or hide minimap'), handler: () => actions.toggleMinimap() },
    { key: 'comment', label: t('Add a comment node'), handler: () => actions.addCommentNode() },
    { key: 'clear', label: t('Remove all nodes'), handler: () => editor.clear() },
  ]

  const nodeItems = (node: BaseNode) => [
    { key: 'remove', label: t('Remove this node'), handler: () => removeNode(editor, node.id) },
  ]

  const contextMenu = new ContextMenuPlugin<Schemes>({
    items(context) {
      return {
        searchBar: false,
        list: context === 'root' || !('name' in context) ? rootItems() : nodeItems(context),
      }
    },
  })

  area.use(contextMenu)
}
