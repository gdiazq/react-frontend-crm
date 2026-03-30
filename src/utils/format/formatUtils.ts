export const formatDateTime = (value?: string, fallback = ''): string => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-CL')
}

export const formatDate = (value?: string, fallback = ''): string => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-CL')
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CL').format(value)
}

export function formatVariationLabel(variation: number): string {
  const absoluteValue = Math.abs(variation)
  const sign = variation >= 0 ? '+' : '-'
  return `${sign}${absoluteValue}% vs mes anterior`
}
