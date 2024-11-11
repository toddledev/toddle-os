"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToddleComponent = void 0;
const LegacyToddleApi_1 = require("../api/LegacyToddleApi");
const formulaUtils_1 = require("../formula/formulaUtils");
const api_1 = require("../src/api/api");
const ToddleApiV2_1 = require("../src/api/ToddleApiV2");
const isPageComponent_1 = require("../src/component/isPageComponent");
const formulaUtils_2 = require("../src/formula/formulaUtils");
const util_1 = require("../src/utils/util");
const actionUtils_1 = require("./actionUtils");
class ToddleComponent {
    component;
    getComponent;
    packageName;
    constructor({ component, getComponent, packageName, }) {
        this.component = component;
        this.getComponent = getComponent;
        this.packageName = packageName;
    }
    get uniqueSubComponents() {
        const components = new Map();
        const visitNode = (packageName) => (node) => {
            if (node.type !== 'component') {
                return;
            }
            if (components.has(node.name)) {
                return;
            }
            const component = this.getComponent(node.name, node.package ?? packageName);
            if (!component) {
                return;
            }
            components.set(component.name, new ToddleComponent({
                component,
                getComponent: this.getComponent,
                packageName: node.package ?? packageName,
            }));
            Object.values(component.nodes).forEach(visitNode(node.package ?? packageName));
        };
        Object.values(this.nodes).forEach(visitNode());
        return [...components.values()];
    }
    get formulaReferences() {
        return new Set(Array.from(this.formulasInComponent())
            .filter(([, f]) => f.type === 'function')
            .map(([, f]) => f)
            .map((f) => [f.package, f.name].filter(util_1.isDefined).join('/')));
    }
    get actionReferences() {
        return new Set(Array.from(this.actionModelsInComponent()).map(([, a]) => a.type === 'Custom' || a.type === undefined
            ? [a.package, a.name].filter(util_1.isDefined).join('/')
            : a.type));
    }
    /**
     * Traverse all formulas in the component.
     * @returns An iterable that yields the path and formula.
     */
    *formulasInComponent() {
        function* visitNode(node, path = []) {
            switch (node.type) {
                case 'text':
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.condition, [...path, 'condition']);
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.repeat, [...path, 'repeat']);
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.repeatKey, [...path, 'repeatKey']);
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.value, [...path, 'value']);
                    break;
                case 'slot':
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.condition, [...path, 'condition']);
                    break;
                case 'component':
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.condition, [...path, 'condition']);
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.repeat, [...path, 'repeat']);
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.repeatKey, [...path, 'repeatKey']);
                    for (const [attrKey, attr] of Object.entries(node.attrs ?? {})) {
                        yield* (0, formulaUtils_2.getFormulasInFormula)(attr, [...path, 'attrs', attrKey]);
                    }
                    for (const [eventKey, event] of Object.entries(node.events ?? {})) {
                        for (const [actionKey, action] of Object.entries(event?.actions ?? {})) {
                            yield* (0, formulaUtils_1.getFormulasInAction)(action, [
                                ...path,
                                'events',
                                eventKey,
                                'actions',
                                actionKey,
                            ]);
                        }
                    }
                    break;
                case 'element':
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.condition, [...path, 'condition']);
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.repeat, [...path, 'repeat']);
                    yield* (0, formulaUtils_2.getFormulasInFormula)(node.repeatKey, [...path, 'repeatKey']);
                    for (const [attrKey, attr] of Object.entries(node.attrs ?? {})) {
                        yield* (0, formulaUtils_2.getFormulasInFormula)(attr, [...path, 'attrs', attrKey]);
                    }
                    for (const [eventKey, event] of Object.entries(node.events ?? {})) {
                        for (const [actionKey, a] of Object.entries(event?.actions ?? {})) {
                            yield* (0, formulaUtils_1.getFormulasInAction)(a, [
                                ...path,
                                'events',
                                eventKey,
                                'actions',
                                actionKey,
                            ]);
                        }
                    }
                    for (const [classKey, c] of Object.entries(node.classes ?? {})) {
                        yield* (0, formulaUtils_2.getFormulasInFormula)(c.formula, [
                            ...path,
                            'classes',
                            classKey,
                            'formula',
                        ]);
                    }
                    for (const [styleVariableKey, styleVariable] of Object.entries(node['style-variables'] ?? {})) {
                        yield* (0, formulaUtils_2.getFormulasInFormula)(styleVariable.formula, [
                            ...path,
                            'style-variables',
                            styleVariableKey,
                            'formula',
                        ]);
                    }
                    break;
            }
        }
        yield* (0, formulaUtils_2.getFormulasInFormula)(this.route?.info?.language?.formula, [
            'route',
            'info',
            'language',
            'formula',
        ]);
        yield* (0, formulaUtils_2.getFormulasInFormula)(this.route?.info?.title?.formula, [
            'route',
            'info',
            'title',
            'formula',
        ]);
        yield* (0, formulaUtils_2.getFormulasInFormula)(this.route?.info?.description?.formula, [
            'route',
            'info',
            'description',
            'formula',
        ]);
        yield* (0, formulaUtils_2.getFormulasInFormula)(this.route?.info?.icon?.formula, [
            'route',
            'info',
            'icon',
            'formula',
        ]);
        yield* (0, formulaUtils_2.getFormulasInFormula)(this.route?.info?.charset?.formula, [
            'route',
            'info',
            'charset',
            'formula',
        ]);
        for (const [metaKey, meta] of Object.entries(this.route?.info?.meta ?? {})) {
            for (const [attrKey, a] of Object.entries(meta.attrs)) {
                yield* (0, formulaUtils_2.getFormulasInFormula)(a, [
                    'route',
                    'info',
                    'meta',
                    metaKey,
                    'attrs',
                    attrKey,
                ]);
            }
        }
        for (const [formulaKey, formula] of Object.entries(this.formulas ?? {})) {
            yield* (0, formulaUtils_2.getFormulasInFormula)(formula.formula, [
                'formulas',
                formulaKey,
                'formula',
            ]);
        }
        for (const [variableKey, variable] of Object.entries(this.variables ?? {})) {
            yield* (0, formulaUtils_2.getFormulasInFormula)(variable.initialValue, [
                'variables',
                variableKey,
                'initialValue',
            ]);
        }
        for (const [workflowKey, workflow] of Object.entries(this.workflows ?? {})) {
            for (const [actionKey, action] of workflow.actions.entries()) {
                yield* (0, formulaUtils_1.getFormulasInAction)(action, [
                    'workflows',
                    workflowKey,
                    'actions',
                    actionKey,
                ]);
            }
        }
        for (const [, api] of Object.entries(this.apis)) {
            yield* api.formulasInApi();
        }
        for (const [actionKey, action] of Object.entries(this.component.onLoad?.actions ?? {})) {
            yield* (0, formulaUtils_1.getFormulasInAction)(action, ['onLoad', 'actions', actionKey]);
        }
        for (const [actionKey, action] of Object.entries(this.component.onAttributeChange?.actions ?? {})) {
            yield* (0, formulaUtils_1.getFormulasInAction)(action, [
                'onAttributeChange',
                'actions',
                actionKey,
            ]);
        }
        for (const [nodeKey, node] of Object.entries(this.nodes ?? {})) {
            yield* visitNode(node, ['nodes', nodeKey]);
        }
    }
    /**
     * Traverse all actions in the component.
     * @returns An iterable that yields the path and action.
     */
    *actionModelsInComponent() {
        function* visitNode(node, path = []) {
            switch (node.type) {
                case 'text':
                case 'slot':
                    break;
                case 'component':
                case 'element':
                    for (const [eventKey, event] of Object.entries(node.events ?? {})) {
                        for (const [actionKey, a] of Object.entries(event?.actions ?? {})) {
                            yield* (0, actionUtils_1.getActionsInAction)(a, [
                                ...path,
                                'events',
                                eventKey,
                                'actions',
                                actionKey,
                            ]);
                        }
                    }
                    break;
            }
        }
        for (const [workflowKey, workflow] of Object.entries(this.workflows ?? {})) {
            for (const [key, a] of Object.entries(workflow?.actions ?? {})) {
                yield* (0, actionUtils_1.getActionsInAction)(a, ['workflows', workflowKey, 'actions', key]);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        for (const [apiKey, api] of Object.entries(this.apis ?? {})) {
            if (!(0, api_1.isLegacyApi)(api)) {
                yield* api.actionModelsInApi();
                continue;
            }
            // Legacy API
            for (const [actionKey, a] of Object.entries(api.onCompleted?.actions ?? {})) {
                yield* (0, actionUtils_1.getActionsInAction)(a, [
                    'apis',
                    apiKey,
                    'onCompleted',
                    'actions',
                    actionKey,
                ]);
            }
            for (const [actionKey, a] of Object.entries(api.onFailed?.actions ?? {})) {
                yield* (0, actionUtils_1.getActionsInAction)(a, [
                    'apis',
                    apiKey,
                    'onFailed',
                    'actions',
                    actionKey,
                ]);
            }
        }
        for (const [actionKey, action] of Object.entries(this.component.onLoad?.actions ?? {})) {
            yield* (0, actionUtils_1.getActionsInAction)(action, ['onLoad', 'actions', actionKey]);
        }
        for (const [actionKey, action] of Object.entries(this.component.onAttributeChange?.actions ?? {})) {
            yield* (0, actionUtils_1.getActionsInAction)(action, [
                'onAttributeChange',
                'actions',
                actionKey,
            ]);
        }
        for (const [nodeKey, node] of Object.entries(this.nodes ?? {})) {
            yield* visitNode(node, ['nodes', nodeKey]);
        }
    }
    get formulas() {
        return this.component.formulas;
    }
    get name() {
        return this.component.name;
    }
    get route() {
        return this.component.route;
    }
    get attributes() {
        return this.component.attributes;
    }
    get variables() {
        return this.component.variables;
    }
    get workflows() {
        return this.component.workflows;
    }
    get apis() {
        return Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        Object.entries(this.component.apis ?? {}).map(([key, api]) => [
            key,
            (0, api_1.isLegacyApi)(api)
                ? new LegacyToddleApi_1.LegacyToddleApi(api, key)
                : new ToddleApiV2_1.ToddleApiV2(api, key),
        ]));
    }
    get nodes() {
        return this.component.nodes;
    }
    get events() {
        return this.component.events;
    }
    get onLoad() {
        return this.component.onLoad;
    }
    get onAttributeChange() {
        return this.component.onAttributeChange;
    }
    get isPage() {
        return (0, isPageComponent_1.isPageComponent)(this.component);
    }
}
exports.ToddleComponent = ToddleComponent;
//# sourceMappingURL=ToddleComponent.js.map