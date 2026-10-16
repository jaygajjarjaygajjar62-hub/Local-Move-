import { Router } from 'express';
import * as supportController from '../controllers/supportController.js';
import { validateBody } from '../middlewares/validate.js';
import { createTicketSchema, addMessageSchema } from '../validations/schemas.js';
const router = Router();
router.get('/tickets', supportController.getTickets);
router.post('/tickets', validateBody(createTicketSchema), supportController.createTicket);
router.get('/tickets/:id', supportController.getTicketById);
router.post('/tickets/:id/messages', validateBody(addMessageSchema), supportController.addMessage);
router.patch('/tickets/:id/status', supportController.updateStatus);
export default router;
//# sourceMappingURL=supportRoutes.js.map