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
