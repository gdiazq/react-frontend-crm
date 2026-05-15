import type { OperationKey, OperationStatus } from '../common'
import type {
  ProjectAssignmentDetail,
  ProjectAssignmentTableRow,
  ProjectAssignmentsPagination,
  ProjectAssignmentsQueryParams,
  ProjectAssignmentsSortBy,
  ProjectAssignmentsSortDir,
} from './project-assignments'

export interface ProjectAssignmentsStore {
  projectAssignmentsRows: ProjectAssignmentTableRow[]
  employeeProjectAssignments: ProjectAssignmentDetail[]
  costCenterProjectAssignments: ProjectAssignmentDetail[]
  pagination: ProjectAssignmentsPagination
  queryParams: ProjectAssignmentsQueryParams
  loadingEmployeeProjectAssignments: boolean
  loadingCostCenterProjectAssignments: boolean
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getProjectAssignments: () => Promise<void>
  getProjectAssignmentsByEmployee: (employeeId: number) => Promise<void>
  getProjectAssignmentsByCostCenter: (costCenter: number) => Promise<void>
  clearEmployeeProjectAssignments: () => void
  clearCostCenterProjectAssignments: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setEmployeeFilter: (employeeId: string) => void
  setCostCenterFilter: (costCenter: string) => void
  setActiveFilter: (active: string) => void
  setAssignmentDateRange: (payload: { dateFrom: string, dateTo: string }) => void
  setCreatedDateRange: (payload: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (payload: { updatedFrom: string, updatedTo: string }) => void
  clearEmployeeFilter: () => void
  clearCostCenterFilter: () => void
  clearActiveFilter: () => void
  clearAssignmentDateRange: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchProjectAssignments: () => Promise<void>
  sortProjectAssignments: (sortBy: ProjectAssignmentsSortBy, sortDir: ProjectAssignmentsSortDir) => Promise<void>
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
