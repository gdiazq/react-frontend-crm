import { create } from 'zustand'
import {
  initialRolesPagination,
  initialRolesQueryParams,
  initialRolesRows,
} from '@/factories'
import {
  mapperRolesPagination,
  mapperRolesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { rolesService } from '@/services'
import type { RolesStore } from '@/types'

export const useStoreRoles = create<RolesStore>()((set, get) => ({
  rolesRows: [...initialRolesRows],
  pagination: { ...initialRolesPagination },
  queryParams: { ...initialRolesQueryParams },
  loadingRoles: false,
  errorMessage: null,
  errorBack: null,

  getRoles: async () => {
    try {
      set({ loadingRoles: true, errorMessage: null, errorBack: null })
      const data = await rolesService.getRoles(get().queryParams)
      const pagination = mapperRolesPagination(data)

      set({
        rolesRows: mapperRolesRows(data.content || []),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      if (rolesService.isAxiosError(error)) {
        set({
          errorMessage: error.response?.data?.message || messages.roles.status.errors.loadError,
          errorBack: error,
        })
      } else {
        set({
          errorMessage: messages.roles.status.errors.loadError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingRoles: false })
    }
  },

  goToPage: async (page: number) => {
    const { pagination } = get()
    const lastPageIndex = Math.max((pagination.totalPages || 1) - 1, 0)
    if (page < 0 || page > lastPageIndex) return

    set((state) => ({
      pagination: { ...state.pagination, page },
      queryParams: { ...state.queryParams, page },
    }))
    await get().getRoles()
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

  searchRoles: async () => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0 },
    }))
    await get().getRoles()
  },

  sortRoles: async (sortBy, sortDir) => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
    }))
    await get().getRoles()
  },

  clearStatus: () => {
    set({ errorMessage: null })
  },
}))
