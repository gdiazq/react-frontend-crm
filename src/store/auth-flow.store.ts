import { create } from 'zustand'
import { authService } from '@/services'
import { createAuthSessionStorage } from '@/utils'
import messages from '@/messages/messages'
import type {
  AuthFlowStore,
  AuthCreatePasswordPayload,
  AuthForgotPasswordPayload,
  AuthRegisterPayload,
  AuthResendVerificationPayload,
  AuthVerifyEmailPayload,
} from '@/types'

const authSessionStorage = createAuthSessionStorage()

export const useStoreAuthFlow = create<AuthFlowStore>()((set) => ({
  // Loading
  registerSubmitting: false,
  forgotPasswordSubmitting: false,
  verifySubmitting: false,
  createPasswordSubmitting: false,
  resendSubmitting: false,
  checkEmailSubmitting: false,
  // Messages
  errorMessage: null,
  successMessage: null,
  errorBack: null,
  // Session
  pendingVerifyEmail: authSessionStorage.getPendingVerifyEmail(),
  pendingVerifyPhone: authSessionStorage.getPendingVerifyPhone(),
  pendingRecoveryEmail: authSessionStorage.getPendingRecoveryEmail(),
  pendingPasswordToken: authSessionStorage.getPendingPasswordToken(),
  pendingPasswordTokenIssuedAt: authSessionStorage.getPendingPasswordTokenIssuedAt(),
  emailAvailable: null,

  register: async (payload: AuthRegisterPayload) => {
    try {
      set({ registerSubmitting: true, errorMessage: null, successMessage: null })
      await authService.register(payload)
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
      if (authService.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 409) message = messages.auth.status.errors.registerEmailTaken
        if (status === 400) message = messages.auth.status.errors.registerInvalidData
      }
      set({ errorBack: error, errorMessage: message })
      return false
    } finally {
      set({ registerSubmitting: false })
    }
  },

  checkEmailAvailability: async (email: string) => {
    try {
      set({ checkEmailSubmitting: true, emailAvailable: null })
      const data = await authService.checkEmailAvailability(email)
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
      set({ verifySubmitting: true, errorMessage: null, successMessage: null })
      const data = await authService.verifyEmail(payload)
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
      if (authService.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.verifyEmailInvalidCode
        if (status === 404) message = messages.auth.status.errors.verifyEmailNotFound
      }
      set({ errorBack: error, errorMessage: message })
      return null
    } finally {
      set({ verifySubmitting: false })
    }
  },

  forgotPassword: async (payload: AuthForgotPasswordPayload) => {
    try {
      set({ forgotPasswordSubmitting: true, errorMessage: null, successMessage: null })
      await authService.forgotPassword(payload)
      authSessionStorage.setPendingRecoveryEmail(payload.email)
      set({ pendingRecoveryEmail: payload.email, successMessage: messages.auth.status.success.forgotPasswordSuccess })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.forgotPasswordErrorDefault
      if (authService.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.forgotPasswordInvalidEmail
        if (status === 404) message = messages.auth.status.errors.forgotPasswordNotFound
      }
      set({ errorBack: error, errorMessage: message })
      return false
    } finally {
      set({ forgotPasswordSubmitting: false })
    }
  },

  resendVerification: async (payload: AuthResendVerificationPayload) => {
    try {
      set({ resendSubmitting: true, errorMessage: null, successMessage: null })
      await authService.resendVerification(payload)
      set({ successMessage: messages.auth.status.success.resendSuccess })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.resendErrorDefault
      if (authService.isAxiosError(error)) {
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
      set({ createPasswordSubmitting: true, errorMessage: null, successMessage: null })
      await authService.createPassword(payload)
      authSessionStorage.clearPendingPasswordToken()
      set({
        pendingPasswordToken: null,
        pendingPasswordTokenIssuedAt: null,
        successMessage: messages.auth.status.success.createPasswordSuccess,
      })
      return true
    } catch (error) {
      let message = messages.auth.status.errors.createPasswordErrorDefault
      if (authService.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = messages.auth.status.errors.createPasswordInvalid
        if (status === 404) message = messages.auth.status.errors.createPasswordNotFound
      }
      set({ errorBack: error, errorMessage: message })
      return false
    } finally {
      set({ createPasswordSubmitting: false })
    }
  },

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

  reset: () => {
    authSessionStorage.clearPendingPasswordToken()
    authSessionStorage.clearPendingRecoveryEmail()
    set({
      pendingPasswordToken: null,
      pendingPasswordTokenIssuedAt: null,
      pendingRecoveryEmail: null,
      errorMessage: null,
      successMessage: null,
    })
  },
}))
