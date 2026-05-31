import { create } from 'zustand'
import { annexesService } from '@/services'
import {
  initialAnnexesPagination,
  initialAnnexesQueryParams,
  initialAnnexesRows,
} from '@/factories'
import {
  mapperAnnexesPagination,
  mapperAnnexesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { AnnexesSortBy, AnnexesSortDir, AnnexesStore } from '@/types'
import {
  createOperationStatusHelpers,
  downloadBlobFile,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreAnnexes = create<AnnexesStore>()((set, get) => {
  let latestAnnexesRequestId = 0
  let latestAnnexDetailRequestId = 0
  let latestContractAnnexesRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    annexesRows: [...initialAnnexesRows],
    annexDetail: null,
    contractAnnexes: [],
    loadingContractAnnexes: false,
    pagination: { ...initialAnnexesPagination },
    queryParams: { ...initialAnnexesQueryParams },
    exportingCsv: false,
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getAnnexes: async () => {
      const requestId = ++latestAnnexesRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await annexesService.getAnnexes(get().queryParams)
        if (requestId !== latestAnnexesRequestId) return
        const pagination = mapperAnnexesPagination(data)
        set({
          annexesRows: mapperAnnexesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestAnnexesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.annexes.status.errors.loadError), error)
      } finally {
        if (requestId === latestAnnexesRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getAnnexDetail: async (annexId: string) => {
      const parsedAnnexId = Number(annexId)
      if (!Number.isInteger(parsedAnnexId) || parsedAnnexId <= 0) {
        setOpError('detail', messages.annexes.status.errors.detailInvalidAnnexId)
        set({ annexDetail: null })
        return null
      }
      const requestId = ++latestAnnexDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ annexDetail: null })
        clearOp('detail')
        const data = await annexesService.getAnnexDetail(parsedAnnexId)
        if (requestId !== latestAnnexDetailRequestId) return null
        set({ annexDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestAnnexDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.annexes.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestAnnexDetailRequestId) {
          setOpLoading('detail', false)
        }
      }
    },

    clearAnnexDetail: () => {
      latestAnnexDetailRequestId += 1
      set({ annexDetail: null })
      setOpLoading('detail', false)
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
      await get().getAnnexes()
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

    setStatusFilter: (status: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, status } }))
    },

    setAnnexTypeFilter: (annexTypeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, annexTypeId } }))
    },

    setContractFilter: (contractId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, contractId } }))
    },

    setDateRange: ({ dateFrom, dateTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, dateFrom, dateTo } }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom, updatedTo } }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, status: '' } }))
    },

    clearAnnexTypeFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, annexTypeId: '' } }))
    },

    clearContractFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, contractId: '' } }))
    },

    clearDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, dateFrom: '', dateTo: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' } }))
    },

    searchAnnexes: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getAnnexes()
    },

    sortAnnexes: async (sortBy: AnnexesSortBy, sortDir: AnnexesSortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getAnnexes()
    },

    createAnnex: async (payload, files = []) => {
      try {
        setOpLoading('create', true)
        clearOp('create')
        await annexesService.createAnnex(payload, files)
        setOpSuccess('create', messages.annexes.status.success.createAnnexSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.annexes.status.errors.createAnnexError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateAnnex: async (payload, files = []) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.annexes.status.errors.detailInvalidAnnexId)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await annexesService.updateAnnex(payload, files)
        setOpSuccess('update', messages.annexes.status.success.updateAnnexSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.annexes.status.errors.updateAnnexError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    exportAnnexesCsv: async () => {
      if (get().exportingCsv) return false
      try {
        set({ exportingCsv: true })
        clearOp('list')
        const blob = await annexesService.exportAnnexesCsv()
        downloadBlobFile(blob, 'annexes.csv')
        setOpSuccess('list', messages.annexes.status.success.exportSuccess)
        return true
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.annexes.status.errors.exportError), error)
        return false
      } finally {
        set({ exportingCsv: false })
      }
    },

    getAnnexesByContract: async (contractId: number) => {
      const requestId = ++latestContractAnnexesRequestId
      try {
        set({ loadingContractAnnexes: true })
        const data = await annexesService.getAnnexesByContract(contractId)
        if (requestId !== latestContractAnnexesRequestId) return
        set({ contractAnnexes: data })
      } catch (error) {
        if (requestId !== latestContractAnnexesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.annexes.status.errors.loadError), error)
        set({ contractAnnexes: [] })
      } finally {
        if (requestId === latestContractAnnexesRequestId) {
          set({ loadingContractAnnexes: false })
        }
      }
    },

    clearContractAnnexes: () => {
      set({ contractAnnexes: [], loadingContractAnnexes: false })
    },

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
