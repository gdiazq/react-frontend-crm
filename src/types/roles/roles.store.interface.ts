import type {
  RoleCreatePayload,
  RoleDetail,
  RoleUpdatePayload,
  RoleRaw,
  RoleTableRow,
  RolesPagination,
  RolesQueryParams,
  RolesSortBy,
  RolesSortDir,
} from './roles.interface'

export interface RolesStore {
  rolesRaw: RoleRaw[]
  roleDetail: RoleDetail | null
  rolesRows: RoleTableRow[]
  pagination: RolesPagination
  queryParams: RolesQueryParams
  loadingRoles: boolean
  loadingRoleDetail: boolean
  createRoleSubmitting: boolean
  updateRoleSubmitting: boolean
  loadingToggleStatus: boolean
  errorMessage: string | null
  detailErrorMessage: string | null
  createRoleErrorMessage: string | null
  createRoleSuccessMessage: string | null
  updateRoleErrorMessage: string | null
  updateRoleSuccessMessage: string | null
  errorBack: unknown | null
  getRoles: () => Promise<void>
  getRoleDetail: (roleId: string) => Promise<RoleDetail | null>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setStatusFilter: (status: string) => void
  clearStatusFilter: () => void
  searchRoles: () => Promise<void>
  sortRoles: (sortBy: RolesSortBy, sortDir: RolesSortDir) => Promise<void>
  mutationCreateRole: (payload: RoleCreatePayload) => Promise<boolean>
  mutationUpdateRole: (payload: RoleUpdatePayload) => Promise<boolean>
  mutationToggleRoleStatus: (roleId: string, nextStatus: boolean) => Promise<boolean>
  clearRoleDetail: () => void
  clearDetailError: () => void
  clearCreateRoleStatus: () => void
  clearUpdateRoleStatus: () => void
  clearStatus: () => void
}
