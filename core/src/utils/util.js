"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBoolean = exports.isObject = exports.isDefined = void 0;
const isDefined = (value) => value !== null && value !== undefined;
exports.isDefined = isDefined;
const isObject = (input) => typeof input === 'object' && input !== null;
exports.isObject = isObject;
const toBoolean = (value) => value !== false && value !== undefined && value !== null;
exports.toBoolean = toBoolean;
//# sourceMappingURL=util.js.map