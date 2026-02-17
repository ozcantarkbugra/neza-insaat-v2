"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = __importDefault(require("../services/authService"));
const zod_1 = require("zod");
const validator_1 = require("../middleware/validator");
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(1),
    }),
});
const refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string(),
    }),
});
class AuthController {
    constructor() {
        this.register = [
            (0, validator_1.validate)(registerSchema),
            async (req, res, next) => {
                try {
                    const result = await authService_1.default.register(req.body);
                    res.status(201).json(result);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.login = [
            (0, validator_1.validate)(loginSchema),
            async (req, res, next) => {
                try {
                    const result = await authService_1.default.login(req.body);
                    res.json(result);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.refresh = [
            (0, validator_1.validate)(refreshSchema),
            async (req, res, next) => {
                try {
                    const { refreshToken } = req.body;
                    const result = await authService_1.default.refreshToken(refreshToken);
                    res.json(result);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.logout = async (req, res, next) => {
            try {
                if (req.user) {
                    await authService_1.default.logout(req.user.id);
                }
                res.json({ message: 'Logged out successfully' });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                if (!req.user) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const user = await authService_1.default.getMe(req.user.id);
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map