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
    projectsRows: [...initialProjectsRows],
    pagination: { ...initialProjectsPagination },
    queryParams: { ...initialProjectsQueryParams },
    loadingProjects: false,
    createProjectSubmitting: false,
    operationStatus: initialOperationStatus(),

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

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
