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

let latestRequestDetailRequestId = 0

export const useStoreRequests = create<RequestsStore>()((set, get) => ({
  requestsRows: [...initialRequestsRows],
  requestDetail: null,
  pagination: { ...initialRequestsPagination },
  queryParams: { ...initialRequestsQueryParams },
  loadingRequests: false,
  loadingRequestDetail: false,
  loadingApproveRequest: false,
  loadingRejectRequest: false,
  errorMessage: null,
  detailErrorMessage: null,
  errorBack: null,

  getRequests: async () => {
    try {
      set({ loadingRequests: true, errorMessage: null, errorBack: null })
      const data = await requestsService.getRequests(get().queryParams)
      const pagination = mapperRequestsPagination(data)
      set({
        requestsRows: mapperRequestsRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      set({ errorBack: error })
      if (requestsService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.requests.status.errors.loadError })
      } else {
        set({ errorMessage: messages.requests.status.errors.loadError })
      }
    } finally {
      set({ loadingRequests: false })
    }
  },

  getRequestDetail: async (requestId: string) => {
    const parsedRequestId = Number(requestId)
    if (!Number.isInteger(parsedRequestId) || parsedRequestId <= 0) {
      set({
        detailErrorMessage: messages.requests.status.errors.invalidRequestId,
        requestDetail: null,
      })
      return null
    }
    const currentRequestId = ++latestRequestDetailRequestId

    try {
      set({
        loadingRequestDetail: true,
        detailErrorMessage: null,
        requestDetail: null,
        errorBack: null,
      })
      const data = await requestsService.getRequestDetail(parsedRequestId)
      if (currentRequestId !== latestRequestDetailRequestId) return null
      set({ requestDetail: data })
      return data
    } catch (error) {
      if (currentRequestId !== latestRequestDetailRequestId) return null
      if (requestsService.isAxiosError(error)) {
        set({
          detailErrorMessage: error.response?.data?.message || messages.requests.status.errors.loadError,
          errorBack: error,
        })
      } else {
        set({
          detailErrorMessage: messages.requests.status.errors.loadError,
          errorBack: error,
        })
      }
      return null
    } finally {
      if (currentRequestId === latestRequestDetailRequestId) {
        set({ loadingRequestDetail: false })
      }
    }
  },

  clearRequestDetail: () => {
    latestRequestDetailRequestId += 1
    set({ requestDetail: null, detailErrorMessage: null, loadingRequestDetail: false })
  },

  clearDetailError: () => {
    set({ detailErrorMessage: null })
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

  mutationApproveRequest: async (requestId: string) => {
    const parsedRequestId = Number(requestId)
    if (!Number.isInteger(parsedRequestId) || parsedRequestId <= 0) {
      set({ errorMessage: messages.requests.status.errors.invalidRequestId })
      return false
    }

    try {
      set({ loadingApproveRequest: true, errorMessage: null, errorBack: null })
      await requestsService.approveRequest(parsedRequestId)
      return true
    } catch (error) {
      set({ errorBack: error })
      if (requestsService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.requests.status.errors.approveError })
      } else {
        set({ errorMessage: messages.requests.status.errors.approveError })
      }
      return false
    } finally {
      set({ loadingApproveRequest: false })
    }
  },

  mutationRejectRequest: async (requestId: string, rejectionDetail: string) => {
    const parsedRequestId = Number(requestId)
    if (!Number.isInteger(parsedRequestId) || parsedRequestId <= 0) {
      set({ errorMessage: messages.requests.status.errors.invalidRequestId })
      return false
    }

    const normalizedRejectionDetail = rejectionDetail.trim()
    if (normalizedRejectionDetail.length === 0) {
      set({ errorMessage: messages.requests.status.errors.rejectDetailRequired })
      return false
    }

    try {
      set({ loadingRejectRequest: true, errorMessage: null, errorBack: null })
      await requestsService.rejectRequest(parsedRequestId, normalizedRejectionDetail)
      return true
    } catch (error) {
      set({ errorBack: error })
      if (requestsService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.requests.status.errors.rejectError })
      } else {
        set({ errorMessage: messages.requests.status.errors.rejectError })
      }
      return false
    } finally {
      set({ loadingRejectRequest: false })
    }
  },

  clearStatus: () => {
    set({ errorMessage: null })
  },
}))
