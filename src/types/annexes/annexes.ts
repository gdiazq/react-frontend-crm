import type { Pagination } from '../common'

export interface AnnexRaw {
  id: number
  status: string
  employeeId: number
  employeeFullName: string
  employeeIdentification: string
  contractId: number
  annexTypeId: number
  annexTypeName: string
  requireApproval: boolean
  date: string
  description?: string | null
  hrRequestId?: number | null
  createdAt: string
  updatedAt?: string | null
}

export interface AnnexDocument {
  id: number
  fileName: string
  fileUrl?: string | null
  uploadedAt?: string | null
}

export interface AnnexDetail {
  id: number
  status: string
  employeeId: number
  employeeFullName?: string | null
  employeeIdentification?: string | null
  contractId: number
  annexTypeId: number
  annexTypeName?: string | null
  requireApproval: boolean
  date: string
  description?: string | null
  documents?: AnnexDocument[]
  hrRequestId?: number | null
  createdAt?: string
  updatedAt?: string | null
}

export interface AnnexCreateForm {
  employeeId: string
  contractId: string
  annexTypeId: string
  date: string
  description: string
}

export interface AnnexCreatePayload {
  employeeId: number
  contractId: number
  annexTypeId: number
  date: string
  description: string | null
}

export interface AnnexUpdatePayload {
  id: number
  annexTypeId: number
  date: string
  description: string | null
}

export interface AnnexCreateResponse {
  id: number
  annexTypeName?: string | null
  date: string
  createdAt?: string
}

export interface AnnexDetailDocumentView {
  id: number
  fileName: string
  uploadedAtDisplay: string
  url: string
}

export interface AnnexDetailView {
  id: number
  statusName: string
  employeeName: string
  employeeIdentification: string
  contractId: number
  annexTypeName: string
  requireApproval: boolean
  requireApprovalDisplay: string
  dateDisplay: string
  descriptionText: string
  documents: AnnexDetailDocumentView[]
  hrRequestId: number | null
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface AnnexTableRow {
  id: string
  active: boolean
  values: string[]
}

export type AnnexesSortBy =
  | 'createdAt'
  | 'date'
  | 'status'
  | 'firstName'
  | 'paternalLastName'
  | 'identification'

export type AnnexesSortDir = 'asc' | 'desc'

export type AnnexesPagination = Pagination

export interface AnnexesQueryParams {
  page: number
  size: number
  search: string
  status: string
  annexTypeId: string
  contractId: string
  dateFrom: string
  dateTo: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: AnnexesSortBy
  sortDir: AnnexesSortDir
}

export interface AnnexPagedResponse {
  content: AnnexRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  first?: boolean
  last?: boolean
}

export interface AnnexByContractItem {
  id: number
  status: string
  employeeId: number
  contractId: number
  annexTypeId: number
  annexTypeName: string
  date: string
  documents: AnnexDocument[]
  hrRequestId?: number | null
  createdAt: string
  updatedAt?: string | null
}
