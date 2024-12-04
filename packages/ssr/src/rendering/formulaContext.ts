import type { PageComponent } from '@toddledev/core/dist/component/component.types'
import {
  applyFormula,
  FormulaContext,
  ToddleServerEnv,
} from '@toddledev/core/dist/formula/formula'
import { mapValues } from '@toddledev/core/dist/utils/collections'
import { isDefined } from '@toddledev/core/dist/utils/util'
import { getPathSegments } from '../routing/routing'
import { getRequestCookies } from './cookies'
import { escapeSearchParameters } from './request'

/**
 * Builds a FormulaContext that can be used to evaluate formulas for a page component
 * It also initializes data->Variables with their initial values based on the FormulaContext
 */
export const getPageFormulaContext = ({
  branchName,
  component,
  req,
}: {
  branchName: string
  component: PageComponent
  req: Request
}): FormulaContext => {
  const env = serverEnv({ req, branchName })
  const { searchParamsWithDefaults, hash, combinedParams, url } = getParameters(
    { component, req },
  )
  const formulaContext: FormulaContext = {
    data: {
      Location: {
        page: component.page ?? '',
        path: url.pathname,
        params: combinedParams,
        query: searchParamsWithDefaults,
        hash,
      },
      Attributes: combinedParams,
      // Path and query parameters are referenced in a flat structure in formulas
      // hence, we need to merge them. We prefer path parameters over query parameters
      // in case of naming collisions
      'URL parameters': {
        ...searchParamsWithDefaults,
        ...combinedParams,
      } as Record<string, string>,
      Apis: {} as Record<string, any>,
    },
    component,
    root: null,
    package: undefined,
    env,
  }
  formulaContext.data.Variables = mapValues(
    component.variables,
    ({ initialValue }) => {
      return applyFormula(initialValue, formulaContext)
    },
  )
  return formulaContext
}

const getParameters = ({
  component,
  req,
}: {
  component: PageComponent
  req: Request
}) => {
  const url = new URL(req.url)
  const searchParams = [
    ...escapeSearchParameters(url.searchParams).entries(),
  ].reduce<
    Record<string, string | null>
    // avoid undefined values in the searchParams
  >(
    (params, [key, val]) => ({
      ...params,
      [key]: val ?? null,
    }),
    {},
  )
  const params: Record<string, string | null> = { ...searchParams }
  const pathSegments = getPathSegments(url)
  component.route?.path.forEach((p, i) => {
    if (p.type === 'param') {
      if (isDefined(pathSegments[i]) && typeof pathSegments[i] === 'string') {
        params[p.name] = pathSegments[i]
      } else {
        // Explicitly set path parameters to null by default
        // to avoid undefined values when serializing for the runtime
        params[p.name] = null
      }
    }
  })

  // Explicitly set all query params to null by default
  // to avoid undefined values in the runtime
  const defaultQueryParams = Object.keys(component.route?.query ?? {}).reduce<
    Record<string, null>
  >((params, key) => ({ ...params, [key]: null }), {})
  return {
    combinedParams: params,
    hash: url.hash.slice(1),
    searchParamsWithDefaults: { ...defaultQueryParams, ...searchParams },
    url,
  }
}

export const serverEnv = ({
  branchName,
  req,
}: {
  branchName: string
  req: Request
}) =>
  ({
    branchName: branchName,
    // isServer will be true for SSR + proxied requests
    isServer: true,
    request: {
      headers: Object.fromEntries(req.headers.entries()),
      cookies: getRequestCookies(req),
      url: req.url,
    },
  }) as ToddleServerEnv
