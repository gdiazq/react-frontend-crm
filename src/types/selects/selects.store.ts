import type {
  SelectPermissionOption,
  SelectProjectSpecialtyOption,
  SelectRoleOption,
  SelectStatusOption,
  SelectUserEmailOption,
  SelectUserNameOption,
} from './selects'

export interface SelectsStore {
  roleOptions: SelectRoleOption[]
  permissionOptions: SelectPermissionOption[]
  projectSpecialtyOptions: SelectProjectSpecialtyOption[]
  userNameOptions: SelectUserNameOption[]
  userEmailOptions: SelectUserEmailOption[]
  statusOptions: SelectStatusOption[]
  loadingRoleOptions: boolean
  loadingPermissionOptions: boolean
  loadingStatusOptions: boolean
  loadingUsersFilterOptions: boolean
  loadingProjectSpecialtyOptions: boolean
  roleOptionsErrorMessage: string | null
  permissionOptionsErrorMessage: string | null
  statusOptionsErrorMessage: string | null
  usersFilterOptionsErrorMessage: string | null
  projectSpecialtyOptionsErrorMessage: string | null
  errorBack: unknown | null
  getRoleOptions: () => Promise<void>
  getPermissionOptions: () => Promise<void>
  getStatusOptions: () => Promise<void>
  getUsersFilterOptions: () => Promise<void>
  getProjectSpecialtyOptions: () => Promise<void>
  clearRoleOptionsStatus: () => void
  clearPermissionOptionsStatus: () => void
  clearStatusOptionsStatus: () => void
  clearUsersFilterOptionsStatus: () => void
  clearProjectSpecialtyOptionsStatus: () => void
}
