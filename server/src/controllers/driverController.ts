import { Request, Response, NextFunction } from 'express'
import * as driverService from '../services/driverService.js'

export async function getDrivers(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, isOnline, vehicleType } = req.query
    const drivers = await driverService.getDrivers({
      status: status as string,
      isOnline: isOnline !== undefined ? isOnline === 'true' : undefined,
      vehicleType: vehicleType as string,
    })
    res.json({ success: true, data: { drivers } })
  } catch (err) {
    next(err)
  }
}

export async function getDriverById(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.getDriverById(req.params.id as string)
    if (!driver) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Driver not found' } })
    }
    res.json({ success: true, data: { driver } })
  } catch (err) {
    next(err)
  }
}

export async function updateDriverOnline(req: Request, res: Response, next: NextFunction) {
  try {
    const { isOnline } = req.body
    const driver = await driverService.updateDriverOnline(req.params.id as string, Boolean(isOnline))
    res.json({ success: true, data: { driver } })
  } catch (err) {
    next(err)
  }
}

export async function updateDriverLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng } = req.body
    await driverService.updateDriverLocation(req.params.id as string, { lat: Number(lat), lng: Number(lng) })
    res.json({ success: true, data: { updated: true } })
  } catch (err) {
    next(err)
  }
}

export async function updateDriverVerification(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, docType, reason } = req.body
    const driver = await driverService.updateDriverVerification(req.params.id as string, status, docType, reason)
    res.json({ success: true, data: { driver } })
  } catch (err) {
    next(err)
  }
}

export async function submitOnboarding(req: Request, res: Response, next: NextFunction) {
  try {
    const driver = await driverService.submitDriverOnboarding(req.body)
    res.status(201).json({ success: true, data: { driverId: driver?.id, driver } })
  } catch (err) {
    next(err)
  }
}

export async function getDriverEarnings(req: Request, res: Response, next: NextFunction) {
  try {
    const period = (req.query.period as string) || 'today'
    const result = await driverService.getDriverEarnings(req.params.id as string, period)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
