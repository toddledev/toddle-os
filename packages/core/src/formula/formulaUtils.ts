import type { ActionModel } from '../component/component.types'
import { isDefined } from '../utils/util'
import {
  Formula,
  FunctionOperation,
  isFormula,
  PathOperation,
  ValueOperation,
} from './formula'
import { GlobalFormulas, isToddleFormula, PluginFormula } from './formulaTypes'

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

export function* getFormulasInFormula<Handler>(
  formula: Formula | undefined | null,
  globalFormulas: GlobalFormulas<Handler>,
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
        yield* getFormulasInFormula(entry.formula, globalFormulas, [
          ...path,
          'entries',
          key,
          'formula',
        ])
      }
      break
    case 'function': {
      for (const [key, arg] of (
        (formula.arguments as typeof formula.arguments | undefined) ?? []
      ).entries()) {
        yield* getFormulasInFormula(arg.formula, globalFormulas, [
          ...path,
          'arguments',
          key,
          'formula',
        ])
      }
      // Lookup the actual function and traverse its potential formula references
      let globalFormula: PluginFormula<Handler> | undefined
      if (formula.package) {
        globalFormula =
          globalFormulas.packages?.[formula.package]?.formulas?.[formula.name]
      } else {
        globalFormula = globalFormulas.formulas?.[formula.name]
      }
      if (globalFormula && isToddleFormula(globalFormula)) {
        yield* getFormulasInFormula(globalFormula.formula, globalFormulas, [
          ...path,
          'formula',
        ])
      }
      break
    }
    case 'array':
    case 'or':
    case 'and':
    case 'apply':
    case 'object':
      for (const [key, arg] of (
        (formula.arguments as typeof formula.arguments | undefined) ?? []
      ).entries()) {
        yield* getFormulasInFormula(arg.formula, globalFormulas, [
          ...path,
          'arguments',
          key,
          'formula',
        ])
      }
      break
    case 'switch':
      for (const [key, c] of formula.cases.entries()) {
        yield* getFormulasInFormula(c.condition, globalFormulas, [
          ...path,
          'cases',
          key,
          'condition',
        ])
        yield* getFormulasInFormula(c.formula, globalFormulas, [
          ...path,
          'cases',
          key,
          'formula',
        ])
      }
      yield* getFormulasInFormula(formula.default, globalFormulas, [
        ...path,
        'default',
      ])
      break
  }
}
export function* getFormulasInAction<Handler>(
  action: ActionModel | null,
  globalFormulas: GlobalFormulas<Handler>,
  path: (string | number)[] = [],
): Generator<[(string | number)[], Formula]> {
  if (!isDefined(action)) {
    return
  }

  switch (action.type) {
    case 'Fetch':
      for (const [inputKey, input] of Object.entries(action.inputs ?? {})) {
        yield* getFormulasInFormula(input.formula, globalFormulas, [
          ...path,
          'input',
          inputKey,
          'formula',
        ])
      }
      for (const [key, a] of Object.entries(action.onSuccess?.actions ?? {})) {
        yield* getFormulasInAction(a, globalFormulas, [
          ...path,
          'onSuccess',
          'actions',
          key,
        ])
      }
      for (const [key, a] of Object.entries(action.onError?.actions ?? {})) {
        yield* getFormulasInAction(a, globalFormulas, [
          ...path,
          'onError',
          'actions',
          key,
        ])
      }
      break
    case 'Custom':
    case undefined:
      if (isFormula(action.data)) {
        yield* getFormulasInFormula(action.data, globalFormulas, [
          ...path,
          'data',
        ])
      }
      for (const [key, a] of Object.entries(action.arguments ?? {})) {
        yield* getFormulasInFormula(a.formula, globalFormulas, [
          ...path,
          'arguments',
          key,
          'formula',
        ])
      }

      for (const [eventKey, event] of Object.entries(action.events ?? {})) {
        for (const [key, a] of Object.entries(event.actions ?? {})) {
          yield* getFormulasInAction(a, globalFormulas, [
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
      yield* getFormulasInFormula(action.data, globalFormulas, [
        ...path,
        'data',
      ])
      break
    case 'TriggerWorkflow':
      for (const [key, a] of Object.entries(action.parameters ?? {})) {
        yield* getFormulasInFormula(a.formula, globalFormulas, [
          ...path,
          'parameters',
          key,
          'formula',
        ])
      }
      break
    case 'Switch':
      if (isDefined(action.data) && isFormula(action.data)) {
        yield* getFormulasInFormula(action.data, globalFormulas, [
          ...path,
          'data',
        ])
      }
      for (const [key, c] of action.cases.entries()) {
        yield* getFormulasInFormula(c.condition, globalFormulas, [
          ...path,
          'cases',
          key,
          'condition',
        ])
        for (const [actionKey, a] of Object.entries(c.actions)) {
          yield* getFormulasInAction(a, globalFormulas, [
            ...path,
            'cases',
            key,
            'actions',
            actionKey,
          ])
        }
      }
      for (const [actionKey, a] of Object.entries(action.default.actions)) {
        yield* getFormulasInAction(a, globalFormulas, [
          ...path,
          'default',
          'actions',
          actionKey,
        ])
      }
      break
  }
}
