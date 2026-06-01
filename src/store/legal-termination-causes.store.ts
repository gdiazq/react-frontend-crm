import { create } from 'zustand'
import {
  initialLegalTerminationCausesPagination,
  initialLegalTerminationCausesQueryParams,
  initialLegalTerminationCausesRows,
  legalTerminationCausesTableColumnIndex,
} from '@/factories'
import {
  mapperLegalTerminationCausesPagination,
  mapperLegalTerminationCausesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { legalTerminationCausesService } from '@/services'
import type { LegalTerminationCausesStore } from '@/types'
import {
  createOperationStatusHelpers,
  downloadBlobFile,
  formatCsvImportSummary,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreLegalTerminationCauses = create<LegalTerminationCausesStore>()((set, get) => {
  let latestLegalTerminationCausesRequestId = 0
  let latestLegalTerminationCauseDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    legalTerminationCausesRaw: [],
    legalTerminationCauseDetail: null,
    legalTerminationCausesRows: [...initialLegalTerminationCausesRows],
    pagination: { ...initialLegalTerminationCausesPagination },
    queryParams: { ...initialLegalTerminationCausesQueryParams },
    exportingCsv: false,
    importingCsv: false,
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getLegalTerminationCauses: async () => {
      const requestId = ++latestLegalTerminationCausesRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await legalTerminationCausesService.getLegalTerminationCauses(get().queryParams)
        if (requestId !== latestLegalTerminationCausesRequestId) return
        const pagination = mapperLegalTerminationCausesPagination(data)

        set({
          legalTerminationCausesRaw: data.content,
          legalTerminationCausesRows: mapperLegalTerminationCausesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestLegalTerminationCausesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.legalTerminationCauses.status.errors.loadError), error)
      } finally {
        if (requestId === latestLegalTerminationCausesRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getLegalTerminationCauseDetail: async (legalTerminationCauseId: string) => {
      const parsedLegalTerminationCauseId = Number(legalTerminationCauseId)
      if (!Number.isInteger(parsedLegalTerminationCauseId) || parsedLegalTerminationCauseId <= 0) {
        setOpError('detail', messages.legalTerminationCauses.status.errors.detailInvalidLegalTerminationCauseId)
        set({ legalTerminationCauseDetail: null })
        return null
      }
      const requestId = ++latestLegalTerminationCauseDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ legalTerminationCauseDetail: null })
        clearOp('detail')
        const data = await legalTerminationCausesService.getLegalTerminationCauseDetail(parsedLegalTerminationCauseId)
        if (requestId !== latestLegalTerminationCauseDetailRequestId) return null
        set({ legalTerminationCauseDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestLegalTerminationCauseDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.legalTerminationCauses.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestLegalTerminationCauseDetailRequestId) {
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
      await get().getLegalTerminationCauses()
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

    searchLegalTerminationCauses: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getLegalTerminationCauses()
    },

    sortLegalTerminationCauses: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getLegalTerminationCauses()
    },

    createLegalTerminationCause: async (payload) => {
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('create', messages.legalTerminationCauses.status.errors.createLegalTerminationCauseNameRequired)
        return false
      }

      try {
        setOpLoading('create', true)
        clearOp('create')
        await legalTerminationCausesService.createLegalTerminationCause(payload)
        setOpSuccess('create', messages.legalTerminationCauses.status.success.createLegalTerminationCauseSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.legalTerminationCauses.status.errors.createLegalTerminationCauseError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateLegalTerminationCause: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.legalTerminationCauses.status.errors.updateLegalTerminationCauseInvalidId)
        return false
      }
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('update', messages.legalTerminationCauses.status.errors.createLegalTerminationCauseNameRequired)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await legalTerminationCausesService.updateLegalTerminationCause(payload)
        setOpSuccess('update', messages.legalTerminationCauses.status.success.updateLegalTerminationCauseSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.legalTerminationCauses.status.errors.updateLegalTerminationCauseError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleLegalTerminationCauseStatus: async (legalTerminationCauseId: string, nextStatus: boolean) => {
      const parsedLegalTerminationCauseId = Number(legalTerminationCauseId)
      if (!Number.isInteger(parsedLegalTerminationCauseId) || parsedLegalTerminationCauseId <= 0) {
        setOpError('toggle', messages.legalTerminationCauses.status.errors.invalidStatusLegalTerminationCauseId)
        return false
      }

      const previousRow = get().legalTerminationCausesRows.find((row) => row.id === legalTerminationCauseId)
      const previousRaw = get().legalTerminationCausesRaw.find((item) => item.id === parsedLegalTerminationCauseId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.legalTerminationCauses.status.errors.invalidStatusLegalTerminationCauseId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        set((state) => ({
          legalTerminationCausesRaw: state.legalTerminationCausesRaw.map((item) => (item.id === parsedLegalTerminationCauseId ? { ...item, active: nextStatus } : item)),
          legalTerminationCausesRows: state.legalTerminationCausesRows.map((row) => {
            if (row.id !== legalTerminationCauseId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((value, index) => {
                if (index !== legalTerminationCausesTableColumnIndex.status) return value
                return nextStatus ? messages.legalTerminationCauses.ui.statusActive : messages.legalTerminationCauses.ui.statusInactive
              }),
            }
          }),
        }))

        await legalTerminationCausesService.toggleLegalTerminationCauseStatus(parsedLegalTerminationCauseId, nextStatus)
        return true
      } catch (error) {
        set((state) => ({
          legalTerminationCausesRaw: state.legalTerminationCausesRaw.map((item) => (item.id === parsedLegalTerminationCauseId ? previousRaw : item)),
          legalTerminationCausesRows: state.legalTerminationCausesRows.map((row) => (row.id === legalTerminationCauseId ? previousRow : row)),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.legalTerminationCauses.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    exportLegalTerminationCausesCsv: async () => {
      if (get().exportingCsv) return false

      try {
        set({ exportingCsv: true })
        clearOp('list')
        const csvBlob = await legalTerminationCausesService.exportLegalTerminationCausesCsv()
        downloadBlobFile(csvBlob, 'legal-termination-causes.csv')
        setOpSuccess('list', messages.legalTerminationCauses.status.success.exportSuccess)
        return true
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.legalTerminationCauses.status.errors.exportError), error)
        return false
      } finally {
        set({ exportingCsv: false })
      }
    },

    importLegalTerminationCausesCsv: async (file: File) => {
      if (get().importingCsv) return null

      try {
        set({ importingCsv: true })
        clearOp('list')
        const result = await legalTerminationCausesService.importLegalTerminationCausesCsv(file)
        await get().getLegalTerminationCauses()
        return formatCsvImportSummary(result)
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.legalTerminationCauses.status.errors.importError), error)
        return null
      } finally {
        set({ importingCsv: false })
      }
    },

    clearLegalTerminationCauseDetail: () => {
      latestLegalTerminationCauseDetailRequestId += 1
      set({ legalTerminationCauseDetail: null })
      setOpLoading('detail', false)
      clearOp('detail')
    },

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
