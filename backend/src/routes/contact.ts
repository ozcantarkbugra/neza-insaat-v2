import { Router } from 'express'
import contactController from '../controllers/contactController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.post('/', ...contactController.create)

router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.getAll)
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.getById)
router.patch('/:id/read', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.markAsRead)
router.patch('/:id/replied', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.markAsReplied)
router.patch('/:id/toggle-active', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.toggleActive)

export default router
