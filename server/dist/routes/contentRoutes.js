import { Router } from 'express';
import * as contentController from '../controllers/contentController.js';
const router = Router();
router.get('/prohibited', contentController.getProhibited);
router.post('/prohibited', contentController.addProhibited);
router.delete('/prohibited/:id', contentController.deleteProhibited);
router.get('/faqs', contentController.getFAQs);
router.post('/faqs', contentController.addFAQ);
export default router;
//# sourceMappingURL=contentRoutes.js.map