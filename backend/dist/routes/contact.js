"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const contactController_1 = __importDefault(require("../controllers/contactController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const contactFormLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({
            error: 'Çok fazla mesaj gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.',
        });
    },
});
router.post('/', contactFormLimiter, ...contactController_1.default.create);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.getAll);
router.get('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.getById);
router.patch('/:id/read', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.markAsRead);
router.patch('/:id/replied', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.markAsReplied);
router.patch('/:id/toggle-active', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController_1.default.toggleActive);
exports.default = router;
//# sourceMappingURL=contact.js.map