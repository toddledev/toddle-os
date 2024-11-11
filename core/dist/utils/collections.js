"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepSortObject = exports.easySort = exports.sortObjectEntries = exports.set = exports.filterObject = exports.groupBy = exports.omitKeys = exports.omit = exports.mapValues = exports.mapObject = exports.isObject = void 0;
exports.get = get;
const util_1 = require("../src/utils/util");
const isObject = (input) => typeof input === 'object' && input !== null;
exports.isObject = isObject;
const mapObject = (object, f) => Object.fromEntries(Object.entries(object).map(f));
exports.mapObject = mapObject;
const mapValues = (object, f) => (0, exports.mapObject)(object, ([key, value]) => [key, f(value)]);
exports.mapValues = mapValues;
const omit = (collection, key) => {
    const [head, ...rest] = key;
    const clone = Array.isArray(collection)
        ? [...collection]
        : (0, exports.isObject)(collection)
            ? { ...collection }
            : {};
    if (rest.length === 0) {
        delete clone[head];
    }
    else {
        clone[head] = (0, exports.omit)(clone[head], rest);
    }
    return clone;
};
exports.omit = omit;
const omitKeys = (object, keys) => Object.fromEntries(Object.entries(object).filter(([k]) => !keys.includes(k)));
exports.omitKeys = omitKeys;
const groupBy = (items, f) => items.reduce((acc, item) => {
    const key = f(item);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
}, {});
exports.groupBy = groupBy;
const filterObject = (object, f) => Object.fromEntries(Object.entries(object).filter(f));
exports.filterObject = filterObject;
function get(collection, [head, ...rest]) {
    if (rest.length === 0) {
        return collection?.[head];
    }
    return get(collection?.[head], rest);
}
const set = (collection, key, value) => {
    const [head, ...rest] = key;
    const clone = Array.isArray(collection)
        ? [...collection]
        : (0, exports.isObject)(collection)
            ? { ...collection }
            : {};
    clone[head] = rest.length === 0 ? value : (0, exports.set)(clone[head], rest, value);
    return clone;
};
exports.set = set;
const sortObjectEntries = (object, f, ascending = true) => (0, exports.easySort)(Object.entries(object), f, ascending);
exports.sortObjectEntries = sortObjectEntries;
const easySort = (collection, f, ascending = true) => [...collection].sort((a, b) => {
    const keyA = f(a);
    const keyB = f(b);
    if (keyA === keyB) {
        return 0;
    }
    return (keyA > keyB ? 1 : -1) * (ascending ? 1 : -1);
});
exports.easySort = easySort;
const deepSortObject = (obj) => {
    if (!(0, util_1.isDefined)(obj)) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((val) => (0, exports.deepSortObject)(val));
    }
    else if (typeof obj === 'object' && Object.keys(obj).length > 0) {
        return [...Object.keys(obj)].sort().reduce((acc, key) => {
            acc[key] = (0, exports.deepSortObject)(obj[key]);
            return acc;
        }, {});
    }
    return obj;
};
exports.deepSortObject = deepSortObject;
//# sourceMappingURL=collections.js.map