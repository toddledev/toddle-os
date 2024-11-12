"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeCustomElementName = void 0;
/**
 * Convert a component name to a valid HTML tag name according to the custom-element specs
 *
 * https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element
 */
const safeCustomElementName = (name) => {
    // Remove any white spaces from the name
    const tag = name.toLocaleLowerCase().replaceAll(' ', '');
    // Add "toddle-" prefix if needed
    if (!tag.includes('-')) {
        return `toddle-${tag}`;
    }
    return tag;
};
exports.safeCustomElementName = safeCustomElementName;
//# sourceMappingURL=customElements.js.map