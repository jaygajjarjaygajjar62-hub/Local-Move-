import React from 'react'
import { cn } from '@/utils/cn'
import { Button } from './Button'
import { PackageOpen } from 'lucide-react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <PackageOpen className="w-12 h-12 text-slate-400 stroke-1" />,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center flex flex-col items-center justify-center space-y-3',
        className,
      )}
    >
      <div className="rounded-full bg-slate-50 dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">{icon}</div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
