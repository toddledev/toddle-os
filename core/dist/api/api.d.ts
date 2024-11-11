import { ApiPerformance, ApiRequest, ComponentAPI, LegacyComponentAPI } from '../src/api/apiTypes';
import { LegacyToddleApi } from '../src/api/LegacyToddleApi';
import { ToddleApiV2 } from '../src/api/ToddleApiV2';
import { Formula, FormulaContext } from '../src/formula/formula';
export declare const NON_BODY_RESPONSE_CODES: number[];
export declare const isLegacyApi: (api: ComponentAPI | LegacyToddleApi | ToddleApiV2) => api is LegacyComponentAPI | LegacyToddleApi;
export declare const createApiRequest: ({ api, formulaContext, baseUrl, defaultHeaders, }: {
    api: ApiRequest | ToddleApiV2;
    formulaContext: FormulaContext;
    baseUrl?: string;
    defaultHeaders: Headers | undefined;
}) => {
    url: URL;
    requestSettings: ToddleRequestInit;
};
export declare const applyAbortSignal: (api: ApiRequest, requestSettings: RequestInit, formulaContext: FormulaContext) => void;
export declare const getRequestPath: (path: ApiRequest["path"], formulaContext: FormulaContext) => string;
export declare const getRequestQueryParams: (params: ApiRequest["queryParams"], formulaContext: FormulaContext) => URLSearchParams;
export declare const getRequestHeaders: ({ apiHeaders, formulaContext, defaultHeaders, }: {
    apiHeaders: ApiRequest["headers"];
    formulaContext: FormulaContext;
    defaultHeaders: Headers | undefined;
}) => Headers;
export declare const getBaseUrl: ({ origin, url, }: {
    origin: string;
    url?: string;
}) => string | undefined;
/**
 * Calculate the hash of a Request object based on its properties
 */
export declare const requestHash: (url: URL, request: RequestInit) => any;
export declare const isApiError: ({ apiName, response, formulaContext, errorFormula, performance, }: {
    apiName: string;
    response: {
        ok: boolean;
        status?: number;
        headers?: Record<string, string> | null;
        body: unknown;
    };
    formulaContext: FormulaContext;
    performance: ApiPerformance;
    errorFormula?: {
        formula: Formula;
    } | null;
}) => any;
export declare const createApiEvent: (eventName: "message" | "success" | "failed", detail: any) => CustomEvent<any>;
