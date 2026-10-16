import { Request, Response, NextFunction } from 'express'
import * as adminService from '../services/adminService.js'

export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getAdminOverview()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getLiveOps(req: Request, res: Response, next: NextFunction) {
  try {
    const vehicleType = req.query.vehicleType as string
    const data = await adminService.getLiveOpsFeed(vehicleType)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getCommissions(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getCommissionsData()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getReports(req: Request, res: Response, next: NextFunction) {
  try {
    const range = (req.query.range as string) || '7d'
    const data = await adminService.getReportsData(range)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function getHelpers(req: Request, res: Response, next: NextFunction) {
  try {
    const helpers = await adminService.getHelpers()
    res.json({ success: true, data: { helpers } })
  } catch (err) {
    next(err)
  }
}

export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await adminService.getAuditLogs()
    res.json({ success: true, data: { logs } })
  } catch (err) {
    next(err)
  }
}
