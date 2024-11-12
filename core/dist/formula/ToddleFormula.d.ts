import { Formula } from '../formula/formula';
export declare class ToddleFormula {
    private formula;
    constructor({ formula }: {
        formula: Formula;
    });
    /**
     * Traverse all formulas in the formula.
     * @returns An iterable that yields the path and formula.
     */
    formulasInFormula(): Generator<[(string | number)[], Formula]>;
}
