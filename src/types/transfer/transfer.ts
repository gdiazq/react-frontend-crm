import type { Pagination } from '../common'

export interface TransferDocument {
  id: number
  fileName: string
  url: string | null
  uploadedAt: string
}

export interface TransferDocumentView {
  id: number
  fileName: string
  url: string
}

export interface TransferRaw {
  id: number
  status: string
  employeeId: number
  employeeFullName: string
  employeeIdentification: string
  fromCostCenter: number
  fromCostCenterName: string
  toCostCenter: number
  toCostCenterName: string
  effectiveDate: string
  reason: string
  documents: TransferDocument[]
  hrRequestId: number | null
  createdAt: string
  updatedAt: string
}

export type TransferDetail = TransferRaw

export interface TransferDetailView {
  statusDisplay: string
  employeeFullNameDisplay: string
  employeeIdentificationDisplay: string
  fromCostCenterNameDisplay: string
  toCostCenterNameDisplay: string
  effectiveDateDisplay: string
  reasonDisplay: string
  hrRequestIdDisplay: string
  createdAtDisplay: string
  updatedAtDisplay: string
  documents: TransferDocumentView[]
}

export interface TransferCreateForm {
  employeeId: string
  toCostCenter: string
  effectiveDate: string
  reason: string
}

export interface TransferCreatePayload {
  employeeId: number
  toCostCenter: number
  effectiveDate: string
  reason: string
}

export interface TransferUpdatePayload {
  id: number
  toCostCenter: number
  effectiveDate: string
  reason: string
}

export type TransferCreateResponse = TransferRaw

export interface TransferTableRow {
  id: string
  values: string[]
}

export type TransferSortBy = 'employeeFullName' | 'effectiveDate' | 'status' | 'createdAt' | 'updatedAt'
export type TransferSortDir = 'asc' | 'desc'

export type TransferPagination = Pagination

export interface TransferQueryParams {
  page: number
  size: number
  search: string
  status: string
  sortBy: TransferSortBy
  sortDir: TransferSortDir
}

export interface TransferPagedResponse {
  content: TransferRaw[]
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
