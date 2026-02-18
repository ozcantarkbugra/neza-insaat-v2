import { Request, Response, NextFunction } from 'express'
import adminService from '../services/adminService'
import { z } from 'zod'
import { validate } from '../middleware/validator'
import { upload } from '../middleware/upload'

const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  }),
})

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  }),
})

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    email: z.string().email().optional(),
    password: z.union([z.string().min(8), z.literal('')]).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
  }),
})

const blogCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
  }),
})

const updateBlogCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
})

const updateSettingSchema = z.object({
  params: z.object({
    key: z.string(),
  }),
  body: z.object({
    value: z.string(),
  }),
})

export class AdminController {
  getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await adminService.getDashboardStats()
      res.json(stats)
    } catch (error) {
      next(error)
    }
  }

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const result = await adminService.getUsers({ page, limit })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  updateUserRole = [
    validate(updateUserRoleSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const user = await adminService.updateUserRole(req.params.id, req.body.role)
        res.json(user)
      } catch (error) {
        next(error)
      }
    },
  ]

  toggleUserActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await adminService.toggleUserActive(req.params.id)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  createUser = [
    validate(createUserSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const user = await adminService.createUser(req.body)
        res.status(201).json(user)
      } catch (error) {
        next(error)
      }
    },
  ]

  updateUser = [
    validate(updateUserSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const body = { ...req.body }
        if (body.password === '') delete body.password
        const user = await adminService.updateUser(req.params.id, body)
        res.json(user)
      } catch (error) {
        next(error)
      }
    },
  ]

  getBlogCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await adminService.getBlogCategories()
      res.json(categories)
    } catch (error) {
      next(error)
    }
  }

  createBlogCategory = [
    validate(blogCategorySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const category = await adminService.createBlogCategory(req.body)
        res.status(201).json(category)
      } catch (error) {
        next(error)
      }
    },
  ]

  updateBlogCategory = [
    validate(updateBlogCategorySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const category = await adminService.updateBlogCategory(req.params.id, req.body)
        res.json(category)
      } catch (error) {
        next(error)
      }
    },
  ]

  toggleBlogCategoryActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await adminService.toggleBlogCategoryActive(req.params.id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  getSiteSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const group = req.query.group as string
      const settings = await adminService.getSiteSettings(group)
      res.json(settings)
    } catch (error) {
      next(error)
    }
  }

  updateSiteSetting = [
    validate(updateSettingSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const setting = await adminService.updateSiteSetting(req.params.key, req.body.value)
        res.json(setting)
      } catch (error) {
        next(error)
      }
    },
  ]

  uploadMedia = [
    upload.single('file'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' })
          return
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`
        const mediaFile = await adminService.uploadMedia(req.file, baseUrl)
        res.status(201).json(mediaFile)
      } catch (error) {
        next(error)
      }
    },
  ]

  getMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const mimeType = req.query.mimeType as string
      const includeInactive = req.query.includeInactive === '1' || req.query.includeInactive === 'true'
      const result = await adminService.getMedia({ page, limit, mimeType, includeInactive })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  toggleMediaActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await adminService.toggleMediaActive(req.params.id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export default new AdminController()
