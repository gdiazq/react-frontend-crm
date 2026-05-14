import { create } from 'zustand'
import { requestsService } from '@/services'
import {
  initialRequestsPagination,
  initialRequestsQueryParams,
  initialRequestsRows,
} from '@/factories'
import {
  mapperRequestsPagination,
  mapperRequestsRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { RequestsSortBy, RequestsSortDir, RequestsStore } from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreRequests = create<RequestsStore>()((set, get) => {
  let latestRequestsRequestId = 0
  let latestRequestDetailRequestId = 0

  const { setOpError, clearOp } = createOperationStatusHelpers(set)

  return {
  requestsRows: [...initialRequestsRows],
  requestDetail: null,
  pagination: { ...initialRequestsPagination },
  queryParams: { ...initialRequestsQueryParams },
  loadingRequests: false,
  loadingRequestDetail: false,
  loadingApproveRequest: false,
  loadingRejectRequest: false,
  operationStatus: initialOperationStatus(),

  getRequests: async () => {
    const requestId = ++latestRequestsRequestId
    try {
      set({ loadingRequests: true })
      clearOp('list')
      const data = await requestsService.getRequests(get().queryParams)
      if (requestId !== latestRequestsRequestId) return
      const pagination = mapperRequestsPagination(data)
      set({
        requestsRows: mapperRequestsRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      if (requestId !== latestRequestsRequestId) return
      setOpError('list', resolveErrorMessage(error, messages.requests.status.errors.loadError), error)
    } finally {
      if (requestId === latestRequestsRequestId) {
        set({ loadingRequests: false })
      }
    }
  },

  getRequestDetail: async (requestId: string) => {
    const parsedRequestId = Number(requestId)
    if (!Number.isInteger(parsedRequestId) || parsedRequestId <= 0) {
      setOpError('detail', messages.requests.status.errors.invalidRequestId)
      set({ requestDetail: null })
      return null
    }
    const currentRequestId = ++latestRequestDetailRequestId

    try {
      set({ loadingRequestDetail: true, requestDetail: null })
      clearOp('detail')
      const data = await requestsService.getRequestDetail(parsedRequestId)
      if (currentRequestId !== latestRequestDetailRequestId) return null
      set({ requestDetail: data })
      return data
    } catch (error) {
      if (currentRequestId !== latestRequestDetailRequestId) return null
      setOpError('detail', resolveErrorMessage(error, messages.requests.status.errors.loadError), error)
      return null
    } finally {
      if (currentRequestId === latestRequestDetailRequestId) {
        set({ loadingRequestDetail: false })
      }
    }
  },

  clearRequestDetail: () => {
    latestRequestDetailRequestId += 1
    set({ requestDetail: null, loadingRequestDetail: false })
    clearOp('detail')
  },

  goToPage: async (page: number) => {
    const { pagination } = get()
    const lastPageIndex = pagination.totalPages - 1
    if (page < 0 || page > lastPageIndex) return

    set((state) => ({
      pagination: { ...state.pagination, page },
      queryParams: { ...state.queryParams, page },
    }))
    await get().getRequests()
  },

  nextPage: async () => {
    if (get().pagination.last) return
    await get().goToPage(get().pagination.page + 1)
  },

  previousPage: async () => {
    if (get().pagination.first) return
    await get().goToPage(get().pagination.page - 1)
  },

  setSearch: (value: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, search: value } }))
  },

  setStatusFilter: (statusId: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, statusId } }))
  },

  setModuleFilter: (idModule: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, idModule } }))
  },

  setCreatedDateRange: ({ createdFrom, createdTo }) => {
    set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
  },

  setApprovalDateRange: ({ approvalFrom, approvalTo }) => {
    set((state) => ({ queryParams: { ...state.queryParams, approvalFrom, approvalTo } }))
  },

  clearStatusFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, statusId: '' } }))
  },

  clearModuleFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, idModule: '' } }))
  },

  clearCreatedDateRange: () => {
    set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
  },

  clearApprovalDateRange: () => {
    set((state) => ({ queryParams: { ...state.queryParams, approvalFrom: '', approvalTo: '' } }))
  },

  searchRequests: async () => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0 },
    }))
    await get().getRequests()
  },

  sortRequests: async (sortBy: RequestsSortBy, sortDir: RequestsSortDir) => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
    }))
    await get().getRequests()
  },

  approveRequest: async (requestId: string) => {
    const parsedRequestId = Number(requestId)
    if (!Number.isInteger(parsedRequestId) || parsedRequestId <= 0) {
      setOpError('list', messages.requests.status.errors.invalidRequestId)
      return false
    }

    try {
      set({ loadingApproveRequest: true })
      clearOp('list')
      await requestsService.approveRequest(parsedRequestId)
      return true
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.requests.status.errors.approveError), error)
      return false
    } finally {
      set({ loadingApproveRequest: false })
    }
  },

  rejectRequest: async (requestId: string, rejectionDetail: string) => {
    const parsedRequestId = Number(requestId)
    if (!Number.isInteger(parsedRequestId) || parsedRequestId <= 0) {
      setOpError('list', messages.requests.status.errors.invalidRequestId)
      return false
    }

    const normalizedRejectionDetail = rejectionDetail.trim()
    if (normalizedRejectionDetail.length === 0) {
      setOpError('list', messages.requests.status.errors.rejectDetailRequired)
      return false
    }

    try {
      set({ loadingRejectRequest: true })
      clearOp('list')
      await requestsService.rejectRequest(parsedRequestId, normalizedRejectionDetail)
      return true
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.requests.status.errors.rejectError), error)
      return false
    } finally {
      set({ loadingRejectRequest: false })
    }
  },

  clearOperationStatus: (key) => {
    clearOp(key)
  },

  clearAllOperationStatus: () => {
    set({ operationStatus: initialOperationStatus() })
  },
  }
})
