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
import type { EmployeesSortBy, EmployeesSortDir, EmployeesStore } from '@/types'

export const useStoreEmployees = create<EmployeesStore>()((set, get) => {
  let latestEmployeeDetailRequestId = 0

  return {
  employeesRows: [...initialEmployeesRows],
  employeeDetail: null,
  pagination: { ...initialEmployeesPagination },
  queryParams: { ...initialEmployeesQueryParams },
  loadingEmployees: false,
  loadingEmployeeDetail: false,
  loadingToggleStatus: false,
  createEmployeeSubmitting: false,
  updateEmployeeSubmitting: false,
  errorMessage: null,
  detailErrorMessage: null,
  createEmployeeErrorMessage: null,
  createEmployeeSuccessMessage: null,
  updateEmployeeErrorMessage: null,
  updateEmployeeSuccessMessage: null,
  errorBack: null,

  getEmployeeDetail: async (employeeId: string) => {
    const parsedId = Number(employeeId)
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      set({ detailErrorMessage: messages.employees.status.errors.detailInvalidEmployeeId, employeeDetail: null })
      return null
    }
    const requestId = ++latestEmployeeDetailRequestId

    try {
      set({ loadingEmployeeDetail: true, detailErrorMessage: null, employeeDetail: null, errorBack: null })
      const data = await employeesService.getEmployeeDetail(parsedId)
      if (requestId !== latestEmployeeDetailRequestId) return null
      set({ employeeDetail: data })
      return data
    } catch (error) {
      if (requestId !== latestEmployeeDetailRequestId) return null
      if (employeesService.isAxiosError(error)) {
        set({ detailErrorMessage: error.response?.data?.message || messages.employees.status.errors.detailLoadError, errorBack: error })
      } else {
        set({ detailErrorMessage: messages.employees.status.errors.detailLoadError, errorBack: error })
      }
      return null
    } finally {
      if (requestId === latestEmployeeDetailRequestId) {
        set({ loadingEmployeeDetail: false })
      }
    }
  },

  clearEmployeeDetail: () => {
    latestEmployeeDetailRequestId += 1
    set({ employeeDetail: null, detailErrorMessage: null, loadingEmployeeDetail: false })
  },

  clearDetailError: () => {
    set({ detailErrorMessage: null })
  },

  getEmployees: async () => {
    try {
      set({ loadingEmployees: true, errorMessage: null, errorBack: null })
      const data = await employeesService.getEmployees(get().queryParams)
      const pagination = mapperEmployeesPagination(data)
      set({
        employeesRows: mapperEmployeesRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      set({ errorBack: error })
      if (employeesService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.employees.status.errors.loadError })
      } else {
        set({ errorMessage: messages.employees.status.errors.loadError })
      }
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

  mutationToggleEmployeeStatus: async (employeeId: string, nextStatus: boolean) => {
    const parsedEmployeeId = Number(employeeId)
    if (!Number.isInteger(parsedEmployeeId) || parsedEmployeeId <= 0) {
      set({ errorMessage: messages.employees.status.errors.invalidStatusEmployeeId })
      return false
    }

    try {
      set({ loadingToggleStatus: true, errorMessage: null, errorBack: null })
      await employeesService.toggleEmployeeStatus(parsedEmployeeId, nextStatus)
      return true
    } catch (error) {
      if (employeesService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.employees.status.errors.toggleStatusError })
      } else {
        set({ errorMessage: messages.employees.status.errors.toggleStatusError })
      }
      return false
    } finally {
      set({ loadingToggleStatus: false })
    }
  },

  mutationCreateEmployee: async (payload) => {
    try {
      set({
        createEmployeeSubmitting: true,
        createEmployeeErrorMessage: null,
        createEmployeeSuccessMessage: null,
        errorBack: null,
      })

      const data = await employeesService.createEmployee(payload)
      const fullName = `${data.firstName} ${data.paternalLastName}`.trim()
      set({
        createEmployeeSuccessMessage: `${messages.employees.status.success.createEmployeeSuccess} (${fullName})`,
      })
      return true
    } catch (error) {
      if (employeesService.isAxiosError(error)) {
        set({
          createEmployeeErrorMessage: error.response?.data?.message || messages.employees.status.errors.createEmployeeError,
          errorBack: error,
        })
      } else {
        set({
          createEmployeeErrorMessage: messages.employees.status.errors.createEmployeeError,
          errorBack: error,
        })
      }
      return false
    } finally {
      set({ createEmployeeSubmitting: false })
    }
  },

  mutationUpdateEmployee: async (payload) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      set({ updateEmployeeErrorMessage: messages.employees.status.errors.detailInvalidEmployeeId })
      return false
    }

    try {
      set({
        updateEmployeeSubmitting: true,
        updateEmployeeErrorMessage: null,
        updateEmployeeSuccessMessage: null,
        errorBack: null,
      })

      await employeesService.updateEmployee(payload)
      set({ updateEmployeeSuccessMessage: messages.employees.status.success.updateEmployeeSuccess })
      return true
    } catch (error) {
      if (employeesService.isAxiosError(error)) {
        set({
          updateEmployeeErrorMessage: error.response?.data?.message || messages.employees.status.errors.updateEmployeeError,
          errorBack: error,
        })
      } else {
        set({
          updateEmployeeErrorMessage: messages.employees.status.errors.updateEmployeeError,
          errorBack: error,
        })
      }
      return false
    } finally {
      set({ updateEmployeeSubmitting: false })
    }
  },

  clearCreateEmployeeStatus: () => {
    set({
      createEmployeeErrorMessage: null,
      createEmployeeSuccessMessage: null,
    })
  },

  clearUpdateEmployeeStatus: () => {
    set({
      updateEmployeeErrorMessage: null,
      updateEmployeeSuccessMessage: null,
    })
  },

  clearStatus: () => {
    set({ errorMessage: null })
  },
  }
})
