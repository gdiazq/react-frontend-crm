import type {
  EmployeeCreatePayload,
  EmployeeDetail,
  EmployeesPagination,
  EmployeesQueryParams,
  EmployeesSortBy,
  EmployeesSortDir,
  EmployeeTableRow,
} from './employees.interface'

export interface EmployeesStore {
  employeesRows: EmployeeTableRow[]
  employeeDetail: EmployeeDetail | null
  pagination: EmployeesPagination
  queryParams: EmployeesQueryParams
  loadingEmployees: boolean
  loadingEmployeeDetail: boolean
  loadingToggleStatus: boolean
  createEmployeeSubmitting: boolean
  errorMessage: string | null
  detailErrorMessage: string | null
  createEmployeeErrorMessage: string | null
  createEmployeeSuccessMessage: string | null
  errorBack: unknown | null
  getEmployees: () => Promise<void>
  getEmployeeDetail: (employeeId: string) => Promise<EmployeeDetail | null>
  clearEmployeeDetail: () => void
  clearDetailError: () => void
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
  mutationToggleEmployeeStatus: (employeeId: string, nextStatus: boolean) => Promise<boolean>
  mutationCreateEmployee: (payload: EmployeeCreatePayload) => Promise<boolean>
  clearCreateEmployeeStatus: () => void
  clearStatus: () => void
}
