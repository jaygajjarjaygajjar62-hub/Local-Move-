import * as walletService from '../services/walletService.js';
export async function getWallet(req, res, next) {
    try {
        const userId = req.user?.id || 'cust-demo';
        const wallet = await walletService.getWallet(userId);
        res.json({ success: true, data: wallet });
    }
    catch (err) {
        next(err);
    }
}
export async function topUpWallet(req, res, next) {
    try {
        const userId = req.user?.id || 'cust-demo';
        const { amount } = req.body;
        const wallet = await walletService.topUpWallet(userId, Number(amount));
        res.json({ success: true, data: wallet });
    }
    catch (err) {
        next(err);
    }
}
export async function deductWallet(req, res, next) {
    try {
        const userId = req.user?.id || 'cust-demo';
        const { amount, orderId } = req.body;
        const wallet = await walletService.deductWallet(userId, Number(amount), orderId);
        res.json({ success: true, data: wallet });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=walletController.js.map