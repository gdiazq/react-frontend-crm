import type { PermissionActionValue, PermissionModuleValue } from '@/constant'
import type { AlertsCore, ModulePermission } from '../common/common'
import type { AuthUser } from './auth'
import type { AuthLoginPayload } from './auth.payload'

export type PermissionType = PermissionActionValue

export interface AuthStore {
  // State
  user: AuthUser | null
  permissions: ModulePermission[]
  // Loading
  loginSubmitting: boolean
  githubOAuthSubmitting: boolean
  loadingUser: boolean
  // Messages
  loginError: boolean
  mfaRequired: boolean
  messageAlert: AlertsCore
  successMessage: string | null
  errorMessage: string | null
  githubOAuthError: string | null
  errorBack: unknown | null
  // Actions
  login: (credentials: AuthLoginPayload) => Promise<boolean>
  startGithubOAuth: () => Promise<boolean>
  clearGithubOAuthStatus: () => void
  getCurrentUser: () => Promise<void>
  logout: () => Promise<void>
  reset: () => void
  clearMfaRequired: () => void
  hasPermission: (moduleName: PermissionModuleValue | string, permissionType: PermissionType) => boolean
}
