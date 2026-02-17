"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }
        const token = authHeader.substring(7);
        try {
            const payload = (0, jwt_1.verifyAccessToken)(token);
            // Verify user still exists and is active
            const user = await database_1.default.user.findUnique({
                where: { id: payload.userId },
                select: { id: true, email: true, role: true, isActive: true },
            });
            if (!user || !user.isActive) {
                res.status(401).json({ error: 'Unauthorized: User not found or inactive' });
                return;
            }
            req.user = {
                ...payload,
                id: user.id,
            };
            next();
        }
        catch (error) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
    }
    catch (error) {
        next(error);
    }
}
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map