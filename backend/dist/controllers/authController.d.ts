import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    register: ((req: Request, _res: Response, next: NextFunction) => void)[];
    login: ((req: Request, _res: Response, next: NextFunction) => void)[];
    refresh: ((req: Request, _res: Response, next: NextFunction) => void)[];
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMe: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=authController.d.ts.map