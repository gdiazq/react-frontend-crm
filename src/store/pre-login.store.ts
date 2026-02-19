import { create } from 'zustand'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperPreLoginMfaRequired } from '@/mappers'
import messages from '@/messages/messages'
import type { AuthPreLoginResponse } from '@/types'

const PRE_LOGIN_EMAIL_KEY = 'preLoginEmail'
const PRE_LOGIN_MFA_REQUIRED_KEY = 'preLoginMfaRequired'

interface PreLoginStore {
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

export const useStorePreLogin = create<PreLoginStore>()((set) => ({
  preLoginSubmitting: false,
  loginError: false,
  mfaRequired: false,
  errorMessage: '',

  preLogin: async (email: string) => {
    try {
      set({ preLoginSubmitting: true, loginError: false, errorMessage: '' })

      const { data } = await axiosInstance.post<AuthPreLoginResponse>('/auth/pre-login', {
        email: email.trim(),
      })

      const mfaRequired = mapperPreLoginMfaRequired(data)
      sessionStorage.setItem(PRE_LOGIN_EMAIL_KEY, email.trim())
      sessionStorage.setItem(PRE_LOGIN_MFA_REQUIRED_KEY, String(mfaRequired))
      set({ mfaRequired })
      return true
    } catch (error) {
      let errorMessage = messages.auth.preLoginInvalidEmail
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) errorMessage = messages.auth.preLoginInvalidEmailShort
      }
      set({ loginError: true, mfaRequired: false, errorMessage })
      return false
    } finally {
      set({ preLoginSubmitting: false })
    }
  },

  getPreLoginEmail: () => {
    return sessionStorage.getItem(PRE_LOGIN_EMAIL_KEY) || ''
  },

  getPreLoginMfaRequired: () => {
    return sessionStorage.getItem(PRE_LOGIN_MFA_REQUIRED_KEY) === 'true'
  },

  clearPreLoginSession: () => {
    sessionStorage.removeItem(PRE_LOGIN_EMAIL_KEY)
    sessionStorage.removeItem(PRE_LOGIN_MFA_REQUIRED_KEY)
  },

  resetStatus: () => {
    set({ loginError: false, errorMessage: '' })
  },
}))
