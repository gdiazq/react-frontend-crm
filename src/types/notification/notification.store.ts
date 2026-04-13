import type {
  NotificationConnectionStatus,
  NotificationCountResponse,
  NotificationItem,
} from './notification'

export interface NotificationStore {
  connectedUserId: number | null
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
  markAllAsRead: () => Promise<void>
  archiveNotification: (payload: NotificationItem) => Promise<void>
  markAsRead: (payload: NotificationItem) => Promise<void>
  markAsNotRead: (payload: NotificationItem) => void
  clearNotifications: () => void
  disconnect: () => void
  connect: (userId: number) => Promise<void>
}
