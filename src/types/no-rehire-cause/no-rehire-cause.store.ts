import type {
  NoRehireCauseCreatePayload,
  NoRehireCauseDetail,
  NoRehireCausePagination,
  NoRehireCauseQueryParams,
  NoRehireCauseRaw,
  NoRehireCauseSortBy,
  NoRehireCauseSortDir,
  NoRehireCauseTableRow,
  NoRehireCauseUpdatePayload,
} from './no-rehire-cause'
import type { OperationKey, OperationStatus } from '../common'

export interface NoRehireCauseStore {
  noRehireCauseRaw: NoRehireCauseRaw[]
  noRehireCauseDetail: NoRehireCauseDetail | null
  noRehireCauseRows: NoRehireCauseTableRow[]
  pagination: NoRehireCausePagination
  queryParams: NoRehireCauseQueryParams
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getNoRehireCause: () => Promise<void>
  getNoRehireCauseDetail: (id: string) => Promise<NoRehireCauseDetail | null>
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
  searchNoRehireCause: () => Promise<void>
  sortNoRehireCause: (sortBy: NoRehireCauseSortBy, sortDir: NoRehireCauseSortDir) => Promise<void>
  createNoRehireCause: (payload: NoRehireCauseCreatePayload) => Promise<boolean>
  updateNoRehireCause: (payload: NoRehireCauseUpdatePayload) => Promise<boolean>
  toggleNoRehireCauseStatus: (id: string, nextStatus: boolean) => Promise<boolean>
  clearNoRehireCauseDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
