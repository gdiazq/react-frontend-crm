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

export const useStoreEmployees = create<EmployeesStore>()((set, get) => ({
  employeesRows: [...initialEmployeesRows],
  pagination: { ...initialEmployeesPagination },
  queryParams: { ...initialEmployeesQueryParams },
  loadingEmployees: false,
  errorMessage: null,
  errorBack: null,

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

  clearActiveFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, active: '' } }))
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

  clearStatus: () => {
    set({ errorMessage: null })
  },
}))
