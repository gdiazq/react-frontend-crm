import { useEffect, useState } from 'react'
import { IconDots } from '@/components/ui/icons/IconDots'

interface ToolbarActionsDropdownComponentProps {
  disabled?: boolean
  showBulkUpload?: boolean
  onDownloadReport: () => void
  onBulkUpload: () => void
}

export function ToolbarActionsDropdownComponent({
  disabled = false,
  showBulkUpload = true,
  onDownloadReport,
  onBulkUpload,
}: ToolbarActionsDropdownComponentProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const itemClass =
    'flex w-full items-center gap-2.5 r-sm px-2.5 py-1.5 text-left text-[12.5px] text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5'

  return (
    <div className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        aria-label="Más acciones"
        aria-haspopup="menu"
        aria-expanded={open}
        className="r-md inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-400)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-50"
        onClick={() => setOpen((value) => !value)}
      >
        <IconDots />
      </button>

      {open && (
        <div className="soft-ring r-md absolute right-0 top-11 z-50 min-w-56 border border-slate-200 bg-white p-1.5 dark:border-white/10 dark:bg-slate-900">
          <div className="px-2 py-1 text-[9.5px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            <span className="num accent-text">01</span> Acciones
          </div>
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              onDownloadReport()
              setOpen(false)
            }}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Descargar reporte
          </button>
          {showBulkUpload && (
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                onBulkUpload()
                setOpen(false)
              }}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M12 21V9m0 0l-4 4m4-4l4 4M4 5h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Carga masiva
            </button>
          )}
        </div>
      )}
    </div>
  )
}
