import axios from 'axios'
import { axiosInstance } from '@/config'
import type { NotificationCountResponse, NotificationPagedResponse } from '@/types'

const NOTIFICATION_BASE_PATH = '/notification'

export const notificationService = {
  getNotifications: async (type = '', page = 0, size = 20) => {
    const { data } = await axiosInstance.get<NotificationPagedResponse>(`${NOTIFICATION_BASE_PATH}/paged`, {
      params: { type, page, size },
    })
    return data
  },

  getCounter: async () => {
    const { data } = await axiosInstance.get<NotificationCountResponse>(`${NOTIFICATION_BASE_PATH}/count`)
    return data
  },

  markAllAsRead: async () => {
    await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read-all`)
  },

  archiveNotifications: async (ids: number[]) => {
    await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, { ids })
  },

  markAsRead: async (ids: number[]) => {
    await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read`, { ids })
  },

  isAxiosError: axios.isAxiosError,
}
