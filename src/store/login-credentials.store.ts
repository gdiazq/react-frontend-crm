import { create } from 'zustand'
import { useStoreAuth } from './auth.store'
import { mapperLoginCredentialsPayload } from '@/mappers'
import type { AuthLoginCredentialsForm, LoginCredentialsStore } from '@/types'

const PRE_LOGIN_EMAIL_KEY = 'preLoginEmail'
const PRE_LOGIN_MFA_REQUIRED_KEY = 'preLoginMfaRequired'

export const useStoreLoginCredentials = create<LoginCredentialsStore>()((set) => ({
  email: '',
  mfaRequired: false,

  hydrate: () => {
    const email = sessionStorage.getItem(PRE_LOGIN_EMAIL_KEY) || ''
    const mfaRequired = sessionStorage.getItem(PRE_LOGIN_MFA_REQUIRED_KEY) === 'true'
    set({ email, mfaRequired })
    return email.length > 0
  },

  clearSession: () => {
    sessionStorage.removeItem(PRE_LOGIN_EMAIL_KEY)
    sessionStorage.removeItem(PRE_LOGIN_MFA_REQUIRED_KEY)
  },

  submitLogin: async (form: AuthLoginCredentialsForm) => {
    const storeAuth = useStoreAuth.getState()
    const email = sessionStorage.getItem(PRE_LOGIN_EMAIL_KEY) || ''
    const payload = mapperLoginCredentialsPayload(email, form)
    const success = await storeAuth.login(payload)

    if (success) {
      sessionStorage.removeItem(PRE_LOGIN_EMAIL_KEY)
      sessionStorage.removeItem(PRE_LOGIN_MFA_REQUIRED_KEY)
      return true
    }

    if (storeAuth.mfaRequired) {
      set({ mfaRequired: true })
      sessionStorage.setItem(PRE_LOGIN_MFA_REQUIRED_KEY, 'true')
    }
    return false
  },
}))
