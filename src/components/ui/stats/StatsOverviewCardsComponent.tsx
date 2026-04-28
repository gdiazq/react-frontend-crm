import { StatCardComponent } from './StatCardComponent'

interface StatsOverviewCardsComponentProps {
  totalLabel: string
  activeLabel: string
  total: number
  active: number
  pendingLabel?: string
  pending?: number
  showRatios?: boolean
}

function formatCounter(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0'
  return value.toLocaleString('es-CL')
}

export function StatsOverviewCardsComponent({
  totalLabel,
  activeLabel,
  total,
  active,
  pendingLabel,
  pending,
  showRatios = true,
}: StatsOverviewCardsComponentProps) {
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0
  const safeActive = Number.isFinite(active) && active > 0 ? Math.min(active, safeTotal || active) : 0
  const safePending = Number.isFinite(pending) && pending && pending > 0 ? Math.min(pending, safeTotal || pending) : 0
  const activeRatio = safeTotal > 0 ? Math.round((safeActive / safeTotal) * 100) : 0
  const pendingRatio = safeTotal > 0 ? Math.round((safePending / safeTotal) * 100) : 0
  const showPendingCard = typeof pending === 'number' && typeof pendingLabel === 'string' && pendingLabel.length > 0

  return (
    <section className={`grid gap-4 ${showPendingCard ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2'}`}>
      <StatCardComponent
        number="01"
        eyebrow={totalLabel}
        value={formatCounter(safeTotal)}
        surfaceClass="border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 dark:border-sky-400/10 dark:from-sky-400/10 dark:via-slate-900/70 dark:to-cyan-400/10"
        glowClass="bg-sky-300/35 dark:bg-sky-400/20"
        valueClass="from-sky-950 via-sky-700 to-cyan-500 dark:from-sky-50 dark:via-sky-200 dark:to-cyan-300"
      />
      <StatCardComponent
        number="02"
        eyebrow={activeLabel}
        value={formatCounter(safeActive)}
        ratio={showRatios ? activeRatio : undefined}
        ratioTone="ok"
        accentClass="bg-emerald-500 dark:bg-emerald-400"
        surfaceClass="border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50/80 dark:border-emerald-400/10 dark:from-emerald-400/10 dark:via-slate-900/70 dark:to-lime-400/10"
        glowClass="bg-emerald-300/35 dark:bg-emerald-400/20"
        valueClass="from-emerald-950 via-emerald-700 to-lime-500 dark:from-emerald-50 dark:via-emerald-200 dark:to-lime-300"
      />
      {showPendingCard && (
        <StatCardComponent
          number="03"
          eyebrow={pendingLabel!}
          value={formatCounter(safePending)}
          ratio={showRatios ? pendingRatio : undefined}
          ratioTone="warn"
          accentClass="bg-amber-500 dark:bg-amber-400"
          surfaceClass="border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 dark:border-amber-400/10 dark:from-amber-400/10 dark:via-slate-900/70 dark:to-orange-400/10"
          glowClass="bg-amber-300/40 dark:bg-amber-400/20"
          valueClass="from-amber-950 via-amber-700 to-orange-500 dark:from-amber-50 dark:via-amber-200 dark:to-orange-300"
        />
      )}
    </section>
  )
}
