import { create } from 'zustand'
import { notificationService } from '@/services'
import {
  initialCounterNotification,
  initialErrorMessageNotification,
  initialLoadingNotification,
  initialNotifications,
  initialStatusNotification,
  initialTabNotification,
} from '@/factories'
import {
  mapperArchiveNotification,
  mapperMarkAsNotRead,
  mapperMarkAsRead,
  mapperNotification,
  mapperNotificationFromPayload,
} from '@/mappers'
import {
  findNotificationById,
  updateNotificationsByIds,
  getNotificationIds,
  convertIdToNumber,
} from '@/utils'
import messages from '@/messages/messages'
import type {
  IncomingNotificationPayload,
  NotificationItem,
  NotificationStore,
} from '@/types'

const MAX_NOTIFICATIONS = 50
const WS_RECONNECT_DELAY = 5_000
const WS_MAX_RECONNECT_ATTEMPTS = 10

let activeWebSocket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0

const clearReconnectTimer = () => {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

const isObjectRecord = (value: unknown) => typeof value === 'object' && value !== null

const getStringValue = (value: object, key: string) => {
  const property = Reflect.get(value, key)
  return typeof property === 'string' ? property : undefined
}

const getBooleanValue = (value: object, key: string) => {
  const property = Reflect.get(value, key)
  return typeof property === 'boolean' ? property : undefined
}

const getStringOrNumberValue = (value: object, key: string) => {
  const property = Reflect.get(value, key)
  if (typeof property === 'string' || typeof property === 'number') return property
  return undefined
}

const parseNotificationPayload = (raw: string): IncomingNotificationPayload | null => {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isObjectRecord(parsed)) return null

    const nested = Reflect.get(parsed, 'notification')
    if (isObjectRecord(nested)) {
      return {
        id: getStringOrNumberValue(nested, 'id'),
        title: getStringValue(nested, 'title'),
        message: getStringValue(nested, 'message'),
        createdAt: getStringValue(nested, 'createdAt'),
        read: getBooleanValue(nested, 'read'),
        variant: getStringValue(nested, 'variant'),
        type: getStringValue(nested, 'type'),
      }
    }

    return {
      id: getStringOrNumberValue(parsed, 'id'),
      title: getStringValue(parsed, 'title'),
      message: getStringValue(parsed, 'message'),
      createdAt: getStringValue(parsed, 'createdAt'),
      read: getBooleanValue(parsed, 'read'),
      variant: getStringValue(parsed, 'variant'),
      type: getStringValue(parsed, 'type'),
    }
  } catch {
    return null
  }
}

const resolveWsUrl = () => {
  const configuredUrl = import.meta.env.VITE_NOTIFICATIONS_WS_URL
  if (typeof configuredUrl === 'string') return configuredUrl.trim()
  return ''
}

const notificationTabFilters: Record<number, (item: NotificationItem) => boolean> = {
  1: (item) => item.inbox,
  2: (item) => !item.read && item.inbox,
  3: (item) => !item.inbox,
}

export const useStoreNotification = create<NotificationStore>()((set, get) => ({
  connectedUserId: null,
  counter: { ...initialCounterNotification },
  notifications: [...initialNotifications],
  tab: initialTabNotification,
  status: initialStatusNotification,
  errorMessage: initialErrorMessageNotification,
  loadingNotifications: initialLoadingNotification,

  captureTab: (tab: number) => set({ tab }),

  pushNotification: (item: NotificationItem) => {
    set((state) => ({
      notifications: [item, ...state.notifications].slice(0, MAX_NOTIFICATIONS),
    }))
  },

  getNotifications: async (type = '', page = 0, size = 20) => {
    const userId = get().connectedUserId
    if (!userId) return
    try {
      set({ loadingNotifications: true, errorMessage: null })
      const data = await notificationService.getNotifications(userId, type, page, size)
      set({ notifications: data.content.map(mapperNotification) })
    } catch {
      set({ errorMessage: messages.notification.status.errors.loadError })
    } finally {
      set({ loadingNotifications: false })
    }
  },

  getCounter: async () => {
    const userId = get().connectedUserId
    if (!userId) return
    try {
      const data = await notificationService.getCounter(userId)
      set({ counter: data })
    } catch {
      set({ errorMessage: messages.notification.status.errors.counterError })
    }
  },

  markAllAsRead: async () => {
    const userId = get().connectedUserId
    if (!userId) return
    try {
      await notificationService.markAllAsRead(userId)
      set((state) => ({
        notifications: updateNotificationsByIds(
          state.notifications,
          getNotificationIds(state.notifications),
          mapperMarkAsRead,
        ),
      }))
      await get().getCounter()
    } catch (error) {
      if (notificationService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.status.errors.markAllReadError })
        return
      }
      set({ errorMessage: messages.notification.status.errors.markAllReadError })
    }
  },

  archiveNotification: async (payload: NotificationItem) => {
    const userId = get().connectedUserId
    if (!userId) return
    const numericId = convertIdToNumber(payload.id)
    if (numericId === null) {
      set({ errorMessage: messages.notification.status.errors.invalidIdArchive })
      return
    }
    try {
      await notificationService.archiveNotifications(userId, [numericId])
      set((state) => ({
        notifications: findNotificationById(state.notifications, payload.id, mapperArchiveNotification),
      }))
      await get().getCounter()
    } catch (error) {
      if (notificationService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.status.errors.archiveOneError })
        return
      }
      set({ errorMessage: messages.notification.status.errors.archiveOneError })
    }
  },

  markAsRead: async (payload: NotificationItem) => {
    const userId = get().connectedUserId
    if (!userId) return
    const numericId = convertIdToNumber(payload.id)
    if (numericId === null) {
      set({ errorMessage: messages.notification.status.errors.invalidIdRead })
      return
    }
    try {
      await notificationService.markAsRead(userId, [numericId])
      set((state) => ({
        notifications: findNotificationById(state.notifications, payload.id, mapperMarkAsRead),
      }))
      await get().getCounter()
    } catch (error) {
      if (notificationService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.status.errors.markReadError })
        return
      }
      set({ errorMessage: messages.notification.status.errors.markReadError })
    }
  },

  markAsNotRead: (payload: NotificationItem) => {
    set((state) => ({
      notifications: findNotificationById(state.notifications, payload.id, mapperMarkAsNotRead),
    }))
  },

  clearNotifications: () => set({ notifications: [] }),

  disconnect: () => {
    clearReconnectTimer()
    reconnectAttempts = 0
    if (!activeWebSocket) return
    if (activeWebSocket.readyState === WebSocket.OPEN) {
      activeWebSocket.close()
      activeWebSocket = null
    }
    if (get().status !== 'idle') set({ connectedUserId: null, status: 'disconnected' })
  },

  connect: async (userId: number) => {
    if (!userId) return
    if (activeWebSocket && (activeWebSocket.readyState === WebSocket.CONNECTING || activeWebSocket.readyState === WebSocket.OPEN)) return

    const wsUrl = resolveWsUrl()
    if (!wsUrl) {
      set({ status: 'error', errorMessage: messages.notification.status.errors.wsUrlMissing })
      return
    }

    set({ connectedUserId: userId, status: 'connecting', errorMessage: null })

    const brokerURL = wsUrl.includes('?')
      ? `${wsUrl}&userId=${userId}`
      : `${wsUrl}?userId=${userId}`

    const ws = new WebSocket(brokerURL)

    ws.onopen = () => {
      reconnectAttempts = 0
      set({ status: 'connected', errorMessage: null })
    }

    ws.onmessage = async (event) => {
      const payload = parseNotificationPayload(String(event.data))
      const notification = payload
        ? mapperNotificationFromPayload(payload, messages.notification.ui.newNotificationFallback)
        : mapperNotificationFromPayload({}, String(event.data || messages.notification.ui.newNotificationFallback))
      get().pushNotification(notification)
      await get().getCounter()
    }

    ws.onerror = () => {
      set({ status: 'error', errorMessage: messages.notification.status.errors.wsConnectionError })
    }

    ws.onclose = () => {
      activeWebSocket = null
      if (get().status === 'error') return

      set({ status: 'disconnected' })

      if (reconnectAttempts < WS_MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++
        reconnectTimer = setTimeout(() => {
          get().connect(userId)
        }, WS_RECONNECT_DELAY)
      }
    }

    activeWebSocket = ws
  },
}))

// Selectors
export const selectUnreadCount = (state: NotificationStore) => state.counter.totalUnread
export const selectHasNotifications = (state: NotificationStore) => state.notifications.length > 0
let lastNotificationsRef: NotificationItem[] | null = null
let lastTabValue: number | null = null
let lastFilteredNotifications: NotificationItem[] = []

export const selectFilterNotifications = (state: NotificationStore) => {
  if (lastNotificationsRef === state.notifications && lastTabValue === state.tab) {
    return lastFilteredNotifications
  }

  const filterPredicate = notificationTabFilters[state.tab]
  lastNotificationsRef = state.notifications
  lastTabValue = state.tab
  lastFilteredNotifications =
    typeof filterPredicate === 'function' ? state.notifications.filter(filterPredicate) : state.notifications

  return lastFilteredNotifications
}
