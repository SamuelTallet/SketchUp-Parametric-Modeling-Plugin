import { AddNode } from './AddNode'
import { AlignNode } from './AlignNode'
import { CalculateNode } from './CalculateNode'
import { CommentNode } from './CommentNode'
import { ConcatenateNode } from './ConcatenateNode'
import { CopyNode } from './CopyNode'
import { DivideNode } from './DivideNode'
import { DrawBoxNode } from './DrawBoxNode'
import { DrawConeNode } from './DrawConeNode'
import { DrawCylinderNode } from './DrawCylinderNode'
import { DrawPrismNode } from './DrawPrismNode'
import { DrawPyramidNode } from './DrawPyramidNode'
import { DrawShapeNode } from './DrawShapeNode'
import { DrawSphereNode } from './DrawSphereNode'
import { DrawTubeNode } from './DrawTubeNode'
import { EraseNode } from './EraseNode'
import { GetPointsNode } from './GetPointsNode'
import { IntersectSolidsNode } from './IntersectSolidsNode'
import { MakeGroupNode } from './MakeGroupNode'
import { MoveNode } from './MoveNode'
import { MultiplyNode } from './MultiplyNode'
import type { NodeName } from './nodeNames'
import { NumberNode } from './NumberNode'
import { PaintNode } from './PaintNode'
import type { NodeValues, BaseNode } from './BaseNode'
import { PointNode } from './PointNode'
import { PushPullNode } from './PushPullNode'
import { RotateNode } from './RotateNode'
import { ScaleNode } from './ScaleNode'
import { SelectNode } from './SelectNode'
import { SubtractNode } from './SubtractNode'
import { SubtractSolidsNode } from './SubtractSolidsNode'
import { TagNode } from './TagNode'
import { UniteSolidsNode } from './UniteSolidsNode'
import { VectorNode } from './VectorNode'

export const NODE_FACTORIES: Record<NodeName, () => BaseNode> = {
  'Draw box': () => new DrawBoxNode(),
  'Draw prism': () => new DrawPrismNode(),
  'Draw cylinder': () => new DrawCylinderNode(),
  'Draw tube': () => new DrawTubeNode(),
  'Draw pyramid': () => new DrawPyramidNode(),
  'Draw cone': () => new DrawConeNode(),
  'Draw sphere': () => new DrawSphereNode(),
  'Draw shape': () => new DrawShapeNode(),
  Number: () => new NumberNode(),
  Add: () => new AddNode(),
  Subtract: () => new SubtractNode(),
  Multiply: () => new MultiplyNode(),
  Divide: () => new DivideNode(),
  Calculate: () => new CalculateNode(),
  Point: () => new PointNode(),
  'Get points': () => new GetPointsNode(),
  Vector: () => new VectorNode(),
  'Intersect solids': () => new IntersectSolidsNode(),
  'Unite solids': () => new UniteSolidsNode(),
  'Subtract solids': () => new SubtractSolidsNode(),
  'Push/Pull': () => new PushPullNode(),
  Move: () => new MoveNode(),
  Align: () => new AlignNode(),
  Rotate: () => new RotateNode(),
  Scale: () => new ScaleNode(),
  Paint: () => new PaintNode(),
  Tag: () => new TagNode(),
  Erase: () => new EraseNode(),
  Copy: () => new CopyNode(),
  Concatenate: () => new ConcatenateNode(),
  Select: () => new SelectNode(),
  'Make group': () => new MakeGroupNode(),
  Comment: () => new CommentNode(),
}

/** Creates a node, optionally pre-filled with control values (`data` of the schema). */
export function createNode(name: NodeName, values?: NodeValues): BaseNode {
  const node = NODE_FACTORIES[name]()

  if (values) {
    node.values = { ...values }
  }

  return node
}

/** Nodes offered by the toolbar, in display order. */
export const TOOLBAR_ORDER: readonly NodeName[] = [
  'Draw box',
  'Draw prism',
  'Draw cylinder',
  'Draw tube',
  'Draw pyramid',
  'Draw cone',
  'Draw sphere',
  'Number',
  'Add',
  'Subtract',
  'Multiply',
  'Divide',
  'Calculate',
  'Point',
  'Get points',
  'Vector',
  'Intersect solids',
  'Unite solids',
  'Subtract solids',
  'Push/Pull',
  'Move',
  'Align',
  'Rotate',
  'Scale',
  'Paint',
  'Tag',
  'Erase',
  'Copy',
  'Concatenate',
  'Select',
  'Make group',
]
