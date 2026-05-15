import type { DashboardSummaryTone } from '@/types'
import { formatDashboardCounter } from '@/utils'

interface DashboardSummaryCardsComponentProps {
  visibleModulesCount: number
  rrhhModulesCount: number
  adminModulesCount: number
}

export function DashboardSummaryCardsComponent({
  visibleModulesCount,
  rrhhModulesCount,
  adminModulesCount,
}: DashboardSummaryCardsComponentProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <DashboardSummaryCard number="01" label="Módulos disponibles" value={visibleModulesCount} tone="cyan" />
      <DashboardSummaryCard number="02" label="Flujos RRHH" value={rrhhModulesCount} tone="emerald" />
      <DashboardSummaryCard number="03" label="Administración" value={adminModulesCount} tone="amber" />
    </section>
  )
}

function DashboardSummaryCard({
  number,
  label,
  value,
  tone,
}: {
  number: string
  label: string
  value: number
  tone: DashboardSummaryTone
}) {
  const toneClasses = {
    cyan: 'from-cyan-50 via-white to-sky-50/80 text-cyan-700 dark:from-cyan-400/10 dark:via-slate-900 dark:to-sky-400/10 dark:text-cyan-300',
    emerald: 'from-emerald-50 via-white to-lime-50/80 text-emerald-700 dark:from-emerald-400/10 dark:via-slate-900 dark:to-lime-400/10 dark:text-emerald-300',
    amber: 'from-amber-50 via-white to-orange-50/80 text-amber-700 dark:from-amber-400/10 dark:via-slate-900 dark:to-orange-400/10 dark:text-amber-300',
  }

  return (
    <article className={`relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br p-4 shadow-sm dark:border-white/10 ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="num text-[10px] uppercase tracking-[0.16em] opacity-70">{number}</p>
        <p className="display text-[34px] leading-none text-slate-950 dark:text-white">{formatDashboardCounter(value)}</p>
      </div>
      <p className="mt-5 text-[13px] font-semibold text-slate-700 dark:text-slate-200">{label}</p>
    </article>
  )
}
