export interface CreateServiceData {
    title: string;
    titleEn?: string;
    slug: string;
    description: string;
    descriptionEn?: string;
    shortDescription?: string;
    shortDescriptionEn?: string;
    icon?: string;
    image?: string;
    featured?: boolean;
    order?: number;
    metaTitle?: string;
    metaDescription?: string;
}
export interface UpdateServiceData extends Partial<CreateServiceData> {
    id: string;
}
export declare class ServiceService {
    getAll(filters: {
        featured?: boolean;
    }): Promise<({
        _count: {
            projects: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        titleEn: string | null;
        slug: string;
        description: string;
        descriptionEn: string | null;
        shortDescription: string | null;
        shortDescriptionEn: string | null;
        featured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        order: number;
        icon: string | null;
        image: string | null;
    })[]>;
    getBySlug(slug: string): Promise<{
        projects: ({
            images: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                url: string;
                alt: string | null;
                projectId: string;
            }[];
        } & {
            status: import(".prisma/client").$Enums.ProjectStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            titleEn: string | null;
            slug: string;
            description: string;
            descriptionEn: string | null;
            shortDescription: string | null;
            shortDescriptionEn: string | null;
            area: number | null;
            location: string | null;
            latitude: number | null;
            longitude: number | null;
            deliveryDate: Date | null;
            startDate: Date | null;
            featured: boolean;
            featuredImage: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            serviceId: string | null;
            createdById: string | null;
            updatedById: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        titleEn: string | null;
        slug: string;
        description: string;
        descriptionEn: string | null;
        shortDescription: string | null;
        shortDescriptionEn: string | null;
        featured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        order: number;
        icon: string | null;
        image: string | null;
    }>;
    getById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        titleEn: string | null;
        slug: string;
        description: string;
        descriptionEn: string | null;
        shortDescription: string | null;
        shortDescriptionEn: string | null;
        featured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        order: number;
        icon: string | null;
        image: string | null;
    }>;
    create(data: CreateServiceData): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        titleEn: string | null;
        slug: string;
        description: string;
        descriptionEn: string | null;
        shortDescription: string | null;
        shortDescriptionEn: string | null;
        featured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        order: number;
        icon: string | null;
        image: string | null;
    }>;
    update(data: UpdateServiceData): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        titleEn: string | null;
        slug: string;
        description: string;
        descriptionEn: string | null;
        shortDescription: string | null;
        shortDescriptionEn: string | null;
        featured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        order: number;
        icon: string | null;
        image: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: ServiceService;
export default _default;
//# sourceMappingURL=serviceService.d.ts.map