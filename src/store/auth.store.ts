import { create } from 'zustand'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { createAuthSessionStorage, createDeviceIdService } from '@/utils'
import { initialAlert } from '@/factories'
import { mapperUpdateAvatarFormData } from '@/mappers'
import messages from '@/messages/messages'
import type {
  AlertsCore,
  AuthCheckEmailResponse,
  AuthCreatePasswordPayload,
  AuthForgotPasswordPayload,
  AuthGithubOAuthUrlResponse,
  AuthLoginErrorResponse,
  AuthLoginPayload,
  AuthResendVerificationPayload,
  AuthRegisterPayload,
  AuthVerifyEmailResponse,
  AuthVerifyEmailPayload,
  AuthUser,
  ModulePermission,
  SettingUpdateAvatarPayload,
  SettingUpdateProfilePayload,
} from '@/types'

type PermissionType = 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'

const authSessionStorage = createAuthSessionStorage()
const { getDeviceId } = createDeviceIdService()

let currentUserRequest: Promise<void> | null = null

interface AuthStore {
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

export const useStoreAuth = create<AuthStore>()((set, get) => ({
  // State
  user: null,
  permissions: [],
  sidebar: { toggleMobile: false, toggleCollapse: false },
  // Loading
  loginSubmitting: false,
  registerSubmitting: false,
  forgotPasswordSubmitting: false,
  verifySubmitting: false,
  createPasswordSubmitting: false,
  resendSubmitting: false,
  checkEmailSubmitting: false,
  updateProfileSubmitting: false,
  updateAvatarSubmitting: false,
  githubOAuthSubmitting: false,
  loadingUser: false,
  // Messages
  loginError: false,
  mfaRequired: false,
  messageAlert: { ...initialAlert },
  successMessage: null,
  errorMessage: null,
  githubOAuthError: null,
  errorBack: null,
  // Session
  pendingVerifyEmail: authSessionStorage.getPendingVerifyEmail(),
  pendingVerifyPhone: authSessionStorage.getPendingVerifyPhone(),
  pendingRecoveryEmail: authSessionStorage.getPendingRecoveryEmail(),
  pendingPasswordToken: authSessionStorage.getPendingPasswordToken(),
  pendingPasswordTokenIssuedAt: authSessionStorage.getPendingPasswordTokenIssuedAt(),
  emailAvailable: null,

  login: async (credentials: AuthLoginPayload) => {
    try {
      set({ loginSubmitting: true, loginError: false, errorMessage: null, successMessage: null })

      const payload = {
        email: credentials.email,
        password: credentials.password,
        ...(credentials.totpCode ? { totpCode: credentials.totpCode } : {}),
      }

      const { data } = await axiosInstance.post<{ user: AuthUser; modules?: ModulePermission[] }>('/auth/login', payload, {
        headers: { 'X-Device-Id': getDeviceId() },
      })
      set({ user: data.user, permissions: data.modules || [], mfaRequired: false })

      try {
        const { data: fullProfile } = await axiosInstance.get<AuthUser>('/auth/me')
        set({ user: fullProfile })
      } catch {
        // Login data is sufficient to proceed
      }

      set({ successMessage: messages.auth.status.success.loginSuccess })
      return true
    } catch (error) {
      set({ loginError: true, errorBack: error })
      let message = messages.auth.status.errors.loginErrorDefault
      let alertVariant: AlertsCore['variant'] = 'error'
      let alertIcon = 'fa-solid fa-triangle-exclamation'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const responseData = (error.response?.data || {}) as AuthLoginErrorResponse
        const backendMessage = responseData.message
        const isMfaRequiredResponse =
          responseData.mfaRequired === true ||
          responseData.mfa_required === true ||
          responseData.error === 'MFA Required' ||
          backendMessage === 'MFA code required'

        if (status === 403 && isMfaRequiredResponse) {
          set({ mfaRequired: true, loginError: false })
          alertVariant = 'info'
          alertIcon = 'fa-solid fa-shield-halved'
          message = messages.auth.ui.loginMfaPrompt
        }

        if (status === 400) message = messages.auth.status.errors.loginInvalidData
        if (status === 401) {
          if (get().mfaRequired && credentials.totpCode) message = messages.auth.status.errors.loginInvalidMfa
          else {
            set({ mfaRequired: false })
            message = messages.auth.status.errors.loginInvalidCredentials
          }
        }
        if (status === 500 || status === 503) message = messages.auth.status.errors.loginServiceUnavailable
        if (
          typeof backendMessage === 'string' &&
          backendMessage.length > 0 &&
          !(status === 403 && isMfaRequiredResponse)
        ) {
          message = backendMessage
        }
      }

      set({
        messageAlert: { icon: alertIcon, variant: alertVariant, message },
        errorMessage: message,
      })
      return false
    } finally {
      set({ loginSubmitting: false })
    }
  },

  startGithubOAuth: async () => {
    try {
      set({
        githubOAuthSubmitting: true,
        githubOAuthError: null,
        loginError: false,
      })
      const { data } = await axiosInstance.get<AuthGithubOAuthUrlResponse>('/auth/oauth2/github')
      const authUrl = typeof data?.authUrl === 'string' ? data.authUrl.trim() : ''

      if (!authUrl) {
        set({
          loginError: true,
          githubOAuthError: messages.auth.status.errors.loginGithubAuthUrlMissing,
          messageAlert: {
            icon: 'fa-solid fa-triangle-exclamation',
            variant: 'error',
            message: messages.auth.status.errors.loginGithubAuthUrlMissing,
          },
        })
        return false
      }

      if (typeof window !== 'undefined') window.location.assign(authUrl)
      return true
    } catch (error) {
      const fallbackMessage = messages.auth.status.errors.loginGithubAuthUrlError
      const backendMessage = axios.isAxiosError(error) ? error.response?.data?.message : null
      const message = typeof backendMessage === 'string' && backendMessage.length > 0 ? backendMessage : fallbackMessage
      set({
        errorBack: error,
        loginError: true,
        githubOAuthError: message,
        messageAlert: {
          icon: 'fa-solid fa-triangle-exclamation',
          variant: 'error',
          message,
        },
      })
      return false
    } finally {
      set({ githubOAuthSubmitting: false })
    }
  },

  clearGithubOAuthStatus: () => {
    set({ githubOAuthError: null })
  },

  register: async (payload: AuthRegisterPayload) => {
    try {
      set({ registerSubmitting: true, loginError: false, errorMessage: null, successMessage: null })

      await axiosInstance.post('/auth/register', payload)
      authSessionStorage.setPendingVerifyEmail(payload.email)
      authSessionStorage.setPendingVerifyPhone(payload.phoneNumber)
      set({
        pendingVerifyEmail: payload.email,
        pendingVerifyPhone: payload.phoneNumber,
        successMessage: messages.auth.status.success.registerSuccess,
      })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.registerErrorDefault
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 409) message = messages.auth.status.errors.registerEmailTaken
        if (status === 400) message = messages.auth.status.errors.registerInvalidData
      }
      set({
        errorBack: error,
        messageAlert: { icon: 'fa-solid fa-triangle-exclamation', variant: 'error', message },
        errorMessage: message,
      })
      return false
    } finally {
      set({ registerSubmitting: false })
    }
  },

  checkEmailAvailability: async (email: string) => {
    try {
      set({ checkEmailSubmitting: true, emailAvailable: null })
      const { data } = await axiosInstance.get<AuthCheckEmailResponse>('/auth/check-email', {
        params: { email },
      })
      set({ emailAvailable: data.available })
      return data.available
    } catch (error) {
      set({ errorBack: error, emailAvailable: null })
      return null
    } finally {
      set({ checkEmailSubmitting: false })
    }
  },

  verifyEmail: async (payload: AuthVerifyEmailPayload) => {
    try {
      set({ verifySubmitting: true, loginError: false, errorMessage: null, successMessage: null })
      const { data } = await axiosInstance.post<AuthVerifyEmailResponse>('/auth/verify-email', payload)
      authSessionStorage.setPendingPasswordToken(data.token)
      set({
        pendingPasswordToken: data.token,
        pendingPasswordTokenIssuedAt: authSessionStorage.getPendingPasswordTokenIssuedAt(),
        pendingVerifyEmail: null,
        pendingVerifyPhone: null,
        successMessage: messages.auth.status.success.verifyEmailSuccess,
      })
      authSessionStorage.clearPendingVerifyEmail()
      authSessionStorage.clearPendingVerifyPhone()
      return data.token
    } catch (error) {
      let message = messages.auth.status.errors.verifyEmailErrorDefault
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.verifyEmailInvalidCode
        if (status === 404) message = messages.auth.status.errors.verifyEmailNotFound
      }
      set({
        errorBack: error,
        messageAlert: { icon: 'fa-solid fa-triangle-exclamation', variant: 'error', message },
        errorMessage: message,
      })
      return null
    } finally {
      set({ verifySubmitting: false })
    }
  },

  forgotPassword: async (payload: AuthForgotPasswordPayload) => {
    try {
      set({ forgotPasswordSubmitting: true, loginError: false, errorMessage: null, successMessage: null })
      await axiosInstance.post('/auth/forgot-password', payload)
      authSessionStorage.setPendingRecoveryEmail(payload.email)
      set({ pendingRecoveryEmail: payload.email, successMessage: messages.auth.status.success.forgotPasswordSuccess })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.forgotPasswordErrorDefault
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.forgotPasswordInvalidEmail
        if (status === 404) message = messages.auth.status.errors.forgotPasswordNotFound
      }
      set({
        errorBack: error,
        messageAlert: { icon: 'fa-solid fa-triangle-exclamation', variant: 'error', message },
        errorMessage: message,
      })
      return false
    } finally {
      set({ forgotPasswordSubmitting: false })
    }
  },

  resendVerification: async (payload: AuthResendVerificationPayload) => {
    try {
      set({ resendSubmitting: true, errorMessage: null, successMessage: null })
      await axiosInstance.post('/auth/resend-verification', payload)
      set({ successMessage: messages.auth.status.success.resendSuccess })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.resendErrorDefault
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.resendInvalidEmail
        if (status === 404) message = messages.auth.status.errors.resendNotFound
      }
      set({ errorBack: error, errorMessage: message })
      return false
    } finally {
      set({ resendSubmitting: false })
    }
  },

  createPassword: async (payload: AuthCreatePasswordPayload) => {
    try {
      set({ createPasswordSubmitting: true, loginError: false, errorMessage: null, successMessage: null })
      await axiosInstance.post('/auth/create-password', payload)
      authSessionStorage.clearPendingPasswordToken()
      set({
        pendingPasswordToken: null,
        pendingPasswordTokenIssuedAt: null,
        successMessage: messages.auth.status.success.createPasswordSuccess,
      })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.createPasswordErrorDefault
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.createPasswordInvalid
        if (status === 404) message = messages.auth.status.errors.createPasswordNotFound
      }
      set({
        errorBack: error,
        messageAlert: { icon: 'fa-solid fa-triangle-exclamation', variant: 'error', message },
        errorMessage: message,
      })
      return false
    } finally {
      set({ createPasswordSubmitting: false })
    }
  },

  getCurrentUser: async () => {
    if (currentUserRequest) return currentUserRequest

    set({ loadingUser: true })

    currentUserRequest = (async () => {
      try {
        const { data } = await axiosInstance.get<AuthUser>('/auth/me')
        set({ user: data })
      } catch (error) {
        set({ errorBack: error })
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          set({ user: null, permissions: [] })
        }
        throw error
      } finally {
        set({ loadingUser: false })
        currentUserRequest = null
      }
    })()

    return currentUserRequest
  },

  reset: () => {
    authSessionStorage.clearPendingPasswordToken()
    authSessionStorage.clearPendingRecoveryEmail()
    set({
      user: null,
      permissions: [],
      mfaRequired: false,
      pendingPasswordToken: null,
      pendingPasswordTokenIssuedAt: null,
      pendingRecoveryEmail: null,
    })
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      set({ errorBack: error })
    }
    get().reset()
  },

  updateProfile: async (payload: SettingUpdateProfilePayload) => {
    try {
      set({ updateProfileSubmitting: true, errorMessage: null })
      await axiosInstance.put('/user/update', payload)
      const currentUser = get().user
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            email: payload.email,
            first_name: payload.firstName,
            last_name: payload.lastName,
            phone_number: payload.phoneNumber,
          },
        })
      }
      set({ successMessage: messages.auth.status.success.updateProfileSuccess })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.updateProfileErrorDefault
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.updateProfileInvalidData
        if (status === 404) message = messages.auth.status.errors.updateProfileNotFound
      }
      set({ errorBack: error, errorMessage: message })
      return false
    } finally {
      set({ updateProfileSubmitting: false })
    }
  },

  updateAvatar: async (userId: number, payload: SettingUpdateAvatarPayload) => {
    try {
      set({ updateAvatarSubmitting: true, errorMessage: null })
      const formData = mapperUpdateAvatarFormData(payload)
      await axiosInstance.post(`/user/${userId}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await get().getCurrentUser()
      set({ successMessage: messages.auth.status.success.updateAvatarSuccess })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.updateAvatarErrorDefault
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.updateAvatarInvalidFile
        if (status === 404) message = messages.auth.status.errors.updateAvatarNotFound
      }
      set({ errorBack: error, errorMessage: message })
      return false
    } finally {
      set({ updateAvatarSubmitting: false })
    }
  },

  // Setters
  setPendingVerifyEmail: (email: string) => {
    authSessionStorage.setPendingVerifyEmail(email)
    set({ pendingVerifyEmail: email })
  },

  setPendingVerifyPhone: (phone: string) => {
    authSessionStorage.setPendingVerifyPhone(phone)
    set({ pendingVerifyPhone: phone })
  },

  setPendingRecoveryEmail: (email: string) => {
    authSessionStorage.setPendingRecoveryEmail(email)
    set({ pendingRecoveryEmail: email })
  },

  setPendingPasswordToken: (token: string) => {
    authSessionStorage.setPendingPasswordToken(token)
    set({
      pendingPasswordToken: token,
      pendingPasswordTokenIssuedAt: authSessionStorage.getPendingPasswordTokenIssuedAt(),
    })
  },

  clearPendingPasswordToken: () => {
    authSessionStorage.clearPendingPasswordToken()
    set({ pendingPasswordToken: null, pendingPasswordTokenIssuedAt: null })
  },

  clearMfaRequired: () => {
    set({ mfaRequired: false })
  },

  // Handlers
  handleSidebarCollapse: () => {
    set((state) => ({ sidebar: { ...state.sidebar, toggleCollapse: !state.sidebar.toggleCollapse } }))
  },

  handleSidebarMobile: () => {
    set((state) => ({ sidebar: { ...state.sidebar, toggleMobile: !state.sidebar.toggleMobile } }))
  },

  hasPermission: (moduleName: string, permissionType: PermissionType) => {
    const module = get().permissions.find((item) => item.module === moduleName)
    if (!module) return false
    return Boolean(module[permissionType])
  },
}))
