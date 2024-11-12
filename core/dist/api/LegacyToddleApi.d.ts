import { type LegacyComponentAPI } from '../api/apiTypes';
import { type Formula } from '../formula/formula';
export declare class LegacyToddleApi {
    private api;
    private key;
    private _apiReferences?;
    constructor(api: LegacyComponentAPI, key: string);
    get apiReferences(): Set<string>;
    get name(): string;
    get type(): "REST";
    get autoFetch(): Formula | null | undefined;
    get url(): Formula | undefined;
    get path(): {
        formula: Formula;
    }[] | undefined;
    get proxy(): boolean | undefined;
    get queryParams(): Record<string, {
        name: string;
        formula: Formula;
    }> | undefined;
    get headers(): Formula | Record<string, Formula> | undefined;
    get method(): "GET" | "POST" | "DELETE" | "PUT" | undefined;
    get body(): Formula | undefined;
    get auth(): {
        type: "Bearer id_token" | "Bearer access_token";
    } | undefined;
    get throttle(): number | null | undefined;
    get debounce(): number | null | undefined;
    get onCompleted(): import("../component/component.types").EventModel | null;
    get onFailed(): import("../component/component.types").EventModel | null;
    formulasInApi(): Generator<[(string | number)[], Formula]>;
}
