import { Request, Response, NextFunction } from 'express';
export declare class ContactController {
    create: ((req: Request, _res: Response, next: NextFunction) => void)[];
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAsReplied: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    toggleActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: ContactController;
export default _default;
//# sourceMappingURL=contactController.d.ts.map