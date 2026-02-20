import type {
  NotificationConnectionStatus,
  NotificationCountResponse,
  NotificationItem,
} from './notification.interface'

export interface NotificationStore {
  counter: NotificationCountResponse
  notifications: NotificationItem[]
  tab: number
  status: NotificationConnectionStatus
  errorMessage: string | null
  loadingNotifications: boolean
  captureTab: (tab: number) => void
  pushNotification: (item: NotificationItem) => void
  getNotifications: (type?: '' | 'unread' | 'archived', page?: number, size?: number) => Promise<void>
  getCounter: () => Promise<void>
  mutationMarkAllAsRead: () => Promise<void>
  mutationArchiveNotification: (payload: NotificationItem) => Promise<void>
  mutationMarkAsRead: (payload: NotificationItem) => Promise<void>
  mutationMarkAsNotRead: (payload: NotificationItem) => void
  clearNotifications: () => void
  disconnect: () => void
  connect: (userId: number) => Promise<void>
}
