import React, { useId } from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id || generatedId

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          className={cn(
            'w-full min-h-[84px] rounded-lg border bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 transition-colors',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600',
            'disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-500 disabled:cursor-not-allowed',
            error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
