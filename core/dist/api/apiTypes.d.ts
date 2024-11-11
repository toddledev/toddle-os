import { EventModel } from '../src/component/component.types';
import { Formula } from '../src/formula/formula';
export type ComponentAPI = LegacyComponentAPI | ApiRequest;
export interface LegacyComponentAPI {
    name: string;
    type: 'REST';
    autoFetch?: Formula | null;
    url?: Formula;
    path?: {
        formula: Formula;
    }[];
    proxy?: boolean;
    queryParams?: Record<string, {
        name: string;
        formula: Formula;
    }>;
    headers?: Record<string, Formula> | Formula;
    method?: 'GET' | 'POST' | 'DELETE' | 'PUT';
    body?: Formula;
    auth?: {
        type: 'Bearer id_token' | 'Bearer access_token';
    };
    throttle?: number | null;
    debounce?: number | null;
    onCompleted: EventModel | null;
    onFailed: EventModel | null;
    version?: never;
}
export interface LegacyApiStatus {
    data: unknown;
    isLoading: boolean;
    error: unknown;
    response?: never;
}
export declare enum ApiMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS"
}
export type RedirectStatusCode = 301 | 302 | 307 | 308;
export interface ApiRequest {
    version: 2;
    name: string;
    type: 'http' | 'ws';
    autoFetch?: Formula | null;
    url?: Formula;
    path?: Record<string, {
        formula: Formula;
        index: number;
    }>;
    headers?: Record<string, {
        formula: Formula;
        enabled?: Formula | null;
    }>;
    method?: ApiMethod;
    body?: Formula;
    inputs: Record<string, {
        formula: Formula;
    }>;
    service?: string | null;
    queryParams?: Record<string, {
        formula: Formula;
        enabled?: Formula | null;
    }>;
    server?: {
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
    };
    client?: {
        debounce?: {
            formula: Formula;
        } | null;
        onCompleted?: EventModel | null;
        onFailed?: EventModel | null;
        onMessage?: EventModel | null;
        parserMode: 'auto' | 'text' | 'json' | 'event-stream' | 'json-stream' | 'blob';
    };
    redirectRules?: Record<string, {
        formula: Formula;
        statusCode?: RedirectStatusCode | null;
        index: number;
    }> | null;
    isError?: {
        formula: Formula;
    } | null;
    timeout?: {
        formula: Formula;
    } | null;
}
export interface ApiStatus {
    data: unknown;
    isLoading: boolean;
    error: unknown;
    response?: {
        status?: number;
        headers?: Record<string, string> | null;
        performance?: ApiPerformance;
        debug?: null | unknown;
    };
}
export interface ApiPerformance {
    requestStart: number | null;
    responseStart: number | null;
    responseEnd: number | null;
}
export declare class RedirectError extends Error {
    readonly redirect: {
        api: string;
        url: URL;
        statusCode?: RedirectStatusCode;
    };
    constructor(redirect: {
        api: string;
        url: URL;
        statusCode?: RedirectStatusCode;
    });
}
export interface ToddleRequestInit extends RequestInit {
    headers: Headers;
}
