export interface ProjectStatusRaw {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectStatusDetail {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectStatusDetailView {
  nameDisplay: string
  descriptionDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface ProjectStatusCreateForm {
  name: string
  description: string
}

export interface ProjectStatusCreatePayload {
  name: string
  description?: string
}

export interface ProjectStatusUpdatePayload {
  id: number
  name: string
  description?: string
}

export interface ProjectStatusCreateResponse {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectStatusTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type ProjectStatusesSortBy = 'name' | 'description' | 'active' | 'createdAt' | 'updatedAt'

export type ProjectStatusesSortDir = 'asc' | 'desc'

export interface ProjectStatusesPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

export interface ProjectStatusesQueryParams {
  page: number
  size: number
  search: string
  active: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: ProjectStatusesSortBy
  sortDir: ProjectStatusesSortDir
}

export interface ProjectStatusPagedResponse {
  content: ProjectStatusRaw[]
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
