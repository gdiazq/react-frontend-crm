import { create } from 'zustand'
import { attendanceMarksService, attendanceService } from '@/services'
import {
  initialAttendancePagination,
  initialAttendanceQueryParams,
  initialAttendanceRows,
} from '@/factories'
import {
  mapperAttendancePagination,
  mapperAttendanceRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { AttendanceSortBy, AttendanceSortDir, AttendanceStore, OperationKey, OperationStatus } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreAttendance = create<AttendanceStore>()((set, get) => {
  let latestAttendanceDetailRequestId = 0

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
    if (attendanceService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
    attendanceRows: [...initialAttendanceRows],
    attendanceDetail: null,
    employeeAttendance: [],
    costCenterAttendance: [],
    attendanceMarks: [],
    pagination: { ...initialAttendancePagination },
    queryParams: { ...initialAttendanceQueryParams },
    loadingAttendance: false,
    loadingAttendanceDetail: false,
    loadingEmployeeAttendance: false,
    loadingCostCenterAttendance: false,
    loadingAttendanceMarks: false,
    createAttendanceSubmitting: false,
    updateAttendanceSubmitting: false,
    deleteAttendanceSubmitting: false,
    createAttendanceMarkSubmitting: false,
    updateAttendanceMarkSubmitting: false,
    operationStatus: initialOperationStatus(),

    getAttendance: async () => {
      try {
        set({ loadingAttendance: true })
        clearOp('list')
        const data = await attendanceService.getAttendance(get().queryParams)
        const pagination = mapperAttendancePagination(data)
        set({
          attendanceRows: mapperAttendanceRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        setOpError('list', resolveErrorMessage(error, messages.attendance.status.errors.loadError), error)
      } finally {
        set({ loadingAttendance: false })
      }
    },

    getAttendanceDetail: async (attendanceId: string) => {
      const parsedAttendanceId = Number(attendanceId)
      if (!Number.isInteger(parsedAttendanceId) || parsedAttendanceId <= 0) {
        setOpError('detail', messages.attendance.status.errors.detailInvalidAttendanceId)
        set({ attendanceDetail: null })
        return null
      }
      const requestId = ++latestAttendanceDetailRequestId

      try {
        set({ loadingAttendanceDetail: true, attendanceDetail: null })
        clearOp('detail')
        const data = await attendanceService.getAttendanceDetail(parsedAttendanceId)
        if (requestId !== latestAttendanceDetailRequestId) return null
        set({ attendanceDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestAttendanceDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.attendance.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestAttendanceDetailRequestId) {
          set({ loadingAttendanceDetail: false })
        }
      }
    },

    clearAttendanceDetail: () => {
      latestAttendanceDetailRequestId += 1
      set({ attendanceDetail: null, loadingAttendanceDetail: false })
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
      await get().getAttendance()
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

    setEmployeeFilter: (employeeId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId } }))
    },

    setCostCenterFilter: (costCenter: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, costCenter } }))
    },

    setStatusFilter: (statusId: string) => {
      set((state) => ({ queryParams: { ...state.queryParams, statusId } }))
    },

    setDateRange: ({ dateFrom, dateTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, dateFrom, dateTo } }))
    },

    setCreatedDateRange: ({ createdFrom, createdTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
    },

    setUpdatedDateRange: ({ updatedFrom, updatedTo }) => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom, updatedTo } }))
    },

    clearEmployeeFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, employeeId: '' } }))
    },

    clearCostCenterFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, costCenter: '' } }))
    },

    clearStatusFilter: () => {
      set((state) => ({ queryParams: { ...state.queryParams, statusId: '' } }))
    },

    clearDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, dateFrom: '', dateTo: '' } }))
    },

    clearCreatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
    },

    clearUpdatedDateRange: () => {
      set((state) => ({ queryParams: { ...state.queryParams, updatedFrom: '', updatedTo: '' } }))
    },

    searchAttendance: async () => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0 },
      }))
      await get().getAttendance()
    },

    sortAttendance: async (sortBy: AttendanceSortBy, sortDir: AttendanceSortDir) => {
      set((state) => ({
        pagination: { ...state.pagination, page: 0 },
        queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
      }))
      await get().getAttendance()
    },

    createAttendance: async (payload) => {
      try {
        set({ createAttendanceSubmitting: true })
        clearOp('create')
        await attendanceService.createAttendance(payload)
        setOpSuccess('create', messages.attendance.status.success.createAttendanceSuccess)
        return true
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.attendance.status.errors.createAttendanceError), error)
        return false
      } finally {
        set({ createAttendanceSubmitting: false })
      }
    },

    updateAttendance: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.attendance.status.errors.detailInvalidAttendanceId)
        return false
      }

      try {
        set({ updateAttendanceSubmitting: true })
        clearOp('update')
        await attendanceService.updateAttendance(payload)
        setOpSuccess('update', messages.attendance.status.success.updateAttendanceSuccess)
        return true
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.attendance.status.errors.updateAttendanceError), error)
        return false
      } finally {
        set({ updateAttendanceSubmitting: false })
      }
    },

    deleteAttendance: async (attendanceId: string) => {
      const parsedAttendanceId = Number(attendanceId)
      if (!Number.isInteger(parsedAttendanceId) || parsedAttendanceId <= 0) {
        setOpError('toggle', messages.attendance.status.errors.detailInvalidAttendanceId)
        return false
      }

      try {
        set({ deleteAttendanceSubmitting: true })
        clearOp('toggle')
        await attendanceService.deleteAttendance(parsedAttendanceId)
        setOpSuccess('toggle', messages.attendance.status.success.deleteAttendanceSuccess)
        await get().getAttendance()
        return true
      } catch (error) {
        setOpError('toggle', resolveErrorMessage(error, messages.attendance.status.errors.deleteAttendanceError), error)
        return false
      } finally {
        set({ deleteAttendanceSubmitting: false })
      }
    },

    getAttendanceByEmployee: async (employeeId: number) => {
      try {
        set({ loadingEmployeeAttendance: true })
        const data = await attendanceService.getAttendanceByEmployee(employeeId)
        set({ employeeAttendance: data })
      } catch {
        set({ employeeAttendance: [] })
      } finally {
        set({ loadingEmployeeAttendance: false })
      }
    },

    getAttendanceByCostCenter: async (costCenter: number) => {
      try {
        set({ loadingCostCenterAttendance: true })
        const data = await attendanceService.getAttendanceByCostCenter(costCenter)
        set({ costCenterAttendance: data })
      } catch {
        set({ costCenterAttendance: [] })
      } finally {
        set({ loadingCostCenterAttendance: false })
      }
    },

    clearEmployeeAttendance: () => {
      set({ employeeAttendance: [], loadingEmployeeAttendance: false })
    },

    clearCostCenterAttendance: () => {
      set({ costCenterAttendance: [], loadingCostCenterAttendance: false })
    },

    getAttendanceMarksByAttendance: async (attendanceId: number) => {
      try {
        set({ loadingAttendanceMarks: true })
        clearOp('detail')
        const data = await attendanceMarksService.getAttendanceMarksByAttendance(attendanceId)
        set({ attendanceMarks: data })
        return data
      } catch (error) {
        const fallback = messages.attendance.status.errors.loadAttendanceMarksError
        const message = attendanceMarksService.isAxiosError(error)
          ? error.response?.data?.message || fallback
          : fallback
        setOpError('detail', message, error)
        set({ attendanceMarks: [] })
        return []
      } finally {
        set({ loadingAttendanceMarks: false })
      }
    },

    clearAttendanceMarks: () => {
      set({ attendanceMarks: [], loadingAttendanceMarks: false })
    },

    createAttendanceMark: async (payload) => {
      try {
        set({ createAttendanceMarkSubmitting: true })
        clearOp('create')
        await attendanceMarksService.createAttendanceMark(payload)
        setOpSuccess('create', messages.attendance.status.success.createAttendanceMarkSuccess)
        return true
      } catch (error) {
        const fallback = messages.attendance.status.errors.createAttendanceMarkError
        const message = attendanceMarksService.isAxiosError(error)
          ? error.response?.data?.message || fallback
          : fallback
        setOpError('create', message, error)
        return false
      } finally {
        set({ createAttendanceMarkSubmitting: false })
      }
    },

    updateAttendanceMark: async (payload) => {
      if (!Number.isInteger(payload.id) || payload.id <= 0) {
        setOpError('update', messages.attendance.status.errors.detailInvalidAttendanceMarkId)
        return false
      }
      try {
        set({ updateAttendanceMarkSubmitting: true })
        clearOp('update')
        await attendanceMarksService.updateAttendanceMark(payload)
        setOpSuccess('update', messages.attendance.status.success.updateAttendanceMarkSuccess)
        return true
      } catch (error) {
        const fallback = messages.attendance.status.errors.updateAttendanceMarkError
        const message = attendanceMarksService.isAxiosError(error)
          ? error.response?.data?.message || fallback
          : fallback
        setOpError('update', message, error)
        return false
      } finally {
        set({ updateAttendanceMarkSubmitting: false })
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
