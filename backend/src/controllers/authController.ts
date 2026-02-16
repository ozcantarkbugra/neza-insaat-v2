import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'
import { z } from 'zod'
import { validate } from '../middleware/validator'

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
})

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
})

export class AuthController {
  register = [
    validate(registerSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await authService.register(req.body)
        res.status(201).json(result)
      } catch (error) {
        next(error)
      }
    },
  ]

  login = [
    validate(loginSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await authService.login(req.body)
        res.json(result)
      } catch (error) {
        next(error)
      }
    },
  ]

  refresh = [
    validate(refreshSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { refreshToken } = req.body
        const result = await authService.refreshToken(refreshToken)
        res.json(result)
      } catch (error) {
        next(error)
      }
    },
  ]

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user) {
        await authService.logout(req.user.id)
      }
      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }
      const user = await authService.getMe(req.user.id)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
