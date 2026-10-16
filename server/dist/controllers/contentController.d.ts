import { Request, Response, NextFunction } from 'express';
export declare function getProhibited(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addProhibited(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteProhibited(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getFAQs(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addFAQ(req: Request, res: Response, next: NextFunction): Promise<void>;
