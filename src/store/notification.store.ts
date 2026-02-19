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
  NotificationPagedResponse,
  NotificationStore,
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

  getNotifications: async (type = '', page = 0, size = 20) => {
    try {
      set({ loadingNotifications: true, errorMessage: null })
      const { data } = await axiosInstance.get<NotificationPagedResponse>(`${NOTIFICATION_BASE_PATH}/paged`, {
        params: { type, page, size },
      })
      set({ notifications: data.content.map(mapperNotification) })
    } catch {
      set({ errorMessage: messages.notification.status.errors.loadError })
    } finally {
      set({ loadingNotifications: false })
    }
  },

  getCounter: async () => {
    try {
      const { data } = await axiosInstance.get<NotificationCountResponse>(`${NOTIFICATION_BASE_PATH}/count`)
      set({ counter: data })
    } catch {
      set({ errorMessage: messages.notification.status.errors.counterError })
    }
  },

  mutationMarkAllAsRead: async () => {
    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read-all`)
      set((state) => ({
        notifications: updateNotificationsByIds(
          state.notifications,
          getNotificationIds(state.notifications),
          mapperMarkAsRead,
        ),
      }))
      await get().getCounter()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.status.errors.markAllReadError })
        return
      }
      set({ errorMessage: messages.notification.status.errors.markAllReadError })
    }
  },

  mutationArchiveAll: async () => {
    const ids = getInboxNotificationIds(get().notifications)
    if (ids.length === 0) return

    const numericIds = convertIdsToNumbers(ids)
    if (numericIds.length === 0) {
      set({ errorMessage: messages.notification.status.errors.archiveConvertError })
      return
    }

    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, { ids: numericIds })
      set((state) => ({
        notifications: updateNotificationsByIds(state.notifications, ids, mapperArchiveNotification),
      }))
      await get().getCounter()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.status.errors.archiveAllError })
        return
      }
      set({ errorMessage: messages.notification.status.errors.archiveAllError })
    }
  },

  mutationArchiveNotification: async (payload: NotificationItem) => {
    const numericId = convertIdToNumber(payload.id)
    if (numericId === null) {
      set({ errorMessage: messages.notification.status.errors.invalidIdArchive })
      return
    }
    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, { ids: [numericId] })
      set((state) => ({
        notifications: findNotificationById(state.notifications, payload.id, mapperArchiveNotification),
      }))
      await get().getCounter()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.status.errors.archiveOneError })
        return
      }
      set({ errorMessage: messages.notification.status.errors.archiveOneError })
    }
  },

  mutationMarkAsRead: async (payload: NotificationItem) => {
    const numericId = convertIdToNumber(payload.id)
    if (numericId === null) {
      set({ errorMessage: messages.notification.status.errors.invalidIdRead })
      return
    }
    try {
      await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read`, { ids: [numericId] })
      set((state) => ({
        notifications: findNotificationById(state.notifications, payload.id, mapperMarkAsRead),
      }))
      await get().getCounter()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.notification.status.errors.markReadError })
        return
      }
      set({ errorMessage: messages.notification.status.errors.markReadError })
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
      set({ status: 'error', errorMessage: messages.notification.status.errors.wsUrlMissing })
      return
    }

    set({ status: 'connecting', errorMessage: null })

    let wsTicket = ''
    try {
      wsTicket = await requestWsTicket()
    } catch {
      set({ status: 'error', errorMessage: messages.notification.status.errors.wsTicketError })
      return
    }

    if (!wsTicket) {
      set({ status: 'error', errorMessage: messages.notification.status.errors.wsTicketInvalid })
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
            ? mapperNotificationFromPayload(payload, messages.notification.ui.newNotificationFallback)
            : mapperNotificationFromPayload({}, String(message.body || messages.notification.ui.newNotificationFallback))
          get().pushNotification(notification)
          await get().getCounter()
        })
      },
      onWebSocketError: () => {
        set({ status: 'error', errorMessage: messages.notification.status.errors.wsConnectionError })
      },
      onStompError: () => {
        set({ status: 'error', errorMessage: messages.notification.status.errors.wsStompError })
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
