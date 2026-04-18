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
import { useStoreAuth } from './auth.store'
import { downloadBlobFile } from '@/utils'
import type { OperationKey, OperationStatus, TransferStore } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreTransfer = create<TransferStore>()((set, get) => {
  let latestDetailRequestId = 0

  const setOpError = (key: OperationKey, error: string, errorBack?: unknown) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error, success: null, errorBack: errorBack ?? null },
      },
    }))
  }

  const setOpSuccess = (key: OperationKey, success: string) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success, errorBack: null },
      },
    }))
  }

  const clearOp = (key: OperationKey) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success: null, errorBack: null },
      },
    }))
  }

  const resolveErrorMessage = (error: unknown, fallback: string): string => {
    if (transferService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
    transferRaw: [],
    transferDetail: null,
    transferRows: [...initialTransferRows],
    pagination: { ...initialTransferPagination },
    queryParams: { ...initialTransferQueryParams },
    loadingTransfers: false,
    loadingTransferDetail: false,
    createTransferSubmitting: false,
    updateTransferSubmitting: false,
    loadingDeleteDocument: false,
    operationStatus: initialOperationStatus(),

    getTransfers: async () => {
      try {
        set({ loadingTransfers: true })
        clearOp('list')
        const data = await transferService.getTransfers(get().queryParams)
        const pagination = mapperTransferPagination(data)
        set({
          transferRaw: data.content,
          transferRows: mapperTransferRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.transfer.status.errors.loadError), error)
      } finally {
        set({ loadingTransfers: false })
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
        set({ loadingTransferDetail: true, transferDetail: null })
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
          set({ loadingTransferDetail: false })
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

    clearSearch: () => {
      set((state) => ({ queryParams: { ...state.queryParams, search: '' } }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, status: '' } }))
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
        set({ createTransferSubmitting: true })
        clearOp('create')
        await transferService.createTransfer(payload, files)
        setOpSuccess('create', messages.transfer.status.success.createSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.transfer.status.errors.createError), error)
        return false
      } finally {
        set({ createTransferSubmitting: false })
      }
    },

    updateTransfer: async (payload, files = []) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.transfer.status.errors.updateInvalidId)
        return false
      }
      try {
        set({ updateTransferSubmitting: true })
        clearOp('update')
        await transferService.updateTransfer(payload, files)
        setOpSuccess('update', messages.transfer.status.success.updateSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.transfer.status.errors.updateError), error)
        return false
      } finally {
        set({ updateTransferSubmitting: false })
      }
    },

    deleteTransferDocument: async (transferId: number, fileId: number) => {
      const userId = useStoreAuth.getState().user?.id
      if (!userId) return false
      try {
        set({ loadingDeleteDocument: true })
        clearOp('toggle')
        await transferService.deleteTransferDocument(transferId, fileId, userId)
        set((state) => {
          if (!state.transferDetail) return {}
          return {
            transferDetail: {
              ...state.transferDetail,
              documents: state.transferDetail.documents.filter((doc) => doc.id !== fileId),
            },
          }
        })
        setOpSuccess('toggle', messages.transfer.status.success.deleteDocumentSuccess)
        return true
      } catch (error) {
        setOpError('toggle', resolveErrorMessage(error, messages.transfer.status.errors.deleteDocumentError), error)
        return false
      } finally {
        set({ loadingDeleteDocument: false })
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

    clearOperationStatus: (key: OperationKey) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
