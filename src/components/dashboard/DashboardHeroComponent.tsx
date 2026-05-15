import { AUTH_ROUTE_SETTINGS } from '@/constant'
import { formatDashboardCounter } from '@/utils'

interface DashboardHeroComponentProps {
  userName: string
  userInitials: string
  visibleModulesCount: number
  permissionCount: number
  roleCount: number
  rrhhModulesCount: number
  projectModulesCount: number
  adminModulesCount: number
  onNavigate: (route: string) => void
  primaryRoute: string
}

export function DashboardHeroComponent({
  userName,
  userInitials,
  visibleModulesCount,
  permissionCount,
  roleCount,
  rrhhModulesCount,
  projectModulesCount,
  adminModulesCount,
  onNavigate,
  primaryRoute,
}: DashboardHeroComponentProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-400/10" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-400/10" />
      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Sesión activa</p>
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">{userName}</p>
            </div>
          </div>

          <h2 className="display mt-8 max-w-2xl text-[46px] leading-[0.98] text-slate-950 dark:text-white">
            Gestiona personas,
            <span className="display-it text-slate-500 dark:text-slate-400"> contratos y operación</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Un punto de entrada para moverte entre RRHH, proyectos, permisos y administración sin perder el contexto del sistema.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate(primaryRoute)}
              className="inline-flex h-10 items-center rounded-full bg-slate-950 px-4 text-[12.5px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Abrir primer módulo
            </button>
            <button
              type="button"
              onClick={() => onNavigate(AUTH_ROUTE_SETTINGS)}
              className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-[12.5px] font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Configuración
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
          <p className="num text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Cobertura</p>
          <p className="display mt-3 text-[54px] leading-none text-slate-950 dark:text-white">
            {formatDashboardCounter(visibleModulesCount)}
          </p>
          <p className="mt-2 text-[12px] leading-5 text-slate-500 dark:text-slate-400">
            módulos disponibles para tu perfil actual, con {formatDashboardCounter(permissionCount)} permisos y {formatDashboardCounter(roleCount)} roles.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <DashboardMiniMetric label="RRHH" value={rrhhModulesCount} />
            <DashboardMiniMetric label="Proyecto" value={projectModulesCount} />
            <DashboardMiniMetric label="Admin" value={adminModulesCount} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardMiniMetric({ label, value }: { label: string, value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900">
      <p className="num text-[16px] leading-none text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}
