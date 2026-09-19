import type { BaseNode } from '../nodes/BaseNode'
import type { BaseControl } from './BaseControl'

export interface ControlChange {
  node: BaseNode
  control: BaseControl
}

type Listener = (change: ControlChange) => void

const listeners = new Set<Listener>()

/** Notifies the editor when the user changes a control value. */
export const controlEvents = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  },

  emit(change: ControlChange): void {
    listeners.forEach((listener) => {
      listener(change)
    })
  },
}
