import type { ActionModel } from '../component/component.types'
import { isDefined } from '../utils/util'
import {
  Formula,
  FunctionOperation,
  isFormula,
  PathOperation,
  ValueOperation,
} from './formula'

export const valueFormula = (
  value: string | number | boolean | null | object,
): ValueOperation => ({
  type: 'value',
  value,
})

export const pathFormula = (path: string[]): PathOperation => ({
  type: 'path',
  path,
})

export const functionFormula = (
  name: string,
  formula?: Omit<Partial<FunctionOperation>, 'type' | 'name'>,
): FunctionOperation => ({
  type: 'function',
  name,
  package: formula?.package,
  arguments: formula?.arguments ?? [],
  variableArguments: formula?.variableArguments,
})

export function* getFormulasInFormula(
  formula: Formula | undefined | null,
  path: (string | number)[] = [],
): Generator<[(string | number)[], Formula]> {
  if (!isDefined(formula)) {
    return
  }

  yield [path, formula]
  switch (formula.type) {
    case 'path':
    case 'value':
      break
    case 'record':
      for (const [key, entry] of formula.entries.entries()) {
        yield* getFormulasInFormula(entry.formula, [
          ...path,
          'entries',
          key,
          'formula',
        ])
      }
      break
    case 'function':
      for (const [key, arg] of (
        (formula.arguments as typeof formula.arguments | undefined) ?? []
      ).entries()) {
        yield* getFormulasInFormula(arg.formula, [
          ...path,
          'arguments',
          key,
          'formula',
        ])
      }
      break
    case 'array':
    case 'or':
    case 'and':
    case 'apply':
    case 'object':
      for (const [key, arg] of (
        (formula.arguments as typeof formula.arguments | undefined) ?? []
      ).entries()) {
        yield* getFormulasInFormula(arg.formula, [
          ...path,
          'arguments',
          key,
          'formula',
        ])
      }
      break
    case 'switch':
      for (const [key, c] of formula.cases.entries()) {
        yield* getFormulasInFormula(c.condition, [
          ...path,
          'cases',
          key,
          'condition',
        ])
        yield* getFormulasInFormula(c.formula, [
          ...path,
          'cases',
          key,
          'formula',
        ])
      }
      yield* getFormulasInFormula(formula.default, [...path, 'default'])
      break
  }
}
export function* getFormulasInAction(
  action: ActionModel | null,
  path: (string | number)[] = [],
): Generator<[(string | number)[], Formula]> {
  if (!isDefined(action)) {
    return
  }

  switch (action.type) {
    case 'Fetch':
      for (const [inputKey, input] of Object.entries(action.inputs ?? {})) {
        yield* getFormulasInFormula(input.formula, [
          ...path,
          'input',
          inputKey,
          'formula',
        ])
      }
      for (const [key, a] of Object.entries(action.onSuccess?.actions ?? {})) {
        yield* getFormulasInAction(a, [...path, 'onSuccess', 'actions', key])
      }
      for (const [key, a] of Object.entries(action.onError?.actions ?? {})) {
        yield* getFormulasInAction(a, [...path, 'onError', 'actions', key])
      }
      break
    case 'Custom':
    case undefined:
      if (isFormula(action.data)) {
        yield* getFormulasInFormula(action.data, [...path, 'data'])
      }
      for (const [key, a] of Object.entries(action.arguments ?? {})) {
        yield* getFormulasInFormula(a.formula, [
          ...path,
          'arguments',
          key,
          'formula',
        ])
      }

      for (const [eventKey, event] of Object.entries(action.events ?? {})) {
        for (const [key, a] of Object.entries(event.actions ?? {})) {
          yield* getFormulasInAction(a, [
            ...path,
            'events',
            eventKey,
            'actions',
            key,
          ])
        }
      }
      break
    case 'SetVariable':
    case 'SetURLParameter':
    case 'TriggerEvent':
      yield* getFormulasInFormula(action.data, [...path, 'data'])
      break
    case 'TriggerWorkflow':
      for (const [key, a] of Object.entries(action.parameters ?? {})) {
        yield* getFormulasInFormula(a.formula, [
          ...path,
          'parameters',
          key,
          'formula',
        ])
      }
      break
    case 'Switch':
      if (isDefined(action.data) && isFormula(action.data)) {
        yield* getFormulasInFormula(action.data, [...path, 'data'])
      }
      for (const [key, c] of action.cases.entries()) {
        yield* getFormulasInFormula(c.condition, [
          ...path,
          'cases',
          key,
          'condition',
        ])
        for (const [actionKey, a] of Object.entries(c.actions)) {
          yield* getFormulasInAction(a, [
            ...path,
            'cases',
            key,
            'actions',
            actionKey,
          ])
        }
      }
      for (const [actionKey, a] of Object.entries(action.default.actions)) {
        yield* getFormulasInAction(a, [
          ...path,
          'default',
          'actions',
          actionKey,
        ])
      }
      break
  }
}
