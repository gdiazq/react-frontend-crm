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
  loadingUsersFilterOptions: boolean
  roleOptionsErrorMessage: string | null
  usersFilterOptionsErrorMessage: string | null
  errorBack: unknown | null
  getRoleOptions: () => Promise<void>
  getUsersFilterOptions: () => Promise<void>
  clearRoleOptionsStatus: () => void
  clearUsersFilterOptionsStatus: () => void
}
