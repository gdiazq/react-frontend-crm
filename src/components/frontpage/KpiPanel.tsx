import type { CrmStat, CrmStage } from '@/types'

interface KpiPanelProps {
  stats: CrmStat[]
  stages: CrmStage[]
}

export function KpiPanel({ stats, stages }: KpiPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-[calc(1.75rem*var(--radius-scale))] border border-slate-200 bg-white/85 p-4 shadow-2xl shadow-cyan-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/30 sm:p-5">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-300/12" />
      <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-300/10" />

      <div className="relative rounded-[calc(1.35rem*var(--radius-scale))] border border-slate-200 bg-slate-950 p-5 text-white dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="num text-[10px] uppercase tracking-[0.2em] text-cyan-200/80">Panel operacional</p>
            <h2 className="display mt-3 text-[34px] leading-none">
              Vista
              <span className="display-it text-cyan-200"> unificada</span>
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="r-xl border border-white/10 bg-white/7 p-3">
              <p className="text-[11px] text-slate-300">{stat.label}</p>
              <p className="display mt-2 text-[30px] leading-none text-white">{stat.value}</p>
              <p className={`mt-2 text-[11px] font-semibold ${stat.trendClass}`}>{stat.trend}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="relative mt-4 rounded-[calc(1.35rem*var(--radius-scale))] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/80">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Flujo de gestion</p>
          <span className="num text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Operacion</span>
        </div>
        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.label} className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-3">
              <span className="truncate text-xs text-slate-500 dark:text-slate-400">{stage.label}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className={`h-full rounded-full ${stage.barClass}`} style={{ width: stage.width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
