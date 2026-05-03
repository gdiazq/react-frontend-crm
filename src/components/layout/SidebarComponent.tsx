import { useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarTooltipComponent } from '@/components/ui/tooltip/SidebarTooltipComponent'

interface SidebarComponentProps {
  mobileOpen: boolean
  collapsed: boolean
  showUsers?: boolean
  showRequests?: boolean
  showEmployees?: boolean
  showContracts?: boolean
  showLeaves?: boolean
  showAnnexes?: boolean
  showTransfers?: boolean
  showSettlements?: boolean
  showProjects?: boolean
  showProjectTypes?: boolean
  showProjectSpecialties?: boolean
  showProjectStatuses?: boolean
  showRoles?: boolean
  onCloseMobile?: () => void
  onToggleDesktopCollapse?: () => void
  onGoDashboard: () => void
  onGoUsers: () => void
  onGoRequests: () => void
  onGoEmployees: () => void
  onGoContracts: () => void
  onGoLeaves: () => void
  onGoAnnexes: () => void
  onGoTransfers: () => void
  onGoSettlements: () => void
  onGoSettlementsTerminationCauses: () => void
  onGoSettlementsWorkQuality: () => void
  onGoSettlementsSafetyCompliance: () => void
  onGoSettlementsNoRehireCause: () => void
  onGoSettlementsTerminationQuizQuestion: () => void
  onGoProjects: () => void
  onGoProjectTypes: () => void
  onGoProjectSpecialties: () => void
  onGoProjectStatuses: () => void
  onGoRoles: () => void
  onGoLogout: () => void
}

type NavItem = {
  show: boolean
  active: boolean
  label: string
  tooltip: string
  icon: ReactNode
  onClick: () => void
}

const baseIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const iconClass = 'h-[18px] w-[18px] shrink-0'
const subIconClass = 'h-[15px] w-[15px] shrink-0 opacity-80'

function NavItemButton({
  item,
  collapsed,
  isSub = false,
}: {
  item: NavItem
  collapsed: boolean
  isSub?: boolean
}) {
  const sizeClasses = isSub ? 'h-8 text-[11.5px]' : 'h-9 text-[12.5px]'
  const stateClasses = item.active
    ? 'accent-text [background:color-mix(in_srgb,var(--accent-500)_10%,transparent)] dark:[background:color-mix(in_srgb,var(--accent-400)_16%,transparent)]'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-50'

  return (
    <SidebarTooltipComponent enabled={collapsed} active={item.active} label={item.tooltip}>
      <button
        type="button"
        onClick={item.onClick}
        aria-current={item.active ? 'page' : undefined}
        className={`r-sm relative flex w-full items-center gap-2.5 px-2.5 text-left font-medium transition ${sizeClasses} ${stateClasses} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
      >
        {item.active && !collapsed && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-[color:var(--accent-500)]"
          />
        )}
        <span aria-hidden>{item.icon}</span>
        <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
      </button>
    </SidebarTooltipComponent>
  )
}

function SectionHeader({
  number,
  title,
  collapsed,
}: {
  number: string
  title: string
  collapsed: boolean
}) {
  return (
    <div className={`flex items-center gap-2 px-2.5 pb-2 pt-0.5 ${collapsed ? 'lg:hidden' : ''}`}>
      <span className="num accent-text text-[9.5px] tracking-[0.22em]">{number}</span>
      <span className="num text-[9.5px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {title}
      </span>
      <span className="ml-1 h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
    </div>
  )
}

export function SidebarComponent({
  mobileOpen,
  collapsed,
  showUsers = true,
  showRequests = true,
  showEmployees = true,
  showContracts = true,
  showLeaves = true,
  showAnnexes = true,
  showTransfers = true,
  showSettlements = true,
  showProjects = true,
  showProjectTypes = true,
  showProjectSpecialties = true,
  showProjectStatuses = true,
  showRoles = true,
  onCloseMobile,
  onToggleDesktopCollapse,
  onGoDashboard,
  onGoUsers,
  onGoRequests,
  onGoEmployees,
  onGoContracts,
  onGoLeaves,
  onGoAnnexes,
  onGoTransfers,
  onGoSettlements,
  onGoSettlementsTerminationCauses,
  onGoSettlementsWorkQuality,
  onGoSettlementsSafetyCompliance,
  onGoSettlementsNoRehireCause,
  onGoSettlementsTerminationQuizQuestion,
  onGoProjects,
  onGoProjectTypes,
  onGoProjectSpecialties,
  onGoProjectStatuses,
  onGoRoles,
  onGoLogout,
}: SidebarComponentProps) {
  const location = useLocation()
  const isDashboardActive = useMemo(() => location.pathname === '/dashboard', [location.pathname])
  const isUsersActive = useMemo(() => location.pathname.startsWith('/users'), [location.pathname])
  const isRequestsActive = useMemo(() => location.pathname.startsWith('/requests'), [location.pathname])
  const isEmployeesActive = useMemo(() => location.pathname.startsWith('/employees'), [location.pathname])
  const isContractsActive = useMemo(() => location.pathname.startsWith('/contracts'), [location.pathname])
  const isLeavesActive = useMemo(() => location.pathname.startsWith('/leaves'), [location.pathname])
  const isAnnexesActive = useMemo(() => location.pathname.startsWith('/annexes'), [location.pathname])
  const isTransfersActive = useMemo(() => location.pathname.startsWith('/transfers'), [location.pathname])
  const isSettlementsActive = useMemo(() => location.pathname === '/settlements', [location.pathname])
  const isSettlementsTerminationCausesActive = useMemo(() => location.pathname === '/settlements/termination-causes', [location.pathname])
  const isSettlementsWorkQualityActive = useMemo(() => location.pathname === '/settlements/work-quality', [location.pathname])
  const isSettlementsSafetyComplianceActive = useMemo(() => location.pathname === '/settlements/safety-compliance', [location.pathname])
  const isSettlementsNoRehireCauseActive = useMemo(() => location.pathname === '/settlements/no-rehire-cause', [location.pathname])
  const isSettlementsTerminationQuizQuestionActive = useMemo(() => location.pathname === '/settlements/termination-quiz-question', [location.pathname])
  const isProjectsActive = useMemo(() => {
    const path = location.pathname
    if (path === '/projects' || path === '/projects/new') return true
    if (path.startsWith('/projects/types')) return false
    if (path.startsWith('/projects/specialties')) return false
    if (path.startsWith('/projects/statuses')) return false
    return path.startsWith('/projects/')
  }, [location.pathname])
  const isProjectTypesActive = useMemo(() => location.pathname.startsWith('/projects/types'), [location.pathname])
  const isProjectSpecialtiesActive = useMemo(() => location.pathname.startsWith('/projects/specialties'), [location.pathname])
  const isProjectStatusesActive = useMemo(() => location.pathname.startsWith('/projects/statuses'), [location.pathname])
  const isRolesActive = useMemo(() => location.pathname.startsWith('/roles'), [location.pathname])

  const dashboardItem: NavItem = {
    show: true,
    active: isDashboardActive,
    label: 'Dashboard',
    tooltip: 'Dashboard',
    icon: (
      <svg {...baseIconProps} className={iconClass}>
        <path d="M3 13h8V3H3v10zm10 8h8V3h-8v18zM3 21h8v-6H3v6z" />
      </svg>
    ),
    onClick: onGoDashboard,
  }

  const rrhhItems: NavItem[] = [
    {
      show: showRequests,
      active: isRequestsActive,
      label: 'Solicitudes',
      tooltip: 'Solicitudes',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M9 5h10" />
          <path d="M9 9h10" />
          <path d="M9 13h10" />
          <path d="M9 17h10" />
          <rect x="3" y="3" width="4" height="4" rx="1" />
          <rect x="3" y="7" width="4" height="4" rx="1" />
          <rect x="3" y="11" width="4" height="4" rx="1" />
          <rect x="3" y="15" width="4" height="4" rx="1" />
        </svg>
      ),
      onClick: onGoRequests,
    },
    {
      show: showEmployees,
      active: isEmployeesActive,
      label: 'Trabajadores',
      tooltip: 'Trabajadores',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      onClick: onGoEmployees,
    },
    {
      show: showContracts,
      active: isContractsActive,
      label: 'Contratos',
      tooltip: 'Contratos',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M8 3h8l5 5v13H3V3z" />
          <path d="M16 3v5h5" />
          <path d="M8 13h8" />
          <path d="M8 17h8" />
        </svg>
      ),
      onClick: onGoContracts,
    },
    {
      show: showLeaves,
      active: isLeavesActive,
      label: 'Permisos',
      tooltip: 'Permisos',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M8 3h8l4 4v14H4V3z" />
          <path d="M16 3v4h4" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
          <path d="M7 8h5" />
        </svg>
      ),
      onClick: onGoLeaves,
    },
    {
      show: showAnnexes,
      active: isAnnexesActive,
      label: 'Anexos',
      tooltip: 'Anexos',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      ),
      onClick: onGoAnnexes,
    },
    {
      show: showTransfers,
      active: isTransfersActive,
      label: 'Traspasos',
      tooltip: 'Traspasos',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M8 7h9a2 2 0 0 1 2 2v8" />
          <path d="M16 4l3 3-3 3" />
          <path d="M16 17H7a2 2 0 0 1-2-2V7" />
          <path d="M8 20l-3-3 3-3" />
        </svg>
      ),
      onClick: onGoTransfers,
    },
    {
      show: showSettlements,
      active: isSettlementsActive,
      label: 'Finiquito',
      tooltip: 'Finiquito',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      ),
      onClick: onGoSettlements,
    },
  ]

  const finiquitoSubItems: NavItem[] = [
    {
      show: showSettlements,
      active: isSettlementsTerminationCausesActive,
      label: 'Terminación',
      tooltip: 'Terminación',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12h8" />
        </svg>
      ),
      onClick: onGoSettlementsTerminationCauses,
    },
    {
      show: showSettlements,
      active: isSettlementsWorkQualityActive,
      label: 'Calidad del trabajo',
      tooltip: 'Calidad del trabajo',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <path d="M12 3l2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.8l-5.6 2.6 1.1-6.3L2.9 9.6l6.3-.9z" />
        </svg>
      ),
      onClick: onGoSettlementsWorkQuality,
    },
    {
      show: showSettlements,
      active: isSettlementsSafetyComplianceActive,
      label: 'Seguridad',
      tooltip: 'Seguridad',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      onClick: onGoSettlementsSafetyCompliance,
    },
    {
      show: showSettlements,
      active: isSettlementsNoRehireCauseActive,
      label: 'No recontratación',
      tooltip: 'No recontratación',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <circle cx="12" cy="12" r="9" />
          <path d="M6 6l12 12" />
        </svg>
      ),
      onClick: onGoSettlementsNoRehireCause,
    },
    {
      show: showSettlements,
      active: isSettlementsTerminationQuizQuestionActive,
      label: 'Quiz de salida',
      tooltip: 'Quiz de salida',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      ),
      onClick: onGoSettlementsTerminationQuizQuestion,
    },
  ]

  const proyectosMainItems: NavItem[] = [
    {
      show: showProjects,
      active: isProjectsActive,
      label: 'Proyectos',
      tooltip: 'Proyectos',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      ),
      onClick: onGoProjects,
    },
  ]

  const proyectosSubItems: NavItem[] = [
    {
      show: showProjectTypes,
      active: isProjectTypesActive,
      label: 'Tipos',
      tooltip: 'Tipos',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      ),
      onClick: onGoProjectTypes,
    },
    {
      show: showProjectSpecialties,
      active: isProjectSpecialtiesActive,
      label: 'Especialidades',
      tooltip: 'Especialidades',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
          <path d="M9 3v18" />
        </svg>
      ),
      onClick: onGoProjectSpecialties,
    },
    {
      show: showProjectStatuses,
      active: isProjectStatusesActive,
      label: 'Vigencia',
      tooltip: 'Vigencia',
      icon: (
        <svg {...baseIconProps} className={subIconClass}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
      onClick: onGoProjectStatuses,
    },
  ]

  const adminItems: NavItem[] = [
    {
      show: showUsers,
      active: isUsersActive,
      label: 'Usuarios',
      tooltip: 'Usuarios',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
      ),
      onClick: onGoUsers,
    },
    {
      show: showRoles,
      active: isRolesActive,
      label: 'Roles',
      tooltip: 'Roles',
      icon: (
        <svg {...baseIconProps} className={iconClass}>
          <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      onClick: onGoRoles,
    },
  ]

  const visibleRrhh = rrhhItems.filter(i => i.show)
  const visibleFiniquitoSub = finiquitoSubItems.filter(i => i.show)
  const visibleProyectosMain = proyectosMainItems.filter(i => i.show)
  const visibleProyectosSub = proyectosSubItems.filter(i => i.show)
  const visibleAdmin = adminItems.filter(i => i.show)

  const hasRrhhItems = visibleRrhh.length > 0
  const hasProjectsItems = visibleProyectosMain.length + visibleProyectosSub.length > 0
  const hasAdministrationItems = visibleAdmin.length > 0

  return (
    <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:shrink-0 lg:flex-col">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh flex-col overflow-hidden border-r border-slate-200 bg-white px-3 pb-3 pt-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-950 lg:static lg:z-auto lg:h-screen lg:flex-1 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-72 lg:w-20' : 'w-72'}`}
      >
        <div className="mb-4 flex items-start justify-between gap-2 px-1.5">
          <div className={`flex min-w-0 flex-col gap-1 ${collapsed ? 'lg:hidden' : ''}`}>
            <span className="num text-[9.5px] uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              Índice · Navegación
            </span>
            <span className="display text-[18px] leading-none text-slate-900 dark:text-slate-100">
              Menú<span className="display-it text-slate-400 dark:text-slate-500"> principal</span>
            </span>
          </div>
          <div className="flex items-center gap-1 lg:ml-auto">
            <button
              type="button"
              className="r-md hidden h-8 w-8 items-center justify-center border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:inline-flex dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-950"
              onClick={onToggleDesktopCollapse}
              aria-label="Contraer o expandir menu"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              className="r-md inline-flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 lg:hidden dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
              onClick={onCloseMobile}
              aria-label="Cerrar menu"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className={`sidebar-scrollbar min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto ${collapsed ? 'pr-0' : 'pr-1'}`}>
          <div className="space-y-0.5">
            <NavItemButton item={dashboardItem} collapsed={collapsed} />
          </div>

          {hasRrhhItems && (
            <section className="space-y-0.5">
              <SectionHeader number="01" title="RRHH" collapsed={collapsed} />
              {visibleRrhh.map(item => (
                <NavItemButton key={item.label} item={item} collapsed={collapsed} />
              ))}
              {showSettlements && visibleFiniquitoSub.length > 0 && (
                <div
                  className={`space-y-0.5 ${
                    collapsed
                      ? 'lg:ml-0 lg:border-0 lg:pl-0'
                      : 'ml-5 mt-1 border-l border-slate-200/70 pl-2.5 dark:border-white/10'
                  }`}
                >
                  {visibleFiniquitoSub.map(sub => (
                    <NavItemButton key={sub.label} item={sub} collapsed={collapsed} isSub />
                  ))}
                </div>
              )}
            </section>
          )}

          {hasProjectsItems && (
            <section className="space-y-0.5">
              <SectionHeader number="02" title="Proyectos" collapsed={collapsed} />
              {visibleProyectosMain.map(item => (
                <NavItemButton key={item.label} item={item} collapsed={collapsed} />
              ))}
              {visibleProyectosSub.length > 0 && (
                <div
                  className={`space-y-0.5 ${
                    collapsed
                      ? 'lg:ml-0 lg:border-0 lg:pl-0'
                      : 'ml-5 mt-1 border-l border-slate-200/70 pl-2.5 dark:border-white/10'
                  }`}
                >
                  {visibleProyectosSub.map(sub => (
                    <NavItemButton key={sub.label} item={sub} collapsed={collapsed} isSub />
                  ))}
                </div>
              )}
            </section>
          )}

          {hasAdministrationItems && (
            <section className="space-y-0.5">
              <SectionHeader number="03" title="Administración" collapsed={collapsed} />
              {visibleAdmin.map(item => (
                <NavItemButton key={item.label} item={item} collapsed={collapsed} />
              ))}
            </section>
          )}
        </nav>

        <div className="mt-4 space-y-1 border-t border-slate-200 pt-3 dark:border-white/10">
          <div
            className={`flex items-center gap-2 px-2.5 pb-1 ${collapsed ? 'lg:hidden' : ''}`}
          >
            <span className="num accent-text text-[9.5px] tracking-[0.22em]">04</span>
            <span className="num text-[9.5px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Sesión
            </span>
          </div>
          <SidebarTooltipComponent enabled={collapsed} label="Salir">
            <button
              type="button"
              onClick={onGoLogout}
              className={`r-sm flex h-9 w-full items-center gap-2.5 px-2.5 text-left text-[12.5px] font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
            >
              <svg {...baseIconProps} className={iconClass}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>Salir</span>
            </button>
          </SidebarTooltipComponent>
        </div>
      </aside>
    </div>
  )
}
