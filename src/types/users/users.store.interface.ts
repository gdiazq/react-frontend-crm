import type {
  UserCreatePayload,
  UserDetail,
  UserTableRow,
  UsersPagination,
  UsersQueryParams,
  UsersSortBy,
  UsersSortDir,
} from './users.interface'

export interface UsersStore {
  // State
  usersRows: UserTableRow[]
  userDetail: UserDetail | null
  pagination: UsersPagination
  queryParams: UsersQueryParams
  // Loading
  loadingUsers: boolean
  loadingUserDetail: boolean
  createUserSubmitting: boolean
  loadingToggleStatus: boolean
  // Messages
  errorMessage: string | null
  detailErrorMessage: string | null
  createUserErrorMessage: string | null
  createUserSuccessMessage: string | null
  errorBack: unknown | null
  // Actions
  getUsers: () => Promise<void>
  getUserDetail: (userId: string) => Promise<boolean>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  searchUsers: () => Promise<void>
  sortUsers: (sortBy: UsersSortBy, sortDir: UsersSortDir) => Promise<void>
  clearUserDetail: () => void
  clearCreateUserStatus: () => void
  mutationCreateUser: (payload: UserCreatePayload) => Promise<boolean>
  mutationToggleUserStatus: (userId: string, nextStatus: boolean) => Promise<boolean>
}
