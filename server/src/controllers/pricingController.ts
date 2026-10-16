import { Request, Response, NextFunction } from 'express'
import * as pricingService from '../services/pricingService.js'

export async function calculateFare(req: Request, res: Response, next: NextFunction) {
  try {
    const fare = await pricingService.calculateFare(req.body)
    res.json({ success: true, data: { fare } })
  } catch (err) {
    next(err)
  }
}

export async function getPricingConfig(req: Request, res: Response, next: NextFunction) {
  try {
    const city = (req.query.city as string) || 'Ahmedabad'
    const config = await pricingService.getPricingConfig(city)
    res.json({ success: true, data: { config } })
  } catch (err) {
    next(err)
  }
}

export async function updatePricingConfig(req: Request, res: Response, next: NextFunction) {
  try {
    const config = await pricingService.updatePricingConfig(req.body)
    res.json({ success: true, data: { config } })
  } catch (err) {
    next(err)
  }
}
