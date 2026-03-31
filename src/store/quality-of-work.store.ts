import { create } from 'zustand'
import {
  initialQualityOfWorkPagination,
  initialQualityOfWorkQueryParams,
  initialQualityOfWorkRows,
  qualityOfWorkTableColumnIndex,
} from '@/factories'
import {
  mapperQualityOfWorkPagination,
  mapperQualityOfWorkRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { qualityOfWorkService } from '@/services'
import type { OperationKey, OperationStatus, QualityOfWorkStore } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreQualityOfWork = create<QualityOfWorkStore>()((set, get) => {
  let latestQualityOfWorkDetailRequestId = 0

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
    if (qualityOfWorkService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
    qualityOfWorkRaw: [],
    qualityOfWorkDetail: null,
    qualityOfWorkRows: [...initialQualityOfWorkRows],
    pagination: { ...initialQualityOfWorkPagination },
    queryParams: { ...initialQualityOfWorkQueryParams },
    loadingQualityOfWork: false,
    loadingQualityOfWorkDetail: false,
    createQualityOfWorkSubmitting: false,
    updateQualityOfWorkSubmitting: false,
    loadingToggleStatus: false,
    operationStatus: initialOperationStatus(),

    getQualityOfWork: async () => {
      try {
        set({ loadingQualityOfWork: true })
        clearOp('list')
        const data = await qualityOfWorkService.getQualityOfWork(get().queryParams)
        const pagination = mapperQualityOfWorkPagination(data)

        set({
          qualityOfWorkRaw: data.content,
          qualityOfWorkRows: mapperQualityOfWorkRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.qualityOfWork.status.errors.loadError), error)
      } finally {
        set({ loadingQualityOfWork: false })
      }
    },

    getQualityOfWorkDetail: async (qualityOfWorkId: string) => {
      const parsedQualityOfWorkId = Number(qualityOfWorkId)
      if (!Number.isInteger(parsedQualityOfWorkId) || parsedQualityOfWorkId <= 0) {
        setOpError('detail', messages.qualityOfWork.status.errors.detailInvalidId)
        set({ qualityOfWorkDetail: null })
        return null
      }
      const requestId = ++latestQualityOfWorkDetailRequestId

      try {
        set({ loadingQualityOfWorkDetail: true, qualityOfWorkDetail: null })
        clearOp('detail')
        const data = await qualityOfWorkService.getQualityOfWorkDetail(parsedQualityOfWorkId)
        if (requestId != latestQualityOfWorkDetailRequestId) return null
        set({ qualityOfWorkDetail: data })
        return data
      } catch (error) {
        if (requestId != latestQualityOfWorkDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.qualityOfWork.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId == latestQualityOfWorkDetailRequestId) {
          set({ loadingQualityOfWorkDetail: false })
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
      await get().getQualityOfWork()
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

    setActiveFilter: (active: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, active } }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({
        queryParams: {
          ...state.queryParams,
          createdFrom,
          createdTo,
        },
      }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({
        queryParams: {
          ...state.queryParams,
          updatedFrom,
          updatedTo,
        },
      }))
    },

    clearActiveFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, active: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({
        queryParams: {
          ...state.queryParams,
          createdFrom: '',
          createdTo: '',
        },
      }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({
        queryParams: {
          ...state.queryParams,
          updatedFrom: '',
          updatedTo: '',
        },
      }))
    },

    searchQualityOfWork: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getQualityOfWork()
    },

    sortQualityOfWork: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getQualityOfWork()
    },

    createQualityOfWork: async (payload) => {
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('create', messages.qualityOfWork.status.errors.createError)
        return false
      }

      try {
        set({ createQualityOfWorkSubmitting: true })
        clearOp('create')
        await qualityOfWorkService.createQualityOfWork(payload)
        setOpSuccess('create', messages.qualityOfWork.status.success.createQualityOfWorkSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.qualityOfWork.status.errors.createError), error)
        return false
      } finally {
        set({ createQualityOfWorkSubmitting: false })
      }
    },

    updateQualityOfWork: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.qualityOfWork.status.errors.updateInvalidId)
        return false
      }
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('update', messages.qualityOfWork.status.errors.createError)
        return false
      }

      try {
        set({ updateQualityOfWorkSubmitting: true })
        clearOp('update')
        await qualityOfWorkService.updateQualityOfWork(payload)
        setOpSuccess('update', messages.qualityOfWork.status.success.updateQualityOfWorkSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.qualityOfWork.status.errors.updateError), error)
        return false
      } finally {
        set({ updateQualityOfWorkSubmitting: false })
      }
    },

    toggleQualityOfWorkStatus: async (qualityOfWorkId: string, nextStatus: boolean) => {
      const parsedQualityOfWorkId = Number(qualityOfWorkId)
      if (!Number.isInteger(parsedQualityOfWorkId) || parsedQualityOfWorkId <= 0) {
        setOpError('toggle', messages.qualityOfWork.status.errors.invalidStatusId)
        return false
      }

      const previousRow = get().qualityOfWorkRows.find((row) => row.id == qualityOfWorkId)
      const previousRaw = get().qualityOfWorkRaw.find((item) => item.id == parsedQualityOfWorkId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.qualityOfWork.status.errors.invalidStatusId)
        return false
      }

      try {
        set({ loadingToggleStatus: true })
        clearOp('toggle')
        set((state) => ({
          qualityOfWorkRaw: state.qualityOfWorkRaw.map((item) =>
            item.id == parsedQualityOfWorkId ? { ...item, active: nextStatus } : item,
          ),
          qualityOfWorkRows: state.qualityOfWorkRows.map((row) => {
            if (row.id != qualityOfWorkId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((val, index) => {
                if (index === qualityOfWorkTableColumnIndex.status) {
                  return nextStatus
                    ? messages.qualityOfWork.ui.statusActive
                    : messages.qualityOfWork.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        await qualityOfWorkService.toggleQualityOfWorkStatus(parsedQualityOfWorkId, nextStatus)
        setOpSuccess(
          'toggle',
          nextStatus
            ? messages.qualityOfWork.status.success.toggleEnabledSuccess
            : messages.qualityOfWork.status.success.toggleDisabledSuccess,
        )
        return true
      } catch (error) {
        set((state) => ({
          qualityOfWorkRaw: state.qualityOfWorkRaw.map((item) =>
            item.id == parsedQualityOfWorkId ? { ...item, active: previousRaw.active } : item,
          ),
          qualityOfWorkRows: state.qualityOfWorkRows.map((row) => {
            if (row.id != qualityOfWorkId) return row
            return {
              ...row,
              active: previousRaw.active,
              values: row.values.map((val, index) => {
                if (index === qualityOfWorkTableColumnIndex.status) {
                  return previousRaw.active
                    ? messages.qualityOfWork.ui.statusActive
                    : messages.qualityOfWork.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.qualityOfWork.status.errors.toggleStatusError), error)
        return false
      } finally {
        set({ loadingToggleStatus: false })
      }
    },

    clearQualityOfWorkDetail: () => {
      set({ qualityOfWorkDetail: null })
    },

    clearOperationStatus: (key: OperationKey) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
