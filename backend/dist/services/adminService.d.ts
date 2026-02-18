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
            id: string;
            email: string;
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
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    toggleUserActive(userId: string): Promise<{
        id: string;
        email: string;
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
        id: string;
        email: string;
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
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    getBlogCategories(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        isDeleted: boolean;
    }[]>;
    createBlogCategory(data: {
        name: string;
        slug: string;
        description?: string;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        isDeleted: boolean;
    }>;
    updateBlogCategory(id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        isDeleted: boolean;
    }>;
    deleteBlogCategory(id: string): Promise<{
        message: string;
    }>;
    getSiteSettings(group?: string): Promise<{
        value: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        group: string | null;
    }[]>;
    updateSiteSetting(key: string, value: string): Promise<{
        value: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        group: string | null;
    }>;
    uploadMedia(file: Express.Multer.File, baseUrl: string): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isDeleted: boolean;
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
    }): Promise<{
        files: {
            path: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isDeleted: boolean;
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
    deleteMedia(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: AdminService;
export default _default;
//# sourceMappingURL=adminService.d.ts.map