export interface AuthPreLoginPayload {
  email: string
}

export interface AuthPreLoginForm {
  email: string
}

export interface AuthPreLoginResponse {
  mfaRequired?: boolean
  mfa_required?: boolean
}
