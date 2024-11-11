"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROXY_URL_HEADER = exports.validateUrl = exports.isLocalhostHostname = exports.isLocalhostUrl = void 0;
const LOCALHOSTS = ['http://localhost:54404', 'http://preview.localhost:54404'];
const isLocalhostUrl = (hrefOrOrigin) => LOCALHOSTS.some((host) => hrefOrOrigin.startsWith(host));
exports.isLocalhostUrl = isLocalhostUrl;
const isLocalhostHostname = (hostname) => hostname === 'localhost' || hostname === '127.0.0.1';
exports.isLocalhostHostname = isLocalhostHostname;
const validateUrl = (url, base) => {
    if (typeof url !== 'string') {
        return false;
    }
    try {
        return new URL(url, base);
    }
    catch {
        return false;
    }
};
exports.validateUrl = validateUrl;
exports.PROXY_URL_HEADER = 'x-toddle-url';
//# sourceMappingURL=url.js.map