import { Router } from 'express';
import * as walletController from '../controllers/walletController.js';
import { validateBody } from '../middlewares/validate.js';
import { walletTopUpSchema, walletDeductSchema } from '../validations/schemas.js';
import { authMiddleware } from '../middlewares/auth.js';
const router = Router();
router.get('/', authMiddleware, walletController.getWallet);
router.post('/top-up', authMiddleware, validateBody(walletTopUpSchema), walletController.topUpWallet);
router.post('/deduct', authMiddleware, validateBody(walletDeductSchema), walletController.deductWallet);
export default router;
//# sourceMappingURL=walletRoutes.js.map