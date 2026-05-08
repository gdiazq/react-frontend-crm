import { CalendarBoardComponent } from '@/components/ui/calendar/CalendarBoardComponent'
import { DropdownComponent } from '@/components/layout/DropdownComponent'
import type { CalendarEventView } from '@/types'

interface NavbarComponentProps {
  unreadCount: number
  userLabel?: string
  userEmail?: string
  avatarUrl?: string
  isDark: boolean
  onToggleSidebar?: () => void
  onGoDashboard: () => void
  settingsDropdownOpen: boolean
  calendarOpen: boolean
  calendarEvents?: CalendarEventView[]
  calendarLoading?: boolean
  calendarErrorMessage?: string | null
  onToggleSettingsDropdown: () => void
  onCloseSettingsDropdown: () => void
  onToggleCalendar: () => void
  onCloseCalendar: () => void
  onCalendarVisibleRangeChange?: (range: { from: string, to: string }) => void
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
  calendarOpen,
  calendarEvents = [],
  calendarLoading = false,
  calendarErrorMessage,
  onToggleSettingsDropdown,
  onCloseSettingsDropdown,
  onToggleCalendar,
  onCloseCalendar,
  onCalendarVisibleRangeChange,
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
        <button
          type="button"
          className={`r-md inline-flex h-9 w-9 items-center justify-center border text-slate-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950 ${
            calendarOpen
              ? 'border-cyan-300 bg-cyan-50 accent-text dark:border-cyan-300/30 dark:bg-cyan-300/10'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-100'
          }`}
          onClick={onToggleCalendar}
          aria-label="Abrir calendario"
          aria-expanded={calendarOpen}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="4.5" width="13" height="12" rx="2" />
            <path d="M7 2.8v3.4M13 2.8v3.4M3.5 8h13" />
            <path d="M7 11h.01M10 11h.01M13 11h.01M7 14h.01M10 14h.01" />
          </svg>
        </button>

        {calendarOpen && (
          <>
            <button type="button" className="fixed inset-0 z-40" onClick={onCloseCalendar} aria-label="Cerrar calendario" />
            <div className="fixed right-3 top-20 z-50 w-[min(calc(100vw-1.5rem),68rem)] overflow-hidden rounded-[calc(1.5rem*var(--radius-scale))] border border-slate-200 bg-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950 sm:right-6 lg:w-[min(calc(100vw-8rem-1.5rem),78rem)]">
              <CalendarBoardComponent
                events={calendarEvents}
                loading={calendarLoading}
                errorMessage={calendarErrorMessage}
                title="Calendario"
                subtitle="Consulta la agenda mensual del sistema desde la navegación principal."
                emptyMessage="No hay eventos registrados para este día."
                onVisibleRangeChange={onCalendarVisibleRangeChange}
              />
            </div>
          </>
        )}

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
