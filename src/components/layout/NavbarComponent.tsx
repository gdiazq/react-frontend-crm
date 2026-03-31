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
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 dark:border-white/10 dark:bg-slate-900/40">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:hidden dark:focus-visible:ring-offset-slate-900"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Abrir menu</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          className="rounded-lg px-3 py-2 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          onClick={onGoDashboard}
        >
          Dashboard
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
