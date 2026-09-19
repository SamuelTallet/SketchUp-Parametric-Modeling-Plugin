/** Node names as stored in schema files (`name` field) and known by the Ruby side. */
export const NODE_NAMES = [
  'Draw box',
  'Draw prism',
  'Draw cylinder',
  'Draw tube',
  'Draw pyramid',
  'Draw cone',
  'Draw sphere',
  'Draw shape',
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
  'Comment',
] as const

export type NodeName = (typeof NODE_NAMES)[number]

export function isNodeName(value: unknown): value is NodeName {
  return typeof value === 'string' && (NODE_NAMES as readonly string[]).includes(value)
}
