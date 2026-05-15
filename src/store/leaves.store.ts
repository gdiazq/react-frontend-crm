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
import type { LeavesSortBy, LeavesSortDir, LeavesStore } from '@/types'
import {
  createOperationStatusHelpers,
  initialOperationLoading,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreLeaves = create<LeavesStore>()((set, get) => {
  let latestLeavesRequestId = 0
  let latestLeaveDetailRequestId = 0
  let latestEmployeeLeavesRequestId = 0

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
    leavesRows: [...initialLeavesRows],
    leaveDetail: null,
    employeeLeaves: [],
    loadingEmployeeLeaves: false,
    pagination: { ...initialLeavesPagination },
    queryParams: { ...initialLeavesQueryParams },
    operationLoading: initialOperationLoading(),
    operationStatus: initialOperationStatus(),

    getLeaves: async () => {
      const requestId = ++latestLeavesRequestId
      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await leavesService.getLeaves(get().queryParams)
        if (requestId !== latestLeavesRequestId) return
        const pagination = mapperLeavesPagination(data)
        set({
          leavesRows: mapperLeavesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (requestId !== latestLeavesRequestId) return
        setOpError('list', resolveErrorMessage(error, messages.leaves.status.errors.loadError), error)
      } finally {
        if (requestId === latestLeavesRequestId) {
          setOpLoading('list', false)
        }
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
        setOpLoading('detail', true)
        set({ leaveDetail: null })
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
          setOpLoading('detail', false)
        }
      }
    },

    clearLeaveDetail: () => {
      latestLeaveDetailRequestId += 1
      set({ leaveDetail: null })
      setOpLoading('detail', false)
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

    setStartDateRange: ({ startFrom, startTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, startFrom, startTo } }))
    },

    setEndDateRange: ({ endFrom, endTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, endFrom, endTo } }))
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

    clearStartDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, startFrom: '', startTo: '' } }))
    },

    clearEndDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, endFrom: '', endTo: '' } }))
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
        setOpLoading('create', true)
        clearOp('create')
        await leavesService.createLeave(payload, files)
        setOpSuccess('create', messages.leaves.status.success.createLeaveSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.leaves.status.errors.createLeaveError), error)
        return false
      } finally {
        setOpLoading('create', false)
      }
    },

    updateLeave: async (payload, files = []) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.leaves.status.errors.detailInvalidLeaveId)
        return false
      }

      try {
        setOpLoading('update', true)
        clearOp('update')
        await leavesService.updateLeave(payload, files)
        setOpSuccess('update', messages.leaves.status.success.updateLeaveSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.leaves.status.errors.updateLeaveError), error)
        return false
      } finally {
        setOpLoading('update', false)
      }
    },

    getLeavesByEmployee: async (employeeId: number) => {
      const requestId = ++latestEmployeeLeavesRequestId
      try {
        set({ loadingEmployeeLeaves: true })
        const data = await leavesService.getLeavesByEmployee(employeeId)
        if (requestId !== latestEmployeeLeavesRequestId) return
        set({ employeeLeaves: data })
      } catch {
        if (requestId !== latestEmployeeLeavesRequestId) return
        set({ employeeLeaves: [] })
      } finally {
        if (requestId === latestEmployeeLeavesRequestId) {
          set({ loadingEmployeeLeaves: false })
        }
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
