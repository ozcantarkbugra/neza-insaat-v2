import { Request, Response, NextFunction } from 'express';
/**
 * Cache-Control middleware for public GET endpoints.
 * max-age in seconds (60 = 1 minute)
 */
export declare function cacheControl(maxAgeSeconds?: number): (_req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=cacheControl.d.ts.map