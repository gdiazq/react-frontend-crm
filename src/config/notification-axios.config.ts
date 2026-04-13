import axios from 'axios'

const NOTIFICATION_API_URL = import.meta.env.VITE_NOTIFICATIONS_API_URL

export const notificationAxiosInstance = axios.create({
  baseURL: typeof NOTIFICATION_API_URL === 'string' ? NOTIFICATION_API_URL.trim() : '',
  headers: {
    'Content-Type': 'application/json',
  },
})
