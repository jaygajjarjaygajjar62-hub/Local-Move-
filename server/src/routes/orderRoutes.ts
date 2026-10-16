import { Router } from 'express'
import * as orderController from '../controllers/orderController.js'
import { validateBody } from '../middlewares/validate.js'
import {
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  rateOrderSchema,
  rescheduleRequestSchema,
  verifyReceiverSchema,
} from '../validations/schemas.js'

const router = Router()

// Order CRUD & Queries
router.post('/', validateBody(createOrderSchema), orderController.createOrder)
router.get('/', orderController.getOrders)
router.get('/:id', orderController.getOrderById)

// Public Receiver Tracking
router.get('/track/:token', orderController.getOrderByToken)
router.post('/track/:token/verify', validateBody(verifyReceiverSchema), orderController.verifyReceiverPhone)

// Status & Assignment
router.patch('/:id/status', validateBody(updateOrderStatusSchema), orderController.updateOrderStatus)
router.post('/:id/assign-driver', orderController.assignDriver)

// Handover Verification Gates: Pickup
router.post('/:id/pickup/confirm-sender', orderController.confirmPickupSender)
router.post('/:id/pickup/verify-otp', orderController.verifyPickupOtp)
router.post('/:id/pickup/proof', orderController.addPickupProof)
router.post('/:id/pickup/approve', orderController.approvePickupCustomer)
router.post('/:id/pickup/start-trip', orderController.startTripInTransit)

// Handover Verification Gates: Drop
router.post('/:id/drop/confirm-receiver', orderController.confirmDropReceiver)
router.post('/:id/drop/verify-otp', orderController.verifyDropOtp)
router.post('/:id/drop/proof', orderController.addDropProof)
router.post('/:id/drop/acknowledge', orderController.acknowledgeDropReceiver)
router.post('/:id/drop/collect-cash', orderController.confirmCashCollection)
router.post('/:id/drop/complete', orderController.completeDelivery)

// Exception & Rating actions
router.post('/:id/cancel', validateBody(cancelOrderSchema), orderController.cancelOrder)
router.post('/:id/rate', validateBody(rateOrderSchema), orderController.rateOrder)
router.post('/:id/reschedule-request', validateBody(rescheduleRequestSchema), orderController.requestReschedule)
router.post('/:id/reschedule-approve', orderController.approveReschedule)

export default router
