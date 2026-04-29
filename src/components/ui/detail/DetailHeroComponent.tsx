import type { ReactNode } from 'react'

export interface DetailHeroStat {
  label: string
  value: string | number
  unit?: string
  progress?: number
}

interface DetailHeroComponentProps {
  eyebrowLabel?: string
  eyebrowId?: string
  eyebrowStatus?: string
  displayName: string
  description?: ReactNode
  badges?: ReactNode
  stat?: DetailHeroStat
  actions?: ReactNode
}

export function DetailHeroComponent({
  eyebrowLabel,
  eyebrowId,
  eyebrowStatus,
  displayName,
  description,
  badges,
  stat,
  actions,
}: DetailHeroComponentProps) {
  const words = displayName.trim().split(/\s+/).filter(Boolean)
  const leading = words.slice(0, 2).join(' ')
  const trailing = words.slice(2).join(' ')

  const eyebrowParts: ReactNode[] = []
  if (eyebrowLabel) {
    eyebrowParts.push(
      <span key="label" className="num">
        {eyebrowLabel}
        {eyebrowId ? ` · ${eyebrowId}` : ''}
      </span>,
    )
  }
  if (eyebrowStatus) {
    eyebrowParts.push(<span key="divider" className="h-px w-6 bg-slate-300 dark:bg-slate-700" />)
    eyebrowParts.push(<span key="status">{eyebrowStatus}</span>)
  }

  const progressPct = stat?.progress != null ? Math.max(0, Math.min(100, stat.progress)) : null
  const titleTopMargin = eyebrowParts.length > 0 ? 'mt-3' : ''

  return (
    <header className="flex flex-col gap-5 pb-2 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 flex-1">
        {eyebrowParts.length > 0 && (
          <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {eyebrowParts}
          </div>
        )}
        <h1 className={`display text-[34px] leading-[1.05] text-slate-900 dark:text-slate-50 ${titleTopMargin}`.trim()}>
          {leading}
          {trailing && (
            <span className="display-it text-slate-500 dark:text-slate-400"> {trailing}</span>
          )}
        </h1>
        {description && (
          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
        {badges && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">{badges}</div>
        )}
      </div>

      {(stat || actions) && (
        <div className="flex flex-wrap items-start gap-3">
          {stat && (
            <div className="r-lg soft-ring min-w-[132px] border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900/50">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {stat.label}
              </p>
              <p className="display mt-1 text-[30px] leading-none text-slate-900 dark:text-slate-50">
                {stat.value}
                {stat.unit && (
                  <span className="ml-1 text-[15px] text-slate-500 dark:text-slate-400">{stat.unit}</span>
                )}
              </p>
              {progressPct !== null && (
                <div className="r-full mt-3 h-1 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div className="accent-bg h-full" style={{ width: `${progressPct}%` }} />
                </div>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
    </header>
  )
}
