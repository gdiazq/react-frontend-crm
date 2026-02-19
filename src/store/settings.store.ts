import { create } from 'zustand'
import axios from 'axios'
import { axiosInstance } from '@/config'
import {
  createDeviceIdService,
  findDeviceById,
  removeDeviceById,
} from '@/utils'
import type {
  SettingDeviceSessionRaw,
  SettingMfaSetupDataRaw,
  SettingMfaStatusResponse,
  SettingsStore,
  SettingTabKey,
} from '@/types'
import {
  initialSettingsDevices,
  initialSettingsMfaSetupData,
  initialSettingsMfaState,
  initialSettingsStatusMessage,
  initialSettingsTab,
  settingsMfaSetupSteps,
  settingsTabs,
} from '@/factories'
import {
  mapperMfaSetupDataFromResponse,
  mapperMfaStateFromResponse,
  mapperSettingSessionsFromResponse,
} from '@/mappers'
import messages from '@/messages/messages'

const AUTH_BASE_PATH = '/auth'
const { getDeviceId } = createDeviceIdService()

export const useStoreSettings = create<SettingsStore>()((set, get) => ({
  // State
  mfaState: { ...initialSettingsMfaState },
  mfaSetupData: { ...initialSettingsMfaSetupData },
  mfaVerificationCode: '',
  mfaStatusEmail: '',
  statusMessage: initialSettingsStatusMessage,
  devices: [...initialSettingsDevices],
  mfaSetupSteps: [...settingsMfaSetupSteps],
  tabs: [...settingsTabs],
  activeTab: initialSettingsTab,
  // Loading
  loadingMfaStatus: false,
  loadingSessions: false,
  loadingMfaAction: false,
  loadingLogoutDevice: false,
  // Messages
  errorBack: null,

  setStatusMessage: (message: string) => set({ statusMessage: message }),
  setActiveTab: (tab: SettingTabKey) => set({ activeTab: tab }),
  setMfaVerificationCode: (value: string) => set({ mfaVerificationCode: value }),
  setMfaStatusEmail: (email: string) => set({ mfaStatusEmail: email }),
  clearMfaVerificationCode: () => set({ mfaVerificationCode: '' }),

  getMfaStatus: async (email: string) => {
    if (!email) return
    try {
      set({ loadingMfaStatus: true, errorBack: null })
      const { data } = await axiosInstance.get<SettingMfaStatusResponse>(`${AUTH_BASE_PATH}/mfa/status/${encodeURIComponent(email)}`)
      set({ mfaState: mapperMfaStateFromResponse(data) })
    } catch (error) {
      set({ errorBack: error, statusMessage: messages.settings.status.errors.mfaStatusError })
    } finally {
      set({ loadingMfaStatus: false })
    }
  },

  mutationMfaSetup: async (username: string) => {
    if (!username) return false
    try {
      set({ loadingMfaAction: true, errorBack: null })
      const { data } = await axiosInstance.post<SettingMfaSetupDataRaw>(
        `${AUTH_BASE_PATH}/mfa/setup`,
        { username },
        { headers: { 'X-Device-Id': getDeviceId() } },
      )
      set({ mfaSetupData: mapperMfaSetupDataFromResponse(data) })
      const email = get().mfaStatusEmail
      if (email) await get().getMfaStatus(email)
      set({ statusMessage: messages.settings.status.success.mfaSetupStarted })
      return true
    } catch (error) {
      set({ errorBack: error })
      if (axios.isAxiosError(error)) {
        set({ statusMessage: error.response?.data?.message || messages.settings.status.errors.mfaSetupError })
      } else {
        set({ statusMessage: messages.settings.status.errors.mfaSetupError })
      }
      return false
    } finally {
      set({ loadingMfaAction: false })
    }
  },

  mutationMfaVerify: async (username: string) => {
    if (!username) return false
    if (get().mfaVerificationCode.trim().length !== 6) {
      set({ statusMessage: messages.settings.status.errors.mfaInvalidCode })
      return false
    }
    try {
      set({ loadingMfaAction: true, errorBack: null })
      await axiosInstance.post(
        `${AUTH_BASE_PATH}/mfa/verify`,
        { username, code: get().mfaVerificationCode.trim() },
        { headers: { 'X-Device-Id': getDeviceId() } },
      )
      set({ mfaVerificationCode: '' })
      const email = get().mfaStatusEmail
      if (email) await get().getMfaStatus(email)
      set({ statusMessage: messages.settings.status.success.mfaVerifySuccess })
      return true
    } catch (error) {
      set({ errorBack: error })
      if (axios.isAxiosError(error)) {
        set({ statusMessage: error.response?.data?.message || messages.settings.status.errors.mfaVerifyError })
      } else {
        set({ statusMessage: messages.settings.status.errors.mfaVerifyError })
      }
      return false
    } finally {
      set({ loadingMfaAction: false })
    }
  },

  mutationMfaDisable: async (username: string) => {
    if (!username) return false
    try {
      set({ loadingMfaAction: true, errorBack: null })
      await axiosInstance.post(
        `${AUTH_BASE_PATH}/mfa/disable`,
        { username },
        { headers: { 'X-Device-Id': getDeviceId() } },
      )
      const email = get().mfaStatusEmail
      if (email) await get().getMfaStatus(email)
      set({ statusMessage: messages.settings.status.success.mfaDisableSuccess })
      return true
    } catch (error) {
      set({ errorBack: error })
      if (axios.isAxiosError(error)) {
        set({ statusMessage: error.response?.data?.message || messages.settings.status.errors.mfaDisableError })
      } else {
        set({ statusMessage: messages.settings.status.errors.mfaDisableError })
      }
      return false
    } finally {
      set({ loadingMfaAction: false })
    }
  },

  getSessions: async () => {
    try {
      set({ loadingSessions: true, errorBack: null })
      const { data } = await axiosInstance.get<SettingDeviceSessionRaw[]>(`${AUTH_BASE_PATH}/sessions`)
      set({ devices: mapperSettingSessionsFromResponse(data, getDeviceId()) })
    } catch (error) {
      set({ errorBack: error, statusMessage: messages.settings.status.errors.sessionsError })
    } finally {
      set({ loadingSessions: false })
    }
  },

  mutationLogoutDevice: async (sessionId: number) => {
    if (!Number.isInteger(sessionId) || sessionId <= 0) return false
    try {
      set({ loadingLogoutDevice: true, errorBack: null })
      await axiosInstance.post(`${AUTH_BASE_PATH}/logout-device`, { sessionId })
      set((state) => ({ devices: removeDeviceById(state.devices, String(sessionId)) }))
      set({ statusMessage: messages.settings.status.success.logoutDeviceSuccess })
      return true
    } catch (error) {
      set({ errorBack: error })
      if (axios.isAxiosError(error)) {
        set({ statusMessage: error.response?.data?.message || messages.settings.status.errors.logoutDeviceError })
      } else {
        set({ statusMessage: messages.settings.status.errors.logoutDeviceError })
      }
      return false
    } finally {
      set({ loadingLogoutDevice: false })
    }
  },

  loadMfaAndSessions: async (email: string) => {
    if (!email) return
    set({ mfaStatusEmail: email })
    await Promise.all([get().getMfaStatus(email), get().getSessions()])
  },

  logoutDevice: async (id: string) => {
    const device = findDeviceById(get().devices, id)
    if (!device) return
    if (device.current) {
      set({ statusMessage: messages.settings.status.errors.logoutCurrentDeviceError })
      return
    }
    const sessionId = Number(id)
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      set({ statusMessage: messages.settings.status.errors.logoutDeviceError })
      return
    }
    await get().mutationLogoutDevice(sessionId)
  },

  logoutAllOtherDevices: async () => {
    const otherSessions = get().devices.filter((device) => !device.current)
    if (otherSessions.length === 0) {
      set({ statusMessage: messages.settings.status.success.noOtherDevices })
      return
    }
    await Promise.all(otherSessions.map((item) => get().mutationLogoutDevice(Number(item.id))))
    set({ statusMessage: messages.settings.status.success.logoutAllOtherSuccess })
  },
}))

// Selectors
export const selectActiveSessions = (state: SettingsStore) => state.devices.length
export const selectOtherSessions = (state: SettingsStore) => state.devices.filter((d) => !d.current)
export const selectMfaStatusLabel = (state: SettingsStore) => (state.mfaState.enabled ? 'Habilitado' : 'Deshabilitado')
export const selectMfaStatusClass = (state: SettingsStore) =>
  state.mfaState.enabled
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400'
