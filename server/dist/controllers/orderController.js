import * as orderService from '../services/orderService.js';
function getId(req) {
    return (req.params.id || '');
}
function getToken(req) {
    return (req.params.token || '');
}
export async function createOrder(req, res, next) {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json({ success: true, data: { orderId: order?.id, order } });
    }
    catch (err) {
        next(err);
    }
}
export async function getOrders(req, res, next) {
    try {
        const { status, customerId, driverId, search } = req.query;
        const orders = await orderService.getOrders({
            status: status,
            customerId: customerId,
            driverId: driverId,
            search: search,
        });
        res.json({ success: true, data: { orders, total: orders.length } });
    }
    catch (err) {
        next(err);
    }
}
export async function getOrderById(req, res, next) {
    try {
        const order = await orderService.getOrderById(getId(req));
        if (!order) {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
        }
        res.json({ success: true, data: { order } });
    }
    catch (err) {
        next(err);
    }
}
export async function getOrderByToken(req, res, next) {
    try {
        const order = await orderService.getOrderByToken(getToken(req));
        if (!order) {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tracking link invalid or expired' } });
        }
        // Mask sensitive sender details for public receiver view until verified
        const publicOrder = {
            ...order,
            // Hide dropOtp until verified
            dropOtp: '****',
        };
        res.json({ success: true, data: { order: publicOrder } });
    }
    catch (err) {
        next(err);
    }
}
export async function verifyReceiverPhone(req, res, next) {
    try {
        const token = getToken(req);
        const { phoneLast4 } = req.body;
        const result = await orderService.verifyReceiverByPhone(token, phoneLast4 || '');
        if (!result.success) {
            return res.status(400).json({ success: false, error: { code: 'VERIFICATION_FAILED', message: result.error } });
        }
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function updateOrderStatus(req, res, next) {
    try {
        const id = getId(req);
        const { status, note } = req.body;
        const order = await orderService.updateOrderStatus(id, status, note);
        if (!order) {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
        }
        res.json({ success: true, data: { order } });
    }
    catch (err) {
        next(err);
    }
}
export async function assignDriver(req, res, next) {
    try {
        const id = getId(req);
        const { driverId } = req.body;
        const order = await orderService.assignDriver(id, driverId);
        res.json({ success: true, data: { order } });
    }
    catch (err) {
        next(err);
    }
}
export async function confirmPickupSender(req, res, next) {
    try {
        const result = await orderService.confirmPickupSender(getId(req));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function verifyPickupOtp(req, res, next) {
    try {
        const id = getId(req);
        const { otp } = req.body;
        const result = await orderService.verifyPickupOtp(id, otp);
        if (!result.success) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_OTP', message: result.error } });
        }
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function addPickupProof(req, res, next) {
    try {
        const result = await orderService.addProof(getId(req), 'pickup', req.body);
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function approvePickupCustomer(req, res, next) {
    try {
        const result = await orderService.approvePickupCustomer(getId(req));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function startTripInTransit(req, res, next) {
    try {
        const result = await orderService.startTripInTransit(getId(req));
        if (!result.success) {
            return res.status(400).json({ success: false, error: { code: 'GATE_FAILED', message: result.error } });
        }
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function confirmDropReceiver(req, res, next) {
    try {
        const result = await orderService.confirmDropReceiver(getId(req));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function verifyDropOtp(req, res, next) {
    try {
        const id = getId(req);
        const { otp } = req.body;
        const result = await orderService.verifyDropOtp(id, otp);
        if (!result.success) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_OTP', message: result.error } });
        }
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function addDropProof(req, res, next) {
    try {
        const result = await orderService.addProof(getId(req), 'drop', req.body);
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function acknowledgeDropReceiver(req, res, next) {
    try {
        const { issueNote } = req.body;
        const result = await orderService.acknowledgeDropReceiver(getId(req), issueNote);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function confirmCashCollection(req, res, next) {
    try {
        const { amount } = req.body;
        const result = await orderService.confirmCashCollection(getId(req), Number(amount));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function completeDelivery(req, res, next) {
    try {
        const result = await orderService.completeDelivery(getId(req));
        if (!result.success) {
            return res.status(400).json({ success: false, error: { code: 'GATE_FAILED', message: result.error } });
        }
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function cancelOrder(req, res, next) {
    try {
        const { reason } = req.body;
        const result = await orderService.cancelOrder(getId(req), reason);
        if (!result.success) {
            return res.status(409).json({ success: false, error: { code: 'CANCEL_RESTRICTED', message: result.error } });
        }
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function rateOrder(req, res, next) {
    try {
        const { stars, comment, tipInr } = req.body;
        const result = await orderService.rateOrder(getId(req), stars, comment, tipInr);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function requestReschedule(req, res, next) {
    try {
        const { requestedBy, newDate, newTimeSlot } = req.body;
        const result = await orderService.requestReschedule(getId(req), requestedBy, newDate, newTimeSlot);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function approveReschedule(req, res, next) {
    try {
        const result = await orderService.approveReschedule(getId(req));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=orderController.js.map