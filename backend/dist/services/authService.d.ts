import { UserRole } from '@prisma/client';
export interface RegisterData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: UserRole;
    };
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    register(data: RegisterData): Promise<AuthResponse>;
    login(data: LoginData): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(userId: string): Promise<void>;
    getMe(userId: string): Promise<{
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=authService.d.ts.map