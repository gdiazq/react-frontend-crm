export interface AuthLoginForm {
  email: string
  password: string
  totpCode: string
}

export interface AuthRegisterForm {
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface AuthVerifyEmailForm {
  code: string
}

export interface AuthCreatePasswordForm {
  password: string
  confirmPassword: string
}

export interface AuthForgotPasswordForm {
  email: string
}

export interface AuthResendVerificationForm {
  phoneNumber: string
}
