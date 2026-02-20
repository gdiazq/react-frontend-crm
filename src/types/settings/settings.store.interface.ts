import type {
  SettingDeviceSession,
  SettingMfaSetupData,
  SettingMfaState,
  SettingTabKey,
  SettingTabOption,
} from './setting.interface'
import type { SettingUpdateAvatarPayload, SettingUpdateProfilePayload } from './setting.payload.interface'

export interface SettingsStore {
  // State
  mfaState: SettingMfaState
  mfaSetupData: SettingMfaSetupData
  mfaVerificationCode: string
  mfaStatusEmail: string
  statusMessage: string
  devices: SettingDeviceSession[]
  mfaSetupSteps: string[]
  tabs: SettingTabOption[]
  activeTab: SettingTabKey
  // Loading
  loadingMfaStatus: boolean
  loadingSessions: boolean
  loadingMfaAction: boolean
  loadingLogoutDevice: boolean
  updateProfileSubmitting: boolean
  updateAvatarSubmitting: boolean
  // Messages
  errorBack: unknown | null
  // Setters
  setStatusMessage: (message: string) => void
  setActiveTab: (tab: SettingTabKey) => void
  setMfaVerificationCode: (value: string) => void
  setMfaStatusEmail: (email: string) => void
  clearMfaVerificationCode: () => void
  // Actions
  getMfaStatus: (email: string) => Promise<void>
  getSessions: () => Promise<void>
  loadMfaAndSessions: (email: string) => Promise<void>
  // Mutations
  mutationMfaSetup: (username: string) => Promise<boolean>
  mutationMfaVerify: (username: string) => Promise<boolean>
  mutationMfaDisable: (username: string) => Promise<boolean>
  mutationLogoutDevice: (sessionId: number) => Promise<boolean>
  mutationUpdateProfile: (payload: SettingUpdateProfilePayload) => Promise<boolean>
  mutationUpdateAvatar: (userId: number, payload: SettingUpdateAvatarPayload) => Promise<boolean>
  // Handlers
  logoutDevice: (id: string) => Promise<void>
  logoutAllOtherDevices: () => Promise<void>
}
