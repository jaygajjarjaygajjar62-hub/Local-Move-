import React, { useId } from 'react'
import { cn } from '@/utils/cn'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  error?: string
  options?: { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, id, options, children, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id || generatedId

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            'w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-3.5 text-sm text-slate-900 dark:text-slate-100 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600',
            'disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-500 disabled:cursor-not-allowed',
            error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600',
            className,
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
