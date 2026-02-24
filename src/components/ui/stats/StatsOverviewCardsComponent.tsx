interface StatsOverviewCardsComponentProps {
  totalLabel: string
  activeLabel: string
  total: number
  active: number
}

function formatCounter(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0'
  return value.toLocaleString('es-CL')
}

export default function StatsOverviewCardsComponent({
  totalLabel,
  activeLabel,
  total,
  active,
}: StatsOverviewCardsComponentProps) {
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0
  const safeActive = Number.isFinite(active) && active > 0 ? Math.min(active, safeTotal || active) : 0
  const activeRatio = safeTotal > 0 ? Math.round((safeActive / safeTotal) * 100) : 0

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <article className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-100 to-white p-5 shadow-sm dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-900/60">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-300/20 blur-xl dark:bg-cyan-400/20" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">{totalLabel}</p>
        <p className="mt-3 text-3xl font-bold leading-none">{formatCounter(safeTotal)}</p>
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">Registros totales disponibles en el listado.</p>
      </article>

      <article className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-cyan-50 p-5 shadow-sm dark:border-emerald-400/20 dark:from-emerald-900/20 dark:to-cyan-900/10">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-emerald-300/25 blur-2xl dark:bg-emerald-400/25" />
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">{activeLabel}</p>
        <div className="mt-3 flex items-center gap-2">
          <p className="text-3xl font-bold leading-none text-emerald-700 dark:text-emerald-300">{formatCounter(safeActive)}</p>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-800/60 dark:text-emerald-200">
            {activeRatio}%
          </span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-emerald-200/60 dark:bg-emerald-950/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
            style={{ width: `${Math.max(0, Math.min(activeRatio, 100))}%` }}
          />
        </div>
      </article>
    </section>
  )
}
