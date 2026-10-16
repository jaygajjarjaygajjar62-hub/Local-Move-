import { Router } from 'express'
import * as pricingController from '../controllers/pricingController.js'
import { validateBody } from '../middlewares/validate.js'
import { calculateFareSchema } from '../validations/schemas.js'

const router = Router()

router.post('/calculate-fare', validateBody(calculateFareSchema), pricingController.calculateFare)
router.get('/config', pricingController.getPricingConfig)
router.put('/config', pricingController.updatePricingConfig)

export default router
