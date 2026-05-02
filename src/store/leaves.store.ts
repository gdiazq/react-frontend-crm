import { create } from 'zustand'
import { leavesService } from '@/services'
import {
  initialLeavesPagination,
  initialLeavesQueryParams,
  initialLeavesRows,
} from '@/factories'
import {
  mapperLeavesPagination,
  mapperLeavesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { LeavesSortBy, LeavesSortDir, LeavesStore, OperationKey, OperationStatus } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreLeaves = create<LeavesStore>()((set, get) => {
  let latestLeaveDetailRequestId = 0

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
    if (leavesService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
    leavesRows: [...initialLeavesRows],
    leaveDetail: null,
    employeeLeaves: [],
    loadingEmployeeLeaves: false,
    pagination: { ...initialLeavesPagination },
    queryParams: { ...initialLeavesQueryParams },
    loadingLeaves: false,
    loadingLeaveDetail: false,
    createLeaveSubmitting: false,
    updateLeaveSubmitting: false,
    deletingLeaveDocument: false,
    operationStatus: initialOperationStatus(),

    getLeaves: async () => {
      try {
        set({ loadingLeaves: true })
        clearOp('list')
        const data = await leavesService.getLeaves(get().queryParams)
        const pagination = mapperLeavesPagination(data)
        set({
          leavesRows: mapperLeavesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.leaves.status.errors.loadError), error)
      } finally {
        set({ loadingLeaves: false })
      }
    },

    getLeaveDetail: async (leaveId: string) => {
      const parsedLeaveId = Number(leaveId)
      if (!Number.isInteger(parsedLeaveId) || parsedLeaveId <= 0) {
        setOpError('detail', messages.leaves.status.errors.detailInvalidLeaveId)
        set({ leaveDetail: null })
        return null
      }
      const requestId = ++latestLeaveDetailRequestId

      try {
        set({ loadingLeaveDetail: true, leaveDetail: null })
        clearOp('detail')
        const data = await leavesService.getLeaveDetail(parsedLeaveId)
        if (requestId !== latestLeaveDetailRequestId) return null
        set({ leaveDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestLeaveDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.leaves.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestLeaveDetailRequestId) {
          set({ loadingLeaveDetail: false })
        }
      }
    },

    clearLeaveDetail: () => {
      latestLeaveDetailRequestId += 1
      set({ leaveDetail: null, loadingLeaveDetail: false })
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
      await get().getLeaves()
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

    setStatusFilter: (status: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, status } }))
    },

    setLeaveTypeFilter: (leaveTypeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, leaveTypeId } }))
    },

    setEmployeeFilter: (employeeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId } }))
    },

    setContractFilter: (contractId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, contractId } }))
    },

    setStartDateRange: ({ startFrom, startTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, startFrom, startTo } }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom, updatedTo } }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, status: '' } }))
    },

    clearLeaveTypeFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, leaveTypeId: '' } }))
    },

    clearEmployeeFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId: '' } }))
    },

    clearContractFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, contractId: '' } }))
    },

    clearStartDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, startFrom: '', startTo: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' } }))
    },

    searchLeaves: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getLeaves()
    },

    sortLeaves: async (sortBy: LeavesSortBy, sortDir: LeavesSortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getLeaves()
    },

    createLeave: async (payload, files = []) => {
      try {
        set({ createLeaveSubmitting: true })
        clearOp('create')
        await leavesService.createLeave(payload, files)
        setOpSuccess('create', messages.leaves.status.success.createLeaveSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.leaves.status.errors.createLeaveError), error)
        return false
      } finally {
        set({ createLeaveSubmitting: false })
      }
    },

    updateLeave: async (payload, files = []) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.leaves.status.errors.detailInvalidLeaveId)
        return false
      }

      try {
        set({ updateLeaveSubmitting: true })
        clearOp('update')
        await leavesService.updateLeave(payload, files)
        setOpSuccess('update', messages.leaves.status.success.updateLeaveSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.leaves.status.errors.updateLeaveError), error)
        return false
      } finally {
        set({ updateLeaveSubmitting: false })
      }
    },

    deleteLeaveDocument: async (leaveId: number, fileId: number, userId: number) => {
      if (!Number.isInteger(leaveId) || leaveId <= 0 || !Number.isInteger(fileId) || fileId <= 0) {
        setOpError('toggle', messages.leaves.status.errors.deleteDocumentError)
        return false
      }

      try {
        set({ deletingLeaveDocument: true })
        clearOp('toggle')
        await leavesService.deleteLeaveDocument(leaveId, fileId, userId)
        set((state) => {
          if (!state.leaveDetail || state.leaveDetail.id !== leaveId) return {}
          return {
            leaveDetail: {
              ...state.leaveDetail,
              documents: (state.leaveDetail.documents ?? []).filter((doc) => doc.id !== fileId),
            },
          }
        })
        setOpSuccess('toggle', messages.leaves.status.success.deleteDocumentSuccess)
        return true
      } catch (error) {
        setOpError('toggle', resolveErrorMessage(error, messages.leaves.status.errors.deleteDocumentError), error)
        return false
      } finally {
        set({ deletingLeaveDocument: false })
      }
    },

    getLeavesByEmployee: async (employeeId: number) => {
      try {
        set({ loadingEmployeeLeaves: true })
        const data = await leavesService.getLeavesByEmployee(employeeId)
        set({ employeeLeaves: data })
      } catch {
        set({ employeeLeaves: [] })
      } finally {
        set({ loadingEmployeeLeaves: false })
      }
    },

    clearEmployeeLeaves: () => {
      set({ employeeLeaves: [], loadingEmployeeLeaves: false })
    },

    clearOperationStatus: (key) => {
      clearOp(key)
    },

    clearAllOperationStatus: () => {
      set({ operationStatus: initialOperationStatus() })
    },
  }
})
