import { useNavigate } from 'react-router-dom'
import {
  DashboardFocusPanelComponent,
  DashboardHeroComponent,
  DashboardModulesGridComponent,
  DashboardSummaryCardsComponent,
  dashboardModules,
} from '@/components'
import { AUTH_ROUTE_SETTINGS, PermissionAction } from '@/constant'
import { useStoreAuth } from '@/store'
import { useHasPermissionFn } from '@/hooks'

const RRHH_MODULE_LABELS = ['Solicitudes', 'Trabajadores', 'Contratos', 'Permisos', 'Asistencia', 'Horas extras', 'Anexos', 'Traspasos', 'Finiquitos']
const ADMIN_MODULE_LABELS = ['Usuarios', 'Roles']

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useStoreAuth((s) => s.user)
  const permissions = useStoreAuth((s) => s.permissions)
  const hasPermission = useHasPermissionFn()

  const visibleModules = dashboardModules.filter((item) => item.permissionModules.some((module) => hasPermission(module, PermissionAction.Read)))
  const rrhhModules = visibleModules.filter((item) => RRHH_MODULE_LABELS.includes(item.label))
  const adminModules = visibleModules.filter((item) => ADMIN_MODULE_LABELS.includes(item.label))
  const projectModules = visibleModules.filter((item) => item.label === 'Proyectos')
  const roleCount = user?.roles.length ?? 0
  const permissionCount = permissions.length + (user?.permissions?.length ?? 0)
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.username || 'Usuario'
  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'VS'
  const primaryRoute = visibleModules[0]?.route ?? AUTH_ROUTE_SETTINGS

  return (
    <section className="min-w-0 space-y-5">
      <header className="border-b border-slate-200 pb-5 dark:border-white/10">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span className="num">PANEL · VELOCITY SUITE</span>
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50">
          Dashboard
          <span className="display-it text-slate-500 dark:text-slate-400"> operativo</span>
        </h1>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <DashboardHeroComponent
          userName={userName}
          userInitials={userInitials}
          visibleModulesCount={visibleModules.length}
          permissionCount={permissionCount}
          roleCount={roleCount}
          rrhhModulesCount={rrhhModules.length}
          projectModulesCount={projectModules.length}
          adminModulesCount={adminModules.length}
          primaryRoute={primaryRoute}
          onNavigate={navigate}
        />
        <DashboardFocusPanelComponent hasModules={visibleModules.length > 0} />
      </section>

      <DashboardSummaryCardsComponent
        visibleModulesCount={visibleModules.length}
        rrhhModulesCount={rrhhModules.length}
        adminModulesCount={adminModules.length}
      />

      <DashboardModulesGridComponent modules={visibleModules} onNavigate={navigate} />
    </section>
  )
}
