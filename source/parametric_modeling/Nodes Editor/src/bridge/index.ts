import type { Bridge } from './Bridge'
import { insideSketchUp } from './insideSketchUp'
import { MockBridge } from './MockBridge'
import { SketchUpBridge } from './SketchUpBridge'

export const bridge: Bridge = insideSketchUp ? new SketchUpBridge() : new MockBridge()

export { insideSketchUp }
export type { Bootstrap, Bridge, LayerInfo, MaterialInfo } from './Bridge'
