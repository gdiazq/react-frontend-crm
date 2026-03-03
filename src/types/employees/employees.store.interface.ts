import type {
  EmployeeCreatePayload,
  EmployeesPagination,
  EmployeesQueryParams,
  EmployeesSortBy,
  EmployeesSortDir,
  EmployeeTableRow,
} from './employees.interface'

export interface EmployeesStore {
  employeesRows: EmployeeTableRow[]
  pagination: EmployeesPagination
  queryParams: EmployeesQueryParams
  loadingEmployees: boolean
  loadingToggleStatus: boolean
  createEmployeeSubmitting: boolean
  errorMessage: string | null
  createEmployeeErrorMessage: string | null
  createEmployeeSuccessMessage: string | null
  errorBack: unknown | null
  getEmployees: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setActiveFilter: (active: string) => void
  clearActiveFilter: () => void
  searchEmployees: () => Promise<void>
  sortEmployees: (sortBy: EmployeesSortBy, sortDir: EmployeesSortDir) => Promise<void>
  mutationToggleEmployeeStatus: (employeeId: string, nextStatus: boolean) => Promise<boolean>
  mutationCreateEmployee: (payload: EmployeeCreatePayload) => Promise<boolean>
  clearCreateEmployeeStatus: () => void
  clearStatus: () => void
}
