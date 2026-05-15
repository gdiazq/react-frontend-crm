export function parseTimeInput(value: string): string | null {
  const normalized = value.trim()
  if (!normalized) return null

  const hourOnlyMatch = normalized.match(/^(\d{1,2})$/)
  if (hourOnlyMatch) {
    const hour = Number(hourOnlyMatch[1])
    if (hour >= 0 && hour <= 23) return `${String(hour).padStart(2, '0')}:00`
    return null
  }

  const compactMatch = normalized.match(/^(\d{1,2})(\d{2})$/)
  if (compactMatch) {
    const hour = Number(compactMatch[1])
    const minute = Number(compactMatch[2])
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
    return null
  }

  const timeMatch = normalized.match(/^(\d{1,2}):(\d{1,2})$/)
  if (timeMatch) {
    const hour = Number(timeMatch[1])
    const minute = Number(timeMatch[2])
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
  }

  return null
}

export function normalizeTimeInput(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return parseTimeInput(trimmed) ?? trimmed
}
