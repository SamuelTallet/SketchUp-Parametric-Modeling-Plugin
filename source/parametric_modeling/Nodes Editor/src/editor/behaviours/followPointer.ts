import type { Area } from '../plugins/createArea'

export interface FollowPointer {
  /** The given node follows the pointer until the next press anywhere in the page. */
  start(nodeId: string): void
  destroy(): void
}

/** A freshly added node sticks to the pointer so the user can drop it where wanted. */
export function createFollowPointer(area: Area): FollowPointer {
  let followingNodeId: string | null = null

  area.addPipe((context) => {
    if (context.type === 'pointermove' && followingNodeId) {
      void area.translate(followingNodeId, context.data.position)
    }

    return context
  })

  const onPress = () => {
    followingNodeId = null
  }

  // `mousedown` rather than `pointerdown`: the pointer events polyfill that SketchUp's old
  // Chromium needs reports a press as a `pointermove` whenever it still believes a button is
  // down, which happens when the user clicks fast, and the node then stays glued to the
  // cursor. Rather than `click` too: Rete reorders the pressed node in the DOM on the press,
  // which makes browsers drop the click. Following the pointer needs a hover, so it is a
  // mouse-only affair anyway.
  window.addEventListener('mousedown', onPress, true)

  return {
    start(nodeId) {
      followingNodeId = nodeId
    },
    destroy() {
      window.removeEventListener('mousedown', onPress, true)
    },
  }
}
