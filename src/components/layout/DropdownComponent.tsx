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

function IconBell() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3.5a4.5 4.5 0 0 0-4.5 4.5v2.2L4 12.5h12l-1.5-2.3V8A4.5 4.5 0 0 0 10 3.5Z" />
      <path d="M8 14.5a2 2 0 0 0 4 0" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.3" />
      <path d="M10 2.5v1.8M10 15.7v1.8M17.5 10h-1.8M4.3 10H2.5M15.3 4.7l-1.3 1.3M6 14l-1.3 1.3M15.3 15.3 14 14M6 6 4.7 4.7" />
    </svg>
  )
}

function IconSun() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2.5v1.5M10 16v1.5M17.5 10H16M4 10H2.5M15.3 4.7l-1.1 1.1M5.8 14.2l-1.1 1.1M15.3 15.3l-1.1-1.1M5.8 5.8 4.7 4.7" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 12.2A6 6 0 0 1 7.8 3.5a6 6 0 1 0 8.7 8.7Z" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 3.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h3.5" />
      <path d="m13 6.5 3.5 3.5L13 13.5" />
      <path d="M16.5 10h-8" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 8 4 4 4-4" />
    </svg>
  )
}

export function DropdownComponent({
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
  const displayName = userLabel || 'Usuario'
  const initial = displayName.slice(0, 1).toUpperCase()

  return (
    <div className="relative">
      <button
        type="button"
        className="r-md inline-flex h-9 items-center gap-2 border border-slate-200 bg-white px-2 text-[12.5px] text-slate-700 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-white/20 dark:focus-visible:ring-offset-slate-950"
        onClick={onToggle}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar de usuario" className="r-full h-6 w-6 object-cover" />
        ) : (
          <span className="r-full inline-flex h-6 w-6 items-center justify-center bg-[color:var(--accent-500)] text-[11px] font-semibold text-white">
            {initial}
          </span>
        )}
        <span className="max-w-28 truncate">{displayName}</span>
        <IconChevron />
      </button>

      {open && (
        <button type="button" className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      )}

      {open && (
        <div className="soft-ring r-md absolute right-0 z-50 mt-2 w-64 border border-slate-200 bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_-30px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar de usuario" className="r-full h-9 w-9 object-cover" />
            ) : (
              <span className="r-full inline-flex h-9 w-9 items-center justify-center bg-[color:var(--accent-500)] text-[14px] font-semibold text-white">
                {initial}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="num text-[9.5px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Sesión activa
              </p>
              <p className="truncate text-[13px] font-medium text-slate-900 dark:text-slate-100">{displayName}</p>
              <p className="num truncate text-[10.5px] text-slate-500 dark:text-slate-400">
                {userEmail || 'sin correo'}
              </p>
            </div>
          </div>

          <div className="my-1 h-px bg-slate-200 dark:bg-white/10" />
          <button
            type="button"
            className="r-sm group flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left text-[12.5px] text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
            onClick={onToggleNotifications}
          >
            <IconBell />
            <span className="flex-1">Notificaciones</span>
            {unreadCount > 0 && (
              <span className="r-full accent-bg num min-w-5 px-1.5 text-center text-[10px] leading-[1.3] text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="r-sm flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left text-[12.5px] text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
            onClick={onGoSettings}
          >
            <IconGear />
            <span className="flex-1">Configuración</span>
          </button>

          <button
            type="button"
            className="r-sm flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left text-[12.5px] text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
            onClick={onToggleTheme}
          >
            {isDark ? <IconSun /> : <IconMoon />}
            <span className="flex-1">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>

          <div className="my-1 h-px bg-slate-200 dark:bg-white/10" />

          <button
            type="button"
            className="r-sm flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left text-[12.5px] text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            onClick={onGoLogout}
          >
            <IconLogout />
            <span className="flex-1">Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  )
}
