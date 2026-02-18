import { Request, Response, NextFunction } from 'express';
export declare class ProjectController {
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: ((req: Request, _res: Response, next: NextFunction) => void)[];
    update: ((req: Request, _res: Response, next: NextFunction) => void)[];
    toggleActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: ProjectController;
export default _default;
//# sourceMappingURL=projectController.d.ts.map