"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errorHandler_1 = require("../middleware/errorHandler");
class BlogService {
    async getAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.featured !== undefined)
            where.featured = filters.featured;
        if (filters.categoryId)
            where.categoryId = filters.categoryId;
        const [blogs, total] = await Promise.all([
            database_1.default.blog.findMany({
                where,
                include: {
                    category: true,
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.blog.count({ where }),
        ]);
        return {
            blogs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getBySlug(slug) {
        const blog = await database_1.default.blog.findUnique({
            where: { slug },
            include: {
                category: true,
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        if (!blog) {
            throw new errorHandler_1.AppError('Blog not found', 404);
        }
        // Increment views
        await database_1.default.blog.update({
            where: { id: blog.id },
            data: { views: { increment: 1 } },
        });
        return blog;
    }
    async getById(id) {
        const blog = await database_1.default.blog.findUnique({
            where: { id },
            include: {
                category: true,
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!blog) {
            throw new errorHandler_1.AppError('Blog not found', 404);
        }
        return blog;
    }
    async create(data, userId) {
        const existing = await database_1.default.blog.findUnique({
            where: { slug: data.slug },
        });
        if (existing) {
            throw new errorHandler_1.AppError('Blog with this slug already exists', 400);
        }
        const blog = await database_1.default.blog.create({
            data: {
                ...data,
                createdById: userId,
                updatedById: userId,
                publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
            },
            include: {
                category: true,
            },
        });
        return blog;
    }
    async update(data, userId) {
        const { id, ...updateData } = data;
        const existing = await database_1.default.blog.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new errorHandler_1.AppError('Blog not found', 404);
        }
        if (updateData.slug && updateData.slug !== existing.slug) {
            const slugExists = await database_1.default.blog.findUnique({
                where: { slug: updateData.slug },
            });
            if (slugExists) {
                throw new errorHandler_1.AppError('Blog with this slug already exists', 400);
            }
        }
        // Handle publishedAt
        const publishedAt = updateData.status === 'PUBLISHED' && existing.status !== 'PUBLISHED'
            ? new Date()
            : updateData.status === 'PUBLISHED' && existing.publishedAt
                ? existing.publishedAt
                : updateData.status !== 'PUBLISHED'
                    ? null
                    : undefined;
        const blog = await database_1.default.blog.update({
            where: { id },
            data: {
                ...updateData,
                updatedById: userId,
                publishedAt,
            },
            include: {
                category: true,
            },
        });
        return blog;
    }
    async delete(id) {
        const blog = await database_1.default.blog.findUnique({
            where: { id },
        });
        if (!blog) {
            throw new errorHandler_1.AppError('Blog not found', 404);
        }
        await database_1.default.blog.delete({
            where: { id },
        });
        return { message: 'Blog deleted successfully' };
    }
}
exports.BlogService = BlogService;
exports.default = new BlogService();
//# sourceMappingURL=blogService.js.map