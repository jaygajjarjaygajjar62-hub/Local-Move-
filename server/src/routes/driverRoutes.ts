import { Router } from 'express'
import * as driverController from '../controllers/driverController.js'
import { validateBody } from '../middlewares/validate.js'
import { driverOnboardingSchema, driverVerificationSchema } from '../validations/schemas.js'

const router = Router()

router.get('/', driverController.getDrivers)
router.get('/:id', driverController.getDriverById)
router.patch('/:id/online', driverController.updateDriverOnline)
router.patch('/:id/location', driverController.updateDriverLocation)
router.patch('/:id/verification', validateBody(driverVerificationSchema), driverController.updateDriverVerification)
router.post('/onboarding', validateBody(driverOnboardingSchema), driverController.submitOnboarding)
router.get('/:id/earnings', driverController.getDriverEarnings)

export default router
