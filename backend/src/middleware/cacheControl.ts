import { Request, Response, NextFunction } from 'express'

export function cacheControl(maxAgeSeconds: number = 60) {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}`)
    next()
  }
}
