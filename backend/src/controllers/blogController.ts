import { Request, Response, NextFunction } from 'express'
import blogService from '../services/blogService'
import { z } from 'zod'
import { validate } from '../middleware/validator'

const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    titleEn: z.string().optional(),
    slug: z.string().min(1),
    content: z.string().min(1),
    contentEn: z.string().optional(),
    excerpt: z.string().optional(),
    excerptEn: z.string().optional(),
    featuredImage: z.string().url().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    featured: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    categoryId: z.string().uuid().optional(),
  }),
})

const updateBlogSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    titleEn: z.string().optional(),
    slug: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    contentEn: z.string().optional(),
    excerpt: z.string().optional(),
    excerptEn: z.string().optional(),
    featuredImage: z.string().url().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    featured: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    categoryId: z.string().uuid().optional(),
  }),
})

export class BlogController {
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as any
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined
      const categoryId = req.query.categoryId as string
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const includeInactive = req.query.includeInactive === 'true' || req.query.includeInactive === '1'

      const result = await blogService.getAll({
        status,
        featured,
        categoryId,
        page,
        limit,
        includeInactive,
      })

      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params
      const blog = await blogService.getBySlug(slug)
      res.json(blog)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const blog = await blogService.getById(id)
      res.json(blog)
    } catch (error) {
      next(error)
    }
  }

  create = [
    validate(createBlogSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Unauthorized' })
          return
        }

        const blog = await blogService.create(req.body, req.user.id)
        res.status(201).json(blog)
      } catch (error) {
        next(error)
      }
    },
  ]

  update = [
    validate(updateBlogSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Unauthorized' })
          return
        }

        const blog = await blogService.update(
          {
            id: req.params.id,
            ...req.body,
          },
          req.user.id
        )
        res.json(blog)
      } catch (error) {
        next(error)
      }
    },
  ]

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const result = await blogService.delete(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  toggleActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const blog = await blogService.toggleActive(id)
      res.json(blog)
    } catch (error) {
      next(error)
    }
  }
}

export default new BlogController()
