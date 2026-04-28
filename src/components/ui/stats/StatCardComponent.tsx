import type { ReactNode } from 'react'
import { DetailBadgeComponent, type DetailBadgeTone } from '../detail/DetailBadgeComponent'

interface StatCardComponentProps {
  number: string
  eyebrow: string
  value: ReactNode
  ratio?: number
  ratioTone?: DetailBadgeTone
  accentClass?: string
  surfaceClass?: string
  glowClass?: string
  valueClass?: string
  className?: string
}

export function StatCardComponent({
  number,
  eyebrow,
  value,
  ratio,
  ratioTone = 'accent',
  accentClass = 'accent-bg',
  surfaceClass = 'bg-white dark:bg-slate-900/50',
  glowClass = 'bg-slate-200/60 dark:bg-white/10',
  valueClass = 'from-slate-950 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-300',
  className = '',
}: StatCardComponentProps) {
  const showRatio = typeof ratio === 'number'
  const progress = showRatio ? Math.max(0, Math.min(100, ratio)) : null

  return (
    <article
      className={`soft-ring r-lg group relative overflow-hidden border border-slate-200 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.55)] dark:border-white/10 dark:hover:shadow-[0_18px_45px_-28px_rgba(0,0,0,0.75)] ${surfaceClass} ${className}`.trim()}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition duration-300 group-hover:scale-110 ${glowClass}`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"
      />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5 text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          <span className="num accent-text block">{number}</span>
          <span className="block truncate">{eyebrow}</span>
        </div>
        <p
          className={`display shrink-0 bg-gradient-to-br bg-clip-text text-right text-[38px] leading-none text-transparent drop-shadow-[0_1px_0_rgba(255,255,255,0.75)] transition duration-300 group-hover:scale-[1.03] dark:drop-shadow-[0_1px_10px_rgba(255,255,255,0.08)] ${valueClass}`.trim()}
        >
          {value}
        </p>
      </div>
      <div className="relative z-10 flex min-h-6 items-center justify-start gap-3">
        {showRatio && (
          <DetailBadgeComponent tone={ratioTone} dot>
            <span className="num">{ratio}%</span>
          </DetailBadgeComponent>
        )}
      </div>
      {progress !== null && (
        <div className="r-full relative z-10 h-1 w-full overflow-hidden bg-white/70 shadow-inner shadow-slate-200/60 dark:bg-slate-950/40 dark:shadow-black/20">
          <div className={`h-full transition-all ${accentClass}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </article>
  )
}
