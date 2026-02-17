"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blogService_1 = __importDefault(require("../services/blogService"));
const zod_1 = require("zod");
const validator_1 = require("../middleware/validator");
const createBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        slug: zod_1.z.string().min(1),
        content: zod_1.z.string().min(1),
        excerpt: zod_1.z.string().optional(),
        featuredImage: zod_1.z.string().url().optional(),
        status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
        featured: zod_1.z.boolean().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
        categoryId: zod_1.z.string().uuid().optional(),
    }),
});
const updateBlogSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        slug: zod_1.z.string().min(1).optional(),
        content: zod_1.z.string().min(1).optional(),
        excerpt: zod_1.z.string().optional(),
        featuredImage: zod_1.z.string().url().optional(),
        status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
        featured: zod_1.z.boolean().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
        categoryId: zod_1.z.string().uuid().optional(),
    }),
});
class BlogController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const status = req.query.status;
                const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined;
                const categoryId = req.query.categoryId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = await blogService_1.default.getAll({
                    status,
                    featured,
                    categoryId,
                    page,
                    limit,
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
                const blog = await blogService_1.default.getBySlug(slug);
                res.json(blog);
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const blog = await blogService_1.default.getById(id);
                res.json(blog);
            }
            catch (error) {
                next(error);
            }
        };
        this.create = [
            (0, validator_1.validate)(createBlogSchema),
            async (req, res, next) => {
                try {
                    if (!req.user) {
                        res.status(401).json({ error: 'Unauthorized' });
                        return;
                    }
                    const blog = await blogService_1.default.create(req.body, req.user.id);
                    res.status(201).json(blog);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.update = [
            (0, validator_1.validate)(updateBlogSchema),
            async (req, res, next) => {
                try {
                    if (!req.user) {
                        res.status(401).json({ error: 'Unauthorized' });
                        return;
                    }
                    const blog = await blogService_1.default.update({
                        id: req.params.id,
                        ...req.body,
                    }, req.user.id);
                    res.json(blog);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.delete = async (req, res, next) => {
            try {
                const { id } = req.params;
                const result = await blogService_1.default.delete(id);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.BlogController = BlogController;
exports.default = new BlogController();
//# sourceMappingURL=blogController.js.map