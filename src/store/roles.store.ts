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
import { formatRoleLabel } from '@/utils'

const ROLE_STATUS_COLUMN_INDEX = 1
let latestRoleDetailRequestId = 0

export const useStoreRoles = create<RolesStore>()((set, get) => ({
  rolesRaw: [],
  roleDetail: null,
  rolesRows: [...initialRolesRows],
  pagination: { ...initialRolesPagination },
  queryParams: { ...initialRolesQueryParams },
  loadingRoles: false,
  loadingRoleDetail: false,
  createRoleSubmitting: false,
  updateRoleSubmitting: false,
  loadingToggleStatus: false,
  errorMessage: null,
  detailErrorMessage: null,
  createRoleErrorMessage: null,
  createRoleSuccessMessage: null,
  updateRoleErrorMessage: null,
  updateRoleSuccessMessage: null,
  errorBack: null,

  getRoles: async () => {
    try {
      set({ loadingRoles: true, errorMessage: null, errorBack: null })
      const data = await rolesService.getRoles(get().queryParams)
      const pagination = mapperRolesPagination(data)

      set({
        rolesRaw: data.content || [],
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

  getRoleDetail: async (roleId: string) => {
    const parsedRoleId = Number(roleId)
    if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
      set({
        detailErrorMessage: messages.roles.status.errors.detailInvalidRoleId,
        roleDetail: null,
      })
      return null
    }
    const requestId = ++latestRoleDetailRequestId

    try {
      set({
        loadingRoleDetail: true,
        detailErrorMessage: null,
        roleDetail: null,
        errorBack: null,
      })
      const data = await rolesService.getRoleDetail(parsedRoleId)
      if (requestId !== latestRoleDetailRequestId) return null
      set({ roleDetail: data })
      return data
    } catch (error) {
      if (requestId !== latestRoleDetailRequestId) return null
      if (rolesService.isAxiosError(error)) {
        set({
          detailErrorMessage: error.response?.data?.message || messages.roles.status.errors.detailLoadError,
          errorBack: error,
        })
      } else {
        set({
          detailErrorMessage: messages.roles.status.errors.detailLoadError,
          errorBack: error,
        })
      }
      return null
    } finally {
      if (requestId === latestRoleDetailRequestId) {
        set({ loadingRoleDetail: false })
      }
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

  setStatusFilter: (status: string) => {
    set((state) => ({ queryParams: { ...state.queryParams, status } }))
  },

  clearStatusFilter: () => {
    set((state) => ({ queryParams: { ...state.queryParams, status: '' } }))
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

  mutationCreateRole: async (payload) => {
    const roleName = payload.name.trim()
    if (roleName.length < 3) {
      set({ createRoleErrorMessage: messages.roles.status.errors.createRoleNameRequired })
      return false
    }

    try {
      set({
        createRoleSubmitting: true,
        createRoleErrorMessage: null,
        createRoleSuccessMessage: null,
        errorBack: null,
      })

      const data = await rolesService.createRole(payload)
      const createdName = (data.name || roleName).trim()
      const displayName = formatRoleLabel(createdName)
      set({
        createRoleSuccessMessage: displayName.length > 0
          ? `${messages.roles.status.success.createRoleSuccess} (${displayName})`
          : messages.roles.status.success.createRoleSuccess,
      })
      return true
    } catch (error) {
      if (rolesService.isAxiosError(error)) {
        set({
          createRoleErrorMessage: error.response?.data?.message || messages.roles.status.errors.createRoleError,
          errorBack: error,
        })
      } else {
        set({
          createRoleErrorMessage: messages.roles.status.errors.createRoleError,
          errorBack: error,
        })
      }
      return false
    } finally {
      set({ createRoleSubmitting: false })
    }
  },

  mutationUpdateRole: async (payload) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      set({ updateRoleErrorMessage: messages.roles.status.errors.updateRoleInvalidRoleId })
      return false
    }

    const roleName = payload.name.trim()
    if (roleName.length < 3) {
      set({ updateRoleErrorMessage: messages.roles.status.errors.createRoleNameRequired })
      return false
    }

    try {
      set({
        updateRoleSubmitting: true,
        updateRoleErrorMessage: null,
        updateRoleSuccessMessage: null,
        errorBack: null,
      })

      await rolesService.updateRole(payload)
      set({ updateRoleSuccessMessage: messages.roles.status.success.updateRoleSuccess })
      return true
    } catch (error) {
      if (rolesService.isAxiosError(error)) {
        set({
          updateRoleErrorMessage: error.response?.data?.message || messages.roles.status.errors.updateRoleError,
          errorBack: error,
        })
      } else {
        set({
          updateRoleErrorMessage: messages.roles.status.errors.updateRoleError,
          errorBack: error,
        })
      }
      return false
    } finally {
      set({ updateRoleSubmitting: false })
    }
  },

  mutationToggleRoleStatus: async (roleId: string, nextStatus: boolean) => {
    const parsedRoleId = Number(roleId)
    if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
      set({ errorMessage: messages.roles.status.errors.invalidStatusRoleId })
      return false
    }

    const previousRow = get().rolesRows.find((row) => row.id === roleId)
    const previousRaw = get().rolesRaw.find((role) => role.id === parsedRoleId)
    if (!previousRow || !previousRaw) {
      set({ errorMessage: messages.roles.status.errors.invalidStatusRoleId })
      return false
    }

    try {
      set({ loadingToggleStatus: true, errorMessage: null, errorBack: null })
      set((state) => ({
        rolesRaw: state.rolesRaw.map((role) => (role.id === parsedRoleId ? { ...role, enabled: nextStatus } : role)),
        rolesRows: state.rolesRows.map((row) => {
          if (row.id !== roleId) return row
          return {
            ...row,
            status: nextStatus,
            values: row.values.map((value, index) => {
              if (index !== ROLE_STATUS_COLUMN_INDEX) return value
              return nextStatus ? messages.roles.ui.statusEnabled : messages.roles.ui.statusDisabled
            }),
          }
        }),
      }))

      await rolesService.toggleRoleStatus(parsedRoleId, nextStatus)
      return true
    } catch (error) {
      set((state) => ({
        rolesRaw: state.rolesRaw.map((role) => (role.id === parsedRoleId ? previousRaw : role)),
        rolesRows: state.rolesRows.map((row) => (row.id === roleId ? previousRow : row)),
      }))
      if (rolesService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.roles.status.errors.toggleStatusError })
      } else {
        set({ errorMessage: messages.roles.status.errors.toggleStatusError })
      }
      return false
    } finally {
      set({ loadingToggleStatus: false })
    }
  },

  clearStatus: () => {
    set({ errorMessage: null })
  },

  clearRoleDetail: () => {
    latestRoleDetailRequestId += 1
    set({ roleDetail: null, detailErrorMessage: null, loadingRoleDetail: false })
  },

  clearDetailError: () => {
    set({ detailErrorMessage: null })
  },

  clearCreateRoleStatus: () => {
    set({
      createRoleErrorMessage: null,
      createRoleSuccessMessage: null,
    })
  },

  clearUpdateRoleStatus: () => {
    set({
      updateRoleErrorMessage: null,
      updateRoleSuccessMessage: null,
    })
  },
}))
