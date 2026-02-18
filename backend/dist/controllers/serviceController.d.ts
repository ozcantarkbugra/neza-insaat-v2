import { Request, Response, NextFunction } from 'express';
export declare class ServiceController {
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: ((req: Request, _res: Response, next: NextFunction) => void)[];
    update: ((req: Request, _res: Response, next: NextFunction) => void)[];
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    toggleActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: ServiceController;
export default _default;
//# sourceMappingURL=serviceController.d.ts.map