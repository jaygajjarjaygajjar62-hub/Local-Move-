import { Request, Response, NextFunction } from 'express';
export declare function loginCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function loginDriver(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getMe(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function logout(req: Request, res: Response): void;
