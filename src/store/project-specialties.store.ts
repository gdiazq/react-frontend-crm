import { create } from 'zustand'
import {
  initialProjectSpecialtiesPagination,
  initialProjectSpecialtiesQueryParams,
  initialProjectSpecialtiesRows,
  projectSpecialtiesTableColumnIndex,
} from '@/factories'
import {
  mapperProjectSpecialtiesPagination,
  mapperProjectSpecialtiesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { projectSpecialtiesService } from '@/services'
import type { ProjectSpecialtiesStore } from '@/types'
import {
  createOperationStatusHelpers,
  downloadBlobFile,
  formatCsvImportSummary,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreProjectSpecialties = create<ProjectSpecialtiesStore>()((set, get) => {
  let latestProjectSpecialtiesRequestId = 0
  let latestProjectSpecialtyDetailRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    projectSpecialtiesRaw: [],
    projectSpecialtyDetail: null,
    projectSpecialtiesRows: [...initialProjectSpecialtiesRows],
    pagination: { ...initialProjectSpecialtiesPagination },
    queryParams: { ...initialProjectSpecialtiesQueryParams },
    exportingCsv: false,
    importingCsv: false,
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getProjectSpecialties: async () => {
      const requestId = ++latestProjectSpecialtiesRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await projectSpecialtiesService.getProjectSpecialties(get().queryParams)
        if (requestId !== latestProjectSpecialtiesRequestId) return
        const pagination = mapperProjectSpecialtiesPagination(data)

        set({
          projectSpecialtiesRaw: data.content,
          projectSpecialtiesRows: mapperProjectSpecialtiesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestProjectSpecialtiesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.projectSpecialties.status.errors.loadError), error)
      } finally {
        if (requestId === latestProjectSpecialtiesRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    getProjectSpecialtyDetail: async (projectSpecialtyId: string) => {
      const parsedProjectSpecialtyId = Number(projectSpecialtyId)
      if (!Number.isInteger(parsedProjectSpecialtyId) || parsedProjectSpecialtyId <= 0) {
        setOpError('detail', messages.projectSpecialties.status.errors.detailInvalidProjectSpecialtyId)
        set({ projectSpecialtyDetail: null })
        return null
      }
      const requestId = ++latestProjectSpecialtyDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ projectSpecialtyDetail: null })
        clearOp('detail')
        const data = await projectSpecialtiesService.getProjectSpecialtyDetail(parsedProjectSpecialtyId)
        if (requestId !== latestProjectSpecialtyDetailRequestId) return null
        set({ projectSpecialtyDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestProjectSpecialtyDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.projectSpecialties.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestProjectSpecialtyDetailRequestId) {
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
      await get().getProjectSpecialties()
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

    searchProjectSpecialties: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getProjectSpecialties()
    },

    sortProjectSpecialties: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getProjectSpecialties()
    },

    createProjectSpecialty: async (payload) => {
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('create', messages.projectSpecialties.status.errors.createProjectSpecialtyNameRequired)
        return false
      }

      try {
        setOpLoading('create', true)
        clearOp('create')
        await projectSpecialtiesService.createProjectSpecialty(payload)
        setOpSuccess('create', messages.projectSpecialties.status.success.createProjectSpecialtySuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.projectSpecialties.status.errors.createProjectSpecialtyError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateProjectSpecialty: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.projectSpecialties.status.errors.updateProjectSpecialtyInvalidId)
        return false
      }
      const name = payload.name.trim()
      if (name.length < 3) {
        setOpError('update', messages.projectSpecialties.status.errors.createProjectSpecialtyNameRequired)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await projectSpecialtiesService.updateProjectSpecialty(payload)
        setOpSuccess('update', messages.projectSpecialties.status.success.updateProjectSpecialtySuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.projectSpecialties.status.errors.updateProjectSpecialtyError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleProjectSpecialtyStatus: async (projectSpecialtyId: string, nextStatus: boolean) => {
      const parsedProjectSpecialtyId = Number(projectSpecialtyId)
      if (!Number.isInteger(parsedProjectSpecialtyId) || parsedProjectSpecialtyId <= 0) {
        setOpError('toggle', messages.projectSpecialties.status.errors.invalidStatusProjectSpecialtyId)
        return false
      }

      const previousRow = get().projectSpecialtiesRows.find((row) => row.id === projectSpecialtyId)
      const previousRaw = get().projectSpecialtiesRaw.find((item) => item.id === parsedProjectSpecialtyId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.projectSpecialties.status.errors.invalidStatusProjectSpecialtyId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        set((state) => ({
          projectSpecialtiesRaw: state.projectSpecialtiesRaw.map((item) => (item.id === parsedProjectSpecialtyId ? { ...item, active: nextStatus } : item)),
          projectSpecialtiesRows: state.projectSpecialtiesRows.map((row) => {
            if (row.id !== projectSpecialtyId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((value, index) => {
                if (index !== projectSpecialtiesTableColumnIndex.status) return value
                return nextStatus ? messages.projectSpecialties.ui.statusActive : messages.projectSpecialties.ui.statusInactive
              }),
            }
          }),
        }))

        await projectSpecialtiesService.toggleProjectSpecialtyStatus(parsedProjectSpecialtyId, nextStatus)
        return true
      } catch (error) {
        set((state) => ({
          projectSpecialtiesRaw: state.projectSpecialtiesRaw.map((item) => (item.id === parsedProjectSpecialtyId ? previousRaw : item)),
          projectSpecialtiesRows: state.projectSpecialtiesRows.map((row) => (row.id === projectSpecialtyId ? previousRow : row)),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.projectSpecialties.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    exportProjectSpecialtiesCsv: async () => {
      if (get().exportingCsv) return false

      try {
        set({ exportingCsv: true })
        clearOp('list')
        const csvBlob = await projectSpecialtiesService.exportProjectSpecialtiesCsv()
        downloadBlobFile(csvBlob, 'project-specialties.csv')
        setOpSuccess('list', messages.projectSpecialties.status.success.exportSuccess)
        return true
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projectSpecialties.status.errors.exportError), error)
        return false
      } finally {
        set({ exportingCsv: false })
      }
    },

    importProjectSpecialtiesCsv: async (file: File) => {
      if (get().importingCsv) return null

      try {
        set({ importingCsv: true })
        clearOp('list')
        const result = await projectSpecialtiesService.importProjectSpecialtiesCsv(file)
        await get().getProjectSpecialties()
        return formatCsvImportSummary(result)
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projectSpecialties.status.errors.importError), error)
        return null
      } finally {
        set({ importingCsv: false })
      }
    },

    clearProjectSpecialtyDetail: () => {
      latestProjectSpecialtyDetailRequestId += 1
      set({ projectSpecialtyDetail: null })
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
