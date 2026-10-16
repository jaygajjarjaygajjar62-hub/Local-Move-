export declare function getNotifications(userId?: string, filter?: string): Promise<{
    id: string;
    title: string;
    description: string;
    category: "delivery" | "security" | "billing" | "account";
    isRead: boolean;
    orderId: string | undefined;
    actionUrl: string | undefined;
    actionLabel: string | undefined;
    timestamp: string;
}[]>;
export declare function markNotificationsRead(userId?: string, notifId?: string): Promise<{
    success: boolean;
}>;
