import type {
  QualityOfWorkCreatePayload,
  QualityOfWorkDetail,
  QualityOfWorkRaw,
  QualityOfWorkPagination,
  QualityOfWorkQueryParams,
  QualityOfWorkSortBy,
  QualityOfWorkSortDir,
  QualityOfWorkTableRow,
  QualityOfWorkUpdatePayload,
} from './quality-of-work'
import type { OperationKey, OperationStatus } from '../common'

export interface QualityOfWorkStore {
  qualityOfWorkRaw: QualityOfWorkRaw[]
  qualityOfWorkDetail: QualityOfWorkDetail | null
  qualityOfWorkRows: QualityOfWorkTableRow[]
  pagination: QualityOfWorkPagination
  queryParams: QualityOfWorkQueryParams
  loadingQualityOfWork: boolean
  loadingQualityOfWorkDetail: boolean
  createQualityOfWorkSubmitting: boolean
  updateQualityOfWorkSubmitting: boolean
  loadingToggleStatus: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getQualityOfWork: () => Promise<void>
  getQualityOfWorkDetail: (id: string) => Promise<QualityOfWorkDetail | null>
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
  searchQualityOfWork: () => Promise<void>
  sortQualityOfWork: (sortBy: QualityOfWorkSortBy, sortDir: QualityOfWorkSortDir) => Promise<void>
  createQualityOfWork: (payload: QualityOfWorkCreatePayload) => Promise<boolean>
  updateQualityOfWork: (payload: QualityOfWorkUpdatePayload) => Promise<boolean>
  toggleQualityOfWorkStatus: (id: string, nextStatus: boolean) => Promise<boolean>
  clearQualityOfWorkDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
