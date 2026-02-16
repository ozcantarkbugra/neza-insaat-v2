import { Router } from 'express'
import contactController from '../controllers/contactController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public route
router.post('/', ...contactController.create)

// Protected routes (admin only)
router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.getAll)
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.getById)
router.patch('/:id/read', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.markAsRead)
router.patch('/:id/replied', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.markAsReplied)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.delete)

export default router
