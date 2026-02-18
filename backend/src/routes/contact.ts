import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import contactController from '../controllers/contactController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Çok fazla mesaj gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.',
    })
  },
})

router.post('/', contactFormLimiter, ...contactController.create)

router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.getAll)
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.getById)
router.patch('/:id/read', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.markAsRead)
router.patch('/:id/replied', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.markAsReplied)
router.patch('/:id/toggle-active', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.toggleActive)

export default router
