import type { Pagination } from '../common'

export interface LegalTerminationCauseRaw {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LegalTerminationCauseDetail {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LegalTerminationCauseDetailView {
  nameDisplay: string
  descriptionDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface LegalTerminationCauseCreateForm {
  name: string
  description: string
}

export type LegalTerminationCauseFormField = keyof LegalTerminationCauseCreateForm

export interface LegalTerminationCauseCreatePayload {
  name: string
  description?: string
}

export interface LegalTerminationCauseUpdatePayload {
  id: number
  name: string
  description?: string
}

export interface LegalTerminationCauseCreateResponse {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface LegalTerminationCauseTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type LegalTerminationCausesSortBy = 'name' | 'description' | 'active' | 'createdAt' | 'updatedAt'

export type LegalTerminationCausesSortDir = 'asc' | 'desc'

export type LegalTerminationCausesPagination = Pagination

export interface LegalTerminationCausesQueryParams {
  page: number
  size: number
  search: string
  active: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: LegalTerminationCausesSortBy
  sortDir: LegalTerminationCausesSortDir
}

export interface LegalTerminationCausesFilterForm {
  activeId: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
}

export interface LegalTerminationCausesFilterSelectOption {
  label: string
  value: string
}

export interface LegalTerminationCausePagedResponse {
  content: LegalTerminationCauseRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  pending?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}
