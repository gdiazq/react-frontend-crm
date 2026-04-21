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
      />
      <StatCardComponent
        number="02"
        eyebrow={activeLabel}
        value={formatCounter(safeActive)}
        ratio={showRatios ? activeRatio : undefined}
        ratioTone="ok"
        accentClass="bg-emerald-500 dark:bg-emerald-400"
      />
      {showPendingCard && (
        <StatCardComponent
          number="03"
          eyebrow={pendingLabel!}
          value={formatCounter(safePending)}
          ratio={showRatios ? pendingRatio : undefined}
          ratioTone="warn"
          accentClass="bg-amber-500 dark:bg-amber-400"
        />
      )}
    </section>
  )
}
