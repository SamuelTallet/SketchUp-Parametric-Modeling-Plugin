// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'

import type { Bootstrap } from '../../bridge/Bridge'
import type { EditorHandle } from '../../editor/EditorHandle'
import { installPublicApi, onBoot, setEditorHandle } from '../PublicApi'

const payload = {
  locale: 'en-US',
  sketchupVersion: 23,
  schemaVersion: '1.0.0',
  translation: {},
  materials: [],
  layers: [],
  schema: { id: 'ParametricModeling@1.0.0', nodes: {} },
} satisfies Bootstrap

function createHandle() {
  const addNode = vi.fn<EditorHandle['addNode']>().mockResolvedValue()
  const tagNodesAsValid = vi.fn<() => void>()
  const tagNodeAsInvalid = vi.fn<(nodeId: number) => void>()
  const handle: EditorHandle = {
    addNode,
    tagNodesAsValid,
    tagNodeAsInvalid,
    toggleMinimap: vi.fn(),
    destroy: vi.fn(),
  }

  return { handle, addNode, tagNodesAsValid, tagNodeAsInvalid }
}

describe('window.PMG.NodesEditor', () => {
  it('keeps a boot payload sent before the app listens, and delivers it once', () => {
    installPublicApi()

    const handler = vi.fn()

    window.PMG!.NodesEditor.boot(payload)
    onBoot(handler)
    onBoot(vi.fn())

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(payload)
  })

  it('delivers a later boot payload to the current listener', () => {
    installPublicApi()

    const handler = vi.fn()

    onBoot(handler)
    window.PMG!.NodesEditor.boot(payload)

    expect(handler).toHaveBeenCalledWith(payload)
  })

  it('forwards node commands to the running editor', () => {
    installPublicApi()

    const { handle, addNode, tagNodeAsInvalid, tagNodesAsValid } = createHandle()

    setEditorHandle(handle)
    window.PMG!.NodesEditor.addNode('Draw box', { width: 2 })
    window.PMG!.NodesEditor.tagNodeAsInvalid(3)
    window.PMG!.NodesEditor.tagNodesAsValid()

    expect(addNode).toHaveBeenCalledWith('Draw box', { width: 2 })
    expect(tagNodeAsInvalid).toHaveBeenCalledWith(3)
    expect(tagNodesAsValid).toHaveBeenCalledTimes(1)
    setEditorHandle(null)
  })

  it('ignores unknown node names and works without an editor', () => {
    installPublicApi()

    const { handle, addNode } = createHandle()

    setEditorHandle(handle)
    window.PMG!.NodesEditor.addNode('Teleport')
    expect(addNode).not.toHaveBeenCalled()

    setEditorHandle(null)
    expect(() => {
      window.PMG!.NodesEditor.addNode('Draw box')
      window.PMG!.NodesEditor.tagNodesAsValid()
    }).not.toThrow()
  })
})
