import { Request, Response, NextFunction } from 'express';
export declare function getAddresses(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addAddress(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void>;
