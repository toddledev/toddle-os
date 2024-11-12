import { ApiRequest } from '../api/apiTypes'
import { getActionsInAction } from '../component/actionUtils'
import { ActionModel } from '../component/component.types'
import { type Formula } from '../formula/formula'
import {
  getFormulasInAction,
  getFormulasInFormula,
} from '../formula/formulaUtils'
import { isDefined } from '../utils/util'

export class ToddleApiV2 implements ApiRequest {
  private api: ApiRequest
  private _apiReferences?: Set<string>
  private key: string

  constructor(api: ApiRequest, apiKey: string) {
    this.api = api
    this.key = apiKey
  }

  get apiReferences(): Set<string> {
    if (this._apiReferences) {
      // Only compute apiReferences once
      return this._apiReferences
    }
    const apis = new Set<string>()
    const visitFormulaReference = (formula?: Formula | null) => {
      if (!isDefined(formula)) {
        return
      }
      switch (formula.type) {
        case 'path':
          if (formula.path[0] === 'Apis') {
            apis.add(formula.path[1])
          }
          break
        case 'value':
          break
        case 'record':
          formula.entries.forEach((entry) =>
            visitFormulaReference(entry.formula),
          )
          break
        case 'function':
        case 'array':
        case 'or':
        case 'and':
        case 'apply':
        case 'object':
          formula.arguments.forEach((arg) => visitFormulaReference(arg.formula))
          break
        case 'switch':
          formula.cases.forEach((c) => {
            visitFormulaReference(c.condition)
            visitFormulaReference(c.formula)
          })
          break
      }
    }
    // Since formulas for body, headers etc. can only use arguments, we only need to visit the
    // arguments to know which other APIs this API depends on
    Object.values(this.api.inputs).forEach((arg) =>
      visitFormulaReference(arg.formula),
    )

    this._apiReferences = apis
    return apis
  }

  get version() {
    return this.api.version
  }

  get name() {
    return this.api.name
  }

  get type() {
    return this.api.type
  }

  get autoFetch() {
    return this.api.autoFetch
  }

  get url() {
    return this.api.url
  }

  get path() {
    return this.api.path
  }

  get headers() {
    return this.api.headers
  }

  set headers(headers) {
    this.api.headers = headers
  }

  get method() {
    return this.api.method
  }

  get body() {
    return this.api.body
  }

  get inputs() {
    return this.api.inputs
  }

  get queryParams() {
    return this.api.queryParams
  }

  get server() {
    return this.api.server
  }

  get client() {
    return this.api.client
  }

  get redirectRules() {
    return this.api.redirectRules
  }

  get isError() {
    return this.api.isError
  }

  get timeout() {
    return this.api.timeout
  }

  *formulasInApi(): Generator<[(string | number)[], Formula]> {
    const api = this.api
    const apiKey = this.key
    for (const [input, value] of Object.entries(this.api.inputs)) {
      yield* getFormulasInFormula(value.formula, [
        'apis',
        apiKey,
        'inputs',
        input,
        'formula',
      ])
    }
    yield* getFormulasInFormula(api.autoFetch, ['apis', apiKey, 'autoFetch'])
    yield* getFormulasInFormula(api.url, ['apis', apiKey, 'url'])
    for (const [pathKey, path] of Object.entries(api.path ?? {})) {
      yield* getFormulasInFormula(path.formula, [
        'apis',
        apiKey,
        'path',
        pathKey,
        'formula',
      ])
    }
    for (const [queryParamKey, queryParam] of Object.entries(
      api.queryParams ?? {},
    )) {
      yield* getFormulasInFormula(queryParam.formula, [
        'apis',
        apiKey,
        'queryParams',
        queryParamKey,
        'formula',
      ])
      yield* getFormulasInFormula(queryParam.enabled, [
        'apis',
        apiKey,
        'queryParams',
        queryParamKey,
        'enabled',
      ])
    }

    for (const [headerKey, header] of Object.entries(api.headers ?? {})) {
      yield* getFormulasInFormula(header.formula, [
        'apis',
        apiKey,
        'headers',
        headerKey,
        'formula',
      ])
      yield* getFormulasInFormula(header.enabled, [
        'apis',
        apiKey,
        'headers',
        headerKey,
        'enabled',
      ])
    }

    yield* getFormulasInFormula(api.body, ['apis', apiKey, 'body'])
    for (const [actionKey, action] of Object.entries(
      api.client?.onCompleted?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, [
        'apis',
        apiKey,
        'client',
        'onCompleted',
        'actions',
        actionKey,
      ])
    }
    for (const [actionKey, action] of Object.entries(
      api.client?.onFailed?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, [
        'apis',
        apiKey,
        'client',
        'onFailed',
        'actions',
        actionKey,
      ])
    }
    yield* getFormulasInFormula(api.client?.debounce?.formula, [
      'apis',
      apiKey,
      'client',
      'debounce',
      'formula',
    ])
    for (const [actionKey, action] of Object.entries(
      api.client?.onMessage?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, [
        'apis',
        apiKey,
        'client',
        'onData',
        'actions',
        actionKey,
      ])
    }
    for (const [rule, value] of Object.entries(api.redirectRules ?? {})) {
      yield* getFormulasInFormula(value.formula, [
        'apis',
        apiKey,
        'redirectRules',
        rule,
        'formula',
      ])
    }
    yield* getFormulasInFormula(api.isError?.formula, [
      'apis',
      apiKey,
      'isError',
      'formula',
    ])
    yield* getFormulasInFormula(api.timeout?.formula, [
      'apis',
      apiKey,
      'timeout',
      'formula',
    ])
    yield* getFormulasInFormula(api.server?.proxy?.enabled.formula, [
      'apis',
      apiKey,
      'server',
      'proxy',
      'enabled',
      'formula',
    ])
    yield* getFormulasInFormula(api.server?.ssr?.enabled?.formula, [
      'apis',
      apiKey,
      'server',
      'ssr',
      'enabled',
      'formula',
    ])
  }

  *actionModelsInApi(): Generator<[(string | number)[], ActionModel]> {
    for (const [actionKey, action] of Object.entries(
      this.api.client?.onCompleted?.actions ?? {},
    )) {
      yield* getActionsInAction(action, [
        'apis',
        this.key,
        'client',
        'onCompleted',
        'actions',
        actionKey,
      ])
    }
    for (const [actionKey, action] of Object.entries(
      this.api.client?.onFailed?.actions ?? {},
    )) {
      yield* getActionsInAction(action, [
        'apis',
        this.key,
        'client',
        'onFailed',
        'actions',
        actionKey,
      ])
    }
    for (const [actionKey, action] of Object.entries(
      this.api.client?.onMessage?.actions ?? {},
    )) {
      yield* getActionsInAction(action, [
        'apis',
        this.key,
        'client',
        'onData',
        'actions',
        actionKey,
      ])
    }
  }
}
