import { Router, Request, Response, NextFunction } from 'express'
import adminService from '../services/adminService'
import { cacheControl } from '../middleware/cacheControl'

const router = Router()

// Public: site ayarlarını döner (footer, iletişim vb. için) - 5 dk cache
router.get('/', cacheControl(300), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await adminService.getSiteSettings()
    const map = (settings as { key: string; value: string }[]).reduce(
      (acc, s) => {
        acc[s.key] = s.value
        return acc
      },
      {} as Record<string, string>
    )
    res.json(map)
  } catch (error) {
    next(error)
  }
})

export default router
