import type { Pagination } from '../common'

export interface OvertimeRaw {
  id: number
  employeeId: number
  employeeName: string
  contractId?: number | null
  costCenter?: number | null
  projectName?: string | null
  overtimeTypeId: number
  overtimeTypeName: string
  surchargePercent?: number | null
  attendanceId?: number | null
  date: string
  startTime: string
  endTime: string
  hours?: number | null
  reason?: string | null
  currentStatusName: string
  createdAt: string
  updatedAt?: string | null
}

export interface OvertimeTypeRaw {
  id: number
  name: string
  description?: string | null
  surchargePercent?: number | null
  nightShift?: boolean | null
  holiday?: boolean | null
  active?: boolean | null
}

export interface OvertimeTableRow {
  id: string
  employeeId: number
  costCenter?: number | null
  overtimeTypeId: number
  values: string[]
}

export type OvertimeSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'employeeName'
  | 'costCenter'
  | 'projectName'
  | 'date'
  | 'startTime'
  | 'endTime'
  | 'hours'
  | 'overtimeTypeName'
  | 'currentStatusName'

export type OvertimeSortDir = 'asc' | 'desc'

export interface OvertimePagination extends Pagination {
  pending: number
}

export interface OvertimeQueryParams {
  page: number
  size: number
  employeeId: string
  costCenter: string
  statusId: string
  dateFrom: string
  dateTo: string
  overtimeTypeId: string
  sortBy: OvertimeSortBy
  sortDir: OvertimeSortDir
}

export interface OvertimePagedResponse {
  content: OvertimeRaw[]
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
