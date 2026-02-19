interface DropdownComponentProps {
  open: boolean
  userLabel?: string
  userEmail?: string
  avatarUrl?: string
  unreadCount: number
  isDark: boolean
  onToggle: () => void
  onClose: () => void
  onToggleNotifications: () => void
  onToggleTheme: () => void
  onGoSettings: () => void
  onGoLogout: () => void
}

export default function DropdownComponent({
  open,
  userLabel,
  userEmail,
  avatarUrl,
  unreadCount,
  isDark,
  onToggle,
  onClose,
  onToggleNotifications,
  onToggleTheme,
  onGoSettings,
  onGoLogout,
}: DropdownComponentProps) {
  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold hover:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-300/60 dark:focus-visible:ring-offset-slate-950"
        onClick={onToggle}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar de usuario" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
            {(userLabel || 'U').slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="ml-2 max-w-24 truncate text-sm">{userLabel || 'Usuario'}</span>
        <svg className="ml-2 h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </button>

      {open && (
        <button type="button" className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      )}

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-slate-900">
          <div className="rounded-md px-3 py-2">
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userEmail || 'Sin correo'}</p>
          </div>
          <div className="my-1 border-t border-slate-200 dark:border-white/10" />
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onToggleNotifications}
          >
            <span>Notificacion</span>
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-cyan-600 px-1.5 py-0.5 text-xs text-white dark:bg-cyan-400 dark:text-slate-900">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onGoSettings}
          >
            Configuracion
          </button>
          <button
            type="button"
            className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onToggleTheme}
          >
            {isDark ? 'Modo claro' : 'Modo oscuro'}
          </button>
          <div className="my-1 border-t border-slate-200 dark:border-white/10" />
          <button
            type="button"
            className="block w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
            onClick={onGoLogout}
          >
            Cerrar sesion
          </button>
        </div>
      )}
    </div>
  )
}
