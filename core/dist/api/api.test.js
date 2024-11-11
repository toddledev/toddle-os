"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const apiTypes_1 = require("../src/api/apiTypes");
const formulaUtils_1 = require("../src/formula/formulaUtils");
const api_1 = require("./api");
(0, globals_1.describe)('getApiPath()', () => {
    (0, globals_1.test)('it returns a valid url path string', () => {
        (0, globals_1.expect)((0, api_1.getRequestPath)({}, undefined)).toBe('');
        (0, globals_1.expect)((0, api_1.getRequestPath)({
            first: { formula: (0, formulaUtils_1.valueFormula)('hello'), index: 0 },
            second: { formula: (0, formulaUtils_1.valueFormula)('world'), index: 1 },
        }, undefined)).toBe('hello/world');
    });
});
(0, globals_1.describe)('getQueryParams()', () => {
    (0, globals_1.test)('it returns a valid url path string', () => {
        const emptyParams = (0, api_1.getRequestQueryParams)({}, undefined);
        (0, globals_1.expect)(emptyParams.size).toBe(0);
        const params = (0, api_1.getRequestQueryParams)({
            q: {
                formula: (0, formulaUtils_1.valueFormula)('hello'),
                enabled: (0, formulaUtils_1.valueFormula)(true),
            },
            filter: {
                formula: (0, formulaUtils_1.valueFormula)('world'),
                enabled: (0, formulaUtils_1.valueFormula)(true),
            },
            unused: {
                formula: (0, formulaUtils_1.valueFormula)('test'),
                enabled: (0, formulaUtils_1.valueFormula)(false),
            },
        }, undefined);
        (0, globals_1.expect)(params.get('q')).toBe('hello');
        (0, globals_1.expect)(params.get('filter')).toBe('world');
        (0, globals_1.expect)(params.get('unused')).toBeNull();
        (0, globals_1.expect)(params.size).toBe(2);
    });
    (0, globals_1.test)('it stringifies arrays', () => {
        const params = (0, api_1.getRequestQueryParams)({
            q: {
                formula: (0, formulaUtils_1.valueFormula)(['hello', 'world']),
                enabled: (0, formulaUtils_1.valueFormula)(true),
            },
        }, undefined);
        (0, globals_1.expect)(params.getAll('q')).toEqual(['hello', 'world']);
        (0, globals_1.expect)(params.size).toBe(2);
    });
    (0, globals_1.test)('it stringifies objects', () => {
        const params = (0, api_1.getRequestQueryParams)({
            q: {
                formula: (0, formulaUtils_1.valueFormula)({ a: 'hello', b: { c: 'world', d: [] } }),
                enabled: (0, formulaUtils_1.valueFormula)(true),
            },
        }, undefined);
        (0, globals_1.expect)(params.get('q[a]')).toEqual('hello');
        (0, globals_1.expect)(params.get('q[b][c]')).toEqual('world');
        (0, globals_1.expect)(params.get('q[b][d]')).toEqual('');
        (0, globals_1.expect)(params.size).toBe(3);
    });
});
(0, globals_1.describe)('getApiHeaders()', () => {
    (0, globals_1.test)('it returns valid headers', () => {
        const emptyParams = (0, api_1.getRequestHeaders)({
            apiHeaders: {},
            formulaContext: undefined,
            defaultHeaders: undefined,
        });
        (0, globals_1.expect)(emptyParams.entries.length).toBe(0);
        const headers = (0, api_1.getRequestHeaders)({
            apiHeaders: {
                q: { formula: (0, formulaUtils_1.valueFormula)('hello') },
                filter: { formula: (0, formulaUtils_1.valueFormula)('world') },
            },
            formulaContext: undefined,
            defaultHeaders: undefined,
        });
        (0, globals_1.expect)(headers.get('q')).toBe('hello');
        (0, globals_1.expect)(headers.get('filter')).toBe('world');
        (0, globals_1.expect)([...headers.entries()].length).toBe(2);
        const headersWithDefaults = (0, api_1.getRequestHeaders)({
            apiHeaders: {
                q: { formula: (0, formulaUtils_1.valueFormula)('hello') },
                filter: { formula: (0, formulaUtils_1.valueFormula)('world') },
            },
            formulaContext: undefined,
            defaultHeaders: new Headers([['accept-encoding', 'gzip']]),
        });
        (0, globals_1.expect)(headersWithDefaults.get('q')).toBe('hello');
        (0, globals_1.expect)(headersWithDefaults.get('filter')).toBe('world');
        (0, globals_1.expect)(headersWithDefaults.get('accept-encoding')).toBe('gzip');
        (0, globals_1.expect)([...headersWithDefaults.entries()].length).toBe(3);
    });
    (0, globals_1.test)('it ignores disabled headers', () => {
        const headers = (0, api_1.getRequestHeaders)({
            apiHeaders: {
                q: { formula: (0, formulaUtils_1.valueFormula)('hello') },
                test: {
                    formula: (0, formulaUtils_1.valueFormula)('hidden'),
                    enabled: (0, formulaUtils_1.valueFormula)(false),
                },
                filter: { formula: (0, formulaUtils_1.valueFormula)('world') },
            },
            formulaContext: undefined,
            defaultHeaders: undefined,
        });
        (0, globals_1.expect)(headers.get('q')).toBe('hello');
        (0, globals_1.expect)(headers.get('filter')).toBe('world');
        (0, globals_1.expect)(headers.get('test')).toBe(null);
        (0, globals_1.expect)([...headers.entries()].length).toBe(2);
    });
});
(0, globals_1.describe)('createApiRequest', () => {
    const baseUrl = 'https://example.com';
    (0, globals_1.it)('creates a GET request with minimal arguments', () => {
        const apiRequest = {
            name: 'Test API',
            type: 'http',
            path: {},
            queryParams: {},
            method: apiTypes_1.ApiMethod.GET,
            url: (0, formulaUtils_1.valueFormula)('service'),
            version: 2,
            inputs: {},
            server: {
                proxy: null,
                ssr: {
                    enabled: { formula: (0, formulaUtils_1.valueFormula)(true) },
                },
            },
            client: {
                parserMode: 'auto',
            },
        };
        const { url, requestSettings } = (0, api_1.createApiRequest)({
            api: apiRequest,
            formulaContext: undefined,
            baseUrl,
            defaultHeaders: undefined,
        });
        const request = new Request(url, requestSettings);
        (0, globals_1.expect)(request.method).toBe('GET');
        (0, globals_1.expect)(request.url).toBe('https://example.com/service');
    });
    (0, globals_1.it)('creates a POST request with all arguments', () => {
        const apiRequest = {
            name: 'Test API',
            type: 'http',
            version: 2,
            inputs: {},
            path: {
                first: { formula: (0, formulaUtils_1.valueFormula)('hello'), index: 0 },
                second: { formula: (0, formulaUtils_1.valueFormula)('world'), index: 1 },
            },
            queryParams: {
                q: {
                    formula: (0, formulaUtils_1.valueFormula)('hello'),
                    enabled: (0, formulaUtils_1.valueFormula)(true),
                },
                filter: {
                    formula: (0, formulaUtils_1.valueFormula)('world'),
                    enabled: (0, formulaUtils_1.valueFormula)(true),
                },
                unused: {
                    formula: (0, formulaUtils_1.valueFormula)('test'),
                    enabled: (0, formulaUtils_1.valueFormula)(false),
                },
            },
            method: apiTypes_1.ApiMethod.POST,
            url: (0, formulaUtils_1.valueFormula)('service'),
            headers: {
                'Content-Type': {
                    formula: (0, formulaUtils_1.valueFormula)('application/json'),
                },
            },
            body: (0, formulaUtils_1.valueFormula)('{"key":"value"}'),
        };
        const { url, requestSettings } = (0, api_1.createApiRequest)({
            api: apiRequest,
            formulaContext: undefined,
            baseUrl,
            defaultHeaders: undefined,
        });
        const request = new Request(url, requestSettings);
        (0, globals_1.expect)(request.method).toBe('POST');
        (0, globals_1.expect)(request.url).toBe('https://example.com/service/hello/world?q=hello&filter=world');
        (0, globals_1.expect)(request.headers.get('Content-Type')).toBe('application/json');
    });
    // TODO: Add tests for the http body
});
//# sourceMappingURL=api.test.js.map