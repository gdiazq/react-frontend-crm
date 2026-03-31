import type { Pagination } from '../common'

export interface SafetyComplianceRaw {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SafetyComplianceDetail {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SafetyComplianceDetailView {
  nameDisplay: string
  descriptionDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface SafetyComplianceCreateForm {
  name: string
  description: string
  active: string
}

export interface SafetyComplianceCreatePayload {
  name: string
  description?: string
  active: boolean
}

export interface SafetyComplianceUpdatePayload {
  id: number
  name: string
  description?: string
  active: boolean
}

export interface SafetyComplianceCreateResponse {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SafetyComplianceTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type SafetyComplianceSortBy = 'name' | 'description' | 'active' | 'createdAt' | 'updatedAt'
export type SafetyComplianceSortDir = 'asc' | 'desc'

export type SafetyCompliancePagination = Pagination

export interface SafetyComplianceQueryParams {
  page: number
  size: number
  search: string
  active: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: SafetyComplianceSortBy
  sortDir: SafetyComplianceSortDir
}

export interface SafetyCompliancePagedResponse {
  content: SafetyComplianceRaw[]
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
