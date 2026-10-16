import React, { useId } from 'react'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode
  description?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const generatedId = useId()
    const checkboxId = id || generatedId

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 select-none cursor-pointer group text-left min-h-[44px]',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded border transition-colors flex items-center justify-center',
              'border-slate-300 bg-white group-hover:border-emerald-600',
              'peer-checked:bg-emerald-600 peer-checked:border-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-1',
            )}
          >
            <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 stroke-[3]" />
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-sm font-medium text-slate-800 leading-snug">{label}</span>
          {description && <p className="text-xs text-slate-500 leading-normal">{description}</p>}
        </div>
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
