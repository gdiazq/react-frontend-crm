export interface AuthLoginPayload {
  email: string
  password: string
  totpCode?: string
}

export interface AuthLoginErrorResponse {
  message?: string
  error?: string
  mfaRequired?: boolean
  mfa_required?: boolean
}

export interface AuthRegisterPayload {
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface AuthVerifyEmailPayload {
  email: string
  code: string
}

export interface AuthVerifyEmailResponse {
  message: string
  token: string
}

export interface AuthCreatePasswordPayload {
  token: string
  newPassword: string
}

export interface AuthForgotPasswordPayload {
  email: string
}

export interface AuthCheckEmailResponse {
  available: boolean
}

export interface AuthResendVerificationPayload {
  email: string
  phoneNumber: string
}
