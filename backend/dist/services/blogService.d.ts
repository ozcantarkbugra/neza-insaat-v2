import { BlogStatus } from '@prisma/client';
export interface CreateBlogData {
    title: string;
    titleEn?: string;
    slug: string;
    content: string;
    contentEn?: string;
    excerpt?: string;
    excerptEn?: string;
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
        includeInactive?: boolean;
    }): Promise<{
        blogs: ({
            createdBy: {
                id: string;
                firstName: string | null;
                lastName: string | null;
            } | null;
            category: {
                name: string;
                slug: string;
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.BlogStatus;
            featured: boolean;
            title: string;
            slug: string;
            id: string;
            categoryId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            titleEn: string | null;
            featuredImage: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            createdById: string | null;
            updatedById: string | null;
            content: string;
            contentEn: string | null;
            excerpt: string | null;
            excerptEn: string | null;
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
            email: string;
            id: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
        category: {
            name: string;
            slug: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        featured: boolean;
        title: string;
        slug: string;
        id: string;
        categoryId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        titleEn: string | null;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        contentEn: string | null;
        excerpt: string | null;
        excerptEn: string | null;
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
            name: string;
            slug: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        featured: boolean;
        title: string;
        slug: string;
        id: string;
        categoryId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        titleEn: string | null;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        contentEn: string | null;
        excerpt: string | null;
        excerptEn: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
    create(data: CreateBlogData, userId: string): Promise<{
        category: {
            name: string;
            slug: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        featured: boolean;
        title: string;
        slug: string;
        id: string;
        categoryId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        titleEn: string | null;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        contentEn: string | null;
        excerpt: string | null;
        excerptEn: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
    update(data: UpdateBlogData, userId: string): Promise<{
        category: {
            name: string;
            slug: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        featured: boolean;
        title: string;
        slug: string;
        id: string;
        categoryId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        titleEn: string | null;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        contentEn: string | null;
        excerpt: string | null;
        excerptEn: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
    toggleActive(id: string): Promise<{
        category: {
            name: string;
            slug: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.BlogStatus;
        featured: boolean;
        title: string;
        slug: string;
        id: string;
        categoryId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        titleEn: string | null;
        featuredImage: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        createdById: string | null;
        updatedById: string | null;
        content: string;
        contentEn: string | null;
        excerpt: string | null;
        excerptEn: string | null;
        views: number;
        publishedAt: Date | null;
    }>;
}
declare const _default: BlogService;
export default _default;
//# sourceMappingURL=blogService.d.ts.map