import { create } from 'zustand'
import { Client } from '@stomp/stompjs'
import axios from 'axios'
import { axiosInstance } from '@/config'
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
  getInboxNotificationIds,
  getNotificationIds,
  convertIdsToNumbers,
  convertIdToNumber,
} from '@/utils'
import messages from '@/messages/messages'
import type {
  IncomingNotificationPayload,
  NotificationItem,
  NotificationCountResponse,
  NotificationConnectionStatus,
  NotificationPagedResponse,
} from '@/types'

const NOTIFICATION_BASE_PATH = '/notification'
const MAX_NOTIFICATIONS = 50

let activeStompClient: Client | null = null

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

const requestWsTicket = async () => {
  const { data } = await axiosInstance.get<{ ticket?: string }>('/auth/ws-ticket')
  return typeof data.ticket === 'string' ? data.ticket : ''
}

const notificationTabFilters: Record<number, (item: NotificationItem) => boolean> = {
  1: (item) => item.inbox,
  2: (item) => !item.read && item.inbox,
  3: (item) => !item.inbox,
}

const isValidUserId = (userId: number) => Number.isInteger(userId) && userId > 0

interface NotificationStore {
  counter: NotificationCountResponse
  notifications: NotificationItem[]
  tab: number
  status: NotificationConnectionStatus
  errorMessage: string | null
  loadingNotifications: boolean
  // Getters (computed via selectors)
  captureTab: (tab: number) => void
  pushNotification: (item: NotificationItem) => void
  getNotifications: (userId: number, type?: '' | 'unread' | 'archived', page?: number, size?: number) => Promise<void>
  getCounter: (userId: number) => Promise<void>
  mutationMarkAllAsRead: (userId: number) => Promise<void>
  mutationArchiveAll: (userId: number) => Promise<void>
  mutationArchiveNotification: (payload: NotificationItem, userId: number) => Promise<void>
  mutationMarkAsRead: (payload: NotificationItem, userId: number) => Promise<void>
  mutationMarkAsNotRead: (payload: NotificationItem) => void
  clearNotifications: () => void
  disconnect: () => void
  connect: (userId: number) => Promise<void>
}

export const useStoreNotification = create<NotificationStore>()((set, get) => ({
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

  getNotifications: async (userId, type = '', page = 0, size = 20) => {
    try {
      set({ loadingNotifications: true, errorMessage: null })
      const { data } = await axiosInstance.get<NotificationPagedResponse>(`${NOTIFICATION_BASE_PATH}/paged`, {
        params: { userId, type, page, size },
      })
      set({ notifications: data.content.map(mapperNotification) })
    } catch {
      set({ errorMessage: messages.notification.loadError })
    } finally {
      set({ loadingNotifications: false })
    }
  },

  getCounter: async (userId: number) => {
    try {
      const { data } = await axiosInstance.get<NotificationCountResponse>(`${NOTIFICATION_BASE_PATH}/count`, {
        params: { userId },
      })
      set({ counter: data })
    } catch {
      set({ errorMessage: messages.notification.counterError })
    }
  },

  mutationMarkAllAsRead: async (userId: number) => {
    if (!isValidUserId(userId)) {
      set({ errorMessage: messages.notification.invalidUserMarkAll })
      return
    }
    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read-all`, { userId })
      set((state) => ({
        notifications: updateNotificationsByIds(
          state.notifications,
          getNotificationIds(state.notifications),
          mapperMarkAsRead,
        ),
      }))
      await get().getCounter(userId)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.markAllReadError })
        return
      }
      set({ errorMessage: messages.notification.markAllReadError })
    }
  },

  mutationArchiveAll: async (userId: number) => {
    if (!isValidUserId(userId)) {
      set({ errorMessage: messages.notification.invalidUserArchive })
      return
    }
    const ids = getInboxNotificationIds(get().notifications)
    if (ids.length === 0) return

    const numericIds = convertIdsToNumbers(ids)
    if (numericIds.length === 0) {
      set({ errorMessage: messages.notification.archiveConvertError })
      return
    }

    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, { ids: numericIds, userId })
      set((state) => ({
        notifications: updateNotificationsByIds(state.notifications, ids, mapperArchiveNotification),
      }))
      await get().getCounter(userId)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.archiveAllError })
        return
      }
      set({ errorMessage: messages.notification.archiveAllError })
    }
  },

  mutationArchiveNotification: async (payload: NotificationItem, userId: number) => {
    if (!isValidUserId(userId)) {
      set({ errorMessage: messages.notification.invalidUserArchive })
      return
    }
    const numericId = convertIdToNumber(payload.id)
    if (numericId === null) {
      set({ errorMessage: messages.notification.invalidIdArchive })
      return
    }
    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, { ids: [numericId], userId })
      set((state) => ({
        notifications: findNotificationById(state.notifications, payload.id, mapperArchiveNotification),
      }))
      await get().getCounter(userId)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.archiveOneError })
        return
      }
      set({ errorMessage: messages.notification.archiveOneError })
    }
  },

  mutationMarkAsRead: async (payload: NotificationItem, userId: number) => {
    if (!isValidUserId(userId)) {
      set({ errorMessage: messages.notification.invalidUserRead })
      return
    }
    const numericId = convertIdToNumber(payload.id)
    if (numericId === null) {
      set({ errorMessage: messages.notification.invalidIdRead })
      return
    }
    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read`, { ids: [numericId], userId })
      set((state) => ({
        notifications: findNotificationById(state.notifications, payload.id, mapperMarkAsRead),
      }))
      await get().getCounter(userId)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.markReadError })
        return
      }
      set({ errorMessage: messages.notification.markReadError })
    }
  },

  mutationMarkAsNotRead: (payload: NotificationItem) => {
    set((state) => ({
      notifications: findNotificationById(state.notifications, payload.id, mapperMarkAsNotRead),
    }))
  },

  clearNotifications: () => set({ notifications: [] }),

  disconnect: () => {
    if (!activeStompClient) return
    activeStompClient.deactivate()
    activeStompClient = null
    if (get().status !== 'idle') set({ status: 'disconnected' })
  },

  connect: async (userId: number) => {
    if (!userId) return
    if (activeStompClient?.active) return

    const wsUrl = resolveWsUrl()
    if (!wsUrl) {
      set({ status: 'error', errorMessage: messages.notification.wsUrlMissing })
      return
    }

    set({ status: 'connecting', errorMessage: null })

    let wsTicket = ''
    try {
      wsTicket = await requestWsTicket()
    } catch {
      set({ status: 'error', errorMessage: messages.notification.wsTicketError })
      return
    }

    if (!wsTicket) {
      set({ status: 'error', errorMessage: messages.notification.wsTicketInvalid })
      return
    }

    const encodedTicket = encodeURIComponent(wsTicket)
    const brokerURL = wsUrl.includes('?')
      ? `${wsUrl}&ticket=${encodedTicket}`
      : `${wsUrl}?ticket=${encodedTicket}`

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      onConnect: () => {
        set({ status: 'connected' })
        client.subscribe(`/topic/notifications/${userId}`, async (message) => {
          const payload = parseNotificationPayload(message.body)
          const notification = payload
            ? mapperNotificationFromPayload(payload, messages.notification.newNotificationFallback)
            : mapperNotificationFromPayload({}, String(message.body || messages.notification.newNotificationFallback))
          get().pushNotification(notification)
          await get().getCounter(userId)
        })
      },
      onWebSocketError: () => {
        set({ status: 'error', errorMessage: messages.notification.wsConnectionError })
      },
      onStompError: () => {
        set({ status: 'error', errorMessage: messages.notification.wsStompError })
      },
      onDisconnect: () => {
        if (get().status !== 'error') set({ status: 'disconnected' })
      },
    })

    activeStompClient = client
    client.activate()
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
