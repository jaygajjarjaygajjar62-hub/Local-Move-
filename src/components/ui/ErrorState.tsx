import React from 'react'
import { cn } from '@/utils/cn'
import { Button } from './Button'
import { AlertCircle, RefreshCw } from 'lucide-react'

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 p-6 text-center flex flex-col items-center justify-center space-y-3',
        className,
      )}
    >
      <div className="rounded-full bg-rose-100 dark:bg-rose-900/60 p-3 text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-8 h-8 stroke-2" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200">{title}</h3>
        <p className="text-xs text-rose-700 dark:text-rose-300">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
