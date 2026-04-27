import type {
  AnnexByContractItem,
  AnnexCreatePayload,
  AnnexDetail,
  AnnexUpdatePayload,
  AnnexesPagination,
  AnnexesQueryParams,
  AnnexesSortBy,
  AnnexesSortDir,
  AnnexTableRow,
} from './annexes'
import type { OperationKey, OperationStatus } from '../common'

export interface AnnexesStore {
  annexesRows: AnnexTableRow[]
  annexDetail: AnnexDetail | null
  contractAnnexes: AnnexByContractItem[]
  loadingContractAnnexes: boolean
  pagination: AnnexesPagination
  queryParams: AnnexesQueryParams
  loadingAnnexes: boolean
  loadingAnnexDetail: boolean
  createAnnexSubmitting: boolean
  updateAnnexSubmitting: boolean
  deletingAnnexDocument: boolean
  operationStatus: Record<OperationKey, OperationStatus>
  getAnnexes: () => Promise<void>
  getAnnexDetail: (annexId: string) => Promise<AnnexDetail | null>
  clearAnnexDetail: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setStatusFilter: (status: string) => void
  setAnnexTypeFilter: (annexTypeId: string) => void
  setContractFilter: (contractId: string) => void
  setDateRange: (payload: { dateFrom: string, dateTo: string }) => void
  setCreatedDateRange: (payload: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (payload: { updatedFrom: string, updatedTo: string }) => void
  clearStatusFilter: () => void
  clearAnnexTypeFilter: () => void
  clearContractFilter: () => void
  clearDateRange: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchAnnexes: () => Promise<void>
  sortAnnexes: (sortBy: AnnexesSortBy, sortDir: AnnexesSortDir) => Promise<void>
  createAnnex: (payload: AnnexCreatePayload, files?: File[]) => Promise<boolean>
  updateAnnex: (payload: AnnexUpdatePayload, files?: File[]) => Promise<boolean>
  deleteAnnexDocument: (annexId: number, fileId: number, userId: number) => Promise<boolean>
  getAnnexesByContract: (contractId: number) => Promise<void>
  clearContractAnnexes: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
