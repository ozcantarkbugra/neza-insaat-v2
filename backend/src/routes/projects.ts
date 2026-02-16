import { Router } from 'express'
import projectController from '../controllers/projectController'
import { authenticate, authorize } from '../middleware/auth'
import { cacheControl } from '../middleware/cacheControl'

const router = Router()

// Public routes - 1 dk cache
router.get('/', cacheControl(60), projectController.getAll)
router.get('/slug/:slug', cacheControl(60), projectController.getBySlug)
router.get('/:id', cacheControl(60), projectController.getById)

// Protected routes (admin only)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), ...projectController.create)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), ...projectController.update)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), projectController.delete)

export default router
