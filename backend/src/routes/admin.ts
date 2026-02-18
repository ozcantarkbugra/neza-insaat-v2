import { Router } from 'express'
import adminController from '../controllers/adminController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.use(authenticate)
router.use(authorize('SUPER_ADMIN', 'ADMIN'))

router.get('/dashboard', adminController.getDashboard)

router.get('/users', adminController.getUsers)
router.post('/users', ...adminController.createUser)
router.put('/users/:id', ...adminController.updateUser)
router.patch('/users/:id/role', ...adminController.updateUserRole)
router.patch('/users/:id/toggle-active', adminController.toggleUserActive)

router.get('/blog-categories', adminController.getBlogCategories)
router.post('/blog-categories', ...adminController.createBlogCategory)
router.put('/blog-categories/:id', ...adminController.updateBlogCategory)
router.patch('/blog-categories/:id/toggle-active', adminController.toggleBlogCategoryActive)

router.get('/settings', adminController.getSiteSettings)
router.put('/settings/:key', ...adminController.updateSiteSetting)

router.post('/media/upload', adminController.uploadMedia)
router.get('/media', adminController.getMedia)
router.patch('/media/:id/toggle-active', adminController.toggleMediaActive)

export default router
