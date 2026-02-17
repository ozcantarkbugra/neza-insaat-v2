"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheControl = cacheControl;
/**
 * Cache-Control middleware for public GET endpoints.
 * max-age in seconds (60 = 1 minute)
 */
function cacheControl(maxAgeSeconds = 60) {
    return (_req, res, next) => {
        res.set('Cache-Control', `public, max-age=${maxAgeSeconds}`);
        next();
    };
}
//# sourceMappingURL=cacheControl.js.map