import type { UserTableRow, UsersPagination, UsersQueryParams, UsersSortBy, UsersSortDir } from './users.interface'

export interface UsersStore {
  // State
  usersRows: UserTableRow[]
  pagination: UsersPagination
  queryParams: UsersQueryParams
  // Loading
  loadingUsers: boolean
  loadingToggleStatus: boolean
  // Messages
  errorMessage: string | null
  errorBack: unknown | null
  // Actions
  getUsers: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  searchUsers: () => Promise<void>
  sortUsers: (sortBy: UsersSortBy, sortDir: UsersSortDir) => Promise<void>
  mutationToggleUserStatus: (userId: string, nextStatus: boolean) => Promise<boolean>
}
