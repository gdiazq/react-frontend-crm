import type { NotificationItem } from '@/types'

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

  return (
    <aside className="fixed right-4 top-20 w-96 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 z-50">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">Notificaciones</p>
        <button
          type="button"
          className="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs opacity-70">{unreadCount} sin leer</p>
        <button
          type="button"
          className="text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          onClick={onMarkAllRead}
        >
          Marcar todas leidas
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-lg border border-slate-200 p-3 text-sm opacity-80 dark:border-white/10">
          Aun no hay notificaciones.
        </div>
      ) : (
        <ul className="max-h-80 space-y-2 overflow-auto pr-1">
          {notifications.map((item) => (
            <li
              key={item.id}
              className={`rounded-lg border p-3 border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40 ${
                !item.read ? 'ring-1 ring-cyan-500/40 dark:ring-cyan-300/40' : ''
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs opacity-70">{formatTimestamp(item.createdAt)}</p>
              </div>
              <p className="text-sm opacity-90">{item.message}</p>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  onClick={() => onMarkRead(item.id)}
                >
                  Marcar leida
                </button>
                <button
                  type="button"
                  className="ml-3 text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  onClick={() => onArchive(item.id)}
                >
                  Archivar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
