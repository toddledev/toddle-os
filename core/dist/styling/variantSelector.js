"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variantSelector = void 0;
const variantSelector = (variant) => [
    (variant.className ?? variant['class']) && `.${variant.className}`,
    (variant.evenChild ?? variant['even-child']) && ':nth-child(even)',
    (variant.firstChild ?? variant['first-child']) && ':first-child',
    (variant.focusWithin ?? variant['focus-within']) && ':focus-within',
    (variant.lastChild ?? variant['last-child']) && ':last-child',
    variant.active && ':active',
    variant.autofill && ':is(:-webkit-autofill, :autofill)',
    variant.checked && ':checked',
    variant.disabled && ':disabled',
    variant.empty && ':empty',
    variant.focus && ':focus',
    variant.hover && ':hover',
    variant.invalid && ':invalid',
    variant.link && ':link',
    variant.visited && ':visited',
    variant['first-of-type'] && ':first-of-type',
    variant['focus-visible'] && ':focus-visible',
    variant['last-of-type'] && ':last-of-type',
    variant['popover-open'] && ':popover-open',
    variant.pseudoElement && `::${variant.pseudoElement}`,
]
    .filter(Boolean)
    .join('');
exports.variantSelector = variantSelector;
//# sourceMappingURL=variantSelector.js.map