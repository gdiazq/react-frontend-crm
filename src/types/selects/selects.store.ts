import type {
  SelectPermissionOption,
  SelectRoleOption,
  SelectStatusOption,
  SelectUserEmailOption,
  SelectUserNameOption,
} from './selects'

export interface SelectsStore {
  roleOptions: SelectRoleOption[]
  permissionOptions: SelectPermissionOption[]
  userNameOptions: SelectUserNameOption[]
  userEmailOptions: SelectUserEmailOption[]
  statusOptions: SelectStatusOption[]
  loadingRoleOptions: boolean
  loadingPermissionOptions: boolean
  loadingStatusOptions: boolean
  loadingUsersFilterOptions: boolean
  roleOptionsErrorMessage: string | null
  permissionOptionsErrorMessage: string | null
  statusOptionsErrorMessage: string | null
  usersFilterOptionsErrorMessage: string | null
  errorBack: unknown | null
  getRoleOptions: () => Promise<void>
  getPermissionOptions: () => Promise<void>
  getStatusOptions: () => Promise<void>
  getUsersFilterOptions: () => Promise<void>
  clearRoleOptionsStatus: () => void
  clearPermissionOptionsStatus: () => void
  clearStatusOptionsStatus: () => void
  clearUsersFilterOptionsStatus: () => void
}
