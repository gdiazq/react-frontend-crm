import axios from 'axios'
import { axiosInstance } from '@/config'
import { createDeviceIdService } from '@/utils'
import { mapperUpdateAvatarFormData } from '@/mappers'
import type {
  AuthCheckEmailResponse,
  AuthCreatePasswordPayload,
  AuthForgotPasswordPayload,
  AuthGithubOAuthUrlResponse,
  AuthLoginPayload,
  AuthPreLoginResponse,
  AuthRegisterPayload,
  AuthResendVerificationPayload,
  AuthUser,
  AuthVerifyEmailPayload,
  AuthVerifyEmailResponse,
  LoginResponse,
  SettingUpdateAvatarPayload,
  SettingUpdateProfilePayload,
} from '@/types'

const AUTH_BASE_PATH = '/auth'
const { getDeviceId } = createDeviceIdService()

export const authService = {
  login: async (credentials: AuthLoginPayload) => {
    const payload = {
      email: credentials.email,
      password: credentials.password,
      ...(credentials.totpCode ? { totpCode: credentials.totpCode } : {}),
    }

    const { data } = await axiosInstance.post<LoginResponse>(`${AUTH_BASE_PATH}/login`, payload, {
      headers: { 'X-Device-Id': getDeviceId() },
    })
    return data
  },

  getFullProfile: async () => {
    const { data } = await axiosInstance.get<AuthUser>(`${AUTH_BASE_PATH}/me`)
    return data
  },

  getGithubOAuthUrl: async () => {
    const { data } = await axiosInstance.get<AuthGithubOAuthUrlResponse>(`${AUTH_BASE_PATH}/oauth2/github`)
    return data
  },

  register: async (payload: AuthRegisterPayload) => {
    await axiosInstance.post(`${AUTH_BASE_PATH}/register`, payload)
  },

  preLogin: async (email: string) => {
    const { data } = await axiosInstance.post<AuthPreLoginResponse>(`${AUTH_BASE_PATH}/pre-login`, {
      email: email.trim(),
    })
    return data
  },

  checkEmailAvailability: async (email: string) => {
    const { data } = await axiosInstance.get<AuthCheckEmailResponse>(`${AUTH_BASE_PATH}/check-email`, {
      params: { email },
    })
    return data
  },

  verifyEmail: async (payload: AuthVerifyEmailPayload) => {
    const { data } = await axiosInstance.post<AuthVerifyEmailResponse>(`${AUTH_BASE_PATH}/verify-email`, payload)
    return data
  },

  forgotPassword: async (payload: AuthForgotPasswordPayload) => {
    await axiosInstance.post(`${AUTH_BASE_PATH}/forgot-password`, payload)
  },

  resendVerification: async (payload: AuthResendVerificationPayload) => {
    await axiosInstance.post(`${AUTH_BASE_PATH}/resend-verification`, payload)
  },

  createPassword: async (payload: AuthCreatePasswordPayload) => {
    await axiosInstance.post(`${AUTH_BASE_PATH}/create-password`, payload)
  },

  getCurrentUser: async () => {
    const { data } = await axiosInstance.get<AuthUser>(`${AUTH_BASE_PATH}/me`)
    return data
  },

  logout: async () => {
    await axiosInstance.post(`${AUTH_BASE_PATH}/logout`)
  },

  updateProfile: async (payload: SettingUpdateProfilePayload) => {
    await axiosInstance.put('/user/update', payload)
  },

  updateAvatar: async (userId: number, payload: SettingUpdateAvatarPayload) => {
    const formData = mapperUpdateAvatarFormData(payload)
    await axiosInstance.post(`/user/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  requestWsTicket: async () => {
    const { data } = await axiosInstance.get<{ ticket?: string }>(`${AUTH_BASE_PATH}/ws-ticket`)
    return typeof data.ticket === 'string' ? data.ticket : ''
  },

  isAxiosError: axios.isAxiosError,
}
