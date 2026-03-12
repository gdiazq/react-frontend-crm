import type { AuthLoginCredentialsForm } from './login-credentials.interface'

export interface LoginCredentialsStore {
  email: string
  mfaRequired: boolean
  hydrate: () => boolean
  clearSession: () => void
  submitLogin: (form: AuthLoginCredentialsForm) => Promise<boolean>
}
