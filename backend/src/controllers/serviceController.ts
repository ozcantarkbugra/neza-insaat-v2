import { Request, Response, NextFunction } from 'express'
import serviceService from '../services/serviceService'
import { z } from 'zod'
import { validate } from '../middleware/validator'

const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    titleEn: z.string().optional(),
    slug: z.string().min(1),
    description: z.string().min(1),
    descriptionEn: z.string().optional(),
    shortDescription: z.string().optional(),
    shortDescriptionEn: z.string().optional(),
    icon: z.string().optional(),
    image: z.string().url().optional(),
    featured: z.boolean().optional(),
    order: z.number().int().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
})

const updateServiceSchema = z.object({
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
    icon: z.string().optional(),
    image: z.string().url().optional(),
    featured: z.boolean().optional(),
    order: z.number().int().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
})

export class ServiceController {
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const featured = req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined
      const services = await serviceService.getAll({ featured })
      res.json(services)
    } catch (error) {
      next(error)
    }
  }

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params
      const service = await serviceService.getBySlug(slug)
      res.json(service)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const service = await serviceService.getById(id)
      res.json(service)
    } catch (error) {
      next(error)
    }
  }

  create = [
    validate(createServiceSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const service = await serviceService.create(req.body)
        res.status(201).json(service)
      } catch (error) {
        next(error)
      }
    },
  ]

  update = [
    validate(updateServiceSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const service = await serviceService.update({
          id: req.params.id,
          ...req.body,
        })
        res.json(service)
      } catch (error) {
        next(error)
      }
    },
  ]

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const result = await serviceService.delete(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export default new ServiceController()
