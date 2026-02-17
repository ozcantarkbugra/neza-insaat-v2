import { BlogStatus } from '@prisma/client';
export interface CreateBlogData {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    status: BlogStatus;
    featured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    categoryId?: string;
}
export interface UpdateBlogData extends Partial<CreateBlogData> {
    id: string;
}
export declare class BlogService {
    getAll(filters: {
        status?: BlogStatus;
        featured?: boolean;
        categoryId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        blogs: ({
            createdBy: {
                id: string;
                firstName: string | null;
                lastName: string | null;
            } | null;
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.BlogStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            featured: boolean;
            featuredImage: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createdById: string | null;
            updatedById: string | null;
            content: string;
            excerpt: string | null;
            categoryId: string | null;
            views: number;
            publishedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getBySlug(slug: string): Promise<{
        createdBy: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        featured: boolean;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        excerpt: string | null;
        categoryId: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
    getById(id: string): Promise<{
        createdBy: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        featured: boolean;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        excerpt: string | null;
        categoryId: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
    create(data: CreateBlogData, userId: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        featured: boolean;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        excerpt: string | null;
        categoryId: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
    update(data: UpdateBlogData, userId: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        featured: boolean;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        excerpt: string | null;
        categoryId: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: BlogService;
export default _default;
//# sourceMappingURL=blogService.d.ts.map