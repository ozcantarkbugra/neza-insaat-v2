import { Router } from 'express'
import serviceController from '../controllers/serviceController'
import { authenticate, authorize } from '../middleware/auth'
import { cacheControl } from '../middleware/cacheControl'

const router = Router()

router.get('/', cacheControl(60), serviceController.getAll)
router.get('/slug/:slug', cacheControl(60), serviceController.getBySlug)
router.get('/:id', cacheControl(60), serviceController.getById)

router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), ...serviceController.create)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), ...serviceController.update)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), serviceController.delete)

export default router
