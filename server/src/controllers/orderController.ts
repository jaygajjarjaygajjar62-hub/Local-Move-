import { Request, Response, NextFunction } from 'express'
import * as orderService from '../services/orderService.js'

function getId(req: Request): string {
  return (req.params.id || '') as string
}

function getToken(req: Request): string {
  return (req.params.token || '') as string
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await orderService.createOrder(req.body)
    res.status(201).json({ success: true, data: { orderId: order?.id, order } })
  } catch (err) {
    next(err)
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, customerId, driverId, search } = req.query
    const orders = await orderService.getOrders({
      status: status as string,
      customerId: customerId as string,
      driverId: driverId as string,
      search: search as string,
    })
    res.json({ success: true, data: { orders, total: orders.length } })
  } catch (err) {
    next(err)
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await orderService.getOrderById(getId(req))
    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } })
    }
    res.json({ success: true, data: { order } })
  } catch (err) {
    next(err)
  }
}

export async function getOrderByToken(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await orderService.getOrderByToken(getToken(req))
    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tracking link invalid or expired' } })
    }
    // Mask sensitive sender details for public receiver view until verified
    const publicOrder = {
      ...order,
      // Hide dropOtp until verified
      dropOtp: '****',
    }
    res.json({ success: true, data: { order: publicOrder } })
  } catch (err) {
    next(err)
  }
}

export async function verifyReceiverPhone(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getToken(req)
    const { phoneLast4 } = req.body
    const result = await orderService.verifyReceiverByPhone(token, phoneLast4 || '')
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VERIFICATION_FAILED', message: result.error } })
    }
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getId(req)
    const { status, note } = req.body
    const order = await orderService.updateOrderStatus(id, status, note)
    if (!order) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } })
    }
    res.json({ success: true, data: { order } })
  } catch (err) {
    next(err)
  }
}

export async function assignDriver(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getId(req)
    const { driverId } = req.body
    const order = await orderService.assignDriver(id, driverId)
    res.json({ success: true, data: { order } })
  } catch (err) {
    next(err)
  }
}

export async function confirmPickupSender(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.confirmPickupSender(getId(req))
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function verifyPickupOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getId(req)
    const { otp } = req.body
    const result = await orderService.verifyPickupOtp(id, otp)
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_OTP', message: result.error } })
    }
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function addPickupProof(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.addProof(getId(req), 'pickup', req.body)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function approvePickupCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.approvePickupCustomer(getId(req))
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function startTripInTransit(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.startTripInTransit(getId(req))
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'GATE_FAILED', message: result.error } })
    }
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function confirmDropReceiver(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.confirmDropReceiver(getId(req))
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function verifyDropOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const id = getId(req)
    const { otp } = req.body
    const result = await orderService.verifyDropOtp(id, otp)
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_OTP', message: result.error } })
    }
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function addDropProof(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.addProof(getId(req), 'drop', req.body)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function acknowledgeDropReceiver(req: Request, res: Response, next: NextFunction) {
  try {
    const { issueNote } = req.body
    const result = await orderService.acknowledgeDropReceiver(getId(req), issueNote)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function confirmCashCollection(req: Request, res: Response, next: NextFunction) {
  try {
    const { amount } = req.body
    const result = await orderService.confirmCashCollection(getId(req), Number(amount))
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function completeDelivery(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.completeDelivery(getId(req))
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'GATE_FAILED', message: result.error } })
    }
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = req.body
    const result = await orderService.cancelOrder(getId(req), reason)
    if (!result.success) {
      return res.status(409).json({ success: false, error: { code: 'CANCEL_RESTRICTED', message: result.error } })
    }
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function rateOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { stars, comment, tipInr } = req.body
    const result = await orderService.rateOrder(getId(req), stars, comment, tipInr)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function requestReschedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestedBy, newDate, newTimeSlot } = req.body
    const result = await orderService.requestReschedule(getId(req), requestedBy, newDate, newTimeSlot)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function approveReschedule(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await orderService.approveReschedule(getId(req))
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
