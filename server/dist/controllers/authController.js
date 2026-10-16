import * as authService from '../services/authService.js';
export async function loginCustomer(req, res, next) {
    try {
        const { phone, name } = req.body;
        const result = await authService.loginCustomer(phone, name);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function loginDriver(req, res, next) {
    try {
        const { phone } = req.body;
        const result = await authService.loginDriver(phone);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function getMe(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
        }
        const user = await authService.getUserById(req.user.id);
        res.json({ success: true, data: { user } });
    }
    catch (err) {
        next(err);
    }
}
export function logout(req, res) {
    res.json({ success: true, data: { message: 'Signed out successfully' } });
}
//# sourceMappingURL=authController.js.map