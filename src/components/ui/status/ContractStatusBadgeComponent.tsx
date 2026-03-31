interface ContractStatusBadgeComponentProps {
  contractStatus: string
}

function normalizeValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function resolveStatusClass(contractStatus: string): string {
  const normalized = normalizeValue(contractStatus)

  if (normalized.includes('vigente') || normalized.includes('activo')) {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  }
  if (normalized.includes('pendiente')) {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  }
  if (normalized.includes('suspendido')) {
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
  if (
    normalized.includes('vencido')
    || normalized.includes('finalizado')
    || normalized.includes('terminado')
    || normalized.includes('anulado')
    || normalized.includes('rechazado')
  ) {
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  }

  return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
}

export function ContractStatusBadgeComponent({
  contractStatus,
}: ContractStatusBadgeComponentProps) {
  const label = contractStatus.trim().length > 0 ? contractStatus : 'Sin estado'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${resolveStatusClass(label)}`}>
      {label}
    </span>
  )
}
