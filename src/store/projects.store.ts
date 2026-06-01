import { create } from 'zustand'
import {
  initialProjectCostCenterEmployeesPagination,
  initialProjectCostCenterEmployeesQueryParams,
  initialProjectCostCenterEmployeesRows,
  initialProjectsPagination,
  initialProjectsQueryParams,
  initialProjectsRows,
} from '@/factories'
import {
  mapperProjectCostCenterEmployeesPagination,
  mapperProjectCostCenterEmployeesRows,
  mapperProjectsPagination,
  mapperProjectsRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { projectsService } from '@/services'
import type { ProjectsStore } from '@/types'
import {
  createOperationStatusHelpers,
  downloadBlobFile,
  formatCsvImportSummary,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreProjects = create<ProjectsStore>()((set, get) => {
  let latestProjectsRequestId = 0
  let latestProjectDetailRequestId = 0
  let latestCostCenterEmployeesRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    projectsRaw: [],
    projectDetail: null,
    projectsRows: [...initialProjectsRows],
    pagination: { ...initialProjectsPagination },
    queryParams: { ...initialProjectsQueryParams },
    costCenterEmployeesRows: [...initialProjectCostCenterEmployeesRows],
    costCenterEmployeesPagination: { ...initialProjectCostCenterEmployeesPagination },
    costCenterEmployeesQueryParams: { ...initialProjectCostCenterEmployeesQueryParams },
    loadingCostCenterEmployees: false,
    costCenterEmployeesErrorMessage: null,
    exportingCsv: false,
    importingCsv: false,
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getProjectDetail: async (projectId: string) => {
      const parsedProjectId = Number(projectId)
      if (!Number.isInteger(parsedProjectId) || parsedProjectId <= 0) {
        setOpError('detail', messages.projects.status.errors.detailInvalidProjectId)
        set({ projectDetail: null })
        return null
      }

      const requestId = ++latestProjectDetailRequestId

      try {
        setOpLoading('detail', true)
        set({ projectDetail: null })
        clearOp('detail')
        const data = await projectsService.getProjectDetail(parsedProjectId)
        if (requestId !== latestProjectDetailRequestId) return null
        set({ projectDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestProjectDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.projects.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestProjectDetailRequestId) {
          setOpLoading('detail', false)
        }
      }
    },

    getProjects: async () => {
      const requestId = ++latestProjectsRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await projectsService.getProjects(get().queryParams)
        if (requestId !== latestProjectsRequestId) return
        const pagination = mapperProjectsPagination(data)

        set({
          projectsRaw: data.content,
          projectsRows: mapperProjectsRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestProjectsRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.projects.status.errors.loadError), error)
      } finally {
        if (requestId === latestProjectsRequestId) {
          setOpLoading('list', false)
        }
      }
    },

    clearProjectDetail: () => {
      latestProjectDetailRequestId += 1
      set({ projectDetail: null })
      setOpLoading('detail', false)
      clearOp('detail')
    },

    getCostCenterEmployees: async (costCenter: number) => {
      if (!Number.isInteger(costCenter) || costCenter <= 0) {
        latestCostCenterEmployeesRequestId += 1
        set({
          costCenterEmployeesRows: [...initialProjectCostCenterEmployeesRows],
          costCenterEmployeesPagination: { ...initialProjectCostCenterEmployeesPagination },
          loadingCostCenterEmployees: false,
        })
        return
      }

      const requestId = ++latestCostCenterEmployeesRequestId
      try {
        set({ loadingCostCenterEmployees: true, costCenterEmployeesErrorMessage: null })
        const data = await projectsService.getCostCenterEmployees(costCenter, get().costCenterEmployeesQueryParams)
        if (requestId !== latestCostCenterEmployeesRequestId) return
        const pagination = {
          ...mapperProjectCostCenterEmployeesPagination(data),
          pending: data.pending ?? 0,
        }
        set({
          costCenterEmployeesRows: mapperProjectCostCenterEmployeesRows(data.content),
          costCenterEmployeesPagination: pagination,
          costCenterEmployeesQueryParams: { ...get().costCenterEmployeesQueryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestCostCenterEmployeesRequestId) return
        set({
          costCenterEmployeesRows: [...initialProjectCostCenterEmployeesRows],
          costCenterEmployeesPagination: { ...initialProjectCostCenterEmployeesPagination },
          costCenterEmployeesErrorMessage: resolveErrorMessage(error, messages.projects.status.errors.loadCostCenterEmployeesError),
        })
      } finally {
        if (requestId === latestCostCenterEmployeesRequestId) {
          set({ loadingCostCenterEmployees: false })
        }
      }
    },

    resetCostCenterEmployees: () => {
      latestCostCenterEmployeesRequestId += 1
      set({
        costCenterEmployeesRows: [...initialProjectCostCenterEmployeesRows],
        costCenterEmployeesPagination: { ...initialProjectCostCenterEmployeesPagination },
        costCenterEmployeesQueryParams: { ...initialProjectCostCenterEmployeesQueryParams },
        loadingCostCenterEmployees: false,
        costCenterEmployeesErrorMessage: null,
      })
    },

    setCostCenterEmployeesSearch: (search: string) => {
      set((state) => ({ costCenterEmployeesQueryParams: { ...state.costCenterEmployeesQueryParams, search } }))
    },

    setCostCenterEmployeesActiveFilter: (active: string) => {
      set((state) => ({ costCenterEmployeesQueryParams: { ...state.costCenterEmployeesQueryParams, active } }))
    },

    setCostCenterEmployeesStatusFilter: (statusId: string) => {
      set((state) => ({ costCenterEmployeesQueryParams: { ...state.costCenterEmployeesQueryParams, statusId } }))
    },

    clearCostCenterEmployeesFilters: () => {
      set((state) => ({
        costCenterEmployeesQueryParams: {
          ...state.costCenterEmployeesQueryParams,
          active: '',
          statusId: '',
        },
      }))
    },

    searchCostCenterEmployees: async (costCenter: number) => {
      set((state) => ({
        costCenterEmployeesPagination: { ...state.costCenterEmployeesPagination, page: 0 },
        costCenterEmployeesQueryParams: { ...state.costCenterEmployeesQueryParams, page: 0 },
      }))
      await get().getCostCenterEmployees(costCenter)
    },

    sortCostCenterEmployees: async (costCenter, sortBy, sortDir) => {
      set((state) => ({
        costCenterEmployeesPagination: { ...state.costCenterEmployeesPagination, page: 0 },
        costCenterEmployeesQueryParams: { ...state.costCenterEmployeesQueryParams, page: 0, sortBy, sortDir },
      }))
      await get().getCostCenterEmployees(costCenter)
    },

    goToCostCenterEmployeesPage: async (costCenter: number, page: number) => {
      const { costCenterEmployeesPagination } = get()
      const lastPageIndex = costCenterEmployeesPagination.totalPages - 1
      if (page < 0 || page > lastPageIndex) return
      set((state) => ({
        costCenterEmployeesPagination: { ...state.costCenterEmployeesPagination, page },
        costCenterEmployeesQueryParams: { ...state.costCenterEmployeesQueryParams, page },
      }))
      await get().getCostCenterEmployees(costCenter)
    },

    clearCostCenterEmployeesError: () => {
      set({ costCenterEmployeesErrorMessage: null })
    },

    goToPage: async (page: number) => {
      const { pagination } = get()
      const lastPageIndex = pagination.totalPages - 1
      if (page < 0 || page > lastPageIndex) return

      set((state) => ({
        pagination: { ...state.pagination, page },
        queryParams: { ...state.queryParams, page },
      }))
      await get().getProjects()
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

    setTypeFilter: (typeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, typeId } }))
    },

    setStatusFilter: (statusId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, statusId } }))
    },

    setSpecialtyFilter: (specialtyId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, specialtyId } }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom, updatedTo } }))
    },

    clearActiveFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, active: '' } }))
    },

    clearTypeFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, typeId: '' } }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, statusId: '' } }))
    },

    clearSpecialtyFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, specialtyId: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' } }))
    },

    searchProjects: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getProjects()
    },

    sortProjects: async (sortBy, sortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getProjects()
    },

    createProject: async (payload) => {
      try {
        setOpLoading('create', true)
        clearOp('create')

        const data = await projectsService.createProject(payload)
        setOpSuccess('create', `${messages.projects.status.success.createProjectSuccess} (${data.name})`)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.projects.status.errors.createProjectError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateProject: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.projects.status.errors.updateProjectInvalidId)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')

        const data = await projectsService.updateProject(payload)
        setOpSuccess('update', `${messages.projects.status.success.updateProjectSuccess} (${data.name})`)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.projects.status.errors.updateProjectError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    toggleProjectStatus: async (projectId: string, nextStatus: boolean) => {
      const parsedProjectId = Number(projectId)
      if (!Number.isInteger(parsedProjectId) || parsedProjectId <= 0) {
        setOpError('toggle', messages.projects.status.errors.invalidStatusProjectId)
        return false
      }

      try {
        setOpLoading('toggle', true)
        clearOp('toggle')
        await projectsService.toggleProjectStatus(parsedProjectId, nextStatus)
        return true
      } catch (error) {
        setOpError('toggle', resolveErrorMessage(error, messages.projects.status.errors.toggleStatusError), error)
        return false
      } finally {
        setOpLoading('toggle', false)
      }
    },

    exportProjectsCsv: async () => {
      if (get().exportingCsv) return false

      try {
        set({ exportingCsv: true })
        clearOp('list')
        const csvBlob = await projectsService.exportProjectsCsv()
        downloadBlobFile(csvBlob, 'projects.csv')
        setOpSuccess('list', messages.projects.status.success.exportSuccess)
        return true
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projects.status.errors.exportError), error)
        return false
      } finally {
        set({ exportingCsv: false })
      }
    },

    importProjectsCsv: async (file: File) => {
      if (get().importingCsv) return null

      try {
        set({ importingCsv: true })
        clearOp('list')
        const result = await projectsService.importProjectsCsv(file)
        await get().getProjects()
        return formatCsvImportSummary(result)
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projects.status.errors.importError), error)
        return null
      } finally {
        set({ importingCsv: false })
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
