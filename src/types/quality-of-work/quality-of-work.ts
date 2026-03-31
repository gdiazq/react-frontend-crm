import type { Pagination } from '../common'

export interface QualityOfWorkRaw {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface QualityOfWorkDetail {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface QualityOfWorkDetailView {
  nameDisplay: string
  descriptionDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface QualityOfWorkCreateForm {
  name: string
  description: string
  active: string
}

export interface QualityOfWorkCreatePayload {
  name: string
  description?: string
  active: boolean
}

export interface QualityOfWorkUpdatePayload {
  id: number
  name: string
  description?: string
  active: boolean
}

export interface QualityOfWorkCreateResponse {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface QualityOfWorkTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type QualityOfWorkSortBy = 'name' | 'description' | 'active' | 'createdAt' | 'updatedAt'
export type QualityOfWorkSortDir = 'asc' | 'desc'

export type QualityOfWorkPagination = Pagination

export interface QualityOfWorkQueryParams {
  page: number
  size: number
  search: string
  active: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: QualityOfWorkSortBy
  sortDir: QualityOfWorkSortDir
}

export interface QualityOfWorkPagedResponse {
  content: QualityOfWorkRaw[]
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
