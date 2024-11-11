"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRING_TEMPLATE = void 0;
const STRING_TEMPLATE = (type, name) => {
    return `{{ ${templateTypes[type]}.${name} }}`;
};
exports.STRING_TEMPLATE = STRING_TEMPLATE;
const templateTypes = {
    cookies: 'cookies',
};
//# sourceMappingURL=template.js.map