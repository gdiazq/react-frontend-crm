import type {
  UserCreatePayload,
  UserDetail,
  UserUpdatePayload,
  UserTableRow,
  UsersAdvancedFilters,
  UsersPagination,
  UsersQueryParams,
  UsersSortBy,
  UsersSortDir,
} from './users'
import type { OperationKey, OperationStatus } from '../common'

export interface UsersStore {
  // State
  usersRows: UserTableRow[]
  userDetail: UserDetail | null
  pagination: UsersPagination
  queryParams: UsersQueryParams
  exportingCsv: boolean
  importingCsv: boolean
  // Loading
  // Messages
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  // Actions
  getUsers: () => Promise<void>
  getUserDetail: (userId: string) => Promise<UserDetail | null>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setAdvancedFilters: (filters: UsersAdvancedFilters) => void
  clearAdvancedFilters: () => void
  searchUsers: () => Promise<void>
  sortUsers: (sortBy: UsersSortBy, sortDir: UsersSortDir) => Promise<void>
  clearUserDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
  createUser: (payload: UserCreatePayload) => Promise<boolean>
  updateUser: (payload: UserUpdatePayload) => Promise<boolean>
  toggleUserStatus: (userId: string, nextStatus: boolean) => Promise<boolean>
  exportUsersCsv: () => Promise<boolean>
  importUsersCsv: (file: File) => Promise<string | null>
}
