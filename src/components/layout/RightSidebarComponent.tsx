import type { ReactNode } from 'react'

interface RightSidebarComponentProps {
  open: boolean
  title?: string
  onClose: () => void
  children?: ReactNode
}

export function RightSidebarComponent({
  open,
  title = 'Panel',
  onClose,
  children,
}: RightSidebarComponentProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Cerrar panel"
          className="fixed inset-0 z-40 bg-slate-950/40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-slate-200 bg-white p-5 shadow-2xl transition-transform dark:border-white/10 dark:bg-slate-900 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            aria-label="Cerrar panel"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-lg leading-none text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="sidebar-scrollbar h-[calc(100vh-96px)] overflow-y-auto pr-2">
          {children}
        </div>
      </aside>
    </>
  )
}
