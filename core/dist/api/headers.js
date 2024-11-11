"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImageHeader = exports.isJsonStreamHeader = exports.isEventStreamHeader = exports.isTextHeader = exports.isJsonHeader = void 0;
/**
 * Checks if a header is a json (content-type) header
 * Also supports edge cases like application/vnd.api+json and application/vnd.contentful.delivery.v1+json
 * See https://jsonapi.org/#mime-types
 */
const isJsonHeader = (header) => {
    if (typeof header !== 'string') {
        return false;
    }
    return /^application\/(json|.*\+json)/.test(header);
};
exports.isJsonHeader = isJsonHeader;
const isTextHeader = (header) => {
    if (typeof header !== 'string') {
        return false;
    }
    return /^(text\/|application\/x-www-form-urlencoded|application\/(xml|.*\+xml))/.test(header);
};
exports.isTextHeader = isTextHeader;
const isEventStreamHeader = (header) => {
    if (typeof header !== 'string') {
        return false;
    }
    return /^text\/event-stream/.test(header);
};
exports.isEventStreamHeader = isEventStreamHeader;
const isJsonStreamHeader = (header) => {
    if (typeof header !== 'string') {
        return false;
    }
    return /^(application\/stream\+json|application\/x-ndjson)/.test(header);
};
exports.isJsonStreamHeader = isJsonStreamHeader;
const isImageHeader = (header) => {
    if (typeof header !== 'string') {
        return false;
    }
    return /^image\//.test(header);
};
exports.isImageHeader = isImageHeader;
//# sourceMappingURL=headers.js.map