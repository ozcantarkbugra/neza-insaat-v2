import { Router } from 'express'
import blogController from '../controllers/blogController'
import { authenticate, authorize } from '../middleware/auth'
import { cacheControl } from '../middleware/cacheControl'

const router = Router()

router.get('/', cacheControl(60), blogController.getAll)
router.get('/slug/:slug', cacheControl(60), blogController.getBySlug)
router.get('/:id', cacheControl(60), blogController.getById)

router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), ...blogController.create)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), ...blogController.update)
router.patch('/:id/toggle-active', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), blogController.toggleActive)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), blogController.delete)

export default router
