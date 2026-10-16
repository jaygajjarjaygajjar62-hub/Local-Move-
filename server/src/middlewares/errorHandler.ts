import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export interface AppError extends Error {
  statusCode?: number
  code?: string
  details?: any
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data provided',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    })
  }

  const statusCode = err.statusCode || 500
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR'
  const message = err.message || 'An unexpected internal error occurred'

  if (statusCode >= 500) {
    console.error('Unhandled server error:', err)
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  })
}
