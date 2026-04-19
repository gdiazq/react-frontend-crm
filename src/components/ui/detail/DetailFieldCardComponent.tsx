import type { ReactNode } from 'react'

interface DetailFieldCardComponentProps {
  title: string
  value: ReactNode
  mono?: boolean
  className?: string
  valueClassName?: string
}

export function DetailFieldCardComponent({
  title,
  value,
  mono = false,
  className = '',
  valueClassName = '',
}: DetailFieldCardComponentProps) {
  const resolvedValue = value === null || value === undefined || value === '' ? '—' : value

  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-slate-100 py-2 dark:border-white/5 ${className}`.trim()}
    >
      <span className="shrink-0 text-[11px] uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
        {title}
      </span>
      <span
        className={`min-w-0 text-right text-[13px] text-slate-800 dark:text-slate-100 ${mono ? 'num' : 'font-medium'} ${valueClassName}`.trim()}
      >
        {resolvedValue}
      </span>
    </div>
  )
}
