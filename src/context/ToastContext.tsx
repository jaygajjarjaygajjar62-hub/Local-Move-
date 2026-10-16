import React, { createContext, useContext, useState, useCallback } from 'react'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
  durationMs?: number
}

interface ToastContextValue {
  showToast: (item: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, message, type = 'info', durationMs = 4500 }: Omit<ToastItem, 'id'>) => {
      const id = 'toast_' + Math.random().toString(36).slice(2, 9)
      setToasts((prev) => [...prev, { id, title, message, type, durationMs }])

      setTimeout(() => {
        removeToast(id)
      }, durationMs)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Area */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-600" />}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-slate-900">{toast.title}</p>
              {toast.message && <p className="text-slate-600 mt-0.5 text-xs">{toast.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
