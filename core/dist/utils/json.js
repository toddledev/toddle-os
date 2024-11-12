"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSONWithDate = parseJSONWithDate;
const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d{1,3})?Z$/;
/**
 * This function is much slower than JSON parse without reviver and is a major
 * bottleneck in the runtime performance. Especially during startup.
 */
function parseJSONWithDate(input) {
    return JSON.parse(input, (_, value) => {
        if (typeof value === 'string' &&
            value.length === 24 &&
            iso8601Regex.test(value)) {
            return new Date(value);
        }
        return value;
    });
}
//# sourceMappingURL=json.js.map