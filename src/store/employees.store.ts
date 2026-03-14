import { create } from 'zustand'
import { employeesService } from '@/services'
import {
  initialEmployeesPagination,
  initialEmployeesQueryParams,
  initialEmployeesRows,
} from '@/factories'
import {
  mapperEmployeesPagination,
  mapperEmployeesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { EmployeeOperationKey, EmployeesSortBy, EmployeesSortDir, EmployeesStore } from '@/types'
import type { OperationStatus } from '@/types'

const initialOperationStatus: () => Record<EmployeeOperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
  link: { error: null, success: null, errorBack: null },
})

export const useStoreEmployees = create<EmployeesStore>()((set, get) => {
  let latestEmployeeDetailRequestId = 0
  let latestAvailableUsersRequestId = 0

  const setOpError = (key: EmployeeOperationKey, error: string, errorBack?: unknown) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error, success: null, errorBack: errorBack ?? null },
      },
    }))
  }

  const setOpSuccess = (key: EmployeeOperationKey, success: string) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success, errorBack: null },
      },
    }))
  }

  const clearOp = (key: EmployeeOperationKey) => {
    set((state) => ({
      operationStatus: {
        ...state.operationStatus,
        [key]: { error: null, success: null, errorBack: null },
      },
    }))
  }

  const resolveErrorMessage = (error: unknown, fallback: string): string => {
    if (employeesService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
  employeesRows: [...initialEmployeesRows],
  employeeDetail: null,
  pagination: { ...initialEmployeesPagination },
  queryParams: { ...initialEmployeesQueryParams },
  loadingEmployees: false,
  loadingEmployeeDetail: false,
  loadingToggleStatus: false,
  loadingLinkUser: false,
  createEmployeeSubmitting: false,
  updateEmployeeSubmitting: false,
  availableUsers: [],
  loadingAvailableUsers: false,
  operationStatus: initialOperationStatus(),

  getEmployeeDetail: async (employeeId: string) => {
    const parsedId = Number(employeeId)
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setOpError('detail', messages.employees.status.errors.detailInvalidEmployeeId)
      set({ employeeDetail: null })
      return null
    }
    const requestId = ++latestEmployeeDetailRequestId

    try {
      set({ loadingEmployeeDetail: true, employeeDetail: null })
      clearOp('detail')
      const data = await employeesService.getEmployeeDetail(parsedId)
      if (requestId !== latestEmployeeDetailRequestId) return null
      set({ employeeDetail: data })
      return data
    } catch (error) {
      if (requestId !== latestEmployeeDetailRequestId) return null
      setOpError('detail', resolveErrorMessage(error, messages.employees.status.errors.detailLoadError), error)
      return null
    } finally {
      if (requestId === latestEmployeeDetailRequestId) {
        set({ loadingEmployeeDetail: false })
      }
    }
  },

  clearEmployeeDetail: () => {
    latestEmployeeDetailRequestId += 1
    set({ employeeDetail: null, loadingEmployeeDetail: false })
    clearOp('detail')
  },

  getEmployees: async () => {
    try {
      set({ loadingEmployees: true })
      clearOp('list')
      const data = await employeesService.getEmployees(get().queryParams)
      const pagination = mapperEmployeesPagination(data)
      set({
        employeesRows: mapperEmployeesRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.employees.status.errors.loadError), error)
    } finally {
      set({ loadingEmployees: false })
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
    await get().getEmployees()
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

  setApprovalStatusFilter: (statusId: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, statusId } }))
  },

  setCreatedDateRange: ({ createdFrom, createdTo }) => {
    set((state) => ({ queryParams: { ...state.queryParams, createdFrom, createdTo } }))
  },

  clearActiveFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, active: '' } }))
  },

  clearApprovalStatusFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, statusId: '' } }))
  },

  clearCreatedDateRange: () => {
    set((state) => ({ queryParams: { ...state.queryParams, createdFrom: '', createdTo: '' } }))
  },

  searchEmployees: async () => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0 },
    }))
    await get().getEmployees()
  },

  sortEmployees: async (sortBy: EmployeesSortBy, sortDir: EmployeesSortDir) => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
    }))
    await get().getEmployees()
  },

  toggleEmployeeStatus: async (employeeId: string, nextStatus: boolean) => {
    const parsedEmployeeId = Number(employeeId)
    if (!Number.isInteger(parsedEmployeeId) || parsedEmployeeId <= 0) {
      setOpError('toggle', messages.employees.status.errors.invalidStatusEmployeeId)
      return false
    }

    try {
      set({ loadingToggleStatus: true })
      clearOp('toggle')
      await employeesService.toggleEmployeeStatus(parsedEmployeeId, nextStatus)
      return true
    } catch (error) {
      setOpError('toggle', resolveErrorMessage(error, messages.employees.status.errors.toggleStatusError), error)
      return false
    } finally {
      set({ loadingToggleStatus: false })
    }
  },

  createEmployee: async (payload) => {
    try {
      set({ createEmployeeSubmitting: true })
      clearOp('create')

      const data = await employeesService.createEmployee(payload)
      const fullName = `${data.firstName} ${data.paternalLastName}`.trim()
      setOpSuccess('create', `${messages.employees.status.success.createEmployeeSuccess} (${fullName})`)
      return true
    } catch (error) {
      setOpError('create', resolveErrorMessage(error, messages.employees.status.errors.createEmployeeError), error)
      return false
    } finally {
      set({ createEmployeeSubmitting: false })
    }
  },

  updateEmployee: async (payload) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      setOpError('update', messages.employees.status.errors.detailInvalidEmployeeId)
      return false
    }

    try {
      set({ updateEmployeeSubmitting: true })
      clearOp('update')

      await employeesService.updateEmployee(payload)
      setOpSuccess('update', messages.employees.status.success.updateEmployeeSuccess)
      return true
    } catch (error) {
      setOpError('update', resolveErrorMessage(error, messages.employees.status.errors.updateEmployeeError), error)
      return false
    } finally {
      set({ updateEmployeeSubmitting: false })
    }
  },

  getAvailableUsers: async (search: string) => {
    const requestId = ++latestAvailableUsersRequestId
    try {
      set({ loadingAvailableUsers: true })
      clearOp('link')
      const data = await employeesService.getAvailableUsers(search)
      if (requestId !== latestAvailableUsersRequestId) return
      set({ availableUsers: data })
    } catch (error) {
      if (requestId !== latestAvailableUsersRequestId) return
      set({ availableUsers: [] })
      setOpError('link', resolveErrorMessage(error, messages.employees.status.errors.loadAvailableUsersError), error)
    } finally {
      if (requestId === latestAvailableUsersRequestId) {
        set({ loadingAvailableUsers: false })
      }
    }
  },

  linkEmployeeUser: async (employeeId: string, userId: number) => {
    const parsedEmployeeId = Number(employeeId)
    if (!Number.isInteger(parsedEmployeeId) || parsedEmployeeId <= 0) {
      setOpError('link', messages.employees.status.errors.invalidLinkEmployeeId)
      return false
    }

    try {
      set({ loadingLinkUser: true })
      clearOp('link')
      await employeesService.linkEmployeeUser(parsedEmployeeId, userId)
      return true
    } catch (error) {
      setOpError('link', resolveErrorMessage(error, messages.employees.status.errors.linkUserError), error)
      return false
    } finally {
      set({ loadingLinkUser: false })
    }
  },

  unlinkEmployeeUser: async (employeeId: string) => {
    const parsedEmployeeId = Number(employeeId)
    if (!Number.isInteger(parsedEmployeeId) || parsedEmployeeId <= 0) {
      setOpError('link', messages.employees.status.errors.invalidLinkEmployeeId)
      return false
    }

    try {
      set({ loadingLinkUser: true })
      clearOp('link')
      await employeesService.unlinkEmployeeUser(parsedEmployeeId)
      return true
    } catch (error) {
      setOpError('link', resolveErrorMessage(error, messages.employees.status.errors.unlinkUserError), error)
      return false
    } finally {
      set({ loadingLinkUser: false })
    }
  },

  clearAvailableUsers: () => {
    latestAvailableUsersRequestId += 1
    set({ availableUsers: [], loadingAvailableUsers: false })
  },

  clearOperationStatus: (key) => {
    clearOp(key)
  },

  clearAllOperationStatus: () => {
    set({ operationStatus: initialOperationStatus() })
  },
  }
})
