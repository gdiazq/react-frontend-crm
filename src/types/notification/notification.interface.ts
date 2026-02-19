export type NotificationVariant = 'info' | 'success' | 'warning' | 'error'

export type NotificationConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'

export interface NotificationCountResponse {
  totalInbox: number
  totalUnread: number
  totalArchived: number
}

export interface NotificationApiItem {
  id: string | number
  userId: number
  title: string
  message: string
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'
  read: boolean
  archived: boolean
  createdAt: string
}

export interface NotificationPagedResponse {
  content: NotificationApiItem[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface IncomingNotificationPayload {
  id?: string | number
  title?: string
  message?: string
  createdAt?: string
  read?: boolean
  variant?: string
  type?: string
}

export interface NotificationPagedFilters {
  userId: number
  type?: '' | 'unread' | 'archived'
  page?: number
  size?: number
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  createdAt: string
  read: boolean
  inbox: boolean
  variant: NotificationVariant
}
