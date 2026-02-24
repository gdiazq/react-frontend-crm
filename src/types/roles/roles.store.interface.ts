import type {
  RoleCreatePayload,
  RoleRaw,
  RoleTableRow,
  RolesPagination,
  RolesQueryParams,
  RolesSortBy,
  RolesSortDir,
} from './roles.interface'

export interface RolesStore {
  rolesRaw: RoleRaw[]
  rolesRows: RoleTableRow[]
  pagination: RolesPagination
  queryParams: RolesQueryParams
  loadingRoles: boolean
  createRoleSubmitting: boolean
  loadingToggleStatus: boolean
  errorMessage: string | null
  createRoleErrorMessage: string | null
  createRoleSuccessMessage: string | null
  errorBack: unknown | null
  getRoles: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  searchRoles: () => Promise<void>
  sortRoles: (sortBy: RolesSortBy, sortDir: RolesSortDir) => Promise<void>
  mutationCreateRole: (payload: RoleCreatePayload) => Promise<boolean>
  mutationToggleRoleStatus: (roleId: string, nextStatus: boolean) => Promise<boolean>
  clearCreateRoleStatus: () => void
  clearStatus: () => void
}
