import { create } from 'zustand'
import {
  initialTransferPagination,
  initialTransferQueryParams,
  initialTransferRows,
} from '@/factories'
import {
  mapperTransferPagination,
  mapperTransferRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { transferService } from '@/services'
import {
  createOperationStatusHelpers,
  initialOperationLoading,
  downloadBlobFile,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'
import type { TransferStore } from '@/types'

export const useStoreTransfer = create<TransferStore>()((set, get) => {
  let latestTransfersRequestId = 0
  let latestDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    transferRaw: [],
    transferDetail: null,
    transferRows: [...initialTransferRows],
    pagination: { ...initialTransferPagination },
    queryParams: { ...initialTransferQueryParams },
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getTransfers: async () => {
      const requestId = ++latestTransfersRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await transferService.getTransfers(get().queryParams)
        if (requestId !== latestTransfersRequestId) return
        const pagination = mapperTransferPagination(data)
        set({
          transferRaw: data.content,
          transferRows: mapperTransferRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestTransfersRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.transfer.status.errors.loadError), error)
      } finally {
        if (requestId === latestTransfersRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getTransferDetail: async (id: string) => {
      const parsedId = Number(id)
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setOpError('detail', messages.transfer.status.errors.detailInvalidId)
        set({ transferDetail: null })
        return null
      }
      const requestId = ++latestDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ transferDetail: null })
        clearOp('detail')
        const data = await transferService.getTransferDetail(parsedId)
        if (requestId !== latestDetailRequestId) return null
        set({ transferDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.transfer.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestDetailRequestId) {
          setOpLoading('detail', false)
        }
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
      await get().getTransfers()
    },

    nextPage: async () => {
      if (get().pagination.last) return
      await get().goToPage(get().pagination.page + 1)
    },

    previousPage: async () => {
      if (get().pagination.first) return
      await get().goToPage(get().pagination.page - 1)
    },

    setSearch: (search: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, search } }))
    },

    setStatusFilter: (status: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, status } }))
    },

    setToCostCenterFilter: (toCostCenter: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, toCostCenter } }))
    },

    setEffectiveDateRange: ({ effectiveDateFrom, effectiveDateTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, effectiveDateFrom, effectiveDateTo } }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom, updatedTo } }))
    },

    clearSearch: () => {
      set((state) => ({ queryParams: { ...state.queryParams, search: '' } }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, status: '' } }))
    },

    clearToCostCenterFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, toCostCenter: '' } }))
    },

    clearEffectiveDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, effectiveDateFrom: '', effectiveDateTo: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' } }))
    },

    searchTransfers: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getTransfers()
    },

    sortTransfers: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getTransfers()
    },

    createTransfer: async (payload, files = []) => {
      try {
        setOpLoading('create', true)
        clearOp('create')
        await transferService.createTransfer(payload, files)
        setOpSuccess('create', messages.transfer.status.success.createSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.transfer.status.errors.createError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateTransfer: async (payload, files = []) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.transfer.status.errors.updateInvalidId)
        return false
      }
      try {
        setOpLoading('update', true)
        clearOp('update')
        await transferService.updateTransfer(payload, files)
        setOpSuccess('update', messages.transfer.status.success.updateSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.transfer.status.errors.updateError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    exportTransfersCsv: async () => {
      try {
        const blob = await transferService.exportTransfersCsv()
        downloadBlobFile(blob, 'transfers.csv')
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.transfer.status.errors.exportError), error)
      }
    },

    clearTransferDetail: () => {
      set({ transferDetail: null })
    },

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
