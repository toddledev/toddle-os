"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathSegments = exports.get404Page = exports.matchPageForUrl = void 0;
const util_1 = require("../../../core/src/utils/util");
const matchPageForUrl = ({ url, components, }) => {
    const pathSegments = (0, exports.getPathSegments)(url);
    return getPages(components)
        .sort((a, b) => a.route.path.length - b.route.path.length)
        .find((component) => {
        return (pathSegments.length <= component.route.path.length &&
            component.route.path.every((segment, index) => segment.type === 'param' ||
                segment.optional === true ||
                segment.name === pathSegments[index]));
    });
};
exports.matchPageForUrl = matchPageForUrl;
const get404Page = (components) => getPages(components).find((page) => page.name === '404');
exports.get404Page = get404Page;
const getPages = (components) => Object.values(components).filter((c) => (0, util_1.isDefined)(c.route));
const getPathSegments = (url) => url.pathname
    .substring(1)
    .split('/')
    .filter((s) => s !== '');
exports.getPathSegments = getPathSegments;
//# sourceMappingURL=routing.js.map