import { create } from 'zustand'
import {
  initialOvertimePagination,
  initialOvertimeQueryParams,
  initialOvertimeRows,
} from '@/factories'
import {
  mapperOvertimePagination,
  mapperOvertimeRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { overtimeService } from '@/services'
import type { OperationKey, OperationStatus, OvertimeSortBy, OvertimeSortDir, OvertimeStore } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreOvertime = create<OvertimeStore>()((set, get) => {
  let latestOvertimeRequestId = 0
  let latestOvertimeDetailRequestId = 0
  let latestOvertimeTypesRequestId = 0

  const setOpError = (key: OperationKey, error: string, errorBack?: unknown) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error, success: null, errorBack: errorBack ?? null },
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
    if (overtimeService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
    overtimeRows: [...initialOvertimeRows],
    overtimeDetail: null,
    overtimeTypes: [],
    pagination: { ...initialOvertimePagination },
    queryParams: { ...initialOvertimeQueryParams },
    loadingOvertime: false,
    loadingOvertimeDetail: false,
    loadingOvertimeTypes: false,
    createOvertimeSubmitting: false,
    updateOvertimeSubmitting: false,
    operationStatus: initialOperationStatus(),

    getOvertime: async () => {
      const requestId = ++latestOvertimeRequestId
      try {
        set({ loadingOvertime: true })
        clearOp('list')
        const data = await overtimeService.getOvertime(get().queryParams)
        if (requestId !== latestOvertimeRequestId) return
        const pagination = mapperOvertimePagination(data)
        set({
          overtimeRows: mapperOvertimeRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestOvertimeRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.overtime.status.errors.loadError), error)
      } finally {
        if (requestId === latestOvertimeRequestId) {
          set({ loadingOvertime: false })
        }
      }
    },

    getOvertimeDetail: async (overtimeId: string) => {
      const parsedOvertimeId = Number(overtimeId)
      if (!Number.isInteger(parsedOvertimeId) || parsedOvertimeId <= 0) {
        setOpError('detail', messages.overtime.status.errors.detailInvalidOvertimeId)
        set({ overtimeDetail: null })
        return null
      }
      const requestId = ++latestOvertimeDetailRequestId

      try {
        set({ loadingOvertimeDetail: true, overtimeDetail: null })
        clearOp('detail')
        const data = await overtimeService.getOvertimeDetail(parsedOvertimeId)
        if (requestId !== latestOvertimeDetailRequestId) return null
        set({ overtimeDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestOvertimeDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.overtime.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestOvertimeDetailRequestId) {
          set({ loadingOvertimeDetail: false })
        }
      }
    },

    clearOvertimeDetail: () => {
      latestOvertimeDetailRequestId += 1
      set({ overtimeDetail: null, loadingOvertimeDetail: false })
      clearOp('detail')
    },

    getOvertimeTypes: async () => {
      const requestId = ++latestOvertimeTypesRequestId
      try {
        set({ loadingOvertimeTypes: true })
        clearOp('list')
        const data = await overtimeService.getOvertimeTypes()
        if (requestId !== latestOvertimeTypesRequestId) return
        set({ overtimeTypes: data })
      } catch (error) {
        if (requestId !== latestOvertimeTypesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.overtime.status.errors.loadTypesError), error)
      } finally {
        if (requestId === latestOvertimeTypesRequestId) {
          set({ loadingOvertimeTypes: false })
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
      await get().getOvertime()
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

    setEmployeeFilter: (employeeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId } }))
    },

    setCostCenterFilter: (costCenter: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, costCenter } }))
    },

    setStatusFilter: (statusId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, statusId } }))
    },

    setDateRange: ({ dateFrom, dateTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, dateFrom, dateTo } }))
    },

    setOvertimeTypeFilter: (overtimeTypeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, overtimeTypeId } }))
    },

    clearEmployeeFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId: '' } }))
    },

    clearCostCenterFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, costCenter: '' } }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, statusId: '' } }))
    },

    clearDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, dateFrom: '', dateTo: '' } }))
    },

    clearOvertimeTypeFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, overtimeTypeId: '' } }))
    },

    searchOvertime: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getOvertime()
    },

    sortOvertime: async (sortBy: OvertimeSortBy, sortDir: OvertimeSortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getOvertime()
    },

    createOvertime: async (payload, userId) => {
      if (!Number.isInteger(userId) || userId <= 0) {
        setOpError('create', messages.overtime.status.errors.invalidCurrentUser)
        return false
      }
      try {
        set({ createOvertimeSubmitting: true })
        clearOp('create')
        await overtimeService.createOvertime(payload, userId)
        set((state) => ({
          operationStatus: {
            ...state.operationStatus,
            create: { error: null, success: messages.overtime.status.success.createOvertimeSuccess, errorBack: null },
          },
        }))
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.overtime.status.errors.createOvertimeError), error)
        return false
      } finally {
        set({ createOvertimeSubmitting: false })
      }
    },

    updateOvertime: async (payload, userId) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.overtime.status.errors.detailInvalidOvertimeId)
        return false
      }
      if (!Number.isInteger(userId) || userId <= 0) {
        setOpError('update', messages.overtime.status.errors.invalidCurrentUser)
        return false
      }

      try {
        set({ updateOvertimeSubmitting: true })
        clearOp('update')
        await overtimeService.updateOvertime(payload, userId)
        set((state) => ({
          operationStatus: {
            ...state.operationStatus,
            update: { error: null, success: messages.overtime.status.success.updateOvertimeSuccess, errorBack: null },
          },
        }))
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.overtime.status.errors.updateOvertimeError), error)
        return false
      } finally {
        set({ updateOvertimeSubmitting: false })
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
