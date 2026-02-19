export interface AuthUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string | null
  avatar_url?: string | null
  roles: string[]
}

export interface PasswordRequirement {
  key: 'lowercase' | 'uppercase' | 'number' | 'specialChar' | 'minLength'
  label: string
  valid: boolean
}
