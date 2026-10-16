import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/auth.js';
const router = Router();
router.get('/', authMiddleware, notificationController.getNotifications);
router.patch('/mark-read', authMiddleware, notificationController.markRead);
export default router;
//# sourceMappingURL=notificationRoutes.js.map