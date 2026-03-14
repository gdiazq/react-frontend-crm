import type {
  EmployeeAvailableUserOption,
  EmployeeCreatePayload,
  EmployeeDetail,
  EmployeeUpdatePayload,
  EmployeesPagination,
  EmployeesQueryParams,
  EmployeesSortBy,
  EmployeesSortDir,
  EmployeeTableRow,
} from './employees'
import type { OperationKey, OperationStatus } from '../common'

export type EmployeeOperationKey = OperationKey | 'link'

export interface EmployeesStore {
  employeesRows: EmployeeTableRow[]
  employeeDetail: EmployeeDetail | null
  pagination: EmployeesPagination
  queryParams: EmployeesQueryParams
  loadingEmployees: boolean
  loadingEmployeeDetail: boolean
  loadingToggleStatus: boolean
  loadingLinkUser: boolean
  createEmployeeSubmitting: boolean
  updateEmployeeSubmitting: boolean
  availableUsers: EmployeeAvailableUserOption[]
  loadingAvailableUsers: boolean
  operationStatus: Record<EmployeeOperationKey, OperationStatus>
  getEmployees: () => Promise<void>
  getEmployeeDetail: (employeeId: string) => Promise<EmployeeDetail | null>
  clearEmployeeDetail: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setActiveFilter: (active: string) => void
  setApprovalStatusFilter: (statusId: string) => void
  setCreatedDateRange: (payload: { createdFrom: string, createdTo: string }) => void
  clearActiveFilter: () => void
  clearApprovalStatusFilter: () => void
  clearCreatedDateRange: () => void
  searchEmployees: () => Promise<void>
  sortEmployees: (sortBy: EmployeesSortBy, sortDir: EmployeesSortDir) => Promise<void>
  toggleEmployeeStatus: (employeeId: string, nextStatus: boolean) => Promise<boolean>
  createEmployee: (payload: EmployeeCreatePayload) => Promise<boolean>
  updateEmployee: (payload: EmployeeUpdatePayload) => Promise<boolean>
  getAvailableUsers: (search: string) => Promise<void>
  linkEmployeeUser: (employeeId: string, userId: number) => Promise<boolean>
  unlinkEmployeeUser: (employeeId: string) => Promise<boolean>
  clearAvailableUsers: () => void
  clearOperationStatus: (key: EmployeeOperationKey) => void
  clearAllOperationStatus: () => void
}
