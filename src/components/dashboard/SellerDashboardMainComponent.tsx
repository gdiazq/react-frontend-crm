import type { DashboardExampleKpi, DashboardExamplePipelineStage } from '@/types'

interface SellerDashboardMainComponentProps {
  kpis: DashboardExampleKpi[]
  pipeline: DashboardExamplePipelineStage[]
  periodLabel: string
}

export function SellerDashboardMainComponent({
  kpis,
  pipeline,
  periodLabel,
}: SellerDashboardMainComponentProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
          Resumen Comercial
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{periodLabel}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {kpis.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/50"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold">{item.displayValue}</p>
              <p
                className={`mt-1 text-xs font-semibold ${
                  item.variationPositive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {item.variationLabel}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="text-lg font-semibold">Pipeline de Ventas</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pipeline.map((stage) => (
            <article key={stage.id} className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <p className="text-sm font-semibold">{stage.label}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{stage.countLabel}</p>
              <p className="text-base font-bold text-cyan-700 dark:text-cyan-300">{stage.amountLabel}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
