import type {
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
  errorMessage: string | null
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
  clearStatus: () => void
}
