import { useEffect, useState } from 'react'

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

  return (
    <div className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Abrir acciones</span>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 min-w-52 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900">
          <button
            type="button"
            className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => {
              onDownloadReport()
              setOpen(false)
            }}
          >
            Descargar reporte
          </button>
          {showBulkUpload && (
            <button
              type="button"
              className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => {
                onBulkUpload()
                setOpen(false)
              }}
            >
              Carga masiva
            </button>
          )}
        </div>
      )}
    </div>
  )
}
