import axios from 'axios'

import { APP_URL } from '@/constant'

type PendingRequestResolver = (success: boolean) => void

let isRefreshingToken = false
let pendingRequests: PendingRequestResolver[] = []

const shouldSkipRefresh = (url?: string) => {
  if (!url) return false
  return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].some((path) => url.includes(path))
}

const isAuthExpiredStatus = (status?: number) => {
  return status === 401 || status === 403
}

const resolvePendingRequests = (success: boolean) => {
  pendingRequests.forEach((resolver) => resolver(success))
  pendingRequests = []
}

export const axiosInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Response interceptor
axiosInstance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response?.status
  const originalRequest = error.config

  if (!originalRequest || !isAuthExpiredStatus(status) || shouldSkipRefresh(originalRequest.url)) {
    return Promise.reject(error)
  }

  const alreadyRetried = Reflect.get(originalRequest, '_retry')
  if (alreadyRetried) {
    return Promise.reject(error)
  }

  if (isRefreshingToken) {
    return new Promise((resolve, reject) => {
      pendingRequests.push((success) => {
        if (!success) {
          reject(error)
          return
        }
        resolve(axiosInstance(originalRequest))
      })
    })
  }

  Reflect.set(originalRequest, '_retry', true)
  isRefreshingToken = true

  try {
    await axios.post(`${APP_URL}/auth/refresh`, null, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    resolvePendingRequests(true)
    return axiosInstance(originalRequest)
  } catch (refreshError) {
    resolvePendingRequests(false)
    return Promise.reject(refreshError)
  } finally {
    isRefreshingToken = false
  }
})


