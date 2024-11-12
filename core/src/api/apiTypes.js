"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectError = exports.ApiMethod = void 0;
var ApiMethod;
(function (ApiMethod) {
    ApiMethod["GET"] = "GET";
    ApiMethod["POST"] = "POST";
    ApiMethod["DELETE"] = "DELETE";
    ApiMethod["PUT"] = "PUT";
    ApiMethod["PATCH"] = "PATCH";
    ApiMethod["HEAD"] = "HEAD";
    ApiMethod["OPTIONS"] = "OPTIONS";
})(ApiMethod || (exports.ApiMethod = ApiMethod = {}));
class RedirectError extends Error {
    redirect;
    constructor(redirect) {
        super();
        this.redirect = redirect;
    }
}
exports.RedirectError = RedirectError;
//# sourceMappingURL=apiTypes.js.map