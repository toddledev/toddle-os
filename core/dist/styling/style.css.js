"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFonts = exports.createStylesheet = void 0;
exports.kebabCase = kebabCase;
const className_1 = require("../src/styling/className");
const theme_1 = require("../src/styling/theme");
const util_1 = require("../src/utils/util");
const collections_1 = require("../utils/collections");
const variantSelector_1 = require("./variantSelector");
const LEGACY_BREAKPOINTS = {
    large: 1440,
    small: 576,
    medium: 960,
};
function kebabCase(string) {
    return string
        .split('')
        .map((char) => {
        return 'ABCDEFGHIJKLMNOPQRSTYVWXYZ'.includes(char)
            ? '-' + char.toLocaleLowerCase()
            : char;
    })
        .join('');
}
const SIZE_PROPERTIES = new Set([
    'width',
    'min-width',
    'max-width',
    'height',
    'min-height',
    'max-height',
    'margin',
    'margin-top',
    'margin-left',
    'margin-bottom',
    'margin-right',
    'padding',
    'padding-top',
    'padding-left',
    'padding-bottom',
    'padding-right',
    'gap',
    'gap-x',
    'gap-y',
    'border-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-width',
    'border-top-width',
    'border-left-width',
    'border-bottom-width',
    'border-right-width',
    'font-size',
    'top',
    'right',
    'bottom',
    'left',
    'outline-width',
]);
const createStylesheet = (root, components, theme, options) => {
    const hashes = new Set();
    // Get fonts used on the page
    const fonts = (0, exports.getAllFonts)(components);
    //Exclude fonts that are not used on this page.
    let stylesheet = (0, theme_1.getThemeCss)('breakpoints' in theme
        ? {
            ...theme,
            fontFamily: Object.fromEntries(Object.entries(theme.fontFamily).filter(([key, value]) => value.default ?? fonts.has('--font-' + key))),
        }
        : {
            ...theme,
            fonts: theme.fonts,
        }, options);
    const styleToCss = (style) => {
        return Object.entries(style)
            .map(([property, value]) => {
            const propertyName = kebabCase(property);
            const propertyValue = String(Number(value)) === String(value) &&
                SIZE_PROPERTIES.has(propertyName)
                ? `${Number(value) * 4}px`
                : value;
            return `${propertyName}:${propertyValue};`;
        })
            .join('\n  ');
    };
    const getNodeStyles = (node, classHash) => {
        try {
            if (!node.style) {
                return '';
            }
            const style = (0, collections_1.omitKeys)(node.style, ['variants', 'breakpoints', 'shadows']);
            const styleVariants = node.variants ?? node.style.variants;
            const renderVariant = (selector, style, options) => {
                const scrollbarStyles = Object.entries(style).filter(([key]) => key == 'scrollbar-width');
                // If selectorCss is empty, we don't need to render the selector
                let styles = styleToCss(style);
                if (options?.startingStyle) {
                    styles = `@starting-style {
            ${styles}
          }`;
                }
                return `
  ${styles.length > 0
                    ? `${selector} {
    ${styles}
  }`
                    : ''}
      ${scrollbarStyles.length > 0
                    ? `
${selector}::-webkit-scrollbar {
  ${scrollbarStyles
                        .map(([_, value]) => {
                        switch (value) {
                            case 'none':
                                return 'width: 0;';
                            case 'thinn':
                            case 'thin':
                                return 'width: 4px;';
                            default:
                                return '';
                        }
                    })
                        .join('\n')}
}
`
                    : ''}
`;
            };
            return `
      ${renderVariant('.' + classHash, style)}
      ${(styleVariants ?? [])
                .map((variant) => {
                const renderedVariant = renderVariant(`.${classHash}${(0, variantSelector_1.variantSelector)(variant)}`, variant.style, {
                    startingStyle: variant.startingStyle,
                });
                if (variant.mediaQuery) {
                    return `
          @media (${Object.entries(variant.mediaQuery)
                        .map(([key, value]) => `${key}: ${value}`)
                        .filter(Boolean)
                        .join(') and (')}) {
            ${renderedVariant}
          }
          `;
                }
                if (variant.breakpoint) {
                    return `
          @media (min-width: ${LEGACY_BREAKPOINTS[variant.breakpoint]}px) {
            ${renderedVariant}
          }
          `;
                }
                return renderedVariant;
            })
                .join('\n')}
      `;
        }
        catch (e) {
            console.error(e);
            return '';
        }
    };
    // Make sure that CSS for dependencies are rendered first so that instance styles can override
    const visitedComponents = new Set();
    function insertComponentStyles(component, package_name) {
        if (visitedComponents.has(component.name)) {
            return;
        }
        visitedComponents.add(component.name);
        if (!component.nodes) {
            console.warn('Unable to find nodes for component', component.name);
            return;
        }
        Object.entries(component.nodes).forEach(([id, node]) => {
            if (node.type === 'component') {
                const childComponent = components.find((c) => c.name ===
                    [node.package ?? package_name, node.name]
                        .filter((c) => c)
                        .join('/'));
                if (childComponent) {
                    insertComponentStyles(childComponent, node.package ?? package_name);
                    stylesheet += '\n' + getNodeStyles(node, `instance\\:${id}`);
                    return;
                }
            }
            if (node.type !== 'element') {
                return;
            }
            const classHash = (0, className_1.getClassName)([node.style, node.variants]);
            if (hashes.has(classHash)) {
                return '';
            }
            hashes.add(classHash);
            stylesheet += '\n' + getNodeStyles(node, classHash);
        });
    }
    insertComponentStyles(root);
    return stylesheet;
};
exports.createStylesheet = createStylesheet;
const getAllFonts = (components) => {
    return new Set(components
        .flatMap((component) => {
        return Object.values(component.nodes).flatMap((node) => {
            if (node.type === 'element') {
                return [
                    node.style.fontFamily,
                    node.style['font-family'],
                    ...(node.variants?.map((v) => v.style.fontFamily ?? v.style['font-family']) ?? []),
                ].filter(util_1.isDefined);
            }
            return [];
        });
    })
        .map((f) => f.replace('var(', '').replace(')', '').replace(/'/g, '')));
};
exports.getAllFonts = getAllFonts;
//# sourceMappingURL=style.css.js.map