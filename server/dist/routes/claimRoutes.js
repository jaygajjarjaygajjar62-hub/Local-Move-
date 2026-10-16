import { Router } from 'express';
import * as claimController from '../controllers/claimController.js';
import { validateBody } from '../middlewares/validate.js';
import { createClaimSchema, resolveClaimSchema } from '../validations/schemas.js';
const router = Router();
router.get('/', claimController.getClaims);
router.post('/', validateBody(createClaimSchema), claimController.raiseClaim);
router.patch('/:id/resolve', validateBody(resolveClaimSchema), claimController.resolveClaim);
export default router;
//# sourceMappingURL=claimRoutes.js.map