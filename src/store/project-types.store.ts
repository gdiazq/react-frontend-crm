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
import type { OperationKey, OperationStatus, ProjectTypesStore } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreProjectTypes = create<ProjectTypesStore>()((set, get) => {
  let latestProjectTypeDetailRequestId = 0

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
    if (projectTypesService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
    projectTypesRaw: [],
    projectTypeDetail: null,
    projectTypesRows: [...initialProjectTypesRows],
    pagination: { ...initialProjectTypesPagination },
    queryParams: { ...initialProjectTypesQueryParams },
    loadingProjectTypes: false,
    loadingProjectTypeDetail: false,
    createProjectTypeSubmitting: false,
    updateProjectTypeSubmitting: false,
    loadingToggleStatus: false,
    operationStatus: initialOperationStatus(),

    getProjectTypes: async () => {
      try {
        set({ loadingProjectTypes: true })
        clearOp('list')
        const data = await projectTypesService.getProjectTypes(get().queryParams)
        const pagination = mapperProjectTypesPagination(data)

        set({
          projectTypesRaw: data.content,
          projectTypesRows: mapperProjectTypesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.projectTypes.status.errors.loadError), error)
      } finally {
        set({ loadingProjectTypes: false })
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
        set({ loadingProjectTypeDetail: true, projectTypeDetail: null })
        clearOp('detail')
        const data = await projectTypesService.getProjectTypeDetail(parsedProjectTypeId)
        if (requestId != latestProjectTypeDetailRequestId) return null
        set({ projectTypeDetail: data })
        return data
      } catch (error) {
        if (requestId != latestProjectTypeDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.projectTypes.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId == latestProjectTypeDetailRequestId) {
          set({ loadingProjectTypeDetail: false })
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

    clearActiveFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, active: '' } }))
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
        set({ createProjectTypeSubmitting: true })
        clearOp('create')
        await projectTypesService.createProjectType(payload)
        setOpSuccess('create', messages.projectTypes.status.success.createProjectTypeSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.projectTypes.status.errors.createProjectTypeError), error)
        return false
      } finally {
        set({ createProjectTypeSubmitting: false })
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
        set({ updateProjectTypeSubmitting: true })
        clearOp('update')
        await projectTypesService.updateProjectType(payload)
        setOpSuccess('update', messages.projectTypes.status.success.updateProjectTypeSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.projectTypes.status.errors.updateProjectTypeError), error)
        return false
      } finally {
        set({ updateProjectTypeSubmitting: false })
      }
    },

    toggleProjectTypeStatus: async (projectTypeId: string, nextStatus: boolean) => {
      const parsedProjectTypeId = Number(projectTypeId)
      if (!Number.isInteger(parsedProjectTypeId) || parsedProjectTypeId <= 0) {
        setOpError('toggle', messages.projectTypes.status.errors.invalidStatusProjectTypeId)
        return false
      }

      const previousRow = get().projectTypesRows.find((row) => row.id == projectTypeId)
      const previousRaw = get().projectTypesRaw.find((item) => item.id == parsedProjectTypeId)
      if (!previousRow || !previousRaw) {
        setOpError('toggle', messages.projectTypes.status.errors.invalidStatusProjectTypeId)
        return false
      }

      try {
        set({ loadingToggleStatus: true })
        clearOp('toggle')
        set((state) => ({
          projectTypesRaw: state.projectTypesRaw.map((item) => (item.id == parsedProjectTypeId ? { ...item, active: nextStatus } : item)),
          projectTypesRows: state.projectTypesRows.map((row) => {
            if (row.id != projectTypeId) return row
            return {
              ...row,
              active: nextStatus,
              values: row.values.map((value, index) => {
                if (index != projectTypesTableColumnIndex.status) return value
                return nextStatus ? messages.projectTypes.ui.statusActive : messages.projectTypes.ui.statusInactive
              }),
            }
          }),
        }))

        await projectTypesService.toggleProjectTypeStatus(parsedProjectTypeId, nextStatus)
        return true
      } catch (error) {
        set((state) => ({
          projectTypesRaw: state.projectTypesRaw.map((item) => (item.id == parsedProjectTypeId ? previousRaw : item)),
          projectTypesRows: state.projectTypesRows.map((row) => (row.id == projectTypeId ? previousRow : row)),
        }))
        setOpError('toggle', resolveErrorMessage(error, messages.projectTypes.status.errors.toggleStatusError), error)
        return false
      } finally {
        set({ loadingToggleStatus: false })
      }
    },

    clearProjectTypeDetail: () => {
      latestProjectTypeDetailRequestId += 1
      set({ projectTypeDetail: null, loadingProjectTypeDetail: false })
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
