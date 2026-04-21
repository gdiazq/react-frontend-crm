import type { ReactNode } from 'react'
import { DetailBadgeComponent, type DetailBadgeTone } from '../detail/DetailBadgeComponent'

interface StatCardComponentProps {
  number: string
  eyebrow: string
  value: ReactNode
  ratio?: number
  ratioTone?: DetailBadgeTone
  accentClass?: string
  className?: string
}

export function StatCardComponent({
  number,
  eyebrow,
  value,
  ratio,
  ratioTone = 'accent',
  accentClass = 'accent-bg',
  className = '',
}: StatCardComponentProps) {
  const showRatio = typeof ratio === 'number'
  const progress = showRatio ? Math.max(0, Math.min(100, ratio)) : null

  return (
    <article
      className={`soft-ring r-lg flex flex-col gap-3 border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/50 ${className}`.trim()}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
        <span className="num accent-text">{number}</span>
        <span>{eyebrow}</span>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="display text-[34px] leading-none text-slate-900 dark:text-slate-50">{value}</p>
        {showRatio && (
          <DetailBadgeComponent tone={ratioTone} dot>
            <span className="num">{ratio}%</span>
          </DetailBadgeComponent>
        )}
      </div>
      {progress !== null && (
        <div className="r-full h-1 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <div className={`h-full transition-all ${accentClass}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </article>
  )
}
