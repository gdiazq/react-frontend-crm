import type {
  AttendanceCreatePayload,
  AttendanceDetail,
  AttendanceMarkCreatePayload,
  AttendanceMarkRaw,
  AttendanceMarkUpdatePayload,
  AttendancePagination,
  AttendanceQueryParams,
  AttendanceSortBy,
  AttendanceSortDir,
  AttendanceTableRow,
  AttendanceUpdatePayload,
} from './attendance'
import type { OperationKey, OperationStatus } from '../common'

export interface AttendanceStore {
  attendanceRows: AttendanceTableRow[]
  attendanceDetail: AttendanceDetail | null
  attendanceMarks: AttendanceMarkRaw[]
  pagination: AttendancePagination
  queryParams: AttendanceQueryParams
  loadingAttendance: boolean
  loadingAttendanceDetail: boolean
  loadingAttendanceMarks: boolean
  createAttendanceSubmitting: boolean
  updateAttendanceSubmitting: boolean
  deleteAttendanceSubmitting: boolean
  createAttendanceMarkSubmitting: boolean
  updateAttendanceMarkSubmitting: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getAttendance: () => Promise<void>
  getAttendanceDetail: (attendanceId: string) => Promise<AttendanceDetail | null>
  clearAttendanceDetail: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setEmployeeFilter: (employeeId: string) => void
  setCostCenterFilter: (costCenter: string) => void
  setStatusFilter: (statusId: string) => void
  setDateRange: (payload: { dateFrom: string, dateTo: string }) => void
  setCreatedDateRange: (payload: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (payload: { updatedFrom: string, updatedTo: string }) => void
  clearEmployeeFilter: () => void
  clearCostCenterFilter: () => void
  clearStatusFilter: () => void
  clearDateRange: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchAttendance: () => Promise<void>
  sortAttendance: (sortBy: AttendanceSortBy, sortDir: AttendanceSortDir) => Promise<void>
  createAttendance: (payload: AttendanceCreatePayload) => Promise<boolean>
  updateAttendance: (payload: AttendanceUpdatePayload) => Promise<boolean>
  deleteAttendance: (attendanceId: string) => Promise<boolean>
  getAttendanceMarksByAttendance: (attendanceId: number) => Promise<AttendanceMarkRaw[]>
  clearAttendanceMarks: () => void
  createAttendanceMark: (payload: AttendanceMarkCreatePayload) => Promise<boolean>
  updateAttendanceMark: (payload: AttendanceMarkUpdatePayload) => Promise<boolean>
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
