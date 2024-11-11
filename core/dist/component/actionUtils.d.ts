import type { ActionModel } from '../src/component/component.types';
export declare function getActionsInAction(action: ActionModel | null, path?: (string | number)[]): Generator<[(string | number)[], ActionModel]>;
