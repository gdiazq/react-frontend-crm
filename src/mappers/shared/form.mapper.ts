export function parseRequiredNumber(value: string): number {
  const parsed = Number(value.trim())
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0
}

export function parseNullableId(value: string): number | null {
  const normalized = value.trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export function parseNullableNumber(value: string): number | null {
  const normalized = value.trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function parseNullableString(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

export function normalizeDateValue(value?: string | null): string {
  const normalized = (value ?? '').trim()
  return normalized.length >= 10 ? normalized.slice(0, 10) : normalized
}

