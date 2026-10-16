import { Request, Response, NextFunction } from 'express'
import * as supportService from '../services/supportService.js'

export async function getTickets(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, status } = req.query
    const tickets = await supportService.getSupportTickets({
      userId: userId as string,
      status: status as string,
    })
    res.json({ success: true, data: { tickets } })
  } catch (err) {
    next(err)
  }
}

export async function getTicketById(req: Request, res: Response, next: NextFunction) {
  try {
    const ticket = await supportService.getTicketById(req.params.id as string)
    if (!ticket) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Ticket not found' } })
    }
    res.json({ success: true, data: { ticket } })
  } catch (err) {
    next(err)
  }
}

export async function createTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const ticket = await supportService.createSupportTicket(req.body)
    res.status(201).json({ success: true, data: { ticketId: ticket?.id, ticket } })
  } catch (err) {
    next(err)
  }
}

export async function addMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { text, sender, senderName } = req.body
    const ticket = await supportService.addTicketMessage(req.params.id as string, text, sender, senderName)
    res.status(201).json({ success: true, data: { ticket } })
  } catch (err) {
    next(err)
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body
    const ticket = await supportService.updateTicketStatus(req.params.id as string, status)
    res.json({ success: true, data: { ticket } })
  } catch (err) {
    next(err)
  }
}
