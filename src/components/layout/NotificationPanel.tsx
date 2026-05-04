import type { NotificationItem, NotificationVariant } from '@/types'

interface NotificationPanelProps {
  isOpen: boolean
  unreadCount: number
  notifications: NotificationItem[]
  onClose: () => void
  onMarkAllRead: () => void
  onMarkRead: (id: string) => void
  onArchive: (id: string) => void
  formatTimestamp: (value: string) => string
}

const variantClass: Record<NotificationVariant, string> = {
  info: 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200',
  error: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200',
}

function IconClose() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3.5a4.5 4.5 0 0 0-4.5 4.5v2.2L4 12.5h12l-1.5-2.3V8A4.5 4.5 0 0 0 10 3.5Z" />
      <path d="M8 14.5a2 2 0 0 0 4 0" />
    </svg>
  )
}

function IconEmpty() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a5 5 0 0 0-5 5v3.6L5.2 16h13.6L17 12.6V9a5 5 0 0 0-5-5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
      <path d="M4 4l16 16" />
    </svg>
  )
}

export function NotificationPanel({
  isOpen,
  unreadCount,
  notifications,
  onClose,
  onMarkAllRead,
  onMarkRead,
  onArchive,
  formatTimestamp,
}: NotificationPanelProps) {
  if (!isOpen) return null

  const hasNotifications = notifications.length > 0

  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-slate-950/10 dark:bg-slate-950/30" onClick={onClose} aria-label="Cerrar notificaciones" />

      <aside className="fixed right-3 top-20 z-50 w-[min(calc(100vw-1.5rem),28rem)] overflow-hidden rounded-[calc(1.5rem*var(--radius-scale))] border border-slate-200 bg-white text-slate-900 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 sm:right-6">
        <header className="relative isolate overflow-hidden border-b border-slate-200 p-4 dark:border-white/10 sm:p-5">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,rgba(8,145,178,0.16),transparent_34%),linear-gradient(135deg,rgba(236,254,255,0.72),transparent_48%)] dark:bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.14),transparent_34%),linear-gradient(135deg,rgba(8,47,73,0.22),transparent_48%)]" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className="r-xl mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
                <IconBell />
              </span>
              <div className="min-w-0">
                <p className="num text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Centro de avisos</p>
                <h2 className="display mt-1 text-[30px] leading-none text-slate-950 dark:text-slate-50">
                  Notificaciones
                </h2>
              </div>
            </div>

            <button
              type="button"
              className="r-md inline-flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <IconClose />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="num text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Pendientes</p>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{unreadCount} sin leer</p>
            </div>
            <button
              type="button"
              className="r-full border border-slate-200 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-45 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-cyan-300/30 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-200 dark:focus-visible:ring-offset-slate-950"
              onClick={onMarkAllRead}
              disabled={unreadCount === 0}
            >
              Marcar todas leidas
            </button>
          </div>
        </header>

        <section className="p-3 sm:p-4">
          {!hasNotifications ? (
            <div className="r-2xl flex min-h-52 flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center dark:border-white/10 dark:bg-slate-900/50">
              <span className="r-xl inline-flex h-14 w-14 items-center justify-center bg-white text-slate-400 soft-ring dark:bg-slate-950 dark:text-slate-500">
                <IconEmpty />
              </span>
              <h3 className="display mt-4 text-[28px] leading-none text-slate-900 dark:text-slate-100">Sin avisos</h3>
              <p className="mt-2 max-w-64 text-sm leading-6 text-slate-500 dark:text-slate-400">Cuando llegue una actualizacion importante, aparecera en este panel.</p>
            </div>
          ) : (
            <ul className="sidebar-scrollbar max-h-[min(60vh,31rem)] space-y-2 overflow-y-auto pr-1">
              {notifications.map((item) => (
                <li
                  key={item.id}
                  className={`r-2xl border bg-white p-3.5 transition hover:shadow-lg hover:shadow-slate-950/5 dark:bg-slate-900/70 dark:hover:shadow-black/20 ${
                    item.read
                      ? 'border-slate-200 dark:border-white/10'
                      : 'border-cyan-400/70 shadow-[inset_3px_0_0_rgba(6,182,212,0.75)] dark:border-cyan-300/45 dark:shadow-[inset_3px_0_0_rgba(103,232,249,0.55)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`r-lg mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center border ${variantClass[item.variant]}`}>
                      <IconBell />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950 dark:text-slate-50">{item.title}</h3>
                        <span className="num shrink-0 text-[10.5px] text-slate-400 dark:text-slate-500">{formatTimestamp(item.createdAt)}</span>
                      </div>
                      <p className="mt-1.5 text-sm leading-5 text-slate-600 dark:text-slate-300">{item.message}</p>

                      <div className="mt-3 flex flex-wrap justify-end gap-2">
                        {!item.read && (
                          <button
                            type="button"
                            className="r-full bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold text-cyan-700 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] dark:bg-cyan-300/10 dark:text-cyan-200 dark:hover:bg-cyan-300/15"
                            onClick={() => onMarkRead(item.id)}
                          >
                            Marcar leida
                          </button>
                        )}
                        <button
                          type="button"
                          className="r-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          onClick={() => onArchive(item.id)}
                        >
                          Archivar
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </>
  )
}
