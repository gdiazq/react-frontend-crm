interface ContractTypeBadgeComponentProps {
  contractType: string
}

function normalizeValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function resolveTypeClass(contractType: string): string {
  const normalized = normalizeValue(contractType)

  if (normalized.includes('indefinido')) {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  }
  if (normalized.includes('plazo') || normalized.includes('temporal')) {
    return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
  }
  if (normalized.includes('obra') || normalized.includes('faena')) {
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  }

  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

export default function ContractTypeBadgeComponent({
  contractType,
}: ContractTypeBadgeComponentProps) {
  const label = contractType.trim().length > 0 ? contractType : 'Sin tipo'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${resolveTypeClass(label)}`}>
      {label}
    </span>
  )
}
