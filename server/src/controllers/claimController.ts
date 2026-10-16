import { Request, Response, NextFunction } from 'express'
import * as claimService from '../services/claimService.js'

export async function getClaims(req: Request, res: Response, next: NextFunction) {
  try {
    const claims = await claimService.getClaims()
    res.json({ success: true, data: { claims } })
  } catch (err) {
    next(err)
  }
}

export async function raiseClaim(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await claimService.raiseClaim(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function resolveClaim(req: Request, res: Response, next: NextFunction) {
  try {
    const { approvedCompensationInr, resolutionNotes } = req.body
    const claim = await claimService.resolveClaim(req.params.id as string, Number(approvedCompensationInr), resolutionNotes)
    res.json({ success: true, data: { claim } })
  } catch (err) {
    next(err)
  }
}
