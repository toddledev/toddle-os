"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiEvent = exports.isApiError = exports.requestHash = exports.getBaseUrl = exports.getRequestHeaders = exports.getRequestQueryParams = exports.getRequestPath = exports.applyAbortSignal = exports.createApiRequest = exports.isLegacyApi = exports.NON_BODY_RESPONSE_CODES = void 0;
const apiTypes_1 = require("@toddle/core/src/api/apiTypes");
const LegacyToddleApi_1 = require("@toddle/core/src/api/LegacyToddleApi");
const formula_1 = require("@toddle/core/src/formula/formula");
const collections_1 = require("@toddle/core/src/utils/collections");
const sha1_1 = require("@toddle/core/src/utils/sha1");
const util_1 = require("@toddle/core/src/utils/util");
exports.NON_BODY_RESPONSE_CODES = [101, 204, 205, 304];
const isLegacyApi = (api) => api instanceof LegacyToddleApi_1.LegacyToddleApi ? true : !('version' in api);
exports.isLegacyApi = isLegacyApi;
const createApiRequest = ({ api, formulaContext, baseUrl, defaultHeaders, }) => {
    const url = getUrl(api, formulaContext, baseUrl);
    const requestSettings = getRequestSettings({
        api,
        formulaContext,
        defaultHeaders,
    });
    return { url, requestSettings };
};
exports.createApiRequest = createApiRequest;
const getUrl = (api, formulaContext, baseUrl) => {
    const url = (0, formula_1.applyFormula)(api.url, formulaContext);
    const path = (0, exports.getRequestPath)(api.path, formulaContext);
    const queryParams = (0, exports.getRequestQueryParams)(api.queryParams, formulaContext);
    const queryString = [...queryParams.entries()].length > 0 ? `?${queryParams.toString()}` : '';
    return new URL(`${url}${typeof url === 'string' && !url.endsWith('/') && path ? '/' : ''}${path}${queryString}`, baseUrl);
};
const HttpMethodsWithAllowedBody = [
    apiTypes_1.ApiMethod.POST,
    apiTypes_1.ApiMethod.DELETE,
    apiTypes_1.ApiMethod.PUT,
    apiTypes_1.ApiMethod.PATCH,
    apiTypes_1.ApiMethod.OPTIONS,
];
const applyAbortSignal = (api, requestSettings, formulaContext) => {
    if (api.timeout) {
        const timeout = (0, formula_1.applyFormula)(api.timeout.formula, formulaContext);
        if (typeof timeout === 'number' && !Number.isNaN(timeout) && timeout > 0) {
            requestSettings.signal = AbortSignal.timeout(timeout);
        }
    }
};
exports.applyAbortSignal = applyAbortSignal;
const getRequestSettings = ({ api, formulaContext, defaultHeaders, }) => {
    const method = Object.values(apiTypes_1.ApiMethod).includes(api.method)
        ? api.method
        : apiTypes_1.ApiMethod.GET;
    const headers = (0, exports.getRequestHeaders)({
        apiHeaders: api.headers,
        formulaContext,
        defaultHeaders,
    });
    const body = getRequestBody({ api, formulaContext, headers, method });
    if (headers.get('content-type') === 'multipart/form-data') {
        headers.delete('content-type');
    }
    const requestSettings = {
        method,
        headers,
        body,
    };
    (0, exports.applyAbortSignal)(api, requestSettings, formulaContext);
    return requestSettings;
};
const getRequestPath = (path, formulaContext) => (0, collections_1.sortObjectEntries)(path ?? {}, ([_, p]) => p.index)
    .map(([_, p]) => (0, formula_1.applyFormula)(p.formula, formulaContext))
    .join('/');
exports.getRequestPath = getRequestPath;
const getRequestQueryParams = (params, formulaContext) => {
    const queryParams = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, param]) => {
        const enabled = (0, util_1.isDefined)(param.enabled)
            ? (0, formula_1.applyFormula)(param.enabled, formulaContext)
            : true;
        if (!enabled) {
            return;
        }
        const value = (0, formula_1.applyFormula)(param.formula, formulaContext);
        if (!(0, util_1.isDefined)(value)) {
            // Ignore null/undefined values
            return;
        }
        if (Array.isArray(value)) {
            // Support encoding 1-dimensional arrays
            value.forEach((v) => queryParams.append(key, String(v)));
        }
        else if ((0, util_1.isObject)(value)) {
            // Support encoding (nested) objects, but cast any non-object to a String
            const encodeObject = (obj, prefix) => {
                Object.entries(obj).forEach(([key, val]) => {
                    if (!Array.isArray(val) && (0, util_1.isObject)(val)) {
                        return encodeObject(val, `${prefix}[${key}]`);
                    }
                    else {
                        queryParams.set(`${prefix}[${key}]`, String(val));
                    }
                });
            };
            encodeObject(value, key);
        }
        else {
            queryParams.set(key, String(value));
        }
    });
    return queryParams;
};
exports.getRequestQueryParams = getRequestQueryParams;
const getRequestHeaders = ({ apiHeaders, formulaContext, defaultHeaders, }) => {
    const headers = new Headers(defaultHeaders);
    Object.entries(apiHeaders ?? {}).forEach(([key, param]) => {
        const enabled = (0, util_1.isDefined)(param.enabled)
            ? (0, formula_1.applyFormula)(param.enabled, formulaContext)
            : true;
        if (enabled) {
            const value = (0, formula_1.applyFormula)(param.formula, formulaContext);
            if ((0, util_1.isDefined)(value)) {
                headers.set(key.trim(), (typeof value === 'string' ? value : String(value)).trim());
            }
        }
    });
    return headers;
};
exports.getRequestHeaders = getRequestHeaders;
const getBaseUrl = ({ origin, url, }) => !(0, util_1.isDefined)(url) || url === '' || url.startsWith('/') ? origin + url : url;
exports.getBaseUrl = getBaseUrl;
/**
 * Calculate the hash of a Request object based on its properties
 */
const requestHash = (url, request) => (0, sha1_1.sha1)(JSON.stringify({
    url: url.href,
    method: request.method,
    headers: (0, collections_1.omitKeys)(Object.fromEntries(Object.entries(request.headers ?? {})), ['host', 'cookie']),
    body: request.body ?? null,
}));
exports.requestHash = requestHash;
const isApiError = ({ apiName, response, formulaContext, errorFormula, performance, }) => {
    const errorFormulaRes = errorFormula
        ? (0, formula_1.applyFormula)(errorFormula.formula, {
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
        : null;
    if (errorFormulaRes === null || errorFormulaRes === undefined) {
        return !response.ok;
    }
    return (0, util_1.toBoolean)(errorFormulaRes);
};
exports.isApiError = isApiError;
const getRequestBody = ({ api, formulaContext, headers, method, }) => {
    if (!api.body || !HttpMethodsWithAllowedBody.includes(method)) {
        return;
    }
    const body = (0, formula_1.applyFormula)(api.body, formulaContext);
    if (!body) {
        return;
    }
    switch (headers.get('content-type')) {
        case 'application/x-www-form-urlencoded': {
            if (typeof body === 'object' && body !== null) {
                return Object.entries(body)
                    .map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value
                            .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
                            .join('&');
                    }
                    else {
                        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
                    }
                })
                    .join('&');
            }
            return '';
        }
        case 'multipart/form-data': {
            const formData = new FormData();
            if (typeof body === 'object' && body !== null) {
                Object.entries(body).forEach(([key, value]) => {
                    formData.set(key, value);
                });
            }
            return formData;
        }
        case 'text/plain':
            return String(body);
        default:
            return JSON.stringify(body);
    }
};
const createApiEvent = (eventName, detail) => {
    return new CustomEvent(eventName, {
        detail,
    });
};
exports.createApiEvent = createApiEvent;
//# sourceMappingURL=api.js.map