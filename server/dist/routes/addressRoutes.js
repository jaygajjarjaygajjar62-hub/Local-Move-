import { Router } from 'express';
import * as addressController from '../controllers/addressController.js';
import { validateBody } from '../middlewares/validate.js';
import { addressSchema } from '../validations/schemas.js';
import { authMiddleware } from '../middlewares/auth.js';
const router = Router();
router.get('/', authMiddleware, addressController.getAddresses);
router.post('/', authMiddleware, validateBody(addressSchema), addressController.addAddress);
router.delete('/:id', authMiddleware, addressController.deleteAddress);
export default router;
//# sourceMappingURL=addressRoutes.js.map