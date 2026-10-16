import { Request, Response, NextFunction } from 'express'
import * as contentService from '../services/contentService.js'

export async function getProhibited(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await contentService.getProhibitedItems()
    res.json({ success: true, data: { items } })
  } catch (err) {
    next(err)
  }
}

export async function addProhibited(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await contentService.addProhibitedItem(req.body)
    res.status(201).json({ success: true, data: { item } })
  } catch (err) {
    next(err)
  }
}

export async function deleteProhibited(req: Request, res: Response, next: NextFunction) {
  try {
    await contentService.deleteProhibitedItem(req.params.id as string)
    res.json({ success: true, data: { deleted: true } })
  } catch (err) {
    next(err)
  }
}

export async function getFAQs(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string
    const faqs = await contentService.getFAQs(category)
    res.json({ success: true, data: { faqs } })
  } catch (err) {
    next(err)
  }
}

export async function addFAQ(req: Request, res: Response, next: NextFunction) {
  try {
    const faq = await contentService.addFAQ(req.body)
    res.status(201).json({ success: true, data: { faq } })
  } catch (err) {
    next(err)
  }
}
