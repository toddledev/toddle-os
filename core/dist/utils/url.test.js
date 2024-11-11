"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const url_1 = require("./url");
(0, globals_1.describe)('validateUrl()', () => {
    (0, globals_1.test)('it validates urls correctly', () => {
        (0, globals_1.expect)((0, url_1.validateUrl)('https://toddle.dev')).toBeInstanceOf(URL);
        (0, globals_1.expect)((0, url_1.validateUrl)('not-a-url')).toBe(false);
    });
});
//# sourceMappingURL=url.test.js.map