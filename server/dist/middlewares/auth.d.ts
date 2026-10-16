import { Request, Response, NextFunction } from 'express';
export interface AuthUser {
    id: string;
    role: 'customer' | 'driver' | 'admin' | 'receiver';
    name: string;
    phone: string;
    adminSubRole?: 'super_admin' | 'operations' | 'support' | 'finance';
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
