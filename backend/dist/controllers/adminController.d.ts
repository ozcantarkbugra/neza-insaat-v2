import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    getDashboard: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateUserRole: ((req: Request, _res: Response, next: NextFunction) => void)[];
    toggleUserActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createUser: ((req: Request, _res: Response, next: NextFunction) => void)[];
    updateUser: ((req: Request, _res: Response, next: NextFunction) => void)[];
    getBlogCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createBlogCategory: ((req: Request, _res: Response, next: NextFunction) => void)[];
    updateBlogCategory: ((req: Request, _res: Response, next: NextFunction) => void)[];
    toggleBlogCategoryActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSiteSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSiteSetting: ((req: Request, _res: Response, next: NextFunction) => void)[];
    uploadMedia: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
    getMedia: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    toggleMediaActive: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: AdminController;
export default _default;
//# sourceMappingURL=adminController.d.ts.map