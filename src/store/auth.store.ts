import { create } from 'zustand'
import { authService } from '@/services'
import { initialAlert } from '@/factories'
import messages from '@/messages/messages'
import type {
  AlertsCore,
  AuthStore,
  AuthLoginErrorResponse,
  AuthLoginPayload,
  PermissionType,
} from '@/types'

let currentUserRequest: Promise<void> | null = null

export const useStoreAuth = create<AuthStore>()((set, get) => ({
  // State
  user: null,
  permissions: [],
  // Loading
  loginSubmitting: false,
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

  login: async (credentials: AuthLoginPayload) => {
    try {
      set({ loginSubmitting: true, loginError: false, errorMessage: null, successMessage: null })

      const data = await authService.login(credentials)
      set({ user: data.user, permissions: data.modules ?? [], mfaRequired: false })

      try {
        const fullProfile = await authService.getFullProfile()
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

      if (authService.isAxiosError(error)) {
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
      set({ githubOAuthSubmitting: true, githubOAuthError: null, loginError: false })
      const data = await authService.getGithubOAuthUrl()
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
      const backendMessage = authService.isAxiosError(error) ? error.response?.data?.message : null
      const message = typeof backendMessage === 'string' && backendMessage.length > 0 ? backendMessage : fallbackMessage
      set({
        errorBack: error,
        loginError: true,
        githubOAuthError: message,
        messageAlert: { icon: 'fa-solid fa-triangle-exclamation', variant: 'error', message },
      })
      return false
    } finally {
      set({ githubOAuthSubmitting: false })
    }
  },

  clearGithubOAuthStatus: () => {
    set({ githubOAuthError: null })
  },

  getCurrentUser: async () => {
    if (currentUserRequest) return currentUserRequest

    set({ loadingUser: true })

    currentUserRequest = (async () => {
      try {
        const data = await authService.getCurrentUser()
        set({ user: data })
      } catch (error) {
        set({ errorBack: error })
        if (authService.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
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
    set({ user: null, permissions: [], mfaRequired: false })
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch (error) {
      set({ errorBack: error })
    }
    get().reset()
  },

  clearMfaRequired: () => {
    set({ mfaRequired: false })
  },

  hasPermission: (moduleName: string, permissionType: PermissionType) => {
    const module = get().permissions.find((item) => item.module === moduleName)
    if (!module) return false
    return Boolean(module[permissionType])
  },
}))
