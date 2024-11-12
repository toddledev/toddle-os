"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFormula = isFormula;
exports.isFormulaApplyOperation = isFormulaApplyOperation;
exports.applyFormula = applyFormula;
const formulaTypes_1 = require("../formula/formulaTypes");
const util_1 = require("../utils/util");
function isFormula(f) {
    return f && typeof f === 'object' && typeof f.type === 'string';
}
function isFormulaApplyOperation(formula) {
    return formula.type === 'apply';
}
function applyFormula(formula, ctx) {
    if (!isFormula(formula)) {
        return formula;
    }
    try {
        switch (formula.type) {
            case 'value':
                return formula.value;
            case 'path': {
                return formula.path.reduce((input, key) => input && typeof input === 'object' ? input[key] : null, ctx.data);
            }
            case 'switch': {
                for (const branch of formula.cases) {
                    if ((0, util_1.toBoolean)(applyFormula(branch.condition, ctx))) {
                        return applyFormula(branch.formula, ctx);
                    }
                }
                return applyFormula(formula.default, ctx);
            }
            case 'or': {
                for (const entry of formula.arguments) {
                    if ((0, util_1.toBoolean)(applyFormula(entry.formula, ctx))) {
                        return true;
                    }
                }
                return false;
            }
            case 'and': {
                for (const entry of formula.arguments) {
                    if (!(0, util_1.toBoolean)(applyFormula(entry.formula, ctx))) {
                        return false;
                    }
                }
                return true;
            }
            case 'function': {
                const packageName = formula.package ?? ctx.package;
                const newFunc = (ctx.toddle ??
                    globalThis.toddle)?.getCustomFormula(formula.name, packageName);
                const legacyFunc = globalThis.toddle.getFormula(formula.name);
                if ((0, util_1.isDefined)(newFunc)) {
                    const args = formula.arguments.reduce((args, arg, i) => ({
                        ...args,
                        [arg.name ?? `${i}`]: arg.isFunction
                            ? (Args) => applyFormula(arg.formula, {
                                ...ctx,
                                data: {
                                    ...ctx.data,
                                    Args: ctx.data.Args
                                        ? { ...Args, '@toddle.parent': ctx.data.Args }
                                        : Args,
                                },
                            })
                            : applyFormula(arg.formula, ctx),
                    }), {});
                    try {
                        return (0, formulaTypes_1.isToddleFormula)(newFunc)
                            ? applyFormula(newFunc.formula, {
                                ...ctx,
                                data: { ...ctx.data, Args: args },
                            })
                            : newFunc.handler(args, {
                                root: ctx.root ?? document,
                                env: ctx.env,
                            });
                    }
                    catch (e) {
                        if (typeof window !== 'undefined' &&
                            window.toddle.errors) {
                            const myWindow = window;
                            myWindow.toddle.errors.push(e);
                        }
                        console.error(e);
                        return null;
                    }
                }
                else if (typeof legacyFunc === 'function') {
                    const args = formula.arguments.map((arg) => arg.isFunction
                        ? (Args) => applyFormula(arg.formula, {
                            ...ctx,
                            data: {
                                ...ctx.data,
                                Args: ctx.data.Args
                                    ? { ...Args, '@toddle.parent': ctx.data.Args }
                                    : Args,
                            },
                        })
                        : applyFormula(arg.formula, ctx));
                    try {
                        return legacyFunc(args, ctx);
                    }
                    catch (e) {
                        if (typeof window !== 'undefined' &&
                            window.toddle.errors) {
                            const myWindow = window;
                            myWindow.toddle.errors.push(e);
                        }
                        console.error(e);
                        return null;
                    }
                }
                console.error(`Could not find formula ${formula.name} in package ${packageName ?? ''}`, formula);
                return null;
            }
            case 'object':
                return Object.fromEntries(formula.arguments.map((entry) => [
                    entry.name,
                    applyFormula(entry.formula, ctx),
                ]));
            case 'record': // object used to be called record, there are still examples in the wild.
                return Object.fromEntries(formula.entries.map((entry) => [
                    entry.name,
                    applyFormula(entry.formula, ctx),
                ]));
            case 'array':
                return formula.arguments.map((entry) => applyFormula(entry.formula, ctx));
            case 'apply': {
                const componentFormula = ctx.component.formulas?.[formula.name];
                if (!componentFormula) {
                    console.log('Component does not have a formula with the name ', formula.name);
                    return null;
                }
                const Input = Object.fromEntries(formula.arguments.map((arg) => arg.isFunction
                    ? [
                        arg.name,
                        (Args) => applyFormula(arg.formula, {
                            ...ctx,
                            data: {
                                ...ctx.data,
                                Args: ctx.data.Args
                                    ? { ...Args, '@toddle.parent': ctx.data.Args }
                                    : Args,
                            },
                        }),
                    ]
                    : [arg.name, applyFormula(arg.formula, ctx)]));
                const data = {
                    ...ctx.data,
                    Args: ctx.data.Args
                        ? { ...Input, '@toddle.parent': ctx.data.Args }
                        : Input,
                };
                const cache = ctx.formulaCache?.[formula.name]?.get(data);
                if (cache?.hit) {
                    return cache.data;
                }
                else {
                    const result = applyFormula(componentFormula.formula, {
                        ...ctx,
                        data,
                    });
                    ctx.formulaCache?.[formula.name]?.set(data, result);
                    return result;
                }
            }
            default:
                console.error('Could not recognize formula', formula);
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
//# sourceMappingURL=formula.js.map