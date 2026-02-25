export interface RoleRaw {
  id: number
  name: string
  description: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface RolePermission {
  id: number
  name: string
  description?: string | null
}

export interface RoleDetail {
  id: number
  name: string
  description?: string | null
  enabled: boolean
  permissions: RolePermission[]
  createdAt: string
  updatedAt: string
}

export interface RoleDetailView {
  roleNameDisplay: string
  descriptionDisplay: string
  enabled: boolean
  permissionsDisplay: Array<{
    id: number
    name: string
    description: string
  }>
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface RoleCreateForm {
  name: string
  description: string
}

export interface RoleCreatePayload {
  name: string
  description?: string
}

export interface RoleUpdatePayload {
  id: number
  name: string
  description?: string
}

export interface RoleCreateResponse {
  id: number
  name: string
  description?: string | null
  enabled: boolean
  createdAt: string
  updatedAt?: string | null
}

export interface RoleTableRow {
  id: string
  values: string[]
  status?: boolean
}

export type RolesSortBy = 'name' | 'description' | 'enabled' | 'createdAt' | 'updatedAt'

export type RolesSortDir = 'asc' | 'desc'

export interface RolesPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

export interface RolesQueryParams {
  page: number
  size: number
  search: string
  status: string
  sortBy: RolesSortBy
  sortDir: RolesSortDir
}

export interface RolePagedResponse {
  content: RoleRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}
