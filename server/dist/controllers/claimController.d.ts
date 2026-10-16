import { Request, Response, NextFunction } from 'express';
export declare function getClaims(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function raiseClaim(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function resolveClaim(req: Request, res: Response, next: NextFunction): Promise<void>;
