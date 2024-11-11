/**
 * Convert a component name to a valid HTML tag name according to the custom-element specs
 *
 * https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element
 */
export declare const safeCustomElementName: (name: string) => string;
