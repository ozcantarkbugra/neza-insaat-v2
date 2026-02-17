"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminService_1 = __importDefault(require("../services/adminService"));
const cacheControl_1 = require("../middleware/cacheControl");
const router = (0, express_1.Router)();
// Public: site ayarlarını döner (footer, iletişim vb. için) - 5 dk cache
router.get('/', (0, cacheControl_1.cacheControl)(300), async (_req, res, next) => {
    try {
        const settings = await adminService_1.default.getSiteSettings();
        const map = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});
        res.json(map);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=settings.js.map