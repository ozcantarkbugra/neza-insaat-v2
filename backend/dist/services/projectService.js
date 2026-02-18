"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errorHandler_1 = require("../middleware/errorHandler");
class ProjectService {
    async getAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.featured !== undefined)
            where.featured = filters.featured;
        if (filters.serviceId)
            where.serviceId = filters.serviceId;
        if (!filters.includeInactive)
            where.isActive = true;
        const [projects, total] = await Promise.all([
            database_1.default.project.findMany({
                where,
                include: {
                    images: {
                        orderBy: { order: 'asc' },
                    },
                    service: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.project.count({ where }),
        ]);
        return {
            projects,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getBySlug(slug) {
        const project = await database_1.default.project.findFirst({
            where: { slug, isActive: true },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
                service: true,
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
        if (!project) {
            throw new errorHandler_1.AppError('Project not found', 404);
        }
        return project;
    }
    async getById(id) {
        const project = await database_1.default.project.findFirst({
            where: { id, isActive: true },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
                service: true,
            },
        });
        if (!project) {
            throw new errorHandler_1.AppError('Project not found', 404);
        }
        return project;
    }
    async create(data, userId) {
        const existing = await database_1.default.project.findUnique({
            where: { slug: data.slug },
        });
        if (existing) {
            throw new errorHandler_1.AppError('Project with this slug already exists', 400);
        }
        const { imageUrls, ...projectData } = data;
        const project = await database_1.default.project.create({
            data: {
                ...projectData,
                createdById: userId,
                updatedById: userId,
                images: imageUrls
                    ? {
                        create: imageUrls.map((url, index) => ({
                            url,
                            order: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                images: true,
                service: true,
            },
        });
        return project;
    }
    async update(data, userId) {
        const { id, imageUrls, ...updateData } = data;
        const existing = await database_1.default.project.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new errorHandler_1.AppError('Project not found', 404);
        }
        if (updateData.slug && updateData.slug !== existing.slug) {
            const slugExists = await database_1.default.project.findUnique({
                where: { slug: updateData.slug },
            });
            if (slugExists) {
                throw new errorHandler_1.AppError('Project with this slug already exists', 400);
            }
        }
        if (imageUrls !== undefined) {
            await database_1.default.projectImage.deleteMany({
                where: { projectId: id },
            });
            if (imageUrls.length > 0) {
                await database_1.default.projectImage.createMany({
                    data: imageUrls.map((url, index) => ({
                        projectId: id,
                        url,
                        order: index,
                    })),
                });
            }
        }
        const project = await database_1.default.project.update({
            where: { id },
            data: {
                ...updateData,
                updatedById: userId,
            },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
                service: true,
            },
        });
        return project;
    }
    async toggleActive(id) {
        const project = await database_1.default.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new errorHandler_1.AppError('Project not found', 404);
        }
        const updated = await database_1.default.project.update({
            where: { id },
            data: { isActive: !project.isActive },
            include: {
                images: { orderBy: { order: 'asc' } },
                service: true,
            },
        });
        return updated;
    }
}
exports.ProjectService = ProjectService;
exports.default = new ProjectService();
//# sourceMappingURL=projectService.js.map