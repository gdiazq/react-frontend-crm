const DEVICE_ID_KEY = 'crm-device-id'

const generateDeviceId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `web-${Date.now()}`
}

const getLocalStorage = () => {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

export const createDeviceIdService = () => {
  const getDeviceId = () => {
    const storage = getLocalStorage()
    const saved = storage?.getItem(DEVICE_ID_KEY)
    if (saved) return saved
    const created = generateDeviceId()
    storage?.setItem(DEVICE_ID_KEY, created)
    return created
  }

  return {
    getDeviceId,
  }
}

