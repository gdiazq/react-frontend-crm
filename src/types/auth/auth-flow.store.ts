import type {
  AuthCreatePasswordPayload,
  AuthForgotPasswordPayload,
  AuthRegisterPayload,
  AuthRegisterResult,
  AuthResendVerificationPayload,
  AuthVerifyEmailPayload,
} from './auth.payload'

export interface AuthFlowStore {
  // Loading
  registerSubmitting: boolean
  forgotPasswordSubmitting: boolean
  verifySubmitting: boolean
  createPasswordSubmitting: boolean
  resendSubmitting: boolean
  // Messages
  errorMessage: string | null
  successMessage: string | null
  errorBack: unknown | null
  // Session
  pendingVerifyEmail: string | null
  pendingVerifyPhone: string | null
  pendingRecoveryEmail: string | null
  pendingPasswordToken: string | null
  pendingPasswordTokenIssuedAt: number | null
  // Actions
  register: (payload: AuthRegisterPayload) => Promise<AuthRegisterResult>
  verifyEmail: (payload: AuthVerifyEmailPayload) => Promise<string | null>
  forgotPassword: (payload: AuthForgotPasswordPayload) => Promise<boolean>
  resendVerification: (payload: AuthResendVerificationPayload) => Promise<boolean>
  createPassword: (payload: AuthCreatePasswordPayload) => Promise<boolean>
  // Setters
  setPendingVerifyEmail: (email: string) => void
  setPendingVerifyPhone: (phone: string) => void
  setPendingRecoveryEmail: (email: string) => void
  setPendingPasswordToken: (token: string) => void
  clearPendingPasswordToken: () => void
  reset: () => void
}
