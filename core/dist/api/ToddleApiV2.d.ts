import { ApiRequest } from '../src/api/apiTypes';
import { ActionModel } from '../src/component/component.types';
import { type Formula } from '../src/formula/formula';
export declare class ToddleApiV2 implements ApiRequest {
    private api;
    private _apiReferences?;
    private key;
    constructor(api: ApiRequest, apiKey: string);
    get apiReferences(): Set<string>;
    get version(): any;
    get name(): any;
    get type(): any;
    get autoFetch(): any;
    get url(): any;
    get path(): any;
    get headers(): any;
    set headers(headers: any);
    get method(): any;
    get body(): any;
    get inputs(): any;
    get queryParams(): any;
    get server(): any;
    get client(): any;
    get redirectRules(): any;
    get isError(): any;
    get timeout(): any;
    formulasInApi(): Generator<[(string | number)[], Formula]>;
    actionModelsInApi(): Generator<[(string | number)[], ActionModel]>;
}
