import type { OperationKey, OperationStatus } from '../common'
import type { ProjectCostCenterSelectOption } from '../projects'
import type {
  TransferCreatePayload,
  TransferDetail,
  TransferPagination,
  TransferQueryParams,
  TransferRaw,
  TransferSortBy,
  TransferSortDir,
  TransferTableRow,
  TransferUpdatePayload,
} from './transfer'

export interface TransferStore {
  transferRaw: TransferRaw[]
  transferDetail: TransferDetail | null
  transferRows: TransferTableRow[]
  pagination: TransferPagination
  queryParams: TransferQueryParams
  exportingCsv: boolean
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  projectCostCenterOptions: ProjectCostCenterSelectOption[]
  loadingProjectCostCenterOptions: boolean
  projectCostCenterOptionsErrorMessage: string | null

  getTransfers: () => Promise<void>
  getTransferDetail: (id: string) => Promise<TransferDetail | null>
  createTransfer: (payload: TransferCreatePayload, files?: File[]) => Promise<boolean>
  updateTransfer: (payload: TransferUpdatePayload, files?: File[]) => Promise<boolean>
  exportTransfersCsv: () => Promise<boolean>
  getProjectCostCenterOptions: () => Promise<void>
  getProjectCostCenterOption: (costCenter: number) => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  setToCostCenterFilter: (toCostCenter: string) => void
  setEffectiveDateRange: (range: { effectiveDateFrom: string, effectiveDateTo: string }) => void
  setCreatedDateRange: (range: { createdFrom: string, createdTo: string }) => void
  setUpdatedDateRange: (range: { updatedFrom: string, updatedTo: string }) => void
  clearSearch: () => void
  clearStatusFilter: () => void
  clearToCostCenterFilter: () => void
  clearEffectiveDateRange: () => void
  clearCreatedDateRange: () => void
  clearUpdatedDateRange: () => void
  searchTransfers: () => Promise<void>
  sortTransfers: (sortBy: TransferSortBy, sortDir: TransferSortDir) => Promise<void>
  clearTransferDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearProjectCostCenterOptionsStatus: () => void
  clearAllOperationStatus: () => void
}
