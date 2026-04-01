import type { Pagination } from '../common'

export interface NoRehireCauseRaw {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface NoRehireCauseDetail {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface NoRehireCauseDetailView {
  nameDisplay: string
  descriptionDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface NoRehireCauseCreateForm {
  name: string
  description: string
  active: string
}

export interface NoRehireCauseCreatePayload {
  name: string
  description?: string
  active: boolean
}

export interface NoRehireCauseUpdatePayload {
  id: number
  name: string
  description?: string
  active: boolean
}

export interface NoRehireCauseCreateResponse {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface NoRehireCauseTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type NoRehireCauseSortBy = 'name' | 'description' | 'active' | 'createdAt' | 'updatedAt'
export type NoRehireCauseSortDir = 'asc' | 'desc'

export type NoRehireCausePagination = Pagination

export interface NoRehireCauseQueryParams {
  page: number
  size: number
  search: string
  active: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: NoRehireCauseSortBy
  sortDir: NoRehireCauseSortDir
}

export interface NoRehireCausePagedResponse {
  content: NoRehireCauseRaw[]
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
