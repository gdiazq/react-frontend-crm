import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarTooltipComponent } from '@/components/ui/tooltip/SidebarTooltipComponent'

interface SidebarComponentProps {
  mobileOpen: boolean
  collapsed: boolean
  showUsers?: boolean
  showRequests?: boolean
  showEmployees?: boolean
  showContracts?: boolean
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

export function SidebarComponent({
  mobileOpen,
  collapsed,
  showUsers = true,
  showRequests = true,
  showEmployees = true,
  showContracts = true,
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
  const hasRrhhItems = showRequests || showEmployees || showContracts || showSettlements
  const hasProjectsItems = showProjects || showProjectTypes || showProjectSpecialties || showProjectStatuses
  const hasAdministrationItems = showUsers || showRoles

  const getItemClasses = (active: boolean) => {
    if (active) return 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-white'
    return 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
  }

  return (
    <div className="lg:flex lg:shrink-0 lg:flex-col">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-900 lg:static lg:z-auto lg:flex-1 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-72 lg:w-20' : 'w-72'}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <p
            className={`text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300 ${collapsed ? 'lg:hidden' : ''}`}
          >
            Menu
          </p>
          <button
            type="button"
            className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:inline-flex lg:items-center lg:justify-center dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onToggleDesktopCollapse}
          >
            <span className="sr-only">Contraer o expandir menu</span>
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onCloseMobile}
          >
            <span className="sr-only">Cerrar menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          <SidebarTooltipComponent enabled={collapsed} active={isDashboardActive} label="Dashboard">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isDashboardActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
              onClick={onGoDashboard}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 13h8V3H3v10zm10 8h8V3h-8v18zM3 21h8v-6H3v6z" />
              </svg>
              <span className={collapsed ? 'lg:hidden' : ''}>Dashboard</span>
            </button>
          </SidebarTooltipComponent>

          {hasRrhhItems && (
            <section className={`rounded-xl border border-slate-200/80 bg-slate-50/60 p-2 dark:border-white/10 dark:bg-slate-800/30 ${collapsed ? 'lg:border-transparent lg:bg-transparent lg:p-0' : ''}`}>
              <p className={`px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>
                RRHH
              </p>

              {showRequests && (
                <SidebarTooltipComponent enabled={collapsed} active={isRequestsActive} label="Solicitudes">
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isRequestsActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                    onClick={onGoRequests}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5h10" />
                      <path d="M9 9h10" />
                      <path d="M9 13h10" />
                      <path d="M9 17h10" />
                      <rect x="3" y="3" width="4" height="4" rx="1" />
                      <rect x="3" y="7" width="4" height="4" rx="1" />
                      <rect x="3" y="11" width="4" height="4" rx="1" />
                      <rect x="3" y="15" width="4" height="4" rx="1" />
                    </svg>
                    <span className={collapsed ? 'lg:hidden' : ''}>Solicitudes</span>
                  </button>
                </SidebarTooltipComponent>
              )}

              {showEmployees && (
                <SidebarTooltipComponent enabled={collapsed} active={isEmployeesActive} label="Trabajadores">
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isEmployeesActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                    onClick={onGoEmployees}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className={collapsed ? 'lg:hidden' : ''}>Trabajadores</span>
                  </button>
                </SidebarTooltipComponent>
              )}

              {showContracts && (
                <SidebarTooltipComponent enabled={collapsed} active={isContractsActive} label="Contratos">
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isContractsActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                    onClick={onGoContracts}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3h8l5 5v13H3V3z" />
                      <path d="M16 3v5h5" />
                      <path d="M8 13h8" />
                      <path d="M8 17h8" />
                    </svg>
                    <span className={collapsed ? 'lg:hidden' : ''}>Contratos</span>
                  </button>
                </SidebarTooltipComponent>
              )}

              {showSettlements && (
                <>
                  <SidebarTooltipComponent enabled={collapsed} active={isSettlementsActive} label="Finiquito">
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isSettlementsActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                      onClick={onGoSettlements}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 5h16v14H4z" />
                        <path d="M8 9h8" />
                        <path d="M8 13h8" />
                        <path d="M8 17h5" />
                      </svg>
                      <span className={collapsed ? 'lg:hidden' : ''}>Finiquito</span>
                    </button>
                  </SidebarTooltipComponent>

                  <div className={`${collapsed ? 'space-y-1' : 'ml-7 space-y-1'}`}>
                    <SidebarTooltipComponent enabled={collapsed} active={isSettlementsTerminationCausesActive} label="Terminacion">
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isSettlementsTerminationCausesActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                        onClick={onGoSettlementsTerminationCauses}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 12h12" />
                          <path d="M12 6v12" />
                        </svg>
                        <span className={collapsed ? 'lg:hidden' : ''}>Terminacion</span>
                      </button>
                    </SidebarTooltipComponent>

                    <SidebarTooltipComponent enabled={collapsed} active={isSettlementsWorkQualityActive} label="Calidad del trabajo">
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isSettlementsWorkQualityActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                        onClick={onGoSettlementsWorkQuality}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3 7h7l-5.5 4.5L18.5 22 12 17.8 5.5 22l2-8.5L2 9h7z" />
                        </svg>
                        <span className={collapsed ? 'lg:hidden' : ''}>Calidad del trabajo</span>
                      </button>
                    </SidebarTooltipComponent>

                    <SidebarTooltipComponent enabled={collapsed} active={isSettlementsSafetyComplianceActive} label="Seguridad">
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isSettlementsSafetyComplianceActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                        onClick={onGoSettlementsSafetyCompliance}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                        <span className={collapsed ? 'lg:hidden' : ''}>Seguridad</span>
                      </button>
                    </SidebarTooltipComponent>

                    <SidebarTooltipComponent enabled={collapsed} active={isSettlementsNoRehireCauseActive} label="No recontratacion">
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isSettlementsNoRehireCauseActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                        onClick={onGoSettlementsNoRehireCause}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M8 8l8 8" />
                        </svg>
                        <span className={collapsed ? 'lg:hidden' : ''}>No recontratacion</span>
                      </button>
                    </SidebarTooltipComponent>

                    <SidebarTooltipComponent enabled={collapsed} active={isSettlementsTerminationQuizQuestionActive} label="Quiz de salida">
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isSettlementsTerminationQuizQuestionActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                        onClick={onGoSettlementsTerminationQuizQuestion}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                          <rect x="9" y="3" width="6" height="4" rx="1" />
                          <path d="M9 12h6M9 16h4" />
                        </svg>
                        <span className={collapsed ? 'lg:hidden' : ''}>Quiz de salida</span>
                      </button>
                    </SidebarTooltipComponent>
                  </div>
                </>
              )}
            </section>
          )}

          {hasRrhhItems && (hasProjectsItems || hasAdministrationItems) && (
            <hr className={`border-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 ${collapsed ? 'my-1 h-px lg:mx-2' : 'my-2 h-px'}`} />
          )}

          {hasProjectsItems && (
            <section className={`rounded-xl border border-slate-200/80 bg-slate-50/60 p-2 dark:border-white/10 dark:bg-slate-800/30 ${collapsed ? 'lg:border-transparent lg:bg-transparent lg:p-0' : ''}`}>
              <p className={`px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>
                Proyectos
              </p>

              {showProjects && (
                <SidebarTooltipComponent enabled={collapsed} active={isProjectsActive} label="Proyectos">
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isProjectsActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                    onClick={onGoProjects}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    <span className={collapsed ? 'lg:hidden' : ''}>Proyectos</span>
                  </button>
                </SidebarTooltipComponent>
              )}

              <div className={`${collapsed ? 'space-y-1' : 'ml-7 space-y-1'}`}>
                {showProjectTypes && (
                  <SidebarTooltipComponent enabled={collapsed} active={isProjectTypesActive} label="Tipos">
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isProjectTypesActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                      onClick={onGoProjectTypes}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 7h16" />
                        <path d="M4 12h16" />
                        <path d="M4 17h16" />
                      </svg>
                      <span className={collapsed ? 'lg:hidden' : ''}>Tipos</span>
                    </button>
                  </SidebarTooltipComponent>
                )}

                {showProjectSpecialties && (
                  <SidebarTooltipComponent enabled={collapsed} active={isProjectSpecialtiesActive} label="Especialidades">
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isProjectSpecialtiesActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                      onClick={onGoProjectSpecialties}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16" />
                        <path d="M4 12h16" />
                        <path d="M4 18h16" />
                        <path d="M9 3v18" />
                      </svg>
                      <span className={collapsed ? 'lg:hidden' : ''}>Especialidades</span>
                    </button>
                  </SidebarTooltipComponent>
                )}

                {showProjectStatuses && (
                  <SidebarTooltipComponent enabled={collapsed} active={isProjectStatusesActive} label="Vigencia">
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isProjectStatusesActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                      onClick={onGoProjectStatuses}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v6" />
                        <path d="M12 16v6" />
                        <path d="M4.93 4.93l4.24 4.24" />
                        <path d="M14.83 14.83l4.24 4.24" />
                        <path d="M2 12h6" />
                        <path d="M16 12h6" />
                        <path d="M4.93 19.07l4.24-4.24" />
                        <path d="M14.83 9.17l4.24-4.24" />
                      </svg>
                      <span className={collapsed ? 'lg:hidden' : ''}>Vigencia</span>
                    </button>
                  </SidebarTooltipComponent>
                )}
              </div>
            </section>
          )}

          {hasProjectsItems && hasAdministrationItems && (
            <hr className={`border-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700 ${collapsed ? 'my-1 h-px lg:mx-2' : 'my-2 h-px'}`} />
          )}

          {hasAdministrationItems && (
            <section className={`rounded-xl border border-slate-200/80 bg-slate-50/60 p-2 dark:border-white/10 dark:bg-slate-800/30 ${collapsed ? 'lg:border-transparent lg:bg-transparent lg:p-0' : ''}`}>
              <p className={`px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>
                Administracion
              </p>

              {showUsers && (
                <SidebarTooltipComponent enabled={collapsed} active={isUsersActive} label="Usuarios">
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isUsersActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                    onClick={onGoUsers}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className={collapsed ? 'lg:hidden' : ''}>Usuarios</span>
                  </button>
                </SidebarTooltipComponent>
              )}

              {showRoles && (
                <SidebarTooltipComponent enabled={collapsed} active={isRolesActive} label="Roles">
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${getItemClasses(isRolesActive)} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
                    onClick={onGoRoles}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                    <span className={collapsed ? 'lg:hidden' : ''}>Roles</span>
                  </button>
                </SidebarTooltipComponent>
              )}
            </section>
          )}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4 dark:border-white/10">
          <SidebarTooltipComponent enabled={collapsed} label="Salir">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg bg-rose-600 px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
              onClick={onGoLogout}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              <span className={collapsed ? 'lg:hidden' : ''}>Salir</span>
            </button>
          </SidebarTooltipComponent>
        </div>
      </aside>
    </div>
  )
}
