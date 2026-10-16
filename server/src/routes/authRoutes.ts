import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { validateBody } from '../middlewares/validate.js'
import { customerLoginSchema, driverLoginSchema } from '../validations/schemas.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.post('/customer/login', validateBody(customerLoginSchema), authController.loginCustomer)
router.post('/driver/login', validateBody(driverLoginSchema), authController.loginDriver)
router.get('/me', authMiddleware, authController.getMe)
router.post('/logout', authController.logout)

export default router
