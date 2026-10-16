import { Request, Response, NextFunction } from 'express';
export declare function getOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getLiveOps(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCommissions(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getReports(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getHelpers(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
