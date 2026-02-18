"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const adminService_1 = __importDefault(require("../services/adminService"));
const zod_1 = require("zod");
const validator_1 = require("../middleware/validator");
const upload_1 = require("../middleware/upload");
const updateUserRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
    }),
});
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
    }),
});
const updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.union([zod_1.z.string().min(8), zod_1.z.literal('')]).optional(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
    }),
});
const blogCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        slug: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
    }),
});
const updateBlogCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        slug: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
    }),
});
const updateSettingSchema = zod_1.z.object({
    params: zod_1.z.object({
        key: zod_1.z.string(),
    }),
    body: zod_1.z.object({
        value: zod_1.z.string(),
    }),
});
class AdminController {
    constructor() {
        this.getDashboard = async (_req, res, next) => {
            try {
                const stats = await adminService_1.default.getDashboardStats();
                res.json(stats);
            }
            catch (error) {
                next(error);
            }
        };
        this.getUsers = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const result = await adminService_1.default.getUsers({ page, limit });
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateUserRole = [
            (0, validator_1.validate)(updateUserRoleSchema),
            async (req, res, next) => {
                try {
                    const user = await adminService_1.default.updateUserRole(req.params.id, req.body.role);
                    res.json(user);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.toggleUserActive = async (req, res, next) => {
            try {
                const user = await adminService_1.default.toggleUserActive(req.params.id);
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        };
        this.createUser = [
            (0, validator_1.validate)(createUserSchema),
            async (req, res, next) => {
                try {
                    const user = await adminService_1.default.createUser(req.body);
                    res.status(201).json(user);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.updateUser = [
            (0, validator_1.validate)(updateUserSchema),
            async (req, res, next) => {
                try {
                    const body = { ...req.body };
                    if (body.password === '')
                        delete body.password;
                    const user = await adminService_1.default.updateUser(req.params.id, body);
                    res.json(user);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.getBlogCategories = async (req, res, next) => {
            try {
                const includeInactive = req.query.includeInactive === '1' || req.query.includeInactive === 'true';
                const categories = await adminService_1.default.getBlogCategories(includeInactive);
                res.json(categories);
            }
            catch (error) {
                next(error);
            }
        };
        this.createBlogCategory = [
            (0, validator_1.validate)(blogCategorySchema),
            async (req, res, next) => {
                try {
                    const category = await adminService_1.default.createBlogCategory(req.body);
                    res.status(201).json(category);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.updateBlogCategory = [
            (0, validator_1.validate)(updateBlogCategorySchema),
            async (req, res, next) => {
                try {
                    const category = await adminService_1.default.updateBlogCategory(req.params.id, req.body);
                    res.json(category);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.toggleBlogCategoryActive = async (req, res, next) => {
            try {
                const result = await adminService_1.default.toggleBlogCategoryActive(req.params.id);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSiteSettings = async (req, res, next) => {
            try {
                const group = req.query.group;
                const settings = await adminService_1.default.getSiteSettings(group);
                res.json(settings);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSiteSetting = [
            (0, validator_1.validate)(updateSettingSchema),
            async (req, res, next) => {
                try {
                    const setting = await adminService_1.default.updateSiteSetting(req.params.key, req.body.value);
                    res.json(setting);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.uploadMedia = [
            upload_1.upload.single('file'),
            async (req, res, next) => {
                try {
                    if (!req.file) {
                        res.status(400).json({ error: 'No file uploaded' });
                        return;
                    }
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    const mediaFile = await adminService_1.default.uploadMedia(req.file, baseUrl);
                    res.status(201).json(mediaFile);
                }
                catch (error) {
                    next(error);
                }
            },
        ];
        this.getMedia = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const mimeType = req.query.mimeType;
                const includeInactive = req.query.includeInactive === '1' || req.query.includeInactive === 'true';
                const result = await adminService_1.default.getMedia({ page, limit, mimeType, includeInactive });
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleMediaActive = async (req, res, next) => {
            try {
                const result = await adminService_1.default.toggleMediaActive(req.params.id);
                res.json(result);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AdminController = AdminController;
exports.default = new AdminController();
//# sourceMappingURL=adminController.js.map