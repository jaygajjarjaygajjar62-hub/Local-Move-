import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        // If no token provided, continue without user (controllers can check optional or require)
        return next();
    }
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Authentication token is invalid or expired',
            },
        });
    }
}
export function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication is required to access this resource',
            },
        });
    }
    next();
}
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication is required',
                },
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `User role '${req.user.role}' is not authorized to perform this action`,
                },
            });
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map