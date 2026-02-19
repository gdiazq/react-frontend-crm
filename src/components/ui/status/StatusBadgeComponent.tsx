interface StatusBadgeComponentProps {
  enabled: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export default function StatusBadgeComponent({
  enabled,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}: StatusBadgeComponentProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        enabled
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
      }`}
    >
      {enabled ? activeLabel : inactiveLabel}
    </span>
  )
}
