"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const serviceService_1 = __importDefault(require("../services/serviceService"));
const zod_1 = require("zod");
const validator_1 = require("../middleware/validator");
const createServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        titleEn: zod_1.z.string().optional(),
        slug: zod_1.z.string().min(1),
        description: zod_1.z.string().min(1),
        descriptionEn: zod_1.z.string().optional(),
        shortDescription: zod_1.z.string().optional(),
        shortDescriptionEn: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        featured: zod_1.z.boolean().optional(),
        order: zod_1.z.number().int().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
    }),
});
const updateServiceSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        titleEn: zod_1.z.string().optional(),
        slug: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        descriptionEn: zod_1.z.string().optional(),
        shortDescription: zod_1.z.string().optional(),
        shortDescriptionEn: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        featured: zod_1.z.boolean().optional(),
        order: zod_1.z.number().int().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
    }),
});
class ServiceController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
                const includeInactive = req.query.includeInactive === 'true' || req.query.includeInactive === '1';
                const services = await serviceService_1.default.getAll({ featured, includeInactive });
                res.json(services);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBySlug = async (req, res, next) => {
            try {
                const { slug } = req.params;
                const service = await serviceService_1.default.getBySlug(slug);
                res.json(service);
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const service = await serviceService_1.default.getById(id);
                res.json(service);
            }
            catch (error) {
                next(error);
            }
        };
        this.create = [
            (0, validator_1.validate)(createServiceSchema),
            async (req, res, next) => {
                try {
                    const service = await serviceService_1.default.create(req.body);
                    res.status(201).json(service);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.update = [
            (0, validator_1.validate)(updateServiceSchema),
            async (req, res, next) => {
                try {
                    const service = await serviceService_1.default.update({
                        id: req.params.id,
                        ...req.body,
                    });
                    res.json(service);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.delete = async (req, res, next) => {
            try {
                const { id } = req.params;
                const result = await serviceService_1.default.delete(id);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleActive = async (req, res, next) => {
            try {
                const { id } = req.params;
                const service = await serviceService_1.default.toggleActive(id);
                res.json(service);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ServiceController = ServiceController;
exports.default = new ServiceController();
//# sourceMappingURL=serviceController.js.map