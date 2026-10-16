import { Request, Response, NextFunction } from 'express';
export declare function calculateFare(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPricingConfig(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updatePricingConfig(req: Request, res: Response, next: NextFunction): Promise<void>;
