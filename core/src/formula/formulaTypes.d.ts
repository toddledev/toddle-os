import type { Formula } from '../formula/formula';
export interface BaseFormula {
    name: string;
    description?: string;
    arguments: Array<{
        name: string;
        formula: Formula;
    }>;
    exported?: boolean;
    variableArguments?: boolean | null;
}
export interface ToddleFormula extends BaseFormula {
    formula: Formula;
}
/**
 * The Handler generic is a string server side, but a function client side
 */
export interface CodeFormula<Handler> extends BaseFormula {
    version?: 2 | never;
    handler: Handler;
}
export type PluginFormula<Handler> = ToddleFormula | CodeFormula<Handler>;
export declare const isToddleFormula: <Handler>(formula: PluginFormula<Handler>) => formula is ToddleFormula;
//# sourceMappingURL=formulaTypes.d.ts.map