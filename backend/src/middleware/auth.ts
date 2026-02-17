import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, TokenPayload } from '../utils/jwt'
import prisma from '../config/database'

export interface AuthRequest extends Request {
  user?: TokenPayload & {
    id: string
  }
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' })
      return
    }

    const token = authHeader.substring(7)

    try {
      const payload = verifyAccessToken(token)

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true, isActive: true },
      })

      if (!user || !user.isActive) {
        res.status(401).json({ error: 'Unauthorized: User not found or inactive' })
        return
      }

      req.user = {
        ...payload,
        id: user.id,
      }

      next()
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' })
      return
    }
  } catch (error) {
    next(error)
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
      return
    }

    next()
  }
}
