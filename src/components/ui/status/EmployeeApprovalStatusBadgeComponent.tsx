interface EmployeeApprovalStatusBadgeComponentProps {
  statusName: string
}

function normalizeStatusName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function resolveStatusClass(statusName: string): string {
  const normalized = normalizeStatusName(statusName)

  if (normalized === 'pendiente de aprobacion') {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  }
  if (normalized === 'pendiente de revision') {
    return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
  }
  if (normalized === 'aprobado') {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  }
  if (normalized === 'rechazado') {
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  }
  if (normalized === 'error de sincronizacion') {
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
  }

  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

export function EmployeeApprovalStatusBadgeComponent({
  statusName,
}: EmployeeApprovalStatusBadgeComponentProps) {
  const label = statusName.trim().length > 0 ? statusName : 'Sin estado'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${resolveStatusClass(label)}`}>
      {label}
    </span>
  )
}
