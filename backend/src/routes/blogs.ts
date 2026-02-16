import { Router } from 'express'
import blogController from '../controllers/blogController'
import { authenticate, authorize } from '../middleware/auth'
import { cacheControl } from '../middleware/cacheControl'

const router = Router()

// Public routes - 1 dk cache
router.get('/', cacheControl(60), blogController.getAll)
router.get('/slug/:slug', cacheControl(60), blogController.getBySlug)
router.get('/:id', cacheControl(60), blogController.getById)

// Protected routes (admin only)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), ...blogController.create)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), ...blogController.update)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), blogController.delete)

export default router
