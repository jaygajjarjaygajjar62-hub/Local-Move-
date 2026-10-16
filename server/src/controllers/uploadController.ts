import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.resolve(__dirname, '../../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const name = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
})

export async function handleUpload(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Multipart file upload
    if (req.file) {
      const publicUrl = `/uploads/${req.file.filename}`
      return res.status(201).json({ success: true, data: { url: publicUrl } })
    }

    // 2. Base64 data URL upload
    if (req.body && req.body.data && typeof req.body.data === 'string') {
      const matches = req.body.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        const mimeType = matches[1]
        const base64Data = matches[2]
        const ext = mimeType.split('/')[1] || 'jpg'
        const filename = `proof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`
        const filePath = path.join(uploadsDir, filename)

        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'))
        return res.status(201).json({ success: true, data: { url: `/uploads/${filename}` } })
      }
    }

    // 3. Fallback URL
    if (req.body && req.body.url) {
      return res.status(201).json({ success: true, data: { url: req.body.url } })
    }

    res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file or image data provided' } })
  } catch (err) {
    next(err)
  }
}
