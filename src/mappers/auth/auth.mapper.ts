import { PASSWORD_MIN_LENGTH } from '@/constant'
import type {
  AuthCreatePasswordForm,
  AuthCreatePasswordPayload,
  AuthForgotPasswordForm,
  AuthForgotPasswordPayload,
  AuthLoginForm,
  AuthLoginPayload,
  AuthRegisterForm,
  AuthRegisterPayload,
  AuthResendVerificationForm,
  AuthResendVerificationPayload,
  AuthVerifyEmailForm,
  AuthVerifyEmailPayload,
  PasswordRequirement,
} from '@/types'

export function mapperLoginPayload(form: AuthLoginForm): AuthLoginPayload {
  const normalizedTotpCode = form.totpCode.trim()
  return {
    email: form.email.trim(),
    password: form.password,
    ...(normalizedTotpCode ? { totpCode: normalizedTotpCode } : {}),
  }
}

export function mapperCreatePasswordPayload(token: string, form: AuthCreatePasswordForm): AuthCreatePasswordPayload {
  return {
    token,
    newPassword: form.password,
  }
}

export function mapperForgotPasswordPayload(form: AuthForgotPasswordForm): AuthForgotPasswordPayload {
  return { email: form.email.trim() }
}

export function mapperRegisterPayload(form: AuthRegisterForm): AuthRegisterPayload {
  return {
    username: form.username.trim(),
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phoneNumber: form.phoneNumber.trim(),
  }
}

export function mapperVerifyEmailPayload(email: string, form: AuthVerifyEmailForm): AuthVerifyEmailPayload {
  return {
    email: email.trim(),
    code: form.code.trim(),
  }
}

export function mapperResendVerificationPayload(email: string, form: AuthResendVerificationForm): AuthResendVerificationPayload {
  return {
    email: email.trim(),
    phoneNumber: form.phoneNumber.trim(),
  }
}

export function mapperPasswordRequirements(password: string, minLength = PASSWORD_MIN_LENGTH): PasswordRequirement[] {
  return [
    { key: 'lowercase', label: 'Al menos 1 letra minuscula', valid: /[a-z]/.test(password) },
    { key: 'uppercase', label: 'Al menos 1 letra mayuscula', valid: /[A-Z]/.test(password) },
    { key: 'number', label: 'Al menos 1 numero', valid: /[0-9]/.test(password) },
    { key: 'specialChar', label: 'Al menos 1 caracter especial', valid: /[^A-Za-z0-9]/.test(password) },
    { key: 'minLength', label: `Minimo ${minLength} caracteres`, valid: password.length >= minLength },
  ]
}

export function mapperMissingPasswordRequirements(requirements: PasswordRequirement[]): string[] {
  return requirements.filter((requirement) => !requirement.valid).map((requirement) => requirement.label)
}
