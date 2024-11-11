import type { ActionModel } from '../src/component/component.types';
import { Formula, FunctionOperation, PathOperation, ValueOperation } from './formula';
export declare const valueFormula: (value: string | number | boolean | null | object) => ValueOperation;
export declare const pathFormula: (path: string[]) => PathOperation;
export declare const functionFormula: (name: string, formula?: Omit<Partial<FunctionOperation>, "type" | "name">) => FunctionOperation;
export declare function getFormulasInFormula(formula: Formula | undefined | null, path?: (string | number)[]): Generator<[(string | number)[], Formula]>;
export declare function getFormulasInAction(action: ActionModel | null, path?: (string | number)[]): Generator<[(string | number)[], Formula]>;
