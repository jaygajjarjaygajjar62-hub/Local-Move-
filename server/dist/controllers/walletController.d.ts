import { Request, Response, NextFunction } from 'express';
export declare function getWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function topUpWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deductWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
