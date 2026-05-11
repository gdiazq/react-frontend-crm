import type { Pagination } from '../common'

export interface AttendanceRaw {
  id: number
  employeeId: number
  employeeFullName: string
  employeeIdentification: string
  contractId?: number | null
  projectAssignmentId?: number | null
  costCenter?: number | null
  projectName?: string | null
  checkInDate?: string | null
  checkInTime?: string | null
  checkOutDate?: string | null
  checkOutTime?: string | null
  totalHours?: number | null
  statusId: number
  statusName: string
  statusCode?: string | null
  generatedByLeaveId?: number | null
  manuallyOverridden?: boolean | null
  hasActiveLeave?: boolean | null
  notes?: string | null
  createdAt: string
  updatedAt?: string | null
}

export type AttendanceDetail = AttendanceRaw

export interface AttendanceCreateForm {
  employeeId: string
  costCenter: string
  date: string
  checkInTime: string
  checkOutTime: string
  statusId: string
  notes: string
}

export interface AttendanceCreatePayload {
  employeeId: number
  costCenter?: number | null
  date: string
  checkInTime?: string | null
  checkOutTime?: string | null
  statusId: number
  notes?: string | null
}

export interface AttendanceUpdatePayload extends AttendanceCreatePayload {
  id: number
}

export type AttendanceCreateResponse = AttendanceDetail
export type AttendanceUpdateResponse = AttendanceDetail

export interface AttendanceDetailView {
  id: number
  employeeName: string
  employeeIdentification: string
  costCenterDisplay: string
  projectName: string
  checkInDateDisplay: string
  checkInTimeDisplay: string
  checkOutDateDisplay: string
  checkOutTimeDisplay: string
  totalHoursDisplay: string
  statusId: number
  statusName: string
  statusCode: string
  generatedByLeaveDisplay: string
  manuallyOverriddenDisplay: string
  hasActiveLeaveDisplay: string
  notesText: string
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface AttendanceTableRow {
  id: string
  employeeId: number
  costCenter?: number | null
  statusId: number
  values: string[]
}

export type AttendanceSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'employeeFullName'
  | 'employeeIdentification'
  | 'costCenter'
  | 'projectName'
  | 'checkInDate'
  | 'checkOutDate'
  | 'checkInTime'
  | 'checkOutTime'
  | 'totalHours'
  | 'statusName'

export type AttendanceSortDir = 'asc' | 'desc'

export interface AttendancePagination extends Pagination {
  pending: number
}

export interface AttendanceQueryParams {
  page: number
  size: number
  search: string
  employeeId: string
  costCenter: string
  statusId: string
  dateFrom: string
  dateTo: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: AttendanceSortBy
  sortDir: AttendanceSortDir
}

export type AttendanceExportQueryParams = Pick<
  AttendanceQueryParams,
  'search' | 'employeeId' | 'costCenter' | 'statusId' | 'dateFrom' | 'dateTo'
>

export interface AttendancePagedResponse {
  content: AttendanceRaw[]
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

export type AttendanceMarkType = 'CHECK_IN' | 'CHECK_OUT'

export interface AttendanceMarkRaw {
  id: number
  attendanceId: number
  employeeId: number
  employeeFullName: string
  employeeIdentification: string
  projectAssignmentId?: number | null
  costCenter?: number | null
  projectName?: string | null
  date: string
  markTime: string
  markType: AttendanceMarkType
  notes?: string | null
  createdAt: string
  updatedAt?: string | null
}

export interface AttendanceMarkCreateForm {
  markType: string
  employeeId: string
  statusId: string
  costCenter: string
  date: string
  markTime: string
  notes: string
}

export interface AttendanceMarkCreatePayload {
  employeeId: number
  attendanceId?: number | null
  projectAssignmentId?: number | null
  costCenter?: number | null
  statusId?: number | null
  markTime: string
  markType: AttendanceMarkType
  notes?: string | null
}

export interface AttendanceMarkUpdatePayload extends AttendanceMarkCreatePayload {
  id: number
}

export type AttendanceMarkResponse = AttendanceMarkRaw
