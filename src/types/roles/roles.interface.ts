export interface RoleRaw {
  id: number
  name: string
  description: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface RoleTableRow {
  id: string
  values: string[]
}

export type RolesSortBy = 'name' | 'description' | 'enabled' | 'createdAt' | 'updatedAt'

export type RolesSortDir = 'asc' | 'desc'

export interface RolesPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface RolesQueryParams {
  page: number
  size: number
  search: string
  sortBy: RolesSortBy
  sortDir: RolesSortDir
}

export interface RolePagedResponse {
  content: RoleRaw[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}
