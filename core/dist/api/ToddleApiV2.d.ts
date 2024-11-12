import { ApiRequest } from '../api/apiTypes';
import { ActionModel } from '../component/component.types';
import { type Formula } from '../formula/formula';
export declare class ToddleApiV2 implements ApiRequest {
    private api;
    private _apiReferences?;
    private key;
    constructor(api: ApiRequest, apiKey: string);
    get apiReferences(): Set<string>;
    get version(): 2;
    get name(): string;
    get type(): "http" | "ws";
    get autoFetch(): Formula | null | undefined;
    get url(): Formula | undefined;
    get path(): Record<string, {
        formula: Formula;
        index: number;
    }> | undefined;
    get headers(): Record<string, {
        formula: Formula;
        enabled?: Formula | null;
    }> | undefined;
    set headers(headers: Record<string, {
        formula: Formula;
        enabled?: Formula | null;
    }> | undefined);
    get method(): import("../api/apiTypes").ApiMethod | undefined;
    get body(): Formula | undefined;
    get inputs(): Record<string, {
        formula: Formula;
    }>;
    get queryParams(): Record<string, {
        formula: Formula;
        enabled?: Formula | null;
    }> | undefined;
    get server(): {
        proxy?: {
            enabled: {
                formula: Formula;
            };
        } | null;
        ssr?: {
            enabled?: {
                formula: Formula;
            } | null;
        };
    } | undefined;
    get client(): {
        debounce?: {
            formula: Formula;
        } | null;
        onCompleted?: import("../component/component.types").EventModel | null;
        onFailed?: import("../component/component.types").EventModel | null;
        onMessage?: import("../component/component.types").EventModel | null;
        parserMode: "auto" | "text" | "json" | "event-stream" | "json-stream" | "blob";
    } | undefined;
    get redirectRules(): Record<string, {
        formula: Formula;
        statusCode?: import("../api/apiTypes").RedirectStatusCode | null;
        index: number;
    }> | null | undefined;
    get isError(): {
        formula: Formula;
    } | null | undefined;
    get timeout(): {
        formula: Formula;
    } | null | undefined;
    formulasInApi(): Generator<[(string | number)[], Formula]>;
    actionModelsInApi(): Generator<[(string | number)[], ActionModel]>;
}
