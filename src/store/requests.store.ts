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
import type { RequestsStore } from '@/types'

export const useStoreRequests = create<RequestsStore>()((set, get) => ({
  requestsRows: [...initialRequestsRows],
  pagination: { ...initialRequestsPagination },
  queryParams: { ...initialRequestsQueryParams },
  loadingRequests: false,
  errorMessage: null,
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

  clearStatus: () => {
    set({ errorMessage: null })
  },
}))
