import { Request, Response, NextFunction } from 'express'
import projectService from '../services/projectService'
import { z } from 'zod'
import { validate } from '../middleware/validator'

const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    titleEn: z.string().optional(),
    slug: z.string().min(1),
    description: z.string().min(1),
    descriptionEn: z.string().optional(),
    shortDescription: z.string().optional(),
    shortDescriptionEn: z.string().optional(),
    status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']),
    area: z.number().positive().optional(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    deliveryDate: z.string().datetime().optional(),
    startDate: z.string().datetime().optional(),
    featured: z.boolean().optional(),
    featuredImage: z.string().url().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    serviceId: z.string().uuid().optional(),
    imageUrls: z.array(z.string().url()).optional(),
  }),
})

const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    titleEn: z.string().optional(),
    slug: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    descriptionEn: z.string().optional(),
    shortDescription: z.string().optional(),
    shortDescriptionEn: z.string().optional(),
    status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).optional(),
    area: z.number().positive().optional(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    deliveryDate: z.string().datetime().optional(),
    startDate: z.string().datetime().optional(),
    featured: z.boolean().optional(),
    featuredImage: z.string().url().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    serviceId: z.string().uuid().optional(),
    imageUrls: z.array(z.string().url()).optional(),
  }),
})

export class ProjectController {
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as any
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined
      const serviceId = req.query.serviceId as string
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 100
      const includeInactive = req.query.includeInactive === 'true' || req.query.includeInactive === '1'

      const result = await projectService.getAll({
        status,
        featured,
        serviceId,
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
      const project = await projectService.getBySlug(slug)
      res.json(project)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const project = await projectService.getById(id)
      res.json(project)
    } catch (error) {
      next(error)
    }
  }

  create = [
    validate(createProjectSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Unauthorized' })
          return
        }

        const data = {
          ...req.body,
          deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : undefined,
          startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        }

        const project = await projectService.create(data, req.user.id)
        res.status(201).json(project)
      } catch (error) {
        next(error)
      }
    },
  ]

  update = [
    validate(updateProjectSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ error: 'Unauthorized' })
          return
        }

        const data = {
          id: req.params.id,
          ...req.body,
          deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : undefined,
          startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        }

        const project = await projectService.update(data, req.user.id)
        res.json(project)
      } catch (error) {
        next(error)
      }
    },
  ]

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const result = await projectService.delete(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  toggleActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const project = await projectService.toggleActive(id)
      res.json(project)
    } catch (error) {
      next(error)
    }
  }
}

export default new ProjectController()
