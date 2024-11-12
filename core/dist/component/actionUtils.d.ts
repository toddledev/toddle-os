import type { ActionModel } from '../component/component.types';
export declare function getActionsInAction(action: ActionModel | null, path?: (string | number)[]): Generator<[(string | number)[], ActionModel]>;
