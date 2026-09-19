// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Area } from '../../plugins/createArea'
import { createFollowPointer } from '../followPointer'

type Pipe = (context: unknown) => unknown

/** A stand-in for the Rete area: records the pipe and the translations asked. */
function createFakeArea() {
  let pipe: Pipe = (context) => context
  const translate = vi.fn<(nodeId: string, position: { x: number; y: number }) => void>()
  const area = {
    addPipe: (added: Pipe) => {
      pipe = added
    },
    translate,
  } as unknown as Area

  return {
    area,
    translate,
    movePointerTo: (x: number, y: number) => {
      pipe({ type: 'pointermove', data: { position: { x, y }, event: {} } })
    },
  }
}

function mousePressOn(target: EventTarget) {
  target.dispatchEvent(new Event('mousedown', { bubbles: true }))
}

describe('createFollowPointer', () => {
  let canvas: HTMLElement
  let toolbarIcon: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="pmg-nodes-editor">
        <div class="toolbar"><div class="icon"></div></div>
        <div class="area"><div class="node"></div></div>
      </div>`
    canvas = document.querySelector('.area')!
    toolbarIcon = document.querySelector('.toolbar .icon')!
  })

  it('moves the started node with the pointer', () => {
    const { area, translate, movePointerTo } = createFakeArea()
    const follow = createFollowPointer(area)

    follow.start('7')
    movePointerTo(10, 20)

    expect(translate).toHaveBeenCalledWith('7', { x: 10, y: 20 })
    follow.destroy()
  })

  it('does nothing while no node is started', () => {
    const { area, translate, movePointerTo } = createFakeArea()
    const follow = createFollowPointer(area)

    movePointerTo(10, 20)

    expect(translate).not.toHaveBeenCalled()
    follow.destroy()
  })

  // Regression: the node stayed glued to the pointer in SketchUp because the release relied on
  // a `click`, which never fires when Rete reorders the pressed node in the DOM on pointerdown.
  it('drops the node on a press, even when no click follows', () => {
    const { area, translate, movePointerTo } = createFakeArea()
    const follow = createFollowPointer(area)

    follow.start('7')
    mousePressOn(canvas.querySelector('.node')!)
    movePointerTo(10, 20)

    expect(translate).not.toHaveBeenCalled()
    follow.destroy()
  })

  // Regression: presses on the toolbar used to be ignored, so the corner it floats over was a
  // dead zone where clicking to drop the node did nothing.
  it('drops the node on a press on the toolbar', () => {
    const { area, translate, movePointerTo } = createFakeArea()
    const follow = createFollowPointer(area)

    follow.start('7')
    mousePressOn(toolbarIcon)
    movePointerTo(10, 20)

    expect(translate).not.toHaveBeenCalled()
    follow.destroy()
  })

  it('stops listening once destroyed', () => {
    const { area, translate, movePointerTo } = createFakeArea()
    const follow = createFollowPointer(area)

    follow.start('7')
    follow.destroy()
    mousePressOn(canvas)
    movePointerTo(10, 20)

    // The pipe is still registered on the area, but the press no longer resets anything:
    // the caller is expected to drop the area as well.
    expect(translate).toHaveBeenCalledTimes(1)
  })
})
