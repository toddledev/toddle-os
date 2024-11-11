"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtmlLanguage = void 0;
const formula_1 = require("@toddle/core/src/formula/formula");
const getHtmlLanguage = ({ pageInfo, formulaContext, defaultLanguage = 'en', }) => pageInfo?.language
    ? (0, formula_1.applyFormula)(pageInfo.language.formula, formulaContext)
    : defaultLanguage;
exports.getHtmlLanguage = getHtmlLanguage;
//# sourceMappingURL=html.js.map