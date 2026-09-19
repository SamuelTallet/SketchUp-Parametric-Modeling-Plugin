import { degreesToRadians } from '../../utils/degreesToRadians'

export const FORMULA_VARIABLES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
] as const

export type FormulaVariable = (typeof FORMULA_VARIABLES)[number]

export type FormulaVariables = Record<FormulaVariable, number>

/** Functions and constants usable in a Calculate formula, besides the variables. */
const FORMULA_SCOPE = {
  pi: Math.PI,
  min: Math.min,
  max: Math.max,
  round: Math.round,
  ceil: Math.ceil,
  floor: Math.floor,
  deg: degreesToRadians,
  sin: Math.sin,
  asin: Math.asin,
  asinh: Math.asinh,
  cos: Math.cos,
  acos: Math.acos,
  acosh: Math.acosh,
  tan: Math.tan,
  atan: Math.atan,
  atanh: Math.atanh,
  exp: Math.exp,
  log2: Math.log2,
  log10: Math.log10,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
}

const SCOPE_NAMES = Object.keys(FORMULA_SCOPE)
const SCOPE_VALUES = Object.values(FORMULA_SCOPE)

type CompiledFormula = (...args: unknown[]) => unknown

const compiledFormulas = new Map<string, CompiledFormula | null>()

function compile(formula: string): CompiledFormula | null {
  const cached = compiledFormulas.get(formula)

  if (cached !== undefined) {
    return cached
  }

  let compiled: CompiledFormula | null

  try {
    // The formula is user code by design (like the Ruby side evaluating it with Dentaku);
    // it only sees the variables and the math scope passed as parameters.
    // eslint-disable-next-line typescript/no-implied-eval
    compiled = new Function(
      ...FORMULA_VARIABLES,
      ...SCOPE_NAMES,
      `"use strict"; return (${formula});`
    ) as CompiledFormula
  } catch {
    compiled = null
  }

  compiledFormulas.set(formula, compiled)

  return compiled
}

/**
 * Evaluates a Calculate node formula such as `round(a) * b` in the browser,
 * for the preview values of the editor. Returns 0 when the formula is invalid.
 * (The Ruby side evaluates the same formula with Dentaku to build the model.)
 */
export function evaluateFormula(formula: string, variables: FormulaVariables): number {
  const trimmed = formula.trim()

  if (trimmed === '') {
    return 0
  }

  const compiled = compile(trimmed)

  if (!compiled) {
    return 0
  }

  try {
    const result = compiled(...FORMULA_VARIABLES.map((name) => variables[name]), ...SCOPE_VALUES)

    return typeof result === 'number' && Number.isFinite(result) ? result : 0
  } catch {
    return 0
  }
}
