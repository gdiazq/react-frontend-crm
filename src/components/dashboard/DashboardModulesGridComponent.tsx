import type { DashboardModule } from './dashboard.types'

interface DashboardModulesGridComponentProps {
  modules: DashboardModule[]
  onNavigate: (route: string) => void
}

export function DashboardModulesGridComponent({ modules, onNavigate }: DashboardModulesGridComponentProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="num text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Accesos</p>
          <h2 className="display mt-2 text-[28px] leading-none text-slate-900 dark:text-slate-50">
            Módulos
            <span className="display-it text-slate-500 dark:text-slate-400"> principales</span>
          </h2>
        </div>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-400">
          No hay módulos de lectura asignados a tu perfil. Si esto no corresponde, revisa roles y permisos.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.route)}
              className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-white/20"
            >
              <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
              <div className="flex items-start justify-between gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${item.accent}`}>
                  {item.icon}
                </span>
                <span className="num text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  {item.eyebrow}
                </span>
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-slate-900 dark:text-slate-50">{item.label}</h3>
              <p className="mt-2 min-h-[60px] text-[12.5px] leading-5 text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
              <span className="mt-4 inline-flex text-[12px] font-semibold text-slate-700 transition group-hover:translate-x-1 dark:text-slate-200">
                Entrar al módulo
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
