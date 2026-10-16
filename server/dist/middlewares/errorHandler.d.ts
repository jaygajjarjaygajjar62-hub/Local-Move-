import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    details?: any;
}
export declare function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
