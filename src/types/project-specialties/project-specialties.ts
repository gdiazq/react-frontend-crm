import type { Pagination } from '../common'

export interface ProjectSpecialtyRaw {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectSpecialtyDetail {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectSpecialtyDetailView {
  nameDisplay: string
  descriptionDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface ProjectSpecialtyCreateForm {
  name: string
  description: string
}

export interface ProjectSpecialtyCreatePayload {
  name: string
  description?: string
}

export interface ProjectSpecialtyUpdatePayload {
  id: number
  name: string
  description?: string
}

export interface ProjectSpecialtyCreateResponse {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectSpecialtyTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type ProjectSpecialtiesSortBy = 'name' | 'description' | 'active' | 'createdAt' | 'updatedAt'

export type ProjectSpecialtiesSortDir = 'asc' | 'desc'

export type ProjectSpecialtiesPagination = Pagination

export interface ProjectSpecialtiesQueryParams {
  page: number
  size: number
  search: string
  active: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: ProjectSpecialtiesSortBy
  sortDir: ProjectSpecialtiesSortDir
}

export interface ProjectSpecialtyPagedResponse {
  content: ProjectSpecialtyRaw[]
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
