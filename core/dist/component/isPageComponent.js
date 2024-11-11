"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPageComponent = void 0;
const util_1 = require("../src/utils/util");
const isPageComponent = (component) => (0, util_1.isDefined)(component.route);
exports.isPageComponent = isPageComponent;
//# sourceMappingURL=isPageComponent.js.map