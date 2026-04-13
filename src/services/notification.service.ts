import axios from 'axios'
import { notificationAxiosInstance } from '@/config'
import type { NotificationCountResponse, NotificationPagedResponse } from '@/types'

const NOTIFICATION_BASE_PATH = 'notification'

const userIdHeaders = (userId: number) => ({
  headers: { 'X-User-Id': String(userId) },
})

export const notificationService = {
  getNotifications: async (userId: number, type = '', page = 0, size = 20) => {
    const { data } = await notificationAxiosInstance.get<NotificationPagedResponse>(`${NOTIFICATION_BASE_PATH}/paged`, {
      params: { type, page, size },
      ...userIdHeaders(userId),
    })
    return data
  },

  getCounter: async (userId: number) => {
    const { data } = await notificationAxiosInstance.get<NotificationCountResponse>(`${NOTIFICATION_BASE_PATH}/count`, {
      ...userIdHeaders(userId),
    })
    return data
  },

  markAllAsRead: async (userId: number) => {
    await notificationAxiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read-all`, null, {
      ...userIdHeaders(userId),
    })
  },

  archiveNotifications: async (userId: number, ids: number[]) => {
    await notificationAxiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, { ids }, {
      ...userIdHeaders(userId),
    })
  },

  markAsRead: async (userId: number, ids: number[]) => {
    await notificationAxiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read`, { ids }, {
      ...userIdHeaders(userId),
    })
  },

  isAxiosError: axios.isAxiosError,
}
