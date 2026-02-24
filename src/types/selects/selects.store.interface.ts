import type {
  SelectRoleOption,
  SelectStatusOption,
  SelectUserEmailOption,
  SelectUserNameOption,
} from './selects.interface'

export interface SelectsStore {
  roleOptions: SelectRoleOption[]
  userNameOptions: SelectUserNameOption[]
  userEmailOptions: SelectUserEmailOption[]
  statusOptions: SelectStatusOption[]
  loadingRoleOptions: boolean
  loadingStatusOptions: boolean
  loadingUsersFilterOptions: boolean
  roleOptionsErrorMessage: string | null
  statusOptionsErrorMessage: string | null
  usersFilterOptionsErrorMessage: string | null
  errorBack: unknown | null
  getRoleOptions: () => Promise<void>
  getStatusOptions: () => Promise<void>
  getUsersFilterOptions: () => Promise<void>
  clearRoleOptionsStatus: () => void
  clearStatusOptionsStatus: () => void
  clearUsersFilterOptionsStatus: () => void
}
