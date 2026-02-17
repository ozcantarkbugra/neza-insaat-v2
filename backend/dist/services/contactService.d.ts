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
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        subject: string | null;
        read: boolean;
        replied: boolean;
    }>;
    getAll(filters: {
        read?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        messages: {
            message: string;
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string | null;
            subject: string | null;
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
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        subject: string | null;
        read: boolean;
        replied: boolean;
    }>;
    markAsRead(id: string): Promise<{
        message: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        subject: string | null;
        read: boolean;
        replied: boolean;
    }>;
    markAsReplied(id: string): Promise<{
        message: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string | null;
        subject: string | null;
        read: boolean;
        replied: boolean;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
declare const _default: ContactService;
export default _default;
//# sourceMappingURL=contactService.d.ts.map