import type {
  HrRequestDetailRaw,
  RequestTableRow,
  RequestsPagination,
  RequestsQueryParams,
} from './requests.interface'

export interface RequestsStore {
  requestsRows: RequestTableRow[]
  requestDetail: HrRequestDetailRaw | null
  pagination: RequestsPagination
  queryParams: RequestsQueryParams
  loadingRequests: boolean
  loadingRequestDetail: boolean
  loadingApproveRequest: boolean
  loadingRejectRequest: boolean
  errorMessage: string | null
  detailErrorMessage: string | null
  errorBack: unknown | null
  getRequests: () => Promise<void>
  getRequestDetail: (requestId: string) => Promise<HrRequestDetailRaw | null>
  clearRequestDetail: () => void
  clearDetailError: () => void
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
  mutationApproveRequest: (requestId: string) => Promise<boolean>
  mutationRejectRequest: (requestId: string, rejectionDetail: string) => Promise<boolean>
  clearStatus: () => void
}
