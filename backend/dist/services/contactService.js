"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errorHandler_1 = require("../middleware/errorHandler");
class ContactService {
    async create(data) {
        const message = await database_1.default.contactMessage.create({
            data,
        });
        return message;
    }
    async getAll(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = { isDeleted: false };
        if (filters.read !== undefined)
            where.read = filters.read;
        const [messages, total] = await Promise.all([
            database_1.default.contactMessage.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.default.contactMessage.count({ where }),
        ]);
        return {
            messages,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getById(id) {
        const message = await database_1.default.contactMessage.findUnique({
            where: { id },
        });
        if (!message) {
            throw new errorHandler_1.AppError('Message not found', 404);
        }
        return message;
    }
    async markAsRead(id) {
        const message = await database_1.default.contactMessage.findUnique({
            where: { id },
        });
        if (!message) {
            throw new errorHandler_1.AppError('Message not found', 404);
        }
        return database_1.default.contactMessage.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAsReplied(id) {
        const message = await database_1.default.contactMessage.findUnique({
            where: { id },
        });
        if (!message) {
            throw new errorHandler_1.AppError('Message not found', 404);
        }
        return database_1.default.contactMessage.update({
            where: { id },
            data: { replied: true },
        });
    }
    async delete(id) {
        const message = await database_1.default.contactMessage.findFirst({
            where: { id, isDeleted: false },
        });
        if (!message) {
            throw new errorHandler_1.AppError('Message not found', 404);
        }
        await database_1.default.contactMessage.update({
            where: { id },
            data: { isDeleted: true },
        });
        return { message: 'Contact message deleted successfully' };
    }
}
exports.ContactService = ContactService;
exports.default = new ContactService();
//# sourceMappingURL=contactService.js.map