"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../middleware/errorHandler");
const client_1 = require("@prisma/client");
class AuthService {
    async register(data) {
        // Check if user exists
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new errorHandler_1.AppError('User with this email already exists', 400);
        }
        // Hash password
        const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
        // Create user
        const user = await database_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: client_1.UserRole.EDITOR, // Default role
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        // Generate tokens
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        // Save refresh token
        await database_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async login(data) {
        // Find user
        const user = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        if (!user.isActive) {
            throw new errorHandler_1.AppError('Account is inactive', 403);
        }
        // Verify password
        const isValidPassword = await (0, bcrypt_1.comparePassword)(data.password, user.password);
        if (!isValidPassword) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        // Generate tokens
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        // Save refresh token
        await database_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(refreshToken) {
        // Verify refresh token
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        // Find user
        const user = await database_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user || !user.isActive) {
            throw new errorHandler_1.AppError('Invalid refresh token', 401);
        }
        if (user.refreshToken !== refreshToken) {
            throw new errorHandler_1.AppError('Invalid refresh token', 401);
        }
        // Generate new access token
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        return { accessToken };
    }
    async logout(userId) {
        await database_1.default.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async getMe(userId) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return user;
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
//# sourceMappingURL=authService.js.map