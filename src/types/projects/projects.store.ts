import type {
  ProjectCreatePayload,
  ProjectCostCenterEmployeeTableRow,
  ProjectCostCenterEmployeesPagination,
  ProjectCostCenterEmployeesQueryParams,
  ProjectCostCenterEmployeesSortBy,
  ProjectCostCenterEmployeesSortDir,
  ProjectDetail,
  ProjectPagedResponse,
  ProjectUpdatePayload,
  ProjectsPagination,
  ProjectsQueryParams,
  ProjectsSortBy,
  ProjectsSortDir,
  ProjectTableRow,
} from './projects'
import type { OperationKey, OperationStatus } from '../common'

export interface ProjectsStore {
  projectsRaw: ProjectPagedResponse['content']
  projectDetail: ProjectDetail | null
  projectsRows: ProjectTableRow[]
  pagination: ProjectsPagination
  queryParams: ProjectsQueryParams
  costCenterEmployeesRows: ProjectCostCenterEmployeeTableRow[]
  costCenterEmployeesPagination: ProjectCostCenterEmployeesPagination
  costCenterEmployeesQueryParams: ProjectCostCenterEmployeesQueryParams
  loadingCostCenterEmployees: boolean
  costCenterEmployeesErrorMessage: string | null
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  createProject: (payload: ProjectCreatePayload) => Promise<boolean>
  updateProject: (payload: ProjectUpdatePayload) => Promise<boolean>
  toggleProjectStatus: (projectId: string, nextStatus: boolean) => Promise<boolean>
  getProjectDetail: (projectId: string) => Promise<ProjectDetail | null>
  clearProjectDetail: () => void
  getProjects: () => Promise<void>
  getCostCenterEmployees: (costCenter: number) => Promise<void>
  resetCostCenterEmployees: () => void
  setCostCenterEmployeesSearch: (search: string) => void
  setCostCenterEmployeesActiveFilter: (active: string) => void
  setCostCenterEmployeesStatusFilter: (statusId: string) => void
  clearCostCenterEmployeesFilters: () => void
  searchCostCenterEmployees: (costCenter: number) => Promise<void>
  sortCostCenterEmployees: (costCenter: number, sortBy: ProjectCostCenterEmployeesSortBy, sortDir: ProjectCostCenterEmployeesSortDir) => Promise<void>
  goToCostCenterEmployeesPage: (costCenter: number, page: number) => Promise<void>
  clearCostCenterEmployeesError: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setActiveFilter: (active: string) => void
  setTypeFilter: (typeId: string) => void
  setStatusFilter: (statusId: string) => void
  setSpecialtyFilter: (specialtyId: string) => void
  setCreatedDateRange: (value: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (value: { updatedFrom: string, updatedTo: string }) => void
  clearActiveFilter: () => void
  clearTypeFilter: () => void
  clearStatusFilter: () => void
  clearSpecialtyFilter: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchProjects: () => Promise<void>
  sortProjects: (sortBy: ProjectsSortBy, sortDir: ProjectsSortDir) => Promise<void>
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
