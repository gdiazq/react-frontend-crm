import { create } from 'zustand'
import {
  initialSafetyCompliancePagination,
  initialSafetyComplianceQueryParams,
  initialSafetyComplianceRows,
  safetyComplianceTableColumnIndex,
} from '@/factories'
import {
  mapperSafetyCompliancePagination,
  mapperSafetyComplianceRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { safetyComplianceService } from '@/services'
import type { SafetyComplianceStore } from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreSafetyCompliance = create<SafetyComplianceStore>()((set, get) => {
  let latestSafetyComplianceRequestId = 0
  let latestSafetyComplianceDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    safetyComplianceRaw: [],
    safetyComplianceDetail: null,
    safetyComplianceRows: [...initialSafetyComplianceRows],
    pagination: { ...initialSafetyCompliancePagination },
    queryParams: { ...initialSafetyComplianceQueryParams },
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getSafetyCompliance: async () => {
      const requestId = ++latestSafetyComplianceRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await safetyComplianceService.getSafetyCompliance(get().queryParams)
        if (requestId !== latestSafetyComplianceRequestId) return
        const pagination = mapperSafetyCompliancePagination(data)

        set({
          safetyComplianceRaw: data.content,
          safetyComplianceRows: mapperSafetyComplianceRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestSafetyComplianceRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.safetyCompliance.status.errors.loadError), error)
      } finally {
        if (requestId === latestSafetyComplianceRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getSafetyComplianceDetail: async (safetyComplianceId: string) => {
      const parsedSafetyComplianceId = Number(safetyComplianceId)
      if (!Number.isInteger(parsedSafetyComplianceId) || parsedSafetyComplianceId <= 0) {
        setOpError('detail', messages.safetyCompliance.status.errors.detailInvalidId)
        set({ safetyComplianceDetail: null })
        return null
      }
      const requestId = ++latestSafetyComplianceDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ safetyComplianceDetail: null })
        clearOp('detail')
        const data = await safetyComplianceService.getSafetyComplianceDetail(parsedSafetyComplianceId)
        if (requestId != latestSafetyComplianceDetailRequestId) return null
        set({ safetyComplianceDetail: data })
        return data
      } catch (error) {
        if (requestId != latestSafetyComplianceDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.safetyCompliance.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId == latestSafetyComplianceDetailRequestId) {
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
      await get().getSafetyCompliance()
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

    searchSafetyCompliance: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getSafetyCompliance()
    },

    sortSafetyCompliance: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getSafetyCompliance()
    },

    createSafetyCompliance: async (payload) => {
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('create', messages.safetyCompliance.status.errors.createError)
        return false
      }

      try {
        setOpLoading('create', true)
        clearOp('create')
        await safetyComplianceService.createSafetyCompliance(payload)
        setOpSuccess('create', messages.safetyCompliance.status.success.createSafetyComplianceSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.safetyCompliance.status.errors.createError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateSafetyCompliance: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.safetyCompliance.status.errors.updateInvalidId)
        return false
      }
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('update', messages.safetyCompliance.status.errors.createError)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await safetyComplianceService.updateSafetyCompliance(payload)
        setOpSuccess('update', messages.safetyCompliance.status.success.updateSafetyComplianceSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.safetyCompliance.status.errors.updateError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleSafetyComplianceStatus: async (safetyComplianceId: string, nextStatus: boolean) => {
      const parsedSafetyComplianceId = Number(safetyComplianceId)
      if (!Number.isInteger(parsedSafetyComplianceId) || parsedSafetyComplianceId <= 0) {
        setOpError('toggle', messages.safetyCompliance.status.errors.invalidStatusId)
        return false
      }

      const previousRow = get().safetyComplianceRows.find((row) => row.id == safetyComplianceId)
      const previousRaw = get().safetyComplianceRaw.find((item) => item.id == parsedSafetyComplianceId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.safetyCompliance.status.errors.invalidStatusId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        set((state) => ({
          safetyComplianceRaw: state.safetyComplianceRaw.map((item) =>
            item.id == parsedSafetyComplianceId ? { ...item, active: nextStatus } : item,
          ),
          safetyComplianceRows: state.safetyComplianceRows.map((row) => {
            if (row.id != safetyComplianceId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((val, index) => {
                if (index === safetyComplianceTableColumnIndex.status) {
                  return nextStatus
                    ? messages.safetyCompliance.ui.statusActive
                    : messages.safetyCompliance.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        await safetyComplianceService.toggleSafetyComplianceStatus(parsedSafetyComplianceId, nextStatus)
        setOpSuccess(
          'toggle',
          nextStatus
            ? messages.safetyCompliance.status.success.toggleEnabledSuccess
            : messages.safetyCompliance.status.success.toggleDisabledSuccess,
        )
        return true
      } catch (error) {
        set((state) => ({
          safetyComplianceRaw: state.safetyComplianceRaw.map((item) =>
            item.id == parsedSafetyComplianceId ? { ...item, active: previousRaw.active } : item,
          ),
          safetyComplianceRows: state.safetyComplianceRows.map((row) => {
            if (row.id != safetyComplianceId) return row
            return {
              ...row,
              active: previousRaw.active,
              values: row.values.map((val, index) => {
                if (index === safetyComplianceTableColumnIndex.status) {
                  return previousRaw.active
                    ? messages.safetyCompliance.ui.statusActive
                    : messages.safetyCompliance.ui.statusInactive
                }
                return val
              }),
            }
          }),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.safetyCompliance.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    clearSafetyComplianceDetail: () => {
      set({ safetyComplianceDetail: null })
    },

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
