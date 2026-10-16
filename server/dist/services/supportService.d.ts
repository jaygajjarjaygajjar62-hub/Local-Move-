export declare function getSupportTickets(filter?: {
    userId?: string;
    status?: string;
}): Promise<any[]>;
export declare function getTicketById(ticketId: string): Promise<any>;
export declare function createSupportTicket(payload: {
    orderId?: string;
    userId: string;
    userRole: string;
    userName: string;
    userPhone: string;
    subject: string;
    category: string;
    priority?: string;
    message: string;
}): Promise<any>;
export declare function addTicketMessage(ticketId: string, text: string, sender: 'user' | 'agent', senderName: string): Promise<any>;
export declare function updateTicketStatus(ticketId: string, status: string): Promise<any>;
