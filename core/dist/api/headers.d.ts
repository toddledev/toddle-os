/**
 * Checks if a header is a json (content-type) header
 * Also supports edge cases like application/vnd.api+json and application/vnd.contentful.delivery.v1+json
 * See https://jsonapi.org/#mime-types
 */
export declare const isJsonHeader: (header?: string | null) => boolean;
export declare const isTextHeader: (header?: string | null) => boolean;
export declare const isEventStreamHeader: (header?: string | null) => boolean;
export declare const isJsonStreamHeader: (header?: string | null) => boolean;
export declare const isImageHeader: (header?: string | null) => boolean;
