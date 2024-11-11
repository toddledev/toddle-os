"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToddleApiV2 = void 0;
const actionUtils_1 = require("../component/actionUtils");
const formulaUtils_1 = require("../formula/formulaUtils");
const formulaUtils_2 = require("../src/formula/formulaUtils");
const util_1 = require("../src/utils/util");
class ToddleApiV2 {
    api;
    _apiReferences;
    key;
    constructor(api, apiKey) {
        this.api = api;
        this.key = apiKey;
    }
    get apiReferences() {
        if (this._apiReferences) {
            // Only compute apiReferences once
            return this._apiReferences;
        }
        const apis = new Set();
        const visitFormulaReference = (formula) => {
            if (!(0, util_1.isDefined)(formula)) {
                return;
            }
            switch (formula.type) {
                case 'path':
                    if (formula.path[0] === 'Apis') {
                        apis.add(formula.path[1]);
                    }
                    break;
                case 'value':
                    break;
                case 'record':
                    formula.entries.forEach((entry) => visitFormulaReference(entry.formula));
                    break;
                case 'function':
                case 'array':
                case 'or':
                case 'and':
                case 'apply':
                case 'object':
                    formula.arguments.forEach((arg) => visitFormulaReference(arg.formula));
                    break;
                case 'switch':
                    formula.cases.forEach((c) => {
                        visitFormulaReference(c.condition);
                        visitFormulaReference(c.formula);
                    });
                    break;
            }
        };
        // Since formulas for body, headers etc. can only use arguments, we only need to visit the
        // arguments to know which other APIs this API depends on
        Object.values(this.api.inputs).forEach((arg) => visitFormulaReference(arg.formula));
        this._apiReferences = apis;
        return apis;
    }
    get version() {
        return this.api.version;
    }
    get name() {
        return this.api.name;
    }
    get type() {
        return this.api.type;
    }
    get autoFetch() {
        return this.api.autoFetch;
    }
    get url() {
        return this.api.url;
    }
    get path() {
        return this.api.path;
    }
    get headers() {
        return this.api.headers;
    }
    set headers(headers) {
        this.api.headers = headers;
    }
    get method() {
        return this.api.method;
    }
    get body() {
        return this.api.body;
    }
    get inputs() {
        return this.api.inputs;
    }
    get queryParams() {
        return this.api.queryParams;
    }
    get server() {
        return this.api.server;
    }
    get client() {
        return this.api.client;
    }
    get redirectRules() {
        return this.api.redirectRules;
    }
    get isError() {
        return this.api.isError;
    }
    get timeout() {
        return this.api.timeout;
    }
    *formulasInApi() {
        const api = this.api;
        const apiKey = this.key;
        for (const [input, value] of Object.entries(this.api.inputs)) {
            yield* (0, formulaUtils_2.getFormulasInFormula)(value.formula, [
                'apis',
                apiKey,
                'inputs',
                input,
                'formula',
            ]);
        }
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.autoFetch, ['apis', apiKey, 'autoFetch']);
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.url, ['apis', apiKey, 'url']);
        for (const [pathKey, path] of Object.entries(api.path ?? {})) {
            yield* (0, formulaUtils_2.getFormulasInFormula)(path.formula, [
                'apis',
                apiKey,
                'path',
                pathKey,
                'formula',
            ]);
        }
        for (const [queryParamKey, queryParam] of Object.entries(api.queryParams ?? {})) {
            yield* (0, formulaUtils_2.getFormulasInFormula)(queryParam.formula, [
                'apis',
                apiKey,
                'queryParams',
                queryParamKey,
                'formula',
            ]);
            yield* (0, formulaUtils_2.getFormulasInFormula)(queryParam.enabled, [
                'apis',
                apiKey,
                'queryParams',
                queryParamKey,
                'enabled',
            ]);
        }
        for (const [headerKey, header] of Object.entries(api.headers ?? {})) {
            yield* (0, formulaUtils_2.getFormulasInFormula)(header.formula, [
                'apis',
                apiKey,
                'headers',
                headerKey,
                'formula',
            ]);
            yield* (0, formulaUtils_2.getFormulasInFormula)(header.enabled, [
                'apis',
                apiKey,
                'headers',
                headerKey,
                'enabled',
            ]);
        }
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.body, ['apis', apiKey, 'body']);
        for (const [actionKey, action] of Object.entries(api.client?.onCompleted?.actions ?? {})) {
            yield* (0, formulaUtils_1.getFormulasInAction)(action, [
                'apis',
                apiKey,
                'client',
                'onCompleted',
                'actions',
                actionKey,
            ]);
        }
        for (const [actionKey, action] of Object.entries(api.client?.onFailed?.actions ?? {})) {
            yield* (0, formulaUtils_1.getFormulasInAction)(action, [
                'apis',
                apiKey,
                'client',
                'onFailed',
                'actions',
                actionKey,
            ]);
        }
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.client?.debounce?.formula, [
            'apis',
            apiKey,
            'client',
            'debounce',
            'formula',
        ]);
        for (const [actionKey, action] of Object.entries(api.client?.onMessage?.actions ?? {})) {
            yield* (0, formulaUtils_1.getFormulasInAction)(action, [
                'apis',
                apiKey,
                'client',
                'onData',
                'actions',
                actionKey,
            ]);
        }
        for (const [rule, value] of Object.entries(api.redirectRules ?? {})) {
            yield* (0, formulaUtils_2.getFormulasInFormula)(value.formula, [
                'apis',
                apiKey,
                'redirectRules',
                rule,
                'formula',
            ]);
        }
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.isError?.formula, [
            'apis',
            apiKey,
            'isError',
            'formula',
        ]);
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.timeout?.formula, [
            'apis',
            apiKey,
            'timeout',
            'formula',
        ]);
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.server?.proxy?.enabled.formula, [
            'apis',
            apiKey,
            'server',
            'proxy',
            'enabled',
            'formula',
        ]);
        yield* (0, formulaUtils_2.getFormulasInFormula)(api.server?.ssr?.enabled?.formula, [
            'apis',
            apiKey,
            'server',
            'ssr',
            'enabled',
            'formula',
        ]);
    }
    *actionModelsInApi() {
        for (const [actionKey, action] of Object.entries(this.api.client?.onCompleted?.actions ?? {})) {
            yield* (0, actionUtils_1.getActionsInAction)(action, [
                'apis',
                this.key,
                'client',
                'onCompleted',
                'actions',
                actionKey,
            ]);
        }
        for (const [actionKey, action] of Object.entries(this.api.client?.onFailed?.actions ?? {})) {
            yield* (0, actionUtils_1.getActionsInAction)(action, [
                'apis',
                this.key,
                'client',
                'onFailed',
                'actions',
                actionKey,
            ]);
        }
        for (const [actionKey, action] of Object.entries(this.api.client?.onMessage?.actions ?? {})) {
            yield* (0, actionUtils_1.getActionsInAction)(action, [
                'apis',
                this.key,
                'client',
                'onData',
                'actions',
                actionKey,
            ]);
        }
    }
}
exports.ToddleApiV2 = ToddleApiV2;
//# sourceMappingURL=ToddleApiV2.js.map