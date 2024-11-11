"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha1 = exports.stableStringify = void 0;
const collections_1 = require("@toddle/core/src/utils/collections");
const stableStringify = (obj) => JSON.stringify((0, collections_1.deepSortObject)(obj));
exports.stableStringify = stableStringify;
const sha1 = async (data) => {
    const payload = new Uint8Array((0, exports.stableStringify)(data)
        .split('')
        .map(function (c) {
        return c.charCodeAt(0);
    }));
    const hashBuffer = await crypto.subtle.digest('SHA-1', payload);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
exports.sha1 = sha1;
//# sourceMappingURL=sha1.js.map