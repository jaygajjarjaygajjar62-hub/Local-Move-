import { Request, Response, NextFunction } from 'express';
export declare function getDrivers(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getDriverById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateDriverOnline(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateDriverLocation(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateDriverVerification(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function submitOnboarding(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getDriverEarnings(req: Request, res: Response, next: NextFunction): Promise<void>;
