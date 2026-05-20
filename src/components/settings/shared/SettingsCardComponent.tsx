import type { ReactNode } from 'react'

interface SettingsCardComponentProps {
  children: ReactNode
  className?: string
}

export function SettingsCardComponent({ children, className = '' }: SettingsCardComponentProps) {
  return (
    <section className={`r-2xl border border-slate-200 bg-white soft-ring dark:border-white/10 dark:bg-slate-950 ${className}`}>
      {children}
    </section>
  )
}
