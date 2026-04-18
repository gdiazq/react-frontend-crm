import type { OperationKey, OperationStatus } from '../common'
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
  loadingTransfers: boolean
  loadingTransferDetail: boolean
  createTransferSubmitting: boolean
  updateTransferSubmitting: boolean
  loadingDeleteDocument: boolean
  operationStatus: Record<OperationKey, OperationStatus>

  getTransfers: () => Promise<void>
  getTransferDetail: (id: string) => Promise<TransferDetail | null>
  createTransfer: (payload: TransferCreatePayload, files?: File[]) => Promise<boolean>
  updateTransfer: (payload: TransferUpdatePayload, files?: File[]) => Promise<boolean>
  deleteTransferDocument: (transferId: number, fileId: number) => Promise<boolean>
  exportTransfersCsv: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  clearSearch: () => void
  clearStatusFilter: () => void
  searchTransfers: () => Promise<void>
  sortTransfers: (sortBy: TransferSortBy, sortDir: TransferSortDir) => Promise<void>
  clearTransferDetail: () => void
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
