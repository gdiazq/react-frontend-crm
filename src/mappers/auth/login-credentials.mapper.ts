import type { AuthLoginCredentialsForm, AuthLoginCredentialsPayload } from '@/types'

export function mapperLoginCredentialsPayload(
  email: string,
  form: AuthLoginCredentialsForm,
): AuthLoginCredentialsPayload {
  const normalizedTotpCode = form.totpCode.trim()

  return {
    email: email.trim(),
    password: form.password,
    ...(normalizedTotpCode ? { totpCode: normalizedTotpCode } : {}),
  }
}
