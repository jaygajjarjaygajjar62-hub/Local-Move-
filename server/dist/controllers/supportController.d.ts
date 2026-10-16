import { Request, Response, NextFunction } from 'express';
export declare function getTickets(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getTicketById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createTicket(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
