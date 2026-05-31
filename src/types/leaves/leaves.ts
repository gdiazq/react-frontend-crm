import type { Pagination } from '../common'

export interface LeaveDocument {
  id: number
  fileName: string
  contentType?: string | null
  size?: number | null
  url?: string | null
  entityType?: string | null
  entityId?: number | null
  createdAt?: string | null
}

export interface LeaveRaw {
  id: number
  status: string
  employeeId: number
  employeeFullName: string
  employeeIdentification: string
  contractId: number
  leaveTypeId: number
  leaveTypeName: string
  paid: boolean
  requiresDocument: boolean
  requireApproval: boolean
  startDate: string
  endDate: string
  halfDay: boolean
  totalDays: number
  reason?: string | null
  documents?: LeaveDocument[]
  hrRequestId?: number | null
  createdAt: string
  updatedAt?: string | null
}

export type LeaveDetail = LeaveRaw

export interface LeaveCreateForm {
  employeeId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  halfDay: string
  reason: string
}

export type LeaveFormField = keyof LeaveCreateForm

export interface LeaveFormSelectOption {
  label: string
  value: string
}

export interface LeavesFilterForm {
  status: string
  leaveTypeId: string
  employeeId: string
  startFrom: string
  startTo: string
  endFrom: string
  endTo: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
}

export type LeavesFilterPayload = LeavesFilterForm

export interface LeaveCreatePayload {
  employeeId: number
  leaveTypeId: number
  startDate: string
  endDate: string
  halfDay: boolean
  reason: string | null
}

export interface LeaveUpdatePayload {
  id: number
  leaveTypeId: number
  startDate: string
  endDate: string
  halfDay: boolean
  reason: string | null
}

export type LeaveCreateResponse = LeaveDetail
export type LeaveUpdateResponse = LeaveDetail

export interface LeaveDetailDocumentView {
  id: number
  fileName: string
  contentType: string
  sizeDisplay: string
  createdAtDisplay: string
  url: string
}

export interface LeaveDetailView {
  id: number
  statusName: string
  employeeId: number
  employeeName: string
  employeeIdentification: string
  leaveTypeId: number
  leaveTypeName: string
  paid: boolean
  paidDisplay: string
  requiresDocument: boolean
  requiresDocumentDisplay: string
  requireApproval: boolean
  requireApprovalDisplay: string
  startDateDisplay: string
  endDateDisplay: string
  halfDay: boolean
  halfDayDisplay: string
  totalDaysDisplay: string
  reasonText: string
  documents: LeaveDetailDocumentView[]
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface LeaveTableRow {
  id: string
  status: string
  displayName: string
  values: string[]
}

export type LeavesSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'leaveTypeName'
  | 'employeeFullName'
  | 'employeeIdentification'
  | 'totalDays'

export type LeavesSortDir = 'asc' | 'desc'

export interface LeavesPagination extends Pagination {
  pending: number
}

export interface LeavesQueryParams {
  page: number
  size: number
  search: string
  status: string
  leaveTypeId: string
  employeeId: string
  startFrom: string
  startTo: string
  endFrom: string
  endTo: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: LeavesSortBy
  sortDir: LeavesSortDir
}

export interface LeavePagedResponse {
  content: LeaveRaw[]
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
}
