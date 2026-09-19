import { ClassicPreset } from 'rete'

import type { BaseNode } from '../nodes/BaseNode'
import { controlEvents } from './controlEvents'

export type ControlValue = string | number | boolean

/** A control bound to one entry of its node's `values` (the `data` object of the schema). */
export abstract class BaseControl<V extends ControlValue = ControlValue>
  extends ClassicPreset.Control
{
  private readonly listeners = new Set<() => void>()

  constructor(
    readonly node: BaseNode,
    readonly key: string
  ) {
    super()
  }

  getValue(): V | undefined {
    const value = this.node.values[this.key]

    return value === undefined || value === null ? undefined : (value as V)
  }

  /**
   * Stores the value in the node and notifies the views.
   * @param options.silent Skip the editor-level change event (used for computed previews).
   */
  setValue(value: V, options: { silent?: boolean } = {}): void {
    this.node.values[this.key] = value
    this.listeners.forEach((listener) => {
      listener()
    })

    if (!options.silent) {
      controlEvents.emit({ node: this.node, control: this })
    }
  }

  /** Lets a view re-render when the value changes. Returns the unsubscribe function. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }
}
