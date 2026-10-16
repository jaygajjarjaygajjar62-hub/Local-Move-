import { Request, Response, NextFunction } from 'express';
export declare function getNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function markRead(req: Request, res: Response, next: NextFunction): Promise<void>;
