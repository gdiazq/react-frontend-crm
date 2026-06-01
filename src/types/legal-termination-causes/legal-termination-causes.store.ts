import type {
  LegalTerminationCauseCreatePayload,
  LegalTerminationCauseDetail,
  LegalTerminationCauseRaw,
  LegalTerminationCausesPagination,
  LegalTerminationCausesQueryParams,
  LegalTerminationCausesSortBy,
  LegalTerminationCausesSortDir,
  LegalTerminationCauseTableRow,
  LegalTerminationCauseUpdatePayload,
} from './legal-termination-causes'
import type { OperationKey, OperationStatus } from '../common'

export interface LegalTerminationCausesStore {
  legalTerminationCausesRaw: LegalTerminationCauseRaw[]
  legalTerminationCauseDetail: LegalTerminationCauseDetail | null
  legalTerminationCausesRows: LegalTerminationCauseTableRow[]
  pagination: LegalTerminationCausesPagination
  queryParams: LegalTerminationCausesQueryParams
  exportingCsv: boolean
  importingCsv: boolean
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getLegalTerminationCauses: () => Promise<void>
  getLegalTerminationCauseDetail: (legalTerminationCauseId: string) => Promise<LegalTerminationCauseDetail | null>
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
  searchLegalTerminationCauses: () => Promise<void>
  sortLegalTerminationCauses: (sortBy: LegalTerminationCausesSortBy, sortDir: LegalTerminationCausesSortDir) => Promise<void>
  createLegalTerminationCause: (payload: LegalTerminationCauseCreatePayload) => Promise<boolean>
  updateLegalTerminationCause: (payload: LegalTerminationCauseUpdatePayload) => Promise<boolean>
  toggleLegalTerminationCauseStatus: (legalTerminationCauseId: string, nextStatus: boolean) => Promise<boolean>
  exportLegalTerminationCausesCsv: () => Promise<boolean>
  importLegalTerminationCausesCsv: (file: File) => Promise<string | null>
  clearLegalTerminationCauseDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
