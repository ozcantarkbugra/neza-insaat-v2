"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errorHandler_1 = require("../middleware/errorHandler");
class ServiceService {
    async getAll(filters) {
        const where = { isDeleted: false };
        if (filters.featured !== undefined)
            where.featured = filters.featured;
        if (!filters.includeInactive)
            where.isActive = true;
        const services = await database_1.default.service.findMany({
            where,
            include: {
                _count: {
                    select: { projects: true },
                },
            },
            orderBy: { order: 'asc' },
        });
        return services;
    }
    async getBySlug(slug) {
        const service = await database_1.default.service.findFirst({
            where: { slug, isDeleted: false, isActive: true },
            include: {
                projects: {
                    take: 6,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        images: {
                            take: 1,
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (!service) {
            throw new errorHandler_1.AppError('Service not found', 404);
        }
        return service;
    }
    async getById(id) {
        const service = await database_1.default.service.findFirst({
            where: { id, isDeleted: false },
        });
        if (!service) {
            throw new errorHandler_1.AppError('Service not found', 404);
        }
        return service;
    }
    async create(data) {
        const existing = await database_1.default.service.findUnique({
            where: { slug: data.slug },
        });
        if (existing) {
            throw new errorHandler_1.AppError('Service with this slug already exists', 400);
        }
        const service = await database_1.default.service.create({
            data,
        });
        return service;
    }
    async update(data) {
        const { id, ...updateData } = data;
        const existing = await database_1.default.service.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new errorHandler_1.AppError('Service not found', 404);
        }
        if (updateData.slug && updateData.slug !== existing.slug) {
            const slugExists = await database_1.default.service.findUnique({
                where: { slug: updateData.slug },
            });
            if (slugExists) {
                throw new errorHandler_1.AppError('Service with this slug already exists', 400);
            }
        }
        const service = await database_1.default.service.update({
            where: { id },
            data: updateData,
        });
        return service;
    }
    async delete(id) {
        const service = await database_1.default.service.findFirst({
            where: { id, isDeleted: false },
        });
        if (!service) {
            throw new errorHandler_1.AppError('Service not found', 404);
        }
        await database_1.default.service.update({
            where: { id },
            data: { isDeleted: true },
        });
        return { message: 'Service deleted successfully' };
    }
    async toggleActive(id) {
        const service = await database_1.default.service.findFirst({
            where: { id, isDeleted: false },
        });
        if (!service) {
            throw new errorHandler_1.AppError('Service not found', 404);
        }
        return database_1.default.service.update({
            where: { id },
            data: { isActive: !service.isActive },
        });
    }
}
exports.ServiceService = ServiceService;
exports.default = new ServiceService();
//# sourceMappingURL=serviceService.js.map