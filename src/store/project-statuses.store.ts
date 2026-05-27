import { create } from 'zustand'
import {
  initialProjectStatusesPagination,
  initialProjectStatusesQueryParams,
  initialProjectStatusesRows,
  projectStatusesTableColumnIndex,
} from '@/factories'
import {
  mapperProjectStatusesPagination,
  mapperProjectStatusesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { projectStatusesService } from '@/services'
import type { ProjectStatusesStore } from '@/types'
import {
  createOperationStatusHelpers,
  downloadBlobFile,
  formatCsvImportSummary,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreProjectStatuses = create<ProjectStatusesStore>()((set, get) => {
  let latestProjectStatusesRequestId = 0
  let latestProjectStatusDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    projectStatusesRaw: [],
    projectStatusDetail: null,
    projectStatusesRows: [...initialProjectStatusesRows],
    pagination: { ...initialProjectStatusesPagination },
    queryParams: { ...initialProjectStatusesQueryParams },
    exportingCsv: false,
    importingCsv: false,
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getProjectStatuses: async () => {
      const requestId = ++latestProjectStatusesRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await projectStatusesService.getProjectStatuses(get().queryParams)
        if (requestId !== latestProjectStatusesRequestId) return
        const pagination = mapperProjectStatusesPagination(data)

        set({
          projectStatusesRaw: data.content,
          projectStatusesRows: mapperProjectStatusesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestProjectStatusesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.projectStatuses.status.errors.loadError), error)
      } finally {
        if (requestId === latestProjectStatusesRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getProjectStatusDetail: async (projectStatusId: string) => {
      const parsedProjectStatusId = Number(projectStatusId)
      if (!Number.isInteger(parsedProjectStatusId) || parsedProjectStatusId <= 0) {
        setOpError('detail', messages.projectStatuses.status.errors.detailInvalidProjectStatusId)
        set({ projectStatusDetail: null })
        return null
      }
      const requestId = ++latestProjectStatusDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ projectStatusDetail: null })
        clearOp('detail')
        const data = await projectStatusesService.getProjectStatusDetail(parsedProjectStatusId)
        if (requestId != latestProjectStatusDetailRequestId) return null
        set({ projectStatusDetail: data })
        return data
      } catch (error) {
        if (requestId != latestProjectStatusDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.projectStatuses.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId == latestProjectStatusDetailRequestId) {
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
      await get().getProjectStatuses()
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

    searchProjectStatuses: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getProjectStatuses()
    },

    sortProjectStatuses: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getProjectStatuses()
    },

    createProjectStatus: async (payload) => {
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('create', messages.projectStatuses.status.errors.createProjectStatusNameRequired)
        return false
      }

      try {
        setOpLoading('create', true)
        clearOp('create')
        await projectStatusesService.createProjectStatus(payload)
        setOpSuccess('create', messages.projectStatuses.status.success.createProjectStatusSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.projectStatuses.status.errors.createProjectStatusError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateProjectStatus: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.projectStatuses.status.errors.updateProjectStatusInvalidId)
        return false
      }
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('update', messages.projectStatuses.status.errors.createProjectStatusNameRequired)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await projectStatusesService.updateProjectStatus(payload)
        setOpSuccess('update', messages.projectStatuses.status.success.updateProjectStatusSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.projectStatuses.status.errors.updateProjectStatusError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleProjectStatusStatus: async (projectStatusId: string, nextStatus: boolean) => {
      const parsedProjectStatusId = Number(projectStatusId)
      if (!Number.isInteger(parsedProjectStatusId) || parsedProjectStatusId <= 0) {
        setOpError('toggle', messages.projectStatuses.status.errors.invalidStatusProjectStatusId)
        return false
      }

      const previousRow = get().projectStatusesRows.find((row) => row.id == projectStatusId)
      const previousRaw = get().projectStatusesRaw.find((item) => item.id == parsedProjectStatusId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.projectStatuses.status.errors.invalidStatusProjectStatusId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        set((state) => ({
          projectStatusesRaw: state.projectStatusesRaw.map((item) => (item.id == parsedProjectStatusId ? { ...item, active: nextStatus } : item)),
          projectStatusesRows: state.projectStatusesRows.map((row) => {
            if (row.id != projectStatusId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((value, index) => {
                if (index != projectStatusesTableColumnIndex.status) return value
                return nextStatus ? messages.projectStatuses.ui.statusActive : messages.projectStatuses.ui.statusInactive
              }),
            }
          }),
        }))

        await projectStatusesService.toggleProjectStatusStatus(parsedProjectStatusId, nextStatus)
        return true
      } catch (error) {
        set((state) => ({
          projectStatusesRaw: state.projectStatusesRaw.map((item) => (item.id == parsedProjectStatusId ? previousRaw : item)),
          projectStatusesRows: state.projectStatusesRows.map((row) => (row.id == projectStatusId ? previousRow : row)),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.projectStatuses.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    exportProjectStatusesCsv: async () => {
      if (get().exportingCsv) return false

      try {
        set({ exportingCsv: true })
        clearOp('list')
        const csvBlob = await projectStatusesService.exportProjectStatusesCsv()
        downloadBlobFile(csvBlob, 'project-statuses.csv')
        setOpSuccess('list', messages.projectStatuses.status.success.exportSuccess)
        return true
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projectStatuses.status.errors.exportError), error)
        return false
      } finally {
        set({ exportingCsv: false })
      }
    },

    importProjectStatusesCsv: async (file: File) => {
      if (get().importingCsv) return null

      try {
        set({ importingCsv: true })
        clearOp('list')
        const result = await projectStatusesService.importProjectStatusesCsv(file)
        await get().getProjectStatuses()
        return formatCsvImportSummary(result)
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projectStatuses.status.errors.importError), error)
        return null
      } finally {
        set({ importingCsv: false })
      }
    },

    clearProjectStatusDetail: () => {
      latestProjectStatusDetailRequestId += 1
      set({ projectStatusDetail: null })
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
