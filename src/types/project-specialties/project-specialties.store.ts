import type {
  ProjectSpecialtyCreatePayload,
  ProjectSpecialtyDetail,
  ProjectSpecialtyRaw,
  ProjectSpecialtiesPagination,
  ProjectSpecialtiesQueryParams,
  ProjectSpecialtiesSortBy,
  ProjectSpecialtiesSortDir,
  ProjectSpecialtyTableRow,
  ProjectSpecialtyUpdatePayload,
} from './project-specialties'
import type { OperationKey, OperationStatus } from '../common'

export interface ProjectSpecialtiesStore {
  projectSpecialtiesRaw: ProjectSpecialtyRaw[]
  projectSpecialtyDetail: ProjectSpecialtyDetail | null
  projectSpecialtiesRows: ProjectSpecialtyTableRow[]
  pagination: ProjectSpecialtiesPagination
  queryParams: ProjectSpecialtiesQueryParams
  exportingCsv: boolean
  importingCsv: boolean
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getProjectSpecialties: () => Promise<void>
  getProjectSpecialtyDetail: (projectSpecialtyId: string) => Promise<ProjectSpecialtyDetail | null>
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
  searchProjectSpecialties: () => Promise<void>
  sortProjectSpecialties: (sortBy: ProjectSpecialtiesSortBy, sortDir: ProjectSpecialtiesSortDir) => Promise<void>
  createProjectSpecialty: (payload: ProjectSpecialtyCreatePayload) => Promise<boolean>
  updateProjectSpecialty: (payload: ProjectSpecialtyUpdatePayload) => Promise<boolean>
  toggleProjectSpecialtyStatus: (projectSpecialtyId: string, nextStatus: boolean) => Promise<boolean>
  exportProjectSpecialtiesCsv: () => Promise<boolean>
  importProjectSpecialtiesCsv: (file: File) => Promise<string | null>
  clearProjectSpecialtyDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
