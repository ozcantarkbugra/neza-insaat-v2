import { Request, Response, NextFunction } from 'express'

/**
 * Cache-Control middleware for public GET endpoints.
 * max-age in seconds (60 = 1 minute)
 */
export function cacheControl(maxAgeSeconds: number = 60) {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}`)
    next()
  }
}
