import type { AuthPreLoginForm, AuthPreLoginPayload, AuthPreLoginResponse } from '@/types'

export function mapperPreLoginPayload(form: AuthPreLoginForm): AuthPreLoginPayload {
  return { email: form.email.trim() }
}

export function mapperPreLoginMfaRequired(response: AuthPreLoginResponse): boolean {
  return response.mfaRequired === true || response.mfa_required === true
}
