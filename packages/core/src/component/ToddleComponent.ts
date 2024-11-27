import { isLegacyApi } from '../api/api'
import { LegacyToddleApi } from '../api/LegacyToddleApi'
import { ToddleApiV2 } from '../api/ToddleApiV2'
import { Formula, FunctionOperation } from '../formula/formula'
import { GlobalFormulas } from '../formula/formulaTypes'
import {
  getFormulasInAction,
  getFormulasInFormula,
} from '../formula/formulaUtils'
import { isDefined } from '../utils/util'
import { getActionsInAction } from './actionUtils'
import type { ActionModel, Component, NodeModel } from './component.types'
import { isPageComponent } from './isPageComponent'

export class ToddleComponent<Handler> {
  private component: Component
  private globalFormulas: GlobalFormulas<Handler>
  private getComponent: (
    name: string,
    packageName?: string,
  ) => Component | undefined
  public packageName?: string

  constructor({
    component,
    getComponent,
    packageName,
    globalFormulas,
  }: {
    component: Component
    getComponent: (name: string, packageName?: string) => Component | undefined
    packageName: string | undefined
    globalFormulas: GlobalFormulas<Handler>
  }) {
    this.component = component
    this.getComponent = getComponent
    this.packageName = packageName
    this.globalFormulas = globalFormulas
  }

  get uniqueSubComponents(): ToddleComponent<Handler>[] {
    const components = new Map<string, ToddleComponent<Handler>>()

    const visitNode = (packageName?: string) => (node: NodeModel) => {
      if (node.type !== 'component') {
        return
      }
      if (components.has(node.name)) {
        return
      }
      const component = this.getComponent(
        node.name,
        node.package ?? packageName,
      )
      if (!component) {
        return
      }
      components.set(
        component.name,
        new ToddleComponent({
          component,
          getComponent: this.getComponent,
          packageName: node.package ?? packageName,
          globalFormulas: this.globalFormulas,
        }),
      )
      Object.values(component.nodes).forEach(
        visitNode(node.package ?? packageName),
      )
    }
    Object.values(this.nodes).forEach(visitNode())
    return [...components.values()]
  }

  get formulaReferences() {
    return new Set(
      Array.from(this.formulasInComponent())
        .filter(([, f]) => f.type === 'function')
        .map<FunctionOperation>(([, f]) => f as FunctionOperation)
        .map((f) => [f.package, f.name].filter(isDefined).join('/')),
    )
  }

  get actionReferences(): Set<string> {
    return new Set(
      Array.from(this.actionModelsInComponent()).map(([, a]) =>
        a.type === 'Custom' || a.type === undefined
          ? [a.package, a.name].filter(isDefined).join('/')
          : a.type,
      ),
    )
  }

  /**
   * Traverse all formulas in the component.
   * @returns An iterable that yields the path and formula.
   */
  *formulasInComponent(): Generator<[(string | number)[], Formula]> {
    const globalFormulas = this.globalFormulas
    function* visitNode(
      node: NodeModel,
      path: (string | number)[] = [],
    ): Generator<[(string | number)[], Formula]> {
      switch (node.type) {
        case 'text':
          yield* getFormulasInFormula(node.condition, globalFormulas, [
            ...path,
            'condition',
          ])
          yield* getFormulasInFormula(node.repeat, globalFormulas, [
            ...path,
            'repeat',
          ])
          yield* getFormulasInFormula(node.repeatKey, globalFormulas, [
            ...path,
            'repeatKey',
          ])
          yield* getFormulasInFormula(node.value, globalFormulas, [
            ...path,
            'value',
          ])
          break
        case 'slot':
          yield* getFormulasInFormula(node.condition, globalFormulas, [
            ...path,
            'condition',
          ])
          break
        case 'component':
          yield* getFormulasInFormula(node.condition, globalFormulas, [
            ...path,
            'condition',
          ])
          yield* getFormulasInFormula(node.repeat, globalFormulas, [
            ...path,
            'repeat',
          ])
          yield* getFormulasInFormula(node.repeatKey, globalFormulas, [
            ...path,
            'repeatKey',
          ])
          for (const [attrKey, attr] of Object.entries(node.attrs ?? {})) {
            yield* getFormulasInFormula(attr, globalFormulas, [
              ...path,
              'attrs',
              attrKey,
            ])
          }
          for (const [eventKey, event] of Object.entries(node.events ?? {})) {
            for (const [actionKey, action] of Object.entries(
              event?.actions ?? {},
            )) {
              yield* getFormulasInAction(action, globalFormulas, [
                ...path,
                'events',
                eventKey,
                'actions',
                actionKey,
              ])
            }
          }
          break
        case 'element':
          yield* getFormulasInFormula(node.condition, globalFormulas, [
            ...path,
            'condition',
          ])
          yield* getFormulasInFormula(node.repeat, globalFormulas, [
            ...path,
            'repeat',
          ])
          yield* getFormulasInFormula(node.repeatKey, globalFormulas, [
            ...path,
            'repeatKey',
          ])
          for (const [attrKey, attr] of Object.entries(node.attrs ?? {})) {
            yield* getFormulasInFormula(attr, globalFormulas, [
              ...path,
              'attrs',
              attrKey,
            ])
          }
          for (const [eventKey, event] of Object.entries(node.events ?? {})) {
            for (const [actionKey, a] of Object.entries(event?.actions ?? {})) {
              yield* getFormulasInAction(a, globalFormulas, [
                ...path,
                'events',
                eventKey,
                'actions',
                actionKey,
              ])
            }
          }
          for (const [classKey, c] of Object.entries(node.classes ?? {})) {
            yield* getFormulasInFormula(c.formula, globalFormulas, [
              ...path,
              'classes',
              classKey,
              'formula',
            ])
          }

          for (const [styleVariableKey, styleVariable] of Object.entries(
            node['style-variables'] ?? {},
          )) {
            yield* getFormulasInFormula(styleVariable.formula, globalFormulas, [
              ...path,
              'style-variables',
              styleVariableKey,
              'formula',
            ])
          }
          break
      }
    }

    yield* getFormulasInFormula(
      this.route?.info?.language?.formula,
      globalFormulas,
      ['route', 'info', 'language', 'formula'],
    )
    yield* getFormulasInFormula(
      this.route?.info?.title?.formula,
      globalFormulas,
      ['route', 'info', 'title', 'formula'],
    )
    yield* getFormulasInFormula(
      this.route?.info?.description?.formula,
      globalFormulas,
      ['route', 'info', 'description', 'formula'],
    )
    yield* getFormulasInFormula(
      this.route?.info?.icon?.formula,
      globalFormulas,
      ['route', 'info', 'icon', 'formula'],
    )
    yield* getFormulasInFormula(
      this.route?.info?.charset?.formula,
      globalFormulas,
      ['route', 'info', 'charset', 'formula'],
    )
    for (const [metaKey, meta] of Object.entries(
      this.route?.info?.meta ?? {},
    )) {
      yield* getFormulasInFormula(meta.content, globalFormulas, [
        'route',
        'info',
        'meta',
        metaKey,
        'content',
      ])
      for (const [attrKey, a] of Object.entries(meta.attrs)) {
        yield* getFormulasInFormula(a, globalFormulas, [
          'route',
          'info',
          'meta',
          metaKey,
          'attrs',
          attrKey,
        ])
      }
    }
    for (const [formulaKey, formula] of Object.entries(this.formulas ?? {})) {
      yield* getFormulasInFormula(formula.formula, globalFormulas, [
        'formulas',
        formulaKey,
        'formula',
      ])
    }
    for (const [variableKey, variable] of Object.entries(
      this.variables ?? {},
    )) {
      yield* getFormulasInFormula(variable.initialValue, globalFormulas, [
        'variables',
        variableKey,
        'initialValue',
      ])
    }
    for (const [workflowKey, workflow] of Object.entries(
      this.workflows ?? {},
    )) {
      for (const [actionKey, action] of workflow.actions.entries()) {
        yield* getFormulasInAction(action, globalFormulas, [
          'workflows',
          workflowKey,
          'actions',
          actionKey,
        ])
      }
    }
    for (const [, api] of Object.entries(this.apis)) {
      yield* api.formulasInApi()
    }
    for (const [actionKey, action] of Object.entries(
      this.component.onLoad?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, globalFormulas, [
        'onLoad',
        'actions',
        actionKey,
      ])
    }
    for (const [actionKey, action] of Object.entries(
      this.component.onAttributeChange?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, globalFormulas, [
        'onAttributeChange',
        'actions',
        actionKey,
      ])
    }
    // Visit all component formulas in case they reference other formulas
    for (const [key, componentFormula] of Object.entries(
      this.component.formulas ?? {},
    )) {
      yield* getFormulasInFormula(componentFormula.formula, globalFormulas, [
        'formulas',
        key,
        'formula',
      ])
    }
    for (const [nodeKey, node] of Object.entries(this.nodes ?? {})) {
      yield* visitNode(node, ['nodes', nodeKey])
    }
  }

  /**
   * Traverse all actions in the component.
   * @returns An iterable that yields the path and action.
   */
  *actionModelsInComponent(): Generator<[(string | number)[], ActionModel]> {
    function* visitNode(
      node: NodeModel,
      path: (string | number)[] = [],
    ): Generator<[(string | number)[], ActionModel]> {
      switch (node.type) {
        case 'text':
        case 'slot':
          break
        case 'component':
        case 'element':
          for (const [eventKey, event] of Object.entries(node.events ?? {})) {
            for (const [actionKey, a] of Object.entries(event?.actions ?? {})) {
              yield* getActionsInAction(a, [
                ...path,
                'events',
                eventKey,
                'actions',
                actionKey,
              ])
            }
          }
          break
      }
    }

    for (const [workflowKey, workflow] of Object.entries(
      this.workflows ?? {},
    )) {
      for (const [key, a] of Object.entries(workflow?.actions ?? {})) {
        yield* getActionsInAction(a, ['workflows', workflowKey, 'actions', key])
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    for (const [apiKey, api] of Object.entries(this.apis ?? {})) {
      if (!isLegacyApi(api)) {
        yield* api.actionModelsInApi()
        continue
      }

      // Legacy API
      for (const [actionKey, a] of Object.entries(
        api.onCompleted?.actions ?? {},
      )) {
        yield* getActionsInAction(a, [
          'apis',
          apiKey,
          'onCompleted',
          'actions',
          actionKey,
        ])
      }
      for (const [actionKey, a] of Object.entries(
        api.onFailed?.actions ?? {},
      )) {
        yield* getActionsInAction(a, [
          'apis',
          apiKey,
          'onFailed',
          'actions',
          actionKey,
        ])
      }
    }
    for (const [actionKey, action] of Object.entries(
      this.component.onLoad?.actions ?? {},
    )) {
      yield* getActionsInAction(action, ['onLoad', 'actions', actionKey])
    }
    for (const [actionKey, action] of Object.entries(
      this.component.onAttributeChange?.actions ?? {},
    )) {
      yield* getActionsInAction(action, [
        'onAttributeChange',
        'actions',
        actionKey,
      ])
    }
    for (const [nodeKey, node] of Object.entries(this.nodes ?? {})) {
      yield* visitNode(node, ['nodes', nodeKey])
    }
  }

  get formulas() {
    return this.component.formulas
  }

  get name() {
    return this.component.name
  }

  get route() {
    return this.component.route
  }

  get attributes() {
    return this.component.attributes
  }

  get variables() {
    return this.component.variables
  }

  get workflows() {
    return this.component.workflows
  }

  get apis() {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      Object.entries(this.component.apis ?? {}).map(([key, api]) => [
        key,
        isLegacyApi(api)
          ? new LegacyToddleApi(api, key, this.globalFormulas)
          : new ToddleApiV2(api, key, this.globalFormulas),
      ]),
    )
  }

  get nodes() {
    return this.component.nodes
  }

  get events() {
    return this.component.events
  }

  get onLoad() {
    return this.component.onLoad
  }

  get onAttributeChange() {
    return this.component.onAttributeChange
  }

  get isPage() {
    return isPageComponent(this.component)
  }
}
