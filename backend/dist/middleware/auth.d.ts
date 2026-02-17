import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/jwt';
export interface AuthRequest extends Request {
    user?: TokenPayload & {
        id: string;
    };
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function authorize(...roles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map