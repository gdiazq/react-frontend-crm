import type { DashboardExampleActivity, DashboardExampleClient, DashboardExampleTask } from '@/types'

interface SellerDashboardSideComponentProps {
  tasks: DashboardExampleTask[]
  topClients: DashboardExampleClient[]
  recentActivity: DashboardExampleActivity[]
}

const priorityClass: Record<DashboardExampleTask['priority'], string> = {
  alta: 'text-rose-600 dark:text-rose-400',
  media: 'text-amber-600 dark:text-amber-400',
  baja: 'text-emerald-600 dark:text-emerald-400',
}

export function SellerDashboardSideComponent({
  tasks,
  topClients,
  recentActivity,
}: SellerDashboardSideComponentProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="text-lg font-semibold">Agenda del Dia</h3>
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <p className="text-sm font-semibold">{task.title}</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">{task.dueAtLabel}</p>
                <p className={`text-xs font-semibold uppercase ${priorityClass[task.priority]}`}>
                  {task.priority}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="text-lg font-semibold">Top Clientes</h3>
        <div className="mt-4 space-y-3">
          {topClients.map((client) => (
            <article key={client.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <p className="text-sm font-semibold">{client.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{client.company}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{client.amountLabel}</p>
                <p
                  className={`text-xs font-semibold uppercase ${
                    client.status === 'activo'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {client.status}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="text-lg font-semibold">Actividad Reciente</h3>
        <div className="mt-4 space-y-2">
          {recentActivity.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10">
              <p className="text-sm">{item.text}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.atLabel}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
