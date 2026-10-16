import { Request, Response, NextFunction } from 'express'
import * as notificationService from '../services/notificationService.js'

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'cust-demo'
    const filter = (req.query.filter as string) || 'all'
    const notifications = await notificationService.getNotifications(userId, filter)
    res.json({ success: true, data: { notifications } })
  } catch (err) {
    next(err)
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'cust-demo'
    const { id } = req.body
    await notificationService.markNotificationsRead(userId, id)
    res.json({ success: true, data: { updated: true } })
  } catch (err) {
    next(err)
  }
}
