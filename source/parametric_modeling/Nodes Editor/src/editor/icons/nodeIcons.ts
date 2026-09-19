import addIcon from '../../assets/icons/add-node-icon.svg'
import alignIcon from '../../assets/icons/align-node-icon.svg'
import calculateIcon from '../../assets/icons/calculate-node-icon.svg'
import commentIcon from '../../assets/icons/comment-node-icon.svg'
import concatenateIcon from '../../assets/icons/concatenate-node-icon.svg'
import copyIcon from '../../assets/icons/copy-node-icon.svg'
import divideIcon from '../../assets/icons/divide-node-icon.svg'
import drawBoxIcon from '../../assets/icons/draw-box-node-icon.svg'
import drawConeIcon from '../../assets/icons/draw-cone-node-icon.svg'
import drawCylinderIcon from '../../assets/icons/draw-cylinder-node-icon.svg'
import drawPrismIcon from '../../assets/icons/draw-prism-node-icon.svg'
import drawPyramidIcon from '../../assets/icons/draw-pyramid-node-icon.svg'
import drawShapeIcon from '../../assets/icons/draw-shape-node-icon.svg'
import drawSphereIcon from '../../assets/icons/draw-sphere-node-icon.svg'
import drawTubeIcon from '../../assets/icons/draw-tube-node-icon.svg'
import eraseIcon from '../../assets/icons/erase-node-icon.svg'
import getPointsIcon from '../../assets/icons/get-points-node-icon.svg'
import helpIcon from '../../assets/icons/help-icon.svg'
import intersectSolidsIcon from '../../assets/icons/intersect-solids-node-icon.svg'
import makeGroupIcon from '../../assets/icons/make-group-node-icon.svg'
import moveIcon from '../../assets/icons/move-node-icon.svg'
import multiplyIcon from '../../assets/icons/multiply-node-icon.svg'
import numberIcon from '../../assets/icons/number-node-icon.svg'
import paintIcon from '../../assets/icons/paint-node-icon.svg'
import pointIcon from '../../assets/icons/point-node-icon.svg'
import pushPullIcon from '../../assets/icons/push-pull-node-icon.svg'
import rotateIcon from '../../assets/icons/rotate-node-icon.svg'
import scaleIcon from '../../assets/icons/scale-node-icon.svg'
import selectIcon from '../../assets/icons/select-node-icon.svg'
import subtractIcon from '../../assets/icons/subtract-node-icon.svg'
import subtractSolidsIcon from '../../assets/icons/subtract-solids-node-icon.svg'
import tagIcon from '../../assets/icons/tag-node-icon.svg'
import uniteSolidsIcon from '../../assets/icons/unite-solids-node-icon.svg'
import vectorIcon from '../../assets/icons/vector-node-icon.svg'
import type { NodeName } from '../nodes/nodeNames'

export interface NodeIcon {
  /** Image URL (inlined as a data URI in the bundle). */
  path: string
  /** Glow color behind the node title. */
  color: string
}

export const NODE_ICONS: Record<NodeName, NodeIcon> = {
  'Draw box': { path: drawBoxIcon, color: 'rgba(30, 227, 165, 0.5)' },
  'Draw prism': { path: drawPrismIcon, color: 'rgba(255, 106, 46, 0.5)' },
  'Draw cylinder': { path: drawCylinderIcon, color: 'rgba(252, 123, 214, 0.5)' },
  'Draw tube': { path: drawTubeIcon, color: 'rgba(252, 220, 25, 0.5)' },
  'Draw pyramid': { path: drawPyramidIcon, color: 'rgba(252, 223, 43, 0.5)' },
  'Draw cone': { path: drawConeIcon, color: 'rgba(252, 231, 103, 0.5)' },
  'Draw sphere': { path: drawSphereIcon, color: 'rgba(133, 164, 255, 0.5)' },
  'Draw shape': { path: drawShapeIcon, color: 'rgba(252, 220, 25, 0.5)' },
  Number: { path: numberIcon, color: 'rgba(0, 140, 189, 0.5)' },
  Add: { path: addIcon, color: 'rgba(125, 210, 240, 0.5)' },
  Subtract: { path: subtractIcon, color: 'rgba(255, 100, 101, 0.5)' },
  Multiply: { path: multiplyIcon, color: 'rgba(125, 210, 240, 0.5)' },
  Divide: { path: divideIcon, color: 'rgba(255, 100, 101, 0.5)' },
  Calculate: { path: calculateIcon, color: 'rgba(5, 112, 150, 0.5)' },
  Point: { path: pointIcon, color: 'rgba(229, 157, 31, 0.5)' },
  'Get points': { path: getPointsIcon, color: 'rgba(100, 128, 147, 0.5)' },
  Vector: { path: vectorIcon, color: 'rgba(229, 56, 4, 0.5)' },
  'Intersect solids': { path: intersectSolidsIcon, color: 'rgba(156, 129, 238, 0.5)' },
  'Unite solids': { path: uniteSolidsIcon, color: 'rgba(125, 210, 240, 0.5)' },
  'Subtract solids': { path: subtractSolidsIcon, color: 'rgba(255, 100, 101, 0.5)' },
  'Push/Pull': { path: pushPullIcon, color: 'rgba(29, 131, 212, 0.5)' },
  Move: { path: moveIcon, color: 'rgba(255, 128, 191, 0.5)' },
  Align: { path: alignIcon, color: 'rgba(37, 185, 154, 0.5)' },
  Rotate: { path: rotateIcon, color: 'rgba(255, 215, 0, 0.5)' },
  Scale: { path: scaleIcon, color: 'rgba(153, 204, 0, 0.5)' },
  Paint: { path: paintIcon, color: 'rgba(0, 206, 209, 0.5)' },
  Tag: { path: tagIcon, color: 'rgba(235, 176, 68, 0.5)' },
  Erase: { path: eraseIcon, color: 'rgba(128, 180, 251, 0.5)' },
  Copy: { path: copyIcon, color: 'rgba(160, 160, 165, 0.5)' },
  Concatenate: { path: concatenateIcon, color: 'rgba(255, 209, 91, 0.5)' },
  Select: { path: selectIcon, color: 'rgba(204, 164, 0, 0.5)' },
  'Make group': { path: makeGroupIcon, color: 'rgba(0, 0, 0, 0.8)' },
  Comment: { path: commentIcon, color: 'rgba(253, 123, 104, 0.5)' },
}

export const HELP_ICON = helpIcon

/** Background of a node title: subtle top light plus the node color glow. */
export function nodeTitleGradient(name: NodeName): string {
  return (
    'linear-gradient(0deg, hsla(0,0%,100%,.05) 0, hsla(0,0%,100%,.05) 40%, hsla(0,0%,100%,.19)), ' +
    `radial-gradient(70% 40px at center, ${NODE_ICONS[name].color} 0, rgba(0,0,0,0) 60%)`
  )
}
