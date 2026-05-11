import type {
  OvertimePagination,
  OvertimeQueryParams,
  OvertimeSortBy,
  OvertimeSortDir,
  OvertimeTableRow,
  OvertimeTypeRaw,
} from './overtime'
import type { OperationKey, OperationStatus } from '../common'

export interface OvertimeStore {
  overtimeRows: OvertimeTableRow[]
  overtimeTypes: OvertimeTypeRaw[]
  pagination: OvertimePagination
  queryParams: OvertimeQueryParams
  loadingOvertime: boolean
  loadingOvertimeTypes: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getOvertime: () => Promise<void>
  getOvertimeTypes: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
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
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
