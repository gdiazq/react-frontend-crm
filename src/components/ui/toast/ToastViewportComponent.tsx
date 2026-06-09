import { createPortal } from 'react-dom'
import { useStoreToast } from '@/store'
import type { ToastTone } from '@/types'

const toneClasses: Record<ToastTone, string> = {
  error: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/30 dark:text-rose-200',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-900/30 dark:text-emerald-200',
  info: 'border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-900/30 dark:text-cyan-200',
  warning: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-900/30 dark:text-amber-200',
}

export function ToastViewportComponent() {
  const toasts = useStoreToast((s) => s.toasts)
  const dismissToast = useStoreToast((s) => s.dismissToast)

  if (typeof document === 'undefined' || toasts.length === 0) return null

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm shadow-lg ${toneClasses[toast.tone]}`}
        >
          <p className="min-w-0 flex-1">{toast.message}</p>
          <button
            type="button"
            aria-label="Cerrar mensaje"
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-base leading-none opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            onClick={() => dismissToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body,
  )
}
