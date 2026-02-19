import type { IncomingNotificationPayload, NotificationApiItem, NotificationItem } from '@/types'
import { normalizeVariant } from '@/utils'

export function mapperNotification(item: NotificationApiItem): NotificationItem {
  return {
    id: String(item.id),
    title: item.title || 'Nueva notificacion',
    message: item.message || '',
    createdAt: item.createdAt,
    read: Boolean(item.read),
    inbox: !item.archived,
    variant: normalizeVariant(item.type),
  }
}

export function mapperNotificationFromPayload(
  payload: IncomingNotificationPayload,
  fallbackMessage: string,
): NotificationItem {
  const timestamp = new Date().toISOString()
  const id = payload.id ? String(payload.id) : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  return {
    id,
    title: payload.title || 'Nueva notificacion',
    message: payload.message || fallbackMessage,
    createdAt: payload.createdAt || timestamp,
    read: Boolean(payload.read),
    inbox: true,
    variant: normalizeVariant(payload.variant || payload.type),
  }
}

export function mapperMarkAsRead(item: NotificationItem): NotificationItem {
  return { ...item, read: true }
}

export function mapperMarkAsNotRead(item: NotificationItem): NotificationItem {
  return { ...item, read: false, inbox: true }
}

export function mapperArchiveNotification(item: NotificationItem): NotificationItem {
  return { ...item, read: true, inbox: false }
}
