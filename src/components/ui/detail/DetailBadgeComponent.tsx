import type { ReactNode } from 'react'

export type DetailBadgeTone = 'neutral' | 'ok' | 'warn' | 'bad' | 'accent'

interface DetailBadgeComponentProps {
  tone?: DetailBadgeTone
  dot?: boolean
  children: ReactNode
  className?: string
}

const TONE_CLASSES: Record<DetailBadgeTone, string> = {
  neutral: 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800',
  ok: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30',
  warn: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/30',
  bad: 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-900/30',
  accent: 'accent-text accent-bg-soft',
}

const DOT_CLASSES: Record<DetailBadgeTone, string> = {
  neutral: 'bg-slate-400',
  ok: 'bg-emerald-500',
  warn: 'bg-amber-500',
  bad: 'bg-rose-500',
  accent: 'bg-[var(--accent-500)]',
}

export function DetailBadgeComponent({
  tone = 'neutral',
  dot = false,
  children,
  className = '',
}: DetailBadgeComponentProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 r-full px-2 py-0.5 text-[11px] font-medium ${TONE_CLASSES[tone]} ${className}`.trim()}
    >
      {dot && <span className={`h-1.5 w-1.5 r-full ${DOT_CLASSES[tone]}`} />}
      {children}
    </span>
  )
}
