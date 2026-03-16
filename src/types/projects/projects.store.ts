import type {
  ProjectCreatePayload,
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
  loadingProjects: boolean
  loadingProjectDetail: boolean
  loadingToggleStatus: boolean
  createProjectSubmitting: boolean
  updateProjectSubmitting: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  createProject: (payload: ProjectCreatePayload) => Promise<boolean>
  updateProject: (payload: ProjectUpdatePayload) => Promise<boolean>
  toggleProjectStatus: (projectId: string, nextStatus: boolean) => Promise<boolean>
  getProjectDetail: (projectId: string) => Promise<ProjectDetail | null>
  clearProjectDetail: () => void
  getProjects: () => Promise<void>
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
