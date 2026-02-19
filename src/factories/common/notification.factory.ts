import type { NotificationConnectionStatus, NotificationCountResponse, NotificationItem } from '@/types'

export const initialCounterNotification: NotificationCountResponse = {
  totalInbox: 0,
  totalUnread: 0,
  totalArchived: 0,
}

export const initialNotifications: NotificationItem[] = []

export const initialTabNotification = 1

export const initialStatusNotification: NotificationConnectionStatus = 'idle'

export const initialErrorMessageNotification: string | null = null

export const initialLoadingNotification = false
