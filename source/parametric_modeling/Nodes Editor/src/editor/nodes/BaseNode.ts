import { ClassicPreset } from 'rete'
import type { DataflowNode } from 'rete-engine'

import { t } from '../../i18n/translate'
import { CheckBoxControl } from '../controls/CheckBoxControl'
import { NumberControl } from '../controls/NumberControl'
import type { BaseControl } from '../controls/BaseControl'
import { SelectControl } from '../controls/SelectControl'
import { TextAreaControl } from '../controls/TextAreaControl'
import { TextControl } from '../controls/TextControl'
import type { BaseSocket, SocketKind } from '../sockets/BaseSocket'
import { getSockets } from '../sockets/sockets'
import type { NodeName } from './nodeNames'

/** The `data` object of a node in the schema: control values keyed by control key. */
export type NodeValues = Record<string, unknown>

/** Inputs as given by the dataflow engine: one array of values per connected input key. */
export type NodeInputs = Record<string, unknown[] | undefined>

export type NodeOutputs = Record<string, unknown>

type Sockets = Record<string, BaseSocket>
type Controls = Record<string, BaseControl>

/**
 * Base class of every Nodes Editor node.
 * Subclasses declare their ports and controls in their constructor
 * and may override `data()` to compute preview values in the browser.
 */
export abstract class BaseNode
  extends ClassicPreset.Node<Sockets, Sockets, Controls>
  implements DataflowNode
{
  readonly name: NodeName

  /** Control values, serialized as the node `data` in the schema. */
  values: NodeValues = {}

  /** Set by the Ruby side when computing this node failed. */
  invalid = false

  /** Rendered size, measured after mount (the minimap needs it). */
  width = 0
  height = 0

  /** `input:<key>` / `output:<key>` entries for sockets that currently have a connection. */
  readonly usedSockets = new Set<string>()

  constructor(name: NodeName) {
    super(t(name))
    this.name = name
  }

  /**
   * Dataflow computation. Only nodes with a preview in the editor override it.
   * The engine requires every output key to be present in the result.
   */
  data(_inputs: NodeInputs): NodeOutputs {
    return this.emptyOutputs()
  }

  protected emptyOutputs(): NodeOutputs {
    const outputs: NodeOutputs = {}

    for (const key of Object.keys(this.outputs)) {
      outputs[key] = undefined
    }

    return outputs
  }

  /** Value of an input: the connected value if any, else the value of its own control. */
  protected resolveInput(inputs: NodeInputs, key: string): unknown {
    const connected = inputs[key]

    return connected && connected.length > 0 ? connected[0] : this.values[key]
  }

  protected addSocketInput(
    key: string,
    label: string,
    kind: SocketKind
  ): ClassicPreset.Input<BaseSocket> {
    const input = new ClassicPreset.Input(getSockets()[kind], label)

    this.addInput(key, input)

    return input
  }

  protected addNumberInput(key: string, label: string, placeholder = ''): NumberControl {
    const control = new NumberControl(this, key, placeholder)

    this.addSocketInput(key, label, 'number').addControl(control)

    return control
  }

  protected addSocketOutput(key: string, label: string, kind: SocketKind): void {
    this.addOutput(key, new ClassicPreset.Output(getSockets()[kind], label))
  }

  protected addNumberControl(key: string, placeholder = '', readonly = false): NumberControl {
    const control = new NumberControl(this, key, placeholder, readonly)

    this.addControl(key, control)

    return control
  }

  protected addTextControl(key: string, placeholder = '', title = ''): TextControl {
    const control = new TextControl(this, key, placeholder, title)

    this.addControl(key, control)

    return control
  }

  protected addTextAreaControl(key: string, placeholder = ''): TextAreaControl {
    const control = new TextAreaControl(this, key, placeholder)

    this.addControl(key, control)

    return control
  }

  protected addCheckBoxControl(key: string, label: string): CheckBoxControl {
    const control = new CheckBoxControl(this, key, label)

    this.addControl(key, control)

    return control
  }

  protected addMaterialControl(): SelectControl {
    const control = new SelectControl(this, 'material', 'material')

    this.addControl('material', control)

    return control
  }

  protected addLayerControl(): SelectControl {
    const control = new SelectControl(this, 'layer', 'layer')

    this.addControl('layer', control)

    return control
  }
}
