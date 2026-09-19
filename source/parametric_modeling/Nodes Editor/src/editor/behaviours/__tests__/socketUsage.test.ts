import { describe, expect, it, vi } from 'vitest'

import { addNode, connect, createHeadlessEditor } from '../../../testing/headlessEditor'
import type { Area } from '../../plugins/createArea'
import { trackSocketUsage } from '../socketUsage'

describe('trackSocketUsage', () => {
  it('marks both ends of a connection as used, then frees them on removal', async () => {
    const editor = createHeadlessEditor()
    const update = vi.fn<(type: string, id: string) => Promise<void>>()
    const area = { update } as unknown as Area

    trackSocketUsage(editor, area)

    const number = await addNode(editor, 'Number')
    const add = await addNode(editor, 'Add')
    const connection = await connect(editor, number, 'number', add, 'number1')

    expect([...number.usedSockets]).toEqual(['output:number'])
    expect([...add.usedSockets]).toEqual(['input:number1'])
    expect(update.mock.calls).toEqual([
      ['node', number.id],
      ['node', add.id],
    ])

    await editor.removeConnection(connection.id)

    expect(number.usedSockets.size).toBe(0)
    expect(add.usedSockets.size).toBe(0)
    expect(update).toHaveBeenCalledTimes(4)
  })
})
