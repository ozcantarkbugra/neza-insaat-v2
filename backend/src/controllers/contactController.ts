import { Request, Response, NextFunction } from 'express'
import contactService from '../services/contactService'
import { z } from 'zod'
import { validate } from '../middleware/validator'

const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(1),
  }),
})

export class ContactController {
  create = [
    validate(createContactSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const message = await contactService.create(req.body)
        res.status(201).json(message)
      } catch (error) {
        next(error)
      }
    },
  ]

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const read = req.query.read === 'true' ? true : req.query.read === 'false' ? false : undefined
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const result = await contactService.getAll({ read, page, limit })
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const message = await contactService.getById(id)
      res.json(message)
    } catch (error) {
      next(error)
    }
  }

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const message = await contactService.markAsRead(id)
      res.json(message)
    } catch (error) {
      next(error)
    }
  }

  markAsReplied = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const message = await contactService.markAsReplied(id)
      res.json(message)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const result = await contactService.delete(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

export default new ContactController()
