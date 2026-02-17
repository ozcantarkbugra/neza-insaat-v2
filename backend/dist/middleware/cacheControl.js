"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheControl = cacheControl;
function cacheControl(maxAgeSeconds = 60) {
    return (_req, res, next) => {
        res.set('Cache-Control', `public, max-age=${maxAgeSeconds}`);
        next();
    };
}
//# sourceMappingURL=cacheControl.js.map