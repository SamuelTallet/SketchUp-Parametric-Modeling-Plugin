import type { LayerInfo, MaterialInfo } from '../bridge/Bridge'

/** Facts about the host SketchUp model that node controls need. */
export interface Environment {
  sketchupVersion: number
  materials: MaterialInfo[]
  layers: LayerInfo[]
}

let environment: Environment = {
  sketchupVersion: 21,
  materials: [],
  layers: [],
}

export function setEnvironment(next: Environment): void {
  environment = { ...next }
}

export function getEnvironment(): Environment {
  return environment
}
