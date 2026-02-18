import { UserRole } from '@prisma/client';
export declare class AdminService {
    getDashboardStats(): Promise<{
        projects: {
            total: number;
            active: number;
            completed: number;
        };
        blogs: {
            total: number;
            published: number;
        };
        messages: {
            total: number;
            unread: number;
        };
        users: {
            total: number;
        };
    }>;
    getUsers(filters: {
        page?: number;
        limit?: number;
    }): Promise<{
        users: {
            email: string;
            id: string;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateUserRole(userId: string, role: UserRole): Promise<{
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    toggleUserActive(userId: string): Promise<{
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    createUser(data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        role: UserRole;
    }): Promise<{
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
    }>;
    updateUser(userId: string, data: {
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        role?: UserRole;
    }): Promise<{
        email: string;
        id: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    getBlogCategories(includeInactive?: boolean): Promise<{
        name: string;
        slug: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createBlogCategory(data: {
        name: string;
        slug: string;
        description?: string;
    }): Promise<{
        name: string;
        slug: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateBlogCategory(id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
    }): Promise<{
        name: string;
        slug: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleBlogCategoryActive(id: string): Promise<{
        name: string;
        slug: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getSiteSettings(group?: string): Promise<{
        value: string;
        type: string;
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        group: string | null;
    }[]>;
    updateSiteSetting(key: string, value: string): Promise<{
        value: string;
        type: string;
        id: string;
        key: string;
        createdAt: Date;
        updatedAt: Date;
        group: string | null;
    }>;
    uploadMedia(file: Express.Multer.File, baseUrl: string): Promise<{
        path: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        alt: string | null;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
    }>;
    getMedia(filters: {
        page?: number;
        limit?: number;
        mimeType?: string;
        includeInactive?: boolean;
    }): Promise<{
        files: {
            path: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            url: string;
            alt: string | null;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    toggleMediaActive(id: string): Promise<{
        path: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        alt: string | null;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
    }>;
}
declare const _default: AdminService;
export default _default;
//# sourceMappingURL=adminService.d.ts.map