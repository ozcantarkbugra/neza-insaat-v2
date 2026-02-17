"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = __importDefault(require("../controllers/serviceController"));
const auth_1 = require("../middleware/auth");
const cacheControl_1 = require("../middleware/cacheControl");
const router = (0, express_1.Router)();
// Public routes - 1 dk cache
router.get('/', (0, cacheControl_1.cacheControl)(60), serviceController_1.default.getAll);
router.get('/slug/:slug', (0, cacheControl_1.cacheControl)(60), serviceController_1.default.getBySlug);
router.get('/:id', (0, cacheControl_1.cacheControl)(60), serviceController_1.default.getById);
// Protected routes (admin only)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), ...serviceController_1.default.create);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), ...serviceController_1.default.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), serviceController_1.default.delete);
exports.default = router;
//# sourceMappingURL=services.js.map