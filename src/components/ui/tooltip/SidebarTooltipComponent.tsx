import type { ReactNode } from 'react'

interface SidebarTooltipComponentProps {
  enabled: boolean
  active?: boolean
  label: string
  children: ReactNode
}

export default function SidebarTooltipComponent({
  enabled,
  active = false,
  label,
  children,
}: SidebarTooltipComponentProps) {
  if (!enabled || active) return <>{children}</>

  return (
    <div className="group relative">
      {children}
      <span
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 lg:inline-flex"
      >
        {label}
      </span>
    </div>
  )
}
