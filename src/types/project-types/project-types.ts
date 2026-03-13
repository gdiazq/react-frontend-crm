export interface ProjectTypeRaw {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectTypeDetail {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectTypeDetailView {
  nameDisplay: string
  descriptionDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface ProjectTypeCreateForm {
  name: string
  description: string
  active: string
}

export interface ProjectTypeCreatePayload {
  name: string
  description?: string
  active: boolean
}

export interface ProjectTypeUpdatePayload {
  id: number
  name: string
  description?: string
  active: boolean
}

export interface ProjectTypeCreateResponse {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectTypeTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type ProjectTypesSortBy = 'name' | 'description' | 'active' | 'createdAt' | 'updatedAt'

export type ProjectTypesSortDir = 'asc' | 'desc'

export interface ProjectTypesPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

export interface ProjectTypesQueryParams {
  page: number
  size: number
  search: string
  active: string
  sortBy: ProjectTypesSortBy
  sortDir: ProjectTypesSortDir
}

export interface ProjectTypePagedResponse {
  content: ProjectTypeRaw[]
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
