import { type LegacyComponentAPI } from '../src/api/apiTypes';
import { type Formula } from '../src/formula/formula';
export declare class LegacyToddleApi {
    private api;
    private key;
    private _apiReferences?;
    constructor(api: LegacyComponentAPI, key: string);
    get apiReferences(): Set<string>;
    get name(): any;
    get type(): any;
    get autoFetch(): any;
    get url(): any;
    get path(): any;
    get proxy(): any;
    get queryParams(): any;
    get headers(): any;
    get method(): any;
    get body(): any;
    get auth(): any;
    get throttle(): any;
    get debounce(): any;
    get onCompleted(): any;
    get onFailed(): any;
    formulasInApi(): Generator<[(string | number)[], Formula]>;
}
