export declare function isEmailConfigured(): boolean;
export declare function getAdminEmail(): Promise<string>;
export interface ContactMessageData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}
export declare function sendContactNotification(data: ContactMessageData): Promise<void>;
export declare function sendContactAutoReply(data: ContactMessageData): Promise<void>;
//# sourceMappingURL=emailService.d.ts.map