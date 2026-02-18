"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errorHandler_1 = require("../middleware/errorHandler");
const bcrypt_1 = require("../utils/bcrypt");
class AdminService {
    async getDashboardStats() {
        const [totalProjects, activeProjects, completedProjects, totalBlogs, publishedBlogs, totalMessages, unreadMessages, totalUsers,] = await Promise.all([
            database_1.default.project.count(),
            database_1.default.project.count({ where: { status: 'IN_PROGRESS' } }),
            database_1.default.project.count({ where: { status: 'COMPLETED' } }),
            database_1.default.blog.count(),
            database_1.default.blog.count({ where: { status: 'PUBLISHED' } }),
            database_1.default.contactMessage.count(),
            database_1.default.contactMessage.count({ where: { read: false } }),
            database_1.default.user.count(),
        ]);
        return {
            projects: {
                total: totalProjects,
                active: activeProjects,
                completed: completedProjects,
            },
            blogs: {
                total: totalBlogs,
                published: publishedBlogs,
            },
            messages: {
                total: totalMessages,
                unread: unreadMessages,
            },
            users: {
                total: totalUsers,
            },
        };
    }
    async getUsers(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.user.count(),
        ]);
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async updateUserRole(userId, role) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return database_1.default.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
            },
        });
    }
    async toggleUserActive(userId) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return database_1.default.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
            },
        });
    }
    async createUser(data) {
        const existing = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new errorHandler_1.AppError('Bu e-posta adresi zaten kayıtlı', 400);
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
        const user = await database_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName ?? undefined,
                lastName: data.lastName ?? undefined,
                role: data.role,
            },
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
        return user;
    }
    async updateUser(userId, data) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const updateData = {};
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.firstName !== undefined)
            updateData.firstName = data.firstName || undefined;
        if (data.lastName !== undefined)
            updateData.lastName = data.lastName || undefined;
        if (data.role !== undefined)
            updateData.role = data.role;
        if (data.password && data.password.length > 0) {
            updateData.password = await (0, bcrypt_1.hashPassword)(data.password);
        }
        return database_1.default.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
            },
        });
    }
    async getBlogCategories() {
        return database_1.default.blogCategory.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async createBlogCategory(data) {
        const existing = await database_1.default.blogCategory.findUnique({
            where: { slug: data.slug },
        });
        if (existing) {
            throw new errorHandler_1.AppError('Category with this slug already exists', 400);
        }
        return database_1.default.blogCategory.create({
            data,
        });
    }
    async updateBlogCategory(id, data) {
        const existing = await database_1.default.blogCategory.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new errorHandler_1.AppError('Category not found', 404);
        }
        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await database_1.default.blogCategory.findUnique({
                where: { slug: data.slug },
            });
            if (slugExists) {
                throw new errorHandler_1.AppError('Category with this slug already exists', 400);
            }
        }
        return database_1.default.blogCategory.update({
            where: { id },
            data,
        });
    }
    async deleteBlogCategory(id) {
        const category = await database_1.default.blogCategory.findFirst({
            where: { id, isDeleted: false },
        });
        if (!category) {
            throw new errorHandler_1.AppError('Category not found', 404);
        }
        await database_1.default.blogCategory.update({
            where: { id },
            data: { isDeleted: true },
        });
        return { message: 'Category deleted successfully' };
    }
    async getSiteSettings(group) {
        const where = {};
        if (group)
            where.group = group;
        const settings = await database_1.default.siteSetting.findMany({
            where,
            orderBy: [{ group: 'asc' }, { key: 'asc' }],
        });
        return settings;
    }
    async updateSiteSetting(key, value) {
        const setting = await database_1.default.siteSetting.findUnique({
            where: { key },
        });
        if (!setting) {
            throw new errorHandler_1.AppError('Setting not found', 404);
        }
        return database_1.default.siteSetting.update({
            where: { key },
            data: { value },
        });
    }
    async uploadMedia(file, baseUrl) {
        const mediaFile = await database_1.default.mediaFile.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                path: file.path,
                url: `${baseUrl}/uploads/${file.filename}`,
            },
        });
        return mediaFile;
    }
    async getMedia(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = { isDeleted: false };
        if (filters.mimeType)
            where.mimeType = { startsWith: filters.mimeType };
        const [files, total] = await Promise.all([
            database_1.default.mediaFile.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.mediaFile.count({ where }),
        ]);
        return {
            files,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async deleteMedia(id) {
        const file = await database_1.default.mediaFile.findFirst({
            where: { id, isDeleted: false },
        });
        if (!file) {
            throw new errorHandler_1.AppError('Media file not found', 404);
        }
        await database_1.default.mediaFile.update({
            where: { id },
            data: { isDeleted: true },
        });
        return { message: 'Media file deleted successfully' };
    }
}
exports.AdminService = AdminService;
exports.default = new AdminService();
//# sourceMappingURL=adminService.js.map