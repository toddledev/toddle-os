import { ApiStatus, LegacyApiStatus } from '@toddledev/core/dist/api/apiTypes'
import {
  Component,
  ComponentData,
} from '@toddledev/core/dist/component/component.types'
import {
  applyFormula,
  ToddleServerEnv,
} from '@toddledev/core/dist/formula/formula'
import { mapValues } from '@toddledev/core/dist/utils/collections'
import { renderComponent } from './renderComponent'

export const createComponent = async ({
  apis,
  attrs,
  children,
  component,
  contexts,
  env,
  instance,
  packageName,
}: {
  component: Component
  attrs: Record<string, any>
  env: ToddleServerEnv
  children?: Record<string, string>
  contexts?: Record<string, Record<string, any>>
  packageName: string | undefined
  instance: Record<string, string>
  apis: Record<
    string,
    | LegacyApiStatus
    | (ApiStatus & {
        inputs?: Record<string, unknown>
      })
  >
}): Promise<string> => {
  const data: ComponentData = {
    Location,
    Attributes: attrs,
    Contexts: contexts,
    Variables: mapValues(component.variables, ({ initialValue }) => {
      return applyFormula(initialValue, formulaContext)
    }),
    Apis: apis,
  }
  data.Contexts = {
    ...data.Contexts,
    ...Object.fromEntries(
      Object.entries(component.formulas ?? {})
        .filter(([, formula]) => formula.exposeInContext)
        .map(([key, formula]) => [
          key,
          applyFormula(formula.formula, {
            ...formulaContext,
            data,
          }),
        ]),
    ),
  }

  return renderComponent({
    component,
    data,
    children,
    packageName,
    instance,
    env,
  })
}
