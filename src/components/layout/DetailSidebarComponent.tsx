import { useEffect, type ReactNode } from 'react'

interface DetailSidebarComponentProps {
  open: boolean
  title?: string
  size?: 'default' | 'wide'
  headerContent?: ReactNode
  onClose: () => void
  children?: ReactNode
}

export function DetailSidebarComponent({
  open,
  title = 'Detalle',
  size = 'default',
  headerContent,
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

  const sizeClass = size === 'wide'
    ? 'w-full lg:left-72 lg:w-auto'
    : 'w-full md:w-[70vw] lg:w-1/2'

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
        className={`fixed inset-y-0 right-0 z-50 border-l border-slate-200 bg-white shadow-2xl transition-[transform,left,width] duration-300 ease-out dark:border-white/10 dark:bg-slate-900 ${sizeClass} ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            {title && <h2 className="display shrink-0 text-[24px] leading-none text-slate-900 dark:text-slate-50">{title}</h2>}
            {headerContent && <div className="min-w-0 flex-1">{headerContent}</div>}
          </div>
          <button
            type="button"
            aria-label="Cerrar detalle"
            className="absolute right-5 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-lg leading-none text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:static"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <section className="sidebar-scrollbar h-[calc(100vh-69px)] overflow-y-auto p-5">
          {children}
        </section>
      </aside>
    </>
  )
}
