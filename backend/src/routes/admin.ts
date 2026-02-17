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
router.delete('/blog-categories/:id', adminController.deleteBlogCategory)

router.get('/settings', adminController.getSiteSettings)
router.put('/settings/:key', ...adminController.updateSiteSetting)

router.post('/media/upload', adminController.uploadMedia)
router.get('/media', adminController.getMedia)
router.delete('/media/:id', adminController.deleteMedia)

export default router
