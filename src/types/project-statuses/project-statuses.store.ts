import type {
  ProjectStatusCreatePayload,
  ProjectStatusDetail,
  ProjectStatusRaw,
  ProjectStatusesPagination,
  ProjectStatusesQueryParams,
  ProjectStatusesSortBy,
  ProjectStatusesSortDir,
  ProjectStatusTableRow,
  ProjectStatusUpdatePayload,
} from './project-statuses'
import type { OperationKey, OperationStatus } from '../common'

export interface ProjectStatusesStore {
  projectStatusesRaw: ProjectStatusRaw[]
  projectStatusDetail: ProjectStatusDetail | null
  projectStatusesRows: ProjectStatusTableRow[]
  pagination: ProjectStatusesPagination
  queryParams: ProjectStatusesQueryParams
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getProjectStatuses: () => Promise<void>
  getProjectStatusDetail: (projectStatusId: string) => Promise<ProjectStatusDetail | null>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setActiveFilter: (active: string) => void
  setCreatedDateRange: (value: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (value: { updatedFrom: string, updatedTo: string }) => void
  clearActiveFilter: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchProjectStatuses: () => Promise<void>
  sortProjectStatuses: (sortBy: ProjectStatusesSortBy, sortDir: ProjectStatusesSortDir) => Promise<void>
  createProjectStatus: (payload: ProjectStatusCreatePayload) => Promise<boolean>
  updateProjectStatus: (payload: ProjectStatusUpdatePayload) => Promise<boolean>
  toggleProjectStatusStatus: (projectStatusId: string, nextStatus: boolean) => Promise<boolean>
  clearProjectStatusDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
