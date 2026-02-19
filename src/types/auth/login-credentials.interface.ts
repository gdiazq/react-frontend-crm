export interface AuthLoginCredentialsForm {
  password: string
  totpCode: string
}

export interface AuthLoginCredentialsPayload {
  email: string
  password: string
  totpCode?: string
}
