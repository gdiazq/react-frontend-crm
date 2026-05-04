import type {
  LeaveCreatePayload,
  LeaveDetail,
  LeaveUpdatePayload,
  LeavesPagination,
  LeavesQueryParams,
  LeavesSortBy,
  LeavesSortDir,
  LeaveTableRow,
} from './leaves'
import type { OperationKey, OperationStatus } from '../common'

export interface LeavesStore {
  leavesRows: LeaveTableRow[]
  leaveDetail: LeaveDetail | null
  employeeLeaves: LeaveDetail[]
  loadingEmployeeLeaves: boolean
  pagination: LeavesPagination
  queryParams: LeavesQueryParams
  loadingLeaves: boolean
  loadingLeaveDetail: boolean
  createLeaveSubmitting: boolean
  updateLeaveSubmitting: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getLeaves: () => Promise<void>
  getLeaveDetail: (leaveId: string) => Promise<LeaveDetail | null>
  clearLeaveDetail: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setStatusFilter: (status: string) => void
  setLeaveTypeFilter: (leaveTypeId: string) => void
  setEmployeeFilter: (employeeId: string) => void
  setStartDateRange: (payload: { startFrom: string, startTo: string }) => void
  setEndDateRange: (payload: { endFrom: string, endTo: string }) => void
  setCreatedDateRange: (payload: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (payload: { updatedFrom: string, updatedTo: string }) => void
  clearStatusFilter: () => void
  clearLeaveTypeFilter: () => void
  clearEmployeeFilter: () => void
  clearStartDateRange: () => void
  clearEndDateRange: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchLeaves: () => Promise<void>
  sortLeaves: (sortBy: LeavesSortBy, sortDir: LeavesSortDir) => Promise<void>
  createLeave: (payload: LeaveCreatePayload, files?: File[]) => Promise<boolean>
  updateLeave: (payload: LeaveUpdatePayload, files?: File[]) => Promise<boolean>
  getLeavesByEmployee: (employeeId: number) => Promise<void>
  clearEmployeeLeaves: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
