import type { RequestTableRow, RequestsPagination, RequestsQueryParams } from './requests.interface'

export interface RequestsStore {
  requestsRows: RequestTableRow[]
  pagination: RequestsPagination
  queryParams: RequestsQueryParams
  loadingRequests: boolean
  loadingApproveRequest: boolean
  loadingRejectRequest: boolean
  errorMessage: string | null
  errorBack: unknown | null
  getRequests: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  mutationApproveRequest: (requestId: string) => Promise<boolean>
  mutationRejectRequest: (requestId: string, rejectionDetail: string) => Promise<boolean>
  clearStatus: () => void
}
