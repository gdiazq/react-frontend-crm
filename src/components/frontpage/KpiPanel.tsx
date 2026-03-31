import type { CrmStat, CrmStage } from '@/types'

interface KpiPanelProps {
  stats: CrmStat[]
  stages: CrmStage[]
}

export function KpiPanel({ stats, stages }: KpiPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
      {stats.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              <p className={`mt-1 text-xs ${stat.trendClass}`}>{stat.trend}</p>
            </article>
          ))}
        </div>
      ) : (
        <article className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 dark:border-white/20 dark:bg-slate-900 dark:text-slate-300">
          No hay metricas disponibles en este momento.
        </article>
      )}

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">Pipeline comercial</p>
          <span className="text-xs text-slate-500 dark:text-slate-400">Q1 2026</span>
        </div>
        {stages.length > 0 ? (
          <div className="space-y-3">
            {stages.map((stage) => (
              <div key={stage.label} className="flex items-center gap-3">
                <span className="w-28 text-xs text-slate-500 dark:text-slate-400">{stage.label}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className={`h-2 rounded-full ${stage.barClass}`} style={{ width: stage.width }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">No hay etapas de pipeline configuradas.</p>
        )}
      </div>
    </div>
  )
}
