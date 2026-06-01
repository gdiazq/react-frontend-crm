import { create } from 'zustand'
import {
  initialNoRehireCausePagination,
  initialNoRehireCauseQueryParams,
  initialNoRehireCauseRows,
  noRehireCauseTableColumnIndex,
} from '@/factories'
import {
  mapperNoRehireCausePagination,
  mapperNoRehireCauseRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { noRehireCauseService } from '@/services'
import type { NoRehireCauseStore } from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreNoRehireCause = create<NoRehireCauseStore>()((set, get) => {
  let latestNoRehireCauseRequestId = 0
  let latestNoRehireCauseDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    noRehireCauseRaw: [],
    noRehireCauseDetail: null,
    noRehireCauseRows: [...initialNoRehireCauseRows],
    pagination: { ...initialNoRehireCausePagination },
    queryParams: { ...initialNoRehireCauseQueryParams },
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getNoRehireCause: async () => {
      const requestId = ++latestNoRehireCauseRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await noRehireCauseService.getNoRehireCause(get().queryParams)
        if (requestId !== latestNoRehireCauseRequestId) return
        const pagination = mapperNoRehireCausePagination(data)

        set({
          noRehireCauseRaw: data.content,
          noRehireCauseRows: mapperNoRehireCauseRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestNoRehireCauseRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.noRehireCause.status.errors.loadError), error)
      } finally {
        if (requestId === latestNoRehireCauseRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getNoRehireCauseDetail: async (noRehireCauseId: string) => {
      const parsedNoRehireCauseId = Number(noRehireCauseId)
      if (!Number.isInteger(parsedNoRehireCauseId) || parsedNoRehireCauseId <= 0) {
        setOpError('detail', messages.noRehireCause.status.errors.detailInvalidId)
        set({ noRehireCauseDetail: null })
        return null
      }
      const requestId = ++latestNoRehireCauseDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ noRehireCauseDetail: null })
        clearOp('detail')
        const data = await noRehireCauseService.getNoRehireCauseDetail(parsedNoRehireCauseId)
        if (requestId !== latestNoRehireCauseDetailRequestId) return null
        set({ noRehireCauseDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestNoRehireCauseDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.noRehireCause.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestNoRehireCauseDetailRequestId) {
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
      await get().getNoRehireCause()
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
        queryParams: { ...state.queryParams, createdFrom, createdTo },
      }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({
        queryParams: { ...state.queryParams, updatedFrom, updatedTo },
      }))
    },

    clearActiveFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, active: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({
        queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' },
      }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({
        queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' },
      }))
    },

    searchNoRehireCause: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getNoRehireCause()
    },

    sortNoRehireCause: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getNoRehireCause()
    },

    createNoRehireCause: async (payload) => {
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('create', messages.noRehireCause.status.errors.createError)
        return false
      }

      try {
        setOpLoading('create', true)
        clearOp('create')
        await noRehireCauseService.createNoRehireCause(payload)
        setOpSuccess('create', messages.noRehireCause.status.success.createNoRehireCauseSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.noRehireCause.status.errors.createError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateNoRehireCause: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.noRehireCause.status.errors.updateInvalidId)
        return false
      }
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('update', messages.noRehireCause.status.errors.createError)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await noRehireCauseService.updateNoRehireCause(payload)
        setOpSuccess('update', messages.noRehireCause.status.success.updateNoRehireCauseSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.noRehireCause.status.errors.updateError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleNoRehireCauseStatus: async (noRehireCauseId: string, nextStatus: boolean) => {
      const parsedNoRehireCauseId = Number(noRehireCauseId)
      if (!Number.isInteger(parsedNoRehireCauseId) || parsedNoRehireCauseId <= 0) {
        setOpError('toggle', messages.noRehireCause.status.errors.invalidStatusId)
        return false
      }

      const previousRow = get().noRehireCauseRows.find((row) => row.id === noRehireCauseId)
      const previousRaw = get().noRehireCauseRaw.find((item) => item.id === parsedNoRehireCauseId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.noRehireCause.status.errors.invalidStatusId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        set((state) => ({
          noRehireCauseRaw: state.noRehireCauseRaw.map((item) =>
            item.id === parsedNoRehireCauseId ? { ...item, active: nextStatus } : item,
          ),
          noRehireCauseRows: state.noRehireCauseRows.map((row) => {
            if (row.id !== noRehireCauseId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((val, index) => {
                if (index === noRehireCauseTableColumnIndex.status) {
                  return nextStatus
                    ? messages.noRehireCause.ui.statusActive
                    : messages.noRehireCause.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        await noRehireCauseService.toggleNoRehireCauseStatus(parsedNoRehireCauseId, nextStatus)
        setOpSuccess(
          'toggle',
          nextStatus
            ? messages.noRehireCause.status.success.toggleEnabledSuccess
            : messages.noRehireCause.status.success.toggleDisabledSuccess,
        )
        return true
      } catch (error) {
        set((state) => ({
          noRehireCauseRaw: state.noRehireCauseRaw.map((item) =>
            item.id === parsedNoRehireCauseId ? { ...item, active: previousRaw.active } : item,
          ),
          noRehireCauseRows: state.noRehireCauseRows.map((row) => {
            if (row.id !== noRehireCauseId) return row
            return {
              ...row,
              active: previousRaw.active,
              values: row.values.map((val, index) => {
                if (index === noRehireCauseTableColumnIndex.status) {
                  return previousRaw.active
                    ? messages.noRehireCause.ui.statusActive
                    : messages.noRehireCause.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.noRehireCause.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    clearNoRehireCauseDetail: () => {
      set({ noRehireCauseDetail: null })
    },

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
