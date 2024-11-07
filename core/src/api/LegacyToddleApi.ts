import { type LegacyComponentAPI } from '@toddle/core/src/api/apiTypes'
import { isFormula, type Formula } from '@toddle/core/src/formula/formula'
import { getFormulasInFormula } from '@toddle/core/src/formula/formulaUtils'
import { isDefined } from '@toddle/core/src/utils/util'
import { getFormulasInAction } from '../formula/formulaUtils'

export class LegacyToddleApi {
  private api: LegacyComponentAPI
  private key: string
  private _apiReferences?: Set<string>

  constructor(api: LegacyComponentAPI, key: string) {
    this.api = api
    this.key = key
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
    visitFormulaReference(this.api.autoFetch)
    visitFormulaReference(this.api.url)
    Object.values(this.api.path ?? {}).forEach((p) =>
      visitFormulaReference(p.formula),
    )
    Object.values(this.api.queryParams ?? {}).forEach((q) =>
      visitFormulaReference(q.formula),
    )

    // this is supporting a few legacy cases where the whole header object was set as a formula. This is no longer possible
    if (isFormula(this.api.headers)) {
      visitFormulaReference(this.api.headers)
    } else {
      Object.values(this.api.headers ?? {}).forEach((h) => {
        visitFormulaReference(h)
      })
    }
    visitFormulaReference(this.api.body)
    this._apiReferences = apis
    return apis
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
  get proxy() {
    return this.api.proxy
  }
  get queryParams() {
    return this.api.queryParams
  }
  get headers() {
    return this.api.headers
  }
  get method() {
    return this.api.method
  }
  get body() {
    return this.api.body
  }
  get auth() {
    return this.api.auth
  }
  get throttle() {
    return this.api.throttle
  }
  get debounce() {
    return this.api.debounce
  }
  get onCompleted() {
    return this.api.onCompleted
  }
  get onFailed() {
    return this.api.onFailed
  }
  *formulasInApi(): Generator<[(string | number)[], Formula]> {
    const api = this.api
    const apiKey = this.key
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
    }

    // this is supporting a few legacy cases where the whole header object was set as a formula. This is no longer possible
    if (isFormula(api.headers)) {
      yield* getFormulasInFormula(api.headers, ['apis', apiKey, 'headers'])
    } else {
      for (const [headerKey, header] of Object.entries(api.headers ?? {})) {
        yield* getFormulasInFormula(header, [
          'apis',
          apiKey,
          'headers',
          headerKey,
        ])
      }
    }

    yield* getFormulasInFormula(api.body, ['apis', apiKey, 'body'])
    for (const [actionKey, action] of Object.entries(
      api.onCompleted?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, [
        'apis',
        apiKey,
        'onCompleted',
        'actions',
        actionKey,
      ])
    }
    for (const [actionKey, action] of Object.entries(
      api.onFailed?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, [
        'apis',
        apiKey,
        'onFailed',
        'actions',
        actionKey,
      ])
    }
  }
}
