export interface PreLoginStore {
  preLoginSubmitting: boolean
  loginError: boolean
  mfaRequired: boolean
  errorMessage: string
  preLogin: (email: string) => Promise<boolean>
  getPreLoginEmail: () => string
  getPreLoginMfaRequired: () => boolean
  clearPreLoginSession: () => void
  resetStatus: () => void
}
