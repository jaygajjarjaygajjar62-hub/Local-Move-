import { Router } from 'express';
import { uploadMiddleware, handleUpload } from '../controllers/uploadController.js';
const router = Router();
router.post('/', uploadMiddleware.single('file'), handleUpload);
export default router;
//# sourceMappingURL=uploadRoutes.js.map