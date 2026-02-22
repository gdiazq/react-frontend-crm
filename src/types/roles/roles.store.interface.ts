import type {
  RoleTableRow,
  RolesPagination,
  RolesQueryParams,
  RolesSortBy,
  RolesSortDir,
} from './roles.interface'

export interface RolesStore {
  rolesRows: RoleTableRow[]
  pagination: RolesPagination
  queryParams: RolesQueryParams
  loadingRoles: boolean
  errorMessage: string | null
  errorBack: unknown | null
  getRoles: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  searchRoles: () => Promise<void>
  sortRoles: (sortBy: RolesSortBy, sortDir: RolesSortDir) => Promise<void>
  clearStatus: () => void
}
