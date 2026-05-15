import type { NotificationItem, NotificationVariant } from '@/types'

export const findNotificationById = (
  items: NotificationItem[],
  id: string,
  mapper: (item: NotificationItem) => NotificationItem,
): NotificationItem[] => {
  return items.map((item) => {
    if (item.id !== id) return item
    return mapper(item)
  })
}

export const updateNotificationsByIds = (
  items: NotificationItem[],
  ids: string[],
  mapper: (item: NotificationItem) => NotificationItem,
): NotificationItem[] => {
  return items.map((item) => {
    if (!ids.includes(item.id)) return item
    return mapper(item)
  })
}

export const getNotificationIds = (items: NotificationItem[]): string[] => {
  return items.map((item) => item.id)
}

export const convertIdToNumber = (id: string): number | null => {
  const numericId = Number.parseInt(id, 10)
  if (!Number.isInteger(numericId) || numericId <= 0) return null
  return numericId
}

export function normalizeVariant(value: unknown): NotificationVariant {
  const normalized = typeof value === 'string' ? value.toLowerCase() : 'info'
  if (normalized === 'success' || normalized === 'warning' || normalized === 'error') return normalized
  return 'info'
}
