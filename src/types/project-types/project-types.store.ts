import type {
  ProjectTypeCreatePayload,
  ProjectTypeDetail,
  ProjectTypeRaw,
  ProjectTypesPagination,
  ProjectTypesQueryParams,
  ProjectTypesSortBy,
  ProjectTypesSortDir,
  ProjectTypeTableRow,
  ProjectTypeUpdatePayload,
} from './project-types'
import type { OperationKey, OperationStatus } from '../common'

export interface ProjectTypesStore {
  projectTypesRaw: ProjectTypeRaw[]
  projectTypeDetail: ProjectTypeDetail | null
  projectTypesRows: ProjectTypeTableRow[]
  pagination: ProjectTypesPagination
  queryParams: ProjectTypesQueryParams
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getProjectTypes: () => Promise<void>
  getProjectTypeDetail: (projectTypeId: string) => Promise<ProjectTypeDetail | null>
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
  searchProjectTypes: () => Promise<void>
  sortProjectTypes: (sortBy: ProjectTypesSortBy, sortDir: ProjectTypesSortDir) => Promise<void>
  createProjectType: (payload: ProjectTypeCreatePayload) => Promise<boolean>
  updateProjectType: (payload: ProjectTypeUpdatePayload) => Promise<boolean>
  toggleProjectTypeStatus: (projectTypeId: string, nextStatus: boolean) => Promise<boolean>
  clearProjectTypeDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
