"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All admin routes require authentication and admin role
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'));
// Dashboard
router.get('/dashboard', adminController_1.default.getDashboard);
// Users
router.get('/users', adminController_1.default.getUsers);
router.post('/users', ...adminController_1.default.createUser);
router.put('/users/:id', ...adminController_1.default.updateUser);
router.patch('/users/:id/role', ...adminController_1.default.updateUserRole);
router.patch('/users/:id/toggle-active', adminController_1.default.toggleUserActive);
// Blog Categories
router.get('/blog-categories', adminController_1.default.getBlogCategories);
router.post('/blog-categories', ...adminController_1.default.createBlogCategory);
router.put('/blog-categories/:id', ...adminController_1.default.updateBlogCategory);
router.delete('/blog-categories/:id', adminController_1.default.deleteBlogCategory);
// Site Settings
router.get('/settings', adminController_1.default.getSiteSettings);
router.put('/settings/:key', ...adminController_1.default.updateSiteSetting);
// Media
router.post('/media/upload', adminController_1.default.uploadMedia);
router.get('/media', adminController_1.default.getMedia);
router.delete('/media/:id', adminController_1.default.deleteMedia);
exports.default = router;
//# sourceMappingURL=admin.js.map