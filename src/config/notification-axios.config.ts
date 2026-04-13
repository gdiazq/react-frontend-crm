import axios from 'axios'

const NOTIFICATION_API_URL = import.meta.env.VITE_NOTIFICATIONS_API_URL

const resolvedBaseURL = typeof NOTIFICATION_API_URL === 'string' ? NOTIFICATION_API_URL.trim().replace(/\/$/, '') + '/' : ''

export const notificationAxiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
