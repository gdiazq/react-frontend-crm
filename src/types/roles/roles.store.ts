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
} from './roles'
import type { OperationKey, OperationStatus } from '../common'

export interface RolesStore {
  rolesRaw: RoleRaw[]
  roleDetail: RoleDetail | null
  rolesRows: RoleTableRow[]
  pagination: RolesPagination
  queryParams: RolesQueryParams
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
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
  createRole: (payload: RoleCreatePayload, permissionIds: number[]) => Promise<boolean>
  updateRole: (payload: RoleUpdatePayload, permissionIds: number[]) => Promise<boolean>
  toggleRoleStatus: (roleId: string, nextStatus: boolean) => Promise<boolean>
  clearRoleDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
