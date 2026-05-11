import type {
  OvertimeCreatePayload,
  OvertimeDetail,
  OvertimePagination,
  OvertimeQueryParams,
  OvertimeSortBy,
  OvertimeSortDir,
  OvertimeTableRow,
  OvertimeTypeRaw,
  OvertimeUpdatePayload,
} from './overtime'
import type { OperationKey, OperationStatus } from '../common'

export interface OvertimeStore {
  overtimeRows: OvertimeTableRow[]
  overtimeDetail: OvertimeDetail | null
  overtimeTypes: OvertimeTypeRaw[]
  pagination: OvertimePagination
  queryParams: OvertimeQueryParams
  loadingOvertime: boolean
  loadingOvertimeDetail: boolean
  loadingOvertimeTypes: boolean
  createOvertimeSubmitting: boolean
  updateOvertimeSubmitting: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getOvertime: () => Promise<void>
  getOvertimeDetail: (overtimeId: string) => Promise<OvertimeDetail | null>
  clearOvertimeDetail: () => void
  getOvertimeTypes: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setEmployeeFilter: (employeeId: string) => void
  setCostCenterFilter: (costCenter: string) => void
  setStatusFilter: (statusId: string) => void
  setDateRange: (payload: { dateFrom: string, dateTo: string }) => void
  setOvertimeTypeFilter: (overtimeTypeId: string) => void
  clearEmployeeFilter: () => void
  clearCostCenterFilter: () => void
  clearStatusFilter: () => void
  clearDateRange: () => void
  clearOvertimeTypeFilter: () => void
  searchOvertime: () => Promise<void>
  sortOvertime: (sortBy: OvertimeSortBy, sortDir: OvertimeSortDir) => Promise<void>
  createOvertime: (payload: OvertimeCreatePayload) => Promise<boolean>
  updateOvertime: (payload: OvertimeUpdatePayload) => Promise<boolean>
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
