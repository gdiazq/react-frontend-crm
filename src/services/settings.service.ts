import axios from 'axios'
import { axiosInstance } from '@/config'
import { createDeviceIdService } from '@/utils'
import type {
  SettingDeviceSessionRaw,
  SettingMfaSetupDataRaw,
  SettingMfaStatusResponse,
} from '@/types'

const AUTH_BASE_PATH = '/auth'
const { getDeviceId } = createDeviceIdService()

export const settingsService = {
  getMfaStatus: async (email: string) => {
    const { data } = await axiosInstance.get<SettingMfaStatusResponse>(
      `${AUTH_BASE_PATH}/mfa/status/${encodeURIComponent(email)}`,
    )
    return data
  },

  setupMfa: async (username: string) => {
    const { data } = await axiosInstance.post<SettingMfaSetupDataRaw>(
      `${AUTH_BASE_PATH}/mfa/setup`,
      { username },
      { headers: { 'X-Device-Id': getDeviceId() } },
    )
    return data
  },

  verifyMfa: async (username: string, code: string) => {
    await axiosInstance.post(
      `${AUTH_BASE_PATH}/mfa/verify`,
      { username, code },
      { headers: { 'X-Device-Id': getDeviceId() } },
    )
  },

  disableMfa: async (username: string) => {
    await axiosInstance.post(
      `${AUTH_BASE_PATH}/mfa/disable`,
      { username },
      { headers: { 'X-Device-Id': getDeviceId() } },
    )
  },

  getSessions: async () => {
    const { data } = await axiosInstance.get<SettingDeviceSessionRaw[]>(`${AUTH_BASE_PATH}/sessions`)
    return data
  },

  logoutDevice: async (sessionId: number) => {
    await axiosInstance.post(`${AUTH_BASE_PATH}/logout-device`, { sessionId })
  },

  isAxiosError: axios.isAxiosError,
}
