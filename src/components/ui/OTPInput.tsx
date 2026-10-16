import React, { useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  autoFocus?: boolean
  label?: string
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = false,
  label = 'Enter verification OTP',
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const digits = value.split('').slice(0, length)
  while (digits.length < length) {
    digits.push('')
  }

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) {
      const newDigits = [...digits]
      newDigits[index] = ''
      onChange(newDigits.join(''))
      return
    }

    const lastChar = val.slice(-1)
    const newDigits = [...digits]
    newDigits[index] = lastChar
    onChange(newDigits.join(''))

    // Move to next input
    if (index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted)
      const focusIndex = Math.min(pasted.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  return (
    <div className="space-y-2 text-center">
      {label && <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{label}</p>}
      <div className="flex items-center justify-center gap-3">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={disabled}
            aria-label={`Digit ${idx + 1} of ${length}`}
            className={cn(
              'w-12 h-14 text-center text-xl font-bold rounded-lg border bg-white dark:bg-slate-900 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600',
              error
                ? 'border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-300 bg-rose-50/50 dark:bg-rose-950/30'
                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-500',
              disabled && 'bg-slate-50 dark:bg-slate-950 opacity-60 cursor-not-allowed',
            )}
          />
        ))}
      </div>
    </div>
  )
}
