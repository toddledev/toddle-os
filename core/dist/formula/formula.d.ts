import type { Component, ComponentData } from '../component/component.types';
import type { CustomFormulaHandler } from '../types';
type ShadowRoot = DocumentFragment;
export type PathOperation = {
    type: 'path';
    path: string[];
};
type FunctionArgument = {
    name?: string;
    isFunction?: boolean;
    formula: Formula;
};
export type FunctionOperation = {
    type: 'function';
    name: string;
    package?: string;
    arguments: FunctionArgument[];
    variableArguments?: boolean;
};
export type RecordOperation = {
    type: 'record';
    entries: FunctionArgument[];
};
export type ObjectOperation = {
    type: 'object';
    arguments: FunctionArgument[];
};
export type ArrayOperation = {
    type: 'array';
    arguments: Array<{
        formula: Formula;
    }>;
};
export type OrOperation = {
    type: 'or';
    arguments: Array<{
        formula: Formula;
    }>;
};
export type AndOperation = {
    type: 'and';
    arguments: Array<{
        formula: Formula;
    }>;
};
export type ApplyOperation = {
    type: 'apply';
    name: string;
    arguments: FunctionArgument[];
};
export type ValueOperation = {
    type: 'value';
    value: string | number | boolean | null | object;
};
export type ValueOperationValue = string | number | boolean | null | object;
export type SwitchOperation = {
    type: 'switch';
    cases: Array<{
        condition: Formula;
        formula: Formula;
    }>;
    default: Formula;
};
export type Formula = FunctionOperation | RecordOperation | ObjectOperation | ArrayOperation | PathOperation | SwitchOperation | OrOperation | AndOperation | ValueOperation | ApplyOperation;
export type FormulaContext = {
    component: Component;
    formulaCache?: Record<string, {
        get: (data: ComponentData) => any;
        set: (data: ComponentData, result: any) => void;
    }>;
    data: ComponentData;
    root?: Document | ShadowRoot | null;
    package: string | undefined;
    toddle?: {
        getCustomFormula: CustomFormulaHandler;
    };
    env: ToddleEnv | undefined;
};
export type ToddleServerEnv = {
    branchName: string;
    isServer: true;
    request: {
        headers: Record<string, string>;
        cookies: Record<string, string>;
        url: string;
    };
    runtime: never;
};
export type ToddleEnv = ToddleServerEnv | {
    branchName: string;
    isServer: false;
    request: undefined;
    runtime: 'page' | 'custom-element' | 'preview';
};
export declare function isFormula(f: any): f is Formula;
export declare function isFormulaApplyOperation(formula: Formula): formula is ApplyOperation;
export declare function applyFormula(formula: Formula | string | number | undefined | boolean, ctx: FormulaContext): any;
export {};
