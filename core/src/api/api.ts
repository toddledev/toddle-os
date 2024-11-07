import {
  ApiMethod,
  ApiPerformance,
  ApiRequest,
  ComponentAPI,
  LegacyComponentAPI,
  ToddleRequestInit,
} from '@toddle/core/src/api/apiTypes'
import { LegacyToddleApi } from '@toddle/core/src/api/LegacyToddleApi'
import { ToddleApiV2 } from '@toddle/core/src/api/ToddleApiV2'
import {
  applyFormula,
  Formula,
  FormulaContext,
} from '@toddle/core/src/formula/formula'
import { omitKeys, sortObjectEntries } from '@toddle/core/src/utils/collections'
import { sha1 } from '@toddle/core/src/utils/sha1'
import { isDefined, isObject, toBoolean } from '@toddle/core/src/utils/util'

export const NON_BODY_RESPONSE_CODES = [101, 204, 205, 304]

export const isLegacyApi = (
  api: ComponentAPI | LegacyToddleApi | ToddleApiV2,
): api is LegacyComponentAPI | LegacyToddleApi =>
  api instanceof LegacyToddleApi ? true : !('version' in api)

export const createApiRequest = ({
  api,
  formulaContext,
  baseUrl,
  defaultHeaders,
}: {
  api: ApiRequest | ToddleApiV2
  formulaContext: FormulaContext
  baseUrl?: string
  defaultHeaders: Headers | undefined
}) => {
  const url = getUrl(api, formulaContext, baseUrl)
  const requestSettings = getRequestSettings({
    api,
    formulaContext,
    defaultHeaders,
  })

  return { url, requestSettings }
}

const getUrl = (
  api: ApiRequest | ToddleApiV2,
  formulaContext: FormulaContext,
  baseUrl?: string,
): URL => {
  const url = applyFormula(api.url, formulaContext)
  const path = getRequestPath(api.path, formulaContext)
  const queryParams = getRequestQueryParams(api.queryParams, formulaContext)
  const queryString =
    [...queryParams.entries()].length > 0 ? `?${queryParams.toString()}` : ''
  return new URL(
    `${url}${
      typeof url === 'string' && !url.endsWith('/') && path ? '/' : ''
    }${path}${queryString}`,
    baseUrl,
  )
}

const HttpMethodsWithAllowedBody: ApiMethod[] = [
  ApiMethod.POST,
  ApiMethod.DELETE,
  ApiMethod.PUT,
  ApiMethod.PATCH,
  ApiMethod.OPTIONS,
]

export const applyAbortSignal = (
  api: ApiRequest,
  requestSettings: RequestInit,
  formulaContext: FormulaContext,
) => {
  if (api.timeout) {
    const timeout = applyFormula(api.timeout.formula, formulaContext)
    if (typeof timeout === 'number' && !Number.isNaN(timeout) && timeout > 0) {
      requestSettings.signal = AbortSignal.timeout(timeout)
    }
  }
}

const getRequestSettings = ({
  api,
  formulaContext,
  defaultHeaders,
}: {
  api: ApiRequest
  formulaContext: FormulaContext
  defaultHeaders: Headers | undefined
}): ToddleRequestInit => {
  const method = Object.values(ApiMethod).includes(api.method as ApiMethod)
    ? (api.method as ApiMethod)
    : ApiMethod.GET
  const headers = getRequestHeaders({
    apiHeaders: api.headers,
    formulaContext,
    defaultHeaders,
  })
  const body = getRequestBody({ api, formulaContext, headers, method })
  if (headers.get('content-type') === 'multipart/form-data') {
    headers.delete('content-type')
  }

  const requestSettings: ToddleRequestInit = {
    method,
    headers,
    body,
  }

  applyAbortSignal(api, requestSettings, formulaContext)

  return requestSettings
}

export const getRequestPath = (
  path: ApiRequest['path'],
  formulaContext: FormulaContext,
): string =>
  sortObjectEntries(path ?? {}, ([_, p]) => p.index)
    .map(([_, p]) => applyFormula(p.formula, formulaContext))
    .join('/')

export const getRequestQueryParams = (
  params: ApiRequest['queryParams'],
  formulaContext: FormulaContext,
): URLSearchParams => {
  const queryParams = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([key, param]) => {
    const enabled = isDefined(param.enabled)
      ? applyFormula(param.enabled, formulaContext)
      : true
    if (!enabled) {
      return
    }

    const value = applyFormula(param.formula, formulaContext)
    if (!isDefined(value)) {
      // Ignore null/undefined values
      return
    }
    if (Array.isArray(value)) {
      // Support encoding 1-dimensional arrays
      value.forEach((v) => queryParams.append(key, String(v)))
    } else if (isObject(value)) {
      // Support encoding (nested) objects, but cast any non-object to a String
      const encodeObject = (obj: Record<string, any>, prefix: string) => {
        Object.entries(obj).forEach(([key, val]) => {
          if (!Array.isArray(val) && isObject(val)) {
            return encodeObject(val, `${prefix}[${key}]`)
          } else {
            queryParams.set(`${prefix}[${key}]`, String(val))
          }
        })
      }
      encodeObject(value, key)
    } else {
      queryParams.set(key, String(value))
    }
  })
  return queryParams
}

export const getRequestHeaders = ({
  apiHeaders,
  formulaContext,
  defaultHeaders,
}: {
  apiHeaders: ApiRequest['headers']
  formulaContext: FormulaContext
  defaultHeaders: Headers | undefined
}) => {
  const headers = new Headers(defaultHeaders)
  Object.entries(apiHeaders ?? {}).forEach(([key, param]) => {
    const enabled = isDefined(param.enabled)
      ? applyFormula(param.enabled, formulaContext)
      : true
    if (enabled) {
      const value = applyFormula(param.formula, formulaContext)
      if (isDefined(value)) {
        headers.set(
          key.trim(),
          (typeof value === 'string' ? value : String(value)).trim(),
        )
      }
    }
  })
  return headers
}

export const getBaseUrl = ({
  origin,
  url,
}: {
  origin: string
  url?: string
}) =>
  !isDefined(url) || url === '' || url.startsWith('/') ? origin + url : url

/**
 * Calculate the hash of a Request object based on its properties
 */
export const requestHash = (url: URL, request: RequestInit) =>
  sha1(
    JSON.stringify({
      url: url.href,
      method: request.method,
      headers: omitKeys(
        Object.fromEntries(Object.entries(request.headers ?? {})),
        ['host', 'cookie'],
      ),
      body: request.body ?? null,
    }),
  )

export const isApiError = ({
  apiName,
  response,
  formulaContext,
  errorFormula,
  performance,
}: {
  apiName: string
  response: {
    ok: boolean
    status?: number
    headers?: Record<string, string> | null
    body: unknown
  }
  formulaContext: FormulaContext
  performance: ApiPerformance
  errorFormula?: { formula: Formula } | null
}) => {
  const errorFormulaRes = errorFormula
    ? applyFormula(errorFormula.formula, {
        component: formulaContext.component,
        package: formulaContext.package,
        toddle: formulaContext.toddle,
        data: {
          Attributes: {},
          Args: formulaContext.data.Args,
          Apis: {
            // The errorFormula will only have access to the data of the current API
            [apiName]: {
              isLoading: false,
              data: response.body,
              error: null,
              response: {
                status: response.status,
                headers: response.headers,
                performance,
              },
            },
          },
        },
        env: formulaContext.env,
      })
    : null

  if (errorFormulaRes === null || errorFormulaRes === undefined) {
    return !response.ok
  }
  return toBoolean(errorFormulaRes)
}

const getRequestBody = ({
  api,
  formulaContext,
  headers,
  method,
}: {
  api: ApiRequest
  formulaContext: FormulaContext
  headers: Headers
  method: ApiMethod
}): FormData | string | undefined => {
  if (!api.body || !HttpMethodsWithAllowedBody.includes(method)) {
    return
  }

  const body = applyFormula(api.body, formulaContext)
  if (!body) {
    return
  }
  switch (headers.get('content-type')) {
    case 'application/x-www-form-urlencoded': {
      if (typeof body === 'object' && body !== null) {
        return Object.entries(body)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return value
                .map(
                  (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`,
                )
                .join('&')
            } else {
              return `${encodeURIComponent(key)}=${encodeURIComponent(
                String(value),
              )}`
            }
          })
          .join('&')
      }
      return ''
    }
    case 'multipart/form-data': {
      const formData = new FormData()
      if (typeof body === 'object' && body !== null) {
        Object.entries(body).forEach(([key, value]) => {
          formData.set(key, value as string | Blob)
        })
      }
      return formData
    }
    case 'text/plain':
      return String(body)
    default:
      return JSON.stringify(body)
  }
}

export const createApiEvent = (
  eventName: 'message' | 'success' | 'failed',
  detail: any,
) => {
  return new CustomEvent(eventName, {
    detail,
  })
}