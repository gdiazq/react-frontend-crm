import type { NotificationVariant } from '@/types'

export function normalizeVariant(value: unknown): NotificationVariant {
  const normalized = typeof value === 'string' ? value.toLowerCase() : 'info'
  if (normalized === 'success' || normalized === 'warning' || normalized === 'error') return normalized
  return 'info'
}
