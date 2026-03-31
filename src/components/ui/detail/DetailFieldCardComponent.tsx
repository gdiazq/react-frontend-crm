import type { ReactNode } from 'react'

interface DetailFieldCardComponentProps {
  title: string
  value: ReactNode
  className?: string
  valueClassName?: string
}

export function DetailFieldCardComponent({
  title,
  value,
  className = '',
  valueClassName = '',
}: DetailFieldCardComponentProps) {
  return (
    <div className={`rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-900/20 ${className}`.trim()}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</div>
      <div className={`mt-1 text-sm font-medium text-slate-900 dark:text-slate-100 ${valueClassName}`.trim()}>
        {value}
      </div>
    </div>
  )
}
