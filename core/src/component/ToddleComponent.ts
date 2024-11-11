import { LegacyToddleApi } from '../api/LegacyToddleApi'
import { getFormulasInAction } from '../formula/formulaUtils'
import { isLegacyApi } from '../src/api/api'
import { ToddleApiV2 } from '../src/api/ToddleApiV2'
import type {
  ActionModel,
  Component,
  NodeModel,
} from '../src/component/component.types'
import { isPageComponent } from '../src/component/isPageComponent'
import { Formula, FunctionOperation } from '../src/formula/formula'
import { getFormulasInFormula } from '../src/formula/formulaUtils'
import { isDefined } from '../src/utils/util'
import { getActionsInAction } from './actionUtils'

export class ToddleComponent {
  private component: Component
  private getComponent: (
    name: string,
    packageName?: string,
  ) => Component | undefined
  public packageName?: string

  constructor({
    component,
    getComponent,
    packageName,
  }: {
    component: Component
    getComponent: (name: string, packageName?: string) => Component | undefined
    packageName: string | undefined
  }) {
    this.component = component
    this.getComponent = getComponent
    this.packageName = packageName
  }

  get uniqueSubComponents(): ToddleComponent[] {
    const components = new Map<string, ToddleComponent>()

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
    function* visitNode(
      node: NodeModel,
      path: (string | number)[] = [],
    ): Generator<[(string | number)[], Formula]> {
      switch (node.type) {
        case 'text':
          yield* getFormulasInFormula(node.condition, [...path, 'condition'])
          yield* getFormulasInFormula(node.repeat, [...path, 'repeat'])
          yield* getFormulasInFormula(node.repeatKey, [...path, 'repeatKey'])
          yield* getFormulasInFormula(node.value, [...path, 'value'])
          break
        case 'slot':
          yield* getFormulasInFormula(node.condition, [...path, 'condition'])
          break
        case 'component':
          yield* getFormulasInFormula(node.condition, [...path, 'condition'])
          yield* getFormulasInFormula(node.repeat, [...path, 'repeat'])
          yield* getFormulasInFormula(node.repeatKey, [...path, 'repeatKey'])
          for (const [attrKey, attr] of Object.entries(node.attrs ?? {})) {
            yield* getFormulasInFormula(attr, [...path, 'attrs', attrKey])
          }
          for (const [eventKey, event] of Object.entries(node.events ?? {})) {
            for (const [actionKey, action] of Object.entries(
              event?.actions ?? {},
            )) {
              yield* getFormulasInAction(action, [
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
          yield* getFormulasInFormula(node.condition, [...path, 'condition'])
          yield* getFormulasInFormula(node.repeat, [...path, 'repeat'])
          yield* getFormulasInFormula(node.repeatKey, [...path, 'repeatKey'])
          for (const [attrKey, attr] of Object.entries(node.attrs ?? {})) {
            yield* getFormulasInFormula(attr, [...path, 'attrs', attrKey])
          }
          for (const [eventKey, event] of Object.entries(node.events ?? {})) {
            for (const [actionKey, a] of Object.entries(event?.actions ?? {})) {
              yield* getFormulasInAction(a, [
                ...path,
                'events',
                eventKey,
                'actions',
                actionKey,
              ])
            }
          }
          for (const [classKey, c] of Object.entries(node.classes ?? {})) {
            yield* getFormulasInFormula(c.formula, [
              ...path,
              'classes',
              classKey,
              'formula',
            ])
          }

          for (const [styleVariableKey, styleVariable] of Object.entries(
            node['style-variables'] ?? {},
          )) {
            yield* getFormulasInFormula(styleVariable.formula, [
              ...path,
              'style-variables',
              styleVariableKey,
              'formula',
            ])
          }
          break
      }
    }

    yield* getFormulasInFormula(this.route?.info?.language?.formula, [
      'route',
      'info',
      'language',
      'formula',
    ])
    yield* getFormulasInFormula(this.route?.info?.title?.formula, [
      'route',
      'info',
      'title',
      'formula',
    ])
    yield* getFormulasInFormula(this.route?.info?.description?.formula, [
      'route',
      'info',
      'description',
      'formula',
    ])
    yield* getFormulasInFormula(this.route?.info?.icon?.formula, [
      'route',
      'info',
      'icon',
      'formula',
    ])
    yield* getFormulasInFormula(this.route?.info?.charset?.formula, [
      'route',
      'info',
      'charset',
      'formula',
    ])
    for (const [metaKey, meta] of Object.entries(
      this.route?.info?.meta ?? {},
    )) {
      for (const [attrKey, a] of Object.entries(meta.attrs)) {
        yield* getFormulasInFormula(a, [
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
      yield* getFormulasInFormula(formula.formula, [
        'formulas',
        formulaKey,
        'formula',
      ])
    }
    for (const [variableKey, variable] of Object.entries(
      this.variables ?? {},
    )) {
      yield* getFormulasInFormula(variable.initialValue, [
        'variables',
        variableKey,
        'initialValue',
      ])
    }
    for (const [workflowKey, workflow] of Object.entries(
      this.workflows ?? {},
    )) {
      for (const [actionKey, action] of workflow.actions.entries()) {
        yield* getFormulasInAction(action, [
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
      yield* getFormulasInAction(action, ['onLoad', 'actions', actionKey])
    }
    for (const [actionKey, action] of Object.entries(
      this.component.onAttributeChange?.actions ?? {},
    )) {
      yield* getFormulasInAction(action, [
        'onAttributeChange',
        'actions',
        actionKey,
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
          ? new LegacyToddleApi(api, key)
          : new ToddleApiV2(api, key),
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
