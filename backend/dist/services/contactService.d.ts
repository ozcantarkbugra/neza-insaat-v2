export interface CreateContactMessageData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}
export declare class ContactService {
    create(data: CreateContactMessageData): Promise<{
        message: string;
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subject: string | null;
        phone: string | null;
        read: boolean;
        replied: boolean;
    }>;
    getAll(filters: {
        read?: boolean;
        page?: number;
        limit?: number;
        includeInactive?: boolean;
    }): Promise<{
        messages: {
            message: string;
            email: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            subject: string | null;
            phone: string | null;
            read: boolean;
            replied: boolean;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getById(id: string): Promise<{
        message: string;
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subject: string | null;
        phone: string | null;
        read: boolean;
        replied: boolean;
    }>;
    markAsRead(id: string): Promise<{
        message: string;
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subject: string | null;
        phone: string | null;
        read: boolean;
        replied: boolean;
    }>;
    markAsReplied(id: string): Promise<{
        message: string;
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subject: string | null;
        phone: string | null;
        read: boolean;
        replied: boolean;
    }>;
    toggleActive(id: string): Promise<{
        message: string;
        email: string;
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        subject: string | null;
        phone: string | null;
        read: boolean;
        replied: boolean;
    }>;
}
declare const _default: ContactService;
export default _default;
//# sourceMappingURL=contactService.d.ts.map