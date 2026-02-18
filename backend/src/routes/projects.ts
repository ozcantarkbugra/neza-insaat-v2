import { Router } from 'express'
import projectController from '../controllers/projectController'
import { authenticate, authorize } from '../middleware/auth'
import { cacheControl } from '../middleware/cacheControl'

const router = Router()

router.get('/', cacheControl(60), projectController.getAll)
router.get('/slug/:slug', cacheControl(60), projectController.getBySlug)
router.get('/:id', cacheControl(60), projectController.getById)

router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), ...projectController.create)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), ...projectController.update)
router.patch('/:id/toggle-active', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), projectController.toggleActive)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), projectController.delete)

export default router
