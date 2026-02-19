import type { NotificationItem } from '@/types'

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

export const getInboxNotificationIds = (items: NotificationItem[]): string[] => {
  return items.filter((item) => item.inbox).map((item) => item.id)
}

export const getNotificationIds = (items: NotificationItem[]): string[] => {
  return items.map((item) => item.id)
}

export const convertIdsToNumbers = (ids: string[]): number[] => {
  return ids
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isInteger(id) && id > 0)
}

export const convertIdToNumber = (id: string): number | null => {
  const numericId = Number.parseInt(id, 10)
  if (!Number.isInteger(numericId) || numericId <= 0) return null
  return numericId
}
