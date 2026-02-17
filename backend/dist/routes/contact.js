"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = __importDefault(require("../controllers/contactController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public route
router.post('/', ...contactController_1.default.create);
// Protected routes (admin only)
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.getAll);
router.get('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.getById);
router.patch('/:id/read', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.markAsRead);
router.patch('/:id/replied', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.markAsReplied);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.delete);
exports.default = router;
//# sourceMappingURL=contact.js.map