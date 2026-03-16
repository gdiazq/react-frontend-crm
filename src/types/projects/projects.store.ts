import type {
  ProjectCreatePayload,
  ProjectPagedResponse,
  ProjectsPagination,
  ProjectsQueryParams,
  ProjectsSortBy,
  ProjectsSortDir,
  ProjectTableRow,
} from './projects'
import type { OperationKey, OperationStatus } from '../common'

export interface ProjectsStore {
  projectsRaw: ProjectPagedResponse['content']
  projectsRows: ProjectTableRow[]
  pagination: ProjectsPagination
  queryParams: ProjectsQueryParams
  loadingProjects: boolean
  createProjectSubmitting: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  createProject: (payload: ProjectCreatePayload) => Promise<boolean>
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
