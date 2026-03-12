import type { ModulePermission } from '../common/common'

export interface LoginResponse {
  user: AuthUser
  modules?: ModulePermission[]
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string | null
  avatarUrl?: string | null
  roles: string[]
  permissions?: string[]
}

export interface PasswordRequirement {
  key: 'lowercase' | 'uppercase' | 'number' | 'specialChar' | 'minLength'
  label: string
  valid: boolean
}
