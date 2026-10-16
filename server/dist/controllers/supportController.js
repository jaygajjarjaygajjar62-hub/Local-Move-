import * as supportService from '../services/supportService.js';
export async function getTickets(req, res, next) {
    try {
        const { userId, status } = req.query;
        const tickets = await supportService.getSupportTickets({
            userId: userId,
            status: status,
        });
        res.json({ success: true, data: { tickets } });
    }
    catch (err) {
        next(err);
    }
}
export async function getTicketById(req, res, next) {
    try {
        const ticket = await supportService.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ticket not found' } });
        }
        res.json({ success: true, data: { ticket } });
    }
    catch (err) {
        next(err);
    }
}
export async function createTicket(req, res, next) {
    try {
        const ticket = await supportService.createSupportTicket(req.body);
        res.status(201).json({ success: true, data: { ticketId: ticket?.id, ticket } });
    }
    catch (err) {
        next(err);
    }
}
export async function addMessage(req, res, next) {
    try {
        const { text, sender, senderName } = req.body;
        const ticket = await supportService.addTicketMessage(req.params.id, text, sender, senderName);
        res.status(201).json({ success: true, data: { ticket } });
    }
    catch (err) {
        next(err);
    }
}
export async function updateStatus(req, res, next) {
    try {
        const { status } = req.body;
        const ticket = await supportService.updateTicketStatus(req.params.id, status);
        res.json({ success: true, data: { ticket } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=supportController.js.map