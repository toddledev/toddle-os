"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const collections_1 = require("@toddle/core/src/utils/collections");
const crypto_1 = __importDefault(require("crypto"));
const sha1_1 = require("./sha1");
global.crypto = crypto_1.default;
(0, globals_1.describe)('sha1', () => {
    (0, globals_1.test)('calculating sha1 of an object works', async () => {
        const data = { foo: 'bar' };
        const sha = await (0, sha1_1.sha1)(data);
        (0, globals_1.expect)(sha).toHaveLength(40);
    });
    (0, globals_1.test)('identical objects should lead to the same sha', async () => {
        const now = new Date();
        const data1 = { foo: 'bar', time: now };
        const data2 = { foo: 'bar', time: now };
        const firstSha = await (0, sha1_1.sha1)(data1);
        const secondSha = await (0, sha1_1.sha1)(data2);
        (0, globals_1.expect)(firstSha).toEqual(secondSha);
    });
    (0, globals_1.test)('variations of an object results in different sha values', async () => {
        const now = new Date();
        const data1 = { foo: 'bar', time: now };
        const firstSha = await (0, sha1_1.sha1)(data1);
        const data2 = { foo: 'bar', time: new Date(now.getTime() + 1000) };
        const secondSha = await (0, sha1_1.sha1)(data2);
        (0, globals_1.expect)(firstSha).not.toEqual(secondSha);
    });
    (0, globals_1.test)('stableStringify', () => {
        const now = new Date();
        (0, globals_1.expect)((0, sha1_1.stableStringify)({ time: now, foo: 'bar' })).toEqual(`{"foo":"bar","time":"${now.toJSON()}"}`);
    });
    (0, globals_1.test)('sortObject sorts object keys as expected', () => {
        (0, globals_1.expect)((0, collections_1.deepSortObject)({
            c: 'test',
            b: [3, 2, { b: 0, a: 1 }],
            d: undefined,
            a: { 2: 'val', 1: 'foo' },
        })).toEqual({
            a: { 1: 'foo', 2: 'val' },
            b: [3, 2, { a: 1, b: 0 }],
            c: 'test',
            d: undefined,
        });
    });
});
//# sourceMappingURL=sha1.test.js.map