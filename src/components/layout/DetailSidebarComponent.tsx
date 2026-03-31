import { useEffect, type ReactNode } from 'react'

interface DetailSidebarComponentProps {
  open: boolean
  title?: string
  onClose: () => void
  children?: ReactNode
}

export function DetailSidebarComponent({
  open,
  title = 'Detalle',
  onClose,
  children,
}: DetailSidebarComponentProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar detalle"
          className="fixed inset-0 z-40 bg-slate-950/40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full border-l border-slate-200 bg-white shadow-2xl transition-transform dark:border-white/10 dark:bg-slate-900 md:w-[70vw] lg:w-1/2 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            aria-label="Cerrar detalle"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-lg leading-none text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <section className="h-[calc(100vh-69px)] overflow-y-auto p-5">
          {children}
        </section>
      </aside>
    </>
  )
}
