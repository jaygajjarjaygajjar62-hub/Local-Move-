import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
export declare const uploadMiddleware: multer.Multer;
export declare function handleUpload(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
