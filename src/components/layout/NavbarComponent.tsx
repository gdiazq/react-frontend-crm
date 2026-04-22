import { DropdownComponent } from '@/components/layout/DropdownComponent'

interface NavbarComponentProps {
  unreadCount: number
  userLabel?: string
  userEmail?: string
  avatarUrl?: string
  isDark: boolean
  onToggleSidebar?: () => void
  onGoDashboard: () => void
  settingsDropdownOpen: boolean
  onToggleSettingsDropdown: () => void
  onCloseSettingsDropdown: () => void
  onToggleNotifications: () => void
  onToggleTheme: () => void
  onGoSettings: () => void
  onGoLogout: () => void
}

export function NavbarComponent({
  unreadCount,
  userLabel,
  userEmail,
  avatarUrl,
  isDark,
  onToggleSidebar,
  onGoDashboard,
  settingsDropdownOpen,
  onToggleSettingsDropdown,
  onCloseSettingsDropdown,
  onToggleNotifications,
  onToggleTheme,
  onGoSettings,
  onGoLogout,
}: NavbarComponentProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 py-4 dark:border-white/10 dark:bg-slate-900/40">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="r-md inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 lg:hidden dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-950"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Abrir menu</span>
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 6h12M4 10h12M4 14h12" />
          </svg>
        </button>
        <button
          type="button"
          className="num r-md group inline-flex h-9 items-center gap-2 border border-slate-200 bg-white px-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-950"
          onClick={onGoDashboard}
        >
          <span className="accent-text">·</span>
          <span>Dashboard</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownComponent
          open={settingsDropdownOpen}
          userLabel={userLabel}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          unreadCount={unreadCount}
          isDark={isDark}
          onToggle={onToggleSettingsDropdown}
          onClose={onCloseSettingsDropdown}
          onToggleNotifications={onToggleNotifications}
          onToggleTheme={onToggleTheme}
          onGoSettings={onGoSettings}
          onGoLogout={onGoLogout}
        />
      </div>
    </header>
  )
}
