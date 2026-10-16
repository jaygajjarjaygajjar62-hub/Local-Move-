import { Request, Response, NextFunction } from 'express'
import * as addressService from '../services/addressService.js'

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'cust-demo'
    const addresses = await addressService.getAddresses(userId)
    res.json({ success: true, data: { addresses } })
  } catch (err) {
    next(err)
  }
}

export async function addAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id || 'cust-demo'
    const address = await addressService.addAddress(userId, req.body)
    res.status(201).json({ success: true, data: { address } })
  } catch (err) {
    next(err)
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    await addressService.deleteAddress(req.params.id as string)
    res.json({ success: true, data: { deleted: true } })
  } catch (err) {
    next(err)
  }
}
