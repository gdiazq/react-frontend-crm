import { create } from 'zustand'
import {
  initialProjectsPagination,
  initialProjectsQueryParams,
  initialProjectsRows,
} from '@/factories'
import {
  mapperProjectsPagination,
  mapperProjectsRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { projectsService } from '@/services'
import type { OperationKey, OperationStatus, ProjectsStore } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreProjects = create<ProjectsStore>()((set, get) => {
  let latestProjectDetailRequestId = 0

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
    if (projectsService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  const setOpSuccess = (key: OperationKey, success: string) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success, errorBack: null },
      },
    }))
  }

  return {
    projectsRaw: [],
    projectDetail: null,
    projectsRows: [...initialProjectsRows],
    pagination: { ...initialProjectsPagination },
    queryParams: { ...initialProjectsQueryParams },
    loadingProjects: false,
    loadingProjectDetail: false,
    loadingToggleStatus: false,
    createProjectSubmitting: false,
    updateProjectSubmitting: false,
    operationStatus: initialOperationStatus(),

    getProjectDetail: async (projectId: string) => {
      const parsedProjectId = Number(projectId)
      if (!Number.isInteger(parsedProjectId) || parsedProjectId <= 0) {
        setOpError('detail', messages.projects.status.errors.detailInvalidProjectId)
        set({ projectDetail: null })
        return null
      }

      const cachedProjectDetail = get().projectsRaw.find((item) => item.id == parsedProjectId)
      if (cachedProjectDetail) {
        set({ projectDetail: cachedProjectDetail })
        clearOp('detail')
        return cachedProjectDetail
      }

      const requestId = ++latestProjectDetailRequestId

      try {
        set({ loadingProjectDetail: true, projectDetail: null })
        clearOp('detail')
        const data = await projectsService.getProjectDetail(parsedProjectId)
        if (requestId != latestProjectDetailRequestId) return null
        set({ projectDetail: data })
        return data
      } catch (error) {
        if (requestId != latestProjectDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.projects.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId == latestProjectDetailRequestId) {
          set({ loadingProjectDetail: false })
        }
      }
    },

    getProjects: async () => {
      try {
        set({ loadingProjects: true })
        clearOp('list')
        const data = await projectsService.getProjects(get().queryParams)
        const pagination = mapperProjectsPagination(data)

        set({
          projectsRaw: data.content,
          projectsRows: mapperProjectsRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projects.status.errors.loadError), error)
      } finally {
        set({ loadingProjects: false })
      }
    },

    clearProjectDetail: () => {
      latestProjectDetailRequestId += 1
      set({ projectDetail: null, loadingProjectDetail: false })
      clearOp('detail')
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
        set({ createProjectSubmitting: true })
        clearOp('create')

        const data = await projectsService.createProject(payload)
        setOpSuccess('create', `${messages.projects.status.success.createProjectSuccess} (${data.name})`)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.projects.status.errors.createProjectError), error)
        return false
      } finally {
        set({ createProjectSubmitting: false })
      }
    },

    updateProject: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.projects.status.errors.updateProjectInvalidId)
        return false
      }

      try {
        set({ updateProjectSubmitting: true })
        clearOp('update')

        const data = await projectsService.updateProject(payload)
        setOpSuccess('update', `${messages.projects.status.success.updateProjectSuccess} (${data.name})`)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.projects.status.errors.updateProjectError), error)
        return false
      } finally {
        set({ updateProjectSubmitting: false })
      }
    },

    toggleProjectStatus: async (projectId: string, nextStatus: boolean) => {
      const parsedProjectId = Number(projectId)
      if (!Number.isInteger(parsedProjectId) || parsedProjectId <= 0) {
        setOpError('toggle', messages.projects.status.errors.invalidStatusProjectId)
        return false
      }

      try {
        set({ loadingToggleStatus: true })
        clearOp('toggle')
        await projectsService.toggleProjectStatus(parsedProjectId, nextStatus)
        return true
      } catch (error) {
        setOpError('toggle', resolveErrorMessage(error, messages.projects.status.errors.toggleStatusError), error)
        return false
      } finally {
        set({ loadingToggleStatus: false })
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
