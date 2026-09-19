import type { Bootstrap } from '../bridge/Bridge'
import type { EditorHandle } from '../editor/EditorHandle'
import { isNodeName } from '../editor/nodes/nodeNames'
import type { NodeValues } from '../editor/nodes/BaseNode'

/**
 * JavaScript API exposed as `window.PMG.NodesEditor`.
 * The Ruby side calls it through `UI::HtmlDialog#execute_script`,
 * so the method names must stay in sync with `nodes_editor.rb`.
 */
export interface PublicApi {
  NodesEditor: {
    /** Receives the bootstrap payload answering `sketchup.ready()`. */
    boot(payload: Bootstrap): void
    /** Adds a node of the given name, optionally pre-filled with values. */
    addNode(nodeName: string, nodeData?: NodeValues): void
    /** Removes the "invalid" mark from every node. */
    tagNodesAsValid(): void
    /** Marks a node as invalid (red border). */
    tagNodeAsInvalid(nodeId: number): void
  }
}

type BootHandler = (payload: Bootstrap) => void

const state: {
  bootHandler: BootHandler | null
  pendingBoot: Bootstrap | null
  editor: EditorHandle | null
} = {
  bootHandler: null,
  pendingBoot: null,
  editor: null,
}

export function installPublicApi(): void {
  window.PMG = {
    NodesEditor: {
      boot(payload) {
        if (state.bootHandler) {
          state.bootHandler(payload)
        } else {
          state.pendingBoot = payload
        }
      },
      addNode(nodeName, nodeData) {
        if (!isNodeName(nodeName)) {
          return
        }

        void state.editor?.addNode(nodeName, nodeData)
      },
      tagNodesAsValid() {
        state.editor?.tagNodesAsValid()
      },
      tagNodeAsInvalid(nodeId) {
        state.editor?.tagNodeAsInvalid(nodeId)
      },
    },
  }
}

/** Registers the function that consumes the bootstrap payload (delivered at most once per page load). */
export function onBoot(handler: BootHandler): void {
  state.bootHandler = handler

  if (state.pendingBoot) {
    const payload = state.pendingBoot

    state.pendingBoot = null
    handler(payload)
  }
}

export function setEditorHandle(handle: EditorHandle | null): void {
  state.editor = handle
}
