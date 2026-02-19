import type { AlertsCore, ModulePermission } from '../common/common.interface'
import type { SettingUpdateAvatarPayload, SettingUpdateProfilePayload } from '../settings/setting.payload'
import type { AuthUser } from './auth.interface'
import type {
  AuthCreatePasswordPayload,
  AuthForgotPasswordPayload,
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthResendVerificationPayload,
  AuthVerifyEmailPayload,
} from './auth.payload'

export type PermissionType = 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'

export interface AuthStore {
  // State
  user: AuthUser | null
  permissions: ModulePermission[]
  sidebar: { toggleMobile: boolean; toggleCollapse: boolean }
  // Loading
  loginSubmitting: boolean
  registerSubmitting: boolean
  forgotPasswordSubmitting: boolean
  verifySubmitting: boolean
  createPasswordSubmitting: boolean
  resendSubmitting: boolean
  checkEmailSubmitting: boolean
  updateProfileSubmitting: boolean
  updateAvatarSubmitting: boolean
  githubOAuthSubmitting: boolean
  loadingUser: boolean
  // Messages
  loginError: boolean
  mfaRequired: boolean
  messageAlert: AlertsCore
  successMessage: string | null
  errorMessage: string | null
  githubOAuthError: string | null
  errorBack: unknown | null
  // Session
  pendingVerifyEmail: string | null
  pendingVerifyPhone: string | null
  pendingRecoveryEmail: string | null
  pendingPasswordToken: string | null
  pendingPasswordTokenIssuedAt: number | null
  emailAvailable: boolean | null
  // Actions
  login: (credentials: AuthLoginPayload) => Promise<boolean>
  register: (payload: AuthRegisterPayload) => Promise<boolean>
  checkEmailAvailability: (email: string) => Promise<boolean | null>
  verifyEmail: (payload: AuthVerifyEmailPayload) => Promise<string | null>
  forgotPassword: (payload: AuthForgotPasswordPayload) => Promise<boolean>
  startGithubOAuth: () => Promise<boolean>
  clearGithubOAuthStatus: () => void
  resendVerification: (payload: AuthResendVerificationPayload) => Promise<boolean>
  createPassword: (payload: AuthCreatePasswordPayload) => Promise<boolean>
  getCurrentUser: () => Promise<void>
  reset: () => void
  logout: () => Promise<void>
  updateProfile: (payload: SettingUpdateProfilePayload) => Promise<boolean>
  updateAvatar: (userId: number, payload: SettingUpdateAvatarPayload) => Promise<boolean>
  // Setters
  setPendingVerifyEmail: (email: string) => void
  setPendingVerifyPhone: (phone: string) => void
  setPendingRecoveryEmail: (email: string) => void
  setPendingPasswordToken: (token: string) => void
  clearPendingPasswordToken: () => void
  clearMfaRequired: () => void
  // Handlers
  handleSidebarCollapse: () => void
  handleSidebarMobile: () => void
  hasPermission: (moduleName: string, permissionType: PermissionType) => boolean
}
