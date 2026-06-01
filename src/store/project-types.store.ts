import { create } from 'zustand'
import {
  initialProjectTypesPagination,
  initialProjectTypesQueryParams,
  initialProjectTypesRows,
  projectTypesTableColumnIndex,
} from '@/factories'
import {
  mapperProjectTypesPagination,
  mapperProjectTypesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { projectTypesService } from '@/services'
import type { ProjectTypesStore } from '@/types'
import {
  createOperationStatusHelpers,
  downloadBlobFile,
  formatCsvImportSummary,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreProjectTypes = create<ProjectTypesStore>()((set, get) => {
  let latestProjectTypesRequestId = 0
  let latestProjectTypeDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    projectTypesRaw: [],
    projectTypeDetail: null,
    projectTypesRows: [...initialProjectTypesRows],
    pagination: { ...initialProjectTypesPagination },
    queryParams: { ...initialProjectTypesQueryParams },
    exportingCsv: false,
    importingCsv: false,
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getProjectTypes: async () => {
      const requestId = ++latestProjectTypesRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await projectTypesService.getProjectTypes(get().queryParams)
        if (requestId !== latestProjectTypesRequestId) return
        const pagination = mapperProjectTypesPagination(data)

        set({
          projectTypesRaw: data.content,
          projectTypesRows: mapperProjectTypesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestProjectTypesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.projectTypes.status.errors.loadError), error)
      } finally {
        if (requestId === latestProjectTypesRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getProjectTypeDetail: async (projectTypeId: string) => {
      const parsedProjectTypeId = Number(projectTypeId)
      if (!Number.isInteger(parsedProjectTypeId) || parsedProjectTypeId <= 0) {
        setOpError('detail', messages.projectTypes.status.errors.detailInvalidProjectTypeId)
        set({ projectTypeDetail: null })
        return null
      }
      const requestId = ++latestProjectTypeDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ projectTypeDetail: null })
        clearOp('detail')
        const data = await projectTypesService.getProjectTypeDetail(parsedProjectTypeId)
        if (requestId !== latestProjectTypeDetailRequestId) return null
        set({ projectTypeDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestProjectTypeDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.projectTypes.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestProjectTypeDetailRequestId) {
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
      await get().getProjectTypes()
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

    searchProjectTypes: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getProjectTypes()
    },

    sortProjectTypes: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getProjectTypes()
    },

    createProjectType: async (payload) => {
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('create', messages.projectTypes.status.errors.createProjectTypeNameRequired)
        return false
      }

      try {
        setOpLoading('create', true)
        clearOp('create')
        await projectTypesService.createProjectType(payload)
        setOpSuccess('create', messages.projectTypes.status.success.createProjectTypeSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.projectTypes.status.errors.createProjectTypeError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateProjectType: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.projectTypes.status.errors.updateProjectTypeInvalidId)
        return false
      }
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('update', messages.projectTypes.status.errors.createProjectTypeNameRequired)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await projectTypesService.updateProjectType(payload)
        setOpSuccess('update', messages.projectTypes.status.success.updateProjectTypeSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.projectTypes.status.errors.updateProjectTypeError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleProjectTypeStatus: async (projectTypeId: string, nextStatus: boolean) => {
      const parsedProjectTypeId = Number(projectTypeId)
      if (!Number.isInteger(parsedProjectTypeId) || parsedProjectTypeId <= 0) {
        setOpError('toggle', messages.projectTypes.status.errors.invalidStatusProjectTypeId)
        return false
      }

      const previousRow = get().projectTypesRows.find((row) => row.id === projectTypeId)
      const previousRaw = get().projectTypesRaw.find((item) => item.id === parsedProjectTypeId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.projectTypes.status.errors.invalidStatusProjectTypeId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        set((state) => ({
          projectTypesRaw: state.projectTypesRaw.map((item) => (item.id === parsedProjectTypeId ? { ...item, active: nextStatus } : item)),
          projectTypesRows: state.projectTypesRows.map((row) => {
            if (row.id !== projectTypeId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((value, index) => {
                if (index !== projectTypesTableColumnIndex.status) return value
                return nextStatus ? messages.projectTypes.ui.statusActive : messages.projectTypes.ui.statusInactive
              }),
            }
          }),
        }))

        await projectTypesService.toggleProjectTypeStatus(parsedProjectTypeId, nextStatus)
        return true
      } catch (error) {
        set((state) => ({
          projectTypesRaw: state.projectTypesRaw.map((item) => (item.id === parsedProjectTypeId ? previousRaw : item)),
          projectTypesRows: state.projectTypesRows.map((row) => (row.id === projectTypeId ? previousRow : row)),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.projectTypes.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    exportProjectTypesCsv: async () => {
      if (get().exportingCsv) return false

      try {
        set({ exportingCsv: true })
        clearOp('list')
        const csvBlob = await projectTypesService.exportProjectTypesCsv()
        downloadBlobFile(csvBlob, 'project-types.csv')
        setOpSuccess('list', messages.projectTypes.status.success.exportSuccess)
        return true
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projectTypes.status.errors.exportError), error)
        return false
      } finally {
        set({ exportingCsv: false })
      }
    },

    importProjectTypesCsv: async (file: File) => {
      if (get().importingCsv) return null

      try {
        set({ importingCsv: true })
        clearOp('list')
        const result = await projectTypesService.importProjectTypesCsv(file)
        await get().getProjectTypes()
        return formatCsvImportSummary(result)
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projectTypes.status.errors.importError), error)
        return null
      } finally {
        set({ importingCsv: false })
      }
    },

    clearProjectTypeDetail: () => {
      latestProjectTypeDetailRequestId += 1
      set({ projectTypeDetail: null })
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
