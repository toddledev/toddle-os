"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collections_1 = require("../utils/collections");
describe('sortObjectEntries()', () => {
    test('it sorts entries in an object based on the callback function', () => {
        expect((0, collections_1.sortObjectEntries)({ c: 'hello', a: 'value', b: 'otherValue' }, ([key]) => key)).toEqual([
            ['a', 'value'],
            ['b', 'otherValue'],
            ['c', 'hello'],
        ]);
        expect((0, collections_1.sortObjectEntries)({ c: 'hello', a: 'value', b: 'otherValue' }, ([_, value]) => value)).toEqual([
            ['c', 'hello'],
            ['b', 'otherValue'],
            ['a', 'value'],
        ]);
    });
});
//# sourceMappingURL=collections.test.js.map