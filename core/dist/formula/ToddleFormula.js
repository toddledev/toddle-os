"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToddleFormula = void 0;
const formulaUtils_1 = require("@toddle/core/src/formula/formulaUtils");
class ToddleFormula {
    formula;
    constructor({ formula }) {
        this.formula = formula;
    }
    /**
     * Traverse all formulas in the formula.
     * @returns An iterable that yields the path and formula.
     */
    *formulasInFormula() {
        yield* (0, formulaUtils_1.getFormulasInFormula)(this.formula);
    }
}
exports.ToddleFormula = ToddleFormula;
//# sourceMappingURL=ToddleFormula.js.map