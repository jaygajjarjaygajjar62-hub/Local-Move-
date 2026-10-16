import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'

export interface AuthUser {
  id: string
  role: 'customer' | 'driver' | 'admin' | 'receiver'
  name: string
  phone: string
  adminSubRole?: 'super_admin' | 'operations' | 'support' | 'finance'
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  let token: string | undefined

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    // If no token provided, continue without user (controllers can check optional or require)
    return next()
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUser
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Authentication token is invalid or expired',
      },
    })
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication is required to access this resource',
      },
    })
  }
  next()
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required',
        },
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `User role '${req.user.role}' is not authorized to perform this action`,
        },
      })
    }

    next()
  }
}
