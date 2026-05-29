import type {
  HrRequestDetailRaw,
  RequestTableRow,
  RequestsPagination,
  RequestsQueryParams,
  RequestsSortBy,
  RequestsSortDir,
} from './requests'
import type { OperationKey, OperationStatus } from '../common'

export interface RequestsStore {
  requestsRows: RequestTableRow[]
  requestDetail: HrRequestDetailRaw | null
  pagination: RequestsPagination
  queryParams: RequestsQueryParams
  loadingApproveRequest: boolean
  loadingRejectRequest: boolean
  exportingCsv: boolean
  operationLoading: Record<OperationKey, boolean>
  operationStatus: Record<OperationKey, OperationStatus>
  getRequests: () => Promise<void>
  getRequestDetail: (requestId: string) => Promise<HrRequestDetailRaw | null>
  clearRequestDetail: () => void
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  setStatusFilter: (statusId: string) => void
  setModuleFilter: (idModule: string) => void
  setCreatedDateRange: (payload: { createdFrom: string, createdTo: string }) => void
  setApprovalDateRange: (payload: { approvalFrom: string, approvalTo: string }) => void
  clearStatusFilter: () => void
  clearModuleFilter: () => void
  clearCreatedDateRange: () => void
  clearApprovalDateRange: () => void
  searchRequests: () => Promise<void>
  sortRequests: (sortBy: RequestsSortBy, sortDir: RequestsSortDir) => Promise<void>
  approveRequest: (requestId: string) => Promise<boolean>
  rejectRequest: (requestId: string, rejectionDetail: string) => Promise<boolean>
  exportRequestsCsv: () => Promise<boolean>
  clearOperationStatus: (key: OperationKey) => void
  clearAllOperationStatus: () => void
}
