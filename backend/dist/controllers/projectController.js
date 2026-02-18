"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const projectService_1 = __importDefault(require("../services/projectService"));
const zod_1 = require("zod");
const validator_1 = require("../middleware/validator");
const createProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        titleEn: zod_1.z.string().optional(),
        slug: zod_1.z.string().min(1),
        description: zod_1.z.string().min(1),
        descriptionEn: zod_1.z.string().optional(),
        shortDescription: zod_1.z.string().optional(),
        shortDescriptionEn: zod_1.z.string().optional(),
        status: zod_1.z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']),
        area: zod_1.z.number().positive().optional(),
        location: zod_1.z.string().optional(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        deliveryDate: zod_1.z.string().datetime().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        featured: zod_1.z.boolean().optional(),
        featuredImage: zod_1.z.string().url().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
        serviceId: zod_1.z.string().uuid().optional(),
        imageUrls: zod_1.z.array(zod_1.z.string().url()).optional(),
    }),
});
const updateProjectSchema = zod_1.z.object({
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
        status: zod_1.z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).optional(),
        area: zod_1.z.number().positive().optional(),
        location: zod_1.z.string().optional(),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        deliveryDate: zod_1.z.string().datetime().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        featured: zod_1.z.boolean().optional(),
        featuredImage: zod_1.z.string().url().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
        serviceId: zod_1.z.string().uuid().optional(),
        imageUrls: zod_1.z.array(zod_1.z.string().url()).optional(),
    }),
});
class ProjectController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const status = req.query.status;
                const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
                const serviceId = req.query.serviceId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 100;
                const includeInactive = req.query.includeInactive === 'true' || req.query.includeInactive === '1';
                const result = await projectService_1.default.getAll({
                    status,
                    featured,
                    serviceId,
                    page,
                    limit,
                    includeInactive,
                });
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.getBySlug = async (req, res, next) => {
            try {
                const { slug } = req.params;
                const project = await projectService_1.default.getBySlug(slug);
                res.json(project);
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const project = await projectService_1.default.getById(id);
                res.json(project);
            }
            catch (error) {
                next(error);
            }
        };
        this.create = [
            (0, validator_1.validate)(createProjectSchema),
            async (req, res, next) => {
                try {
                    if (!req.user) {
                        res.status(401).json({ error: 'Unauthorized' });
                        return;
                    }
                    const data = {
                        ...req.body,
                        deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : undefined,
                        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
                    };
                    const project = await projectService_1.default.create(data, req.user.id);
                    res.status(201).json(project);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.update = [
            (0, validator_1.validate)(updateProjectSchema),
            async (req, res, next) => {
                try {
                    if (!req.user) {
                        res.status(401).json({ error: 'Unauthorized' });
                        return;
                    }
                    const data = {
                        id: req.params.id,
                        ...req.body,
                        deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : undefined,
                        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
                    };
                    const project = await projectService_1.default.update(data, req.user.id);
                    res.json(project);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.toggleActive = async (req, res, next) => {
            try {
                const { id } = req.params;
                const project = await projectService_1.default.toggleActive(id);
                res.json(project);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ProjectController = ProjectController;
exports.default = new ProjectController();
//# sourceMappingURL=projectController.js.map