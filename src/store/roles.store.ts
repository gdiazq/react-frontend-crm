import { create } from 'zustand'
import {
  initialRolesPagination,
  initialRolesQueryParams,
  initialRolesRows,
  rolesTableColumnIndex,
} from '@/factories'
import {
  mapperRolesPagination,
  mapperRolesRows,
} from '@/mappers'
import messages from '@/messages/messages'
import { rolesService } from '@/services'
import type { RoleDetail, RolesStore } from '@/types'
import type { OperationKey, OperationStatus } from '@/types'
import { formatRoleLabel } from '@/utils'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreRoles = create<RolesStore>()((set, get) => {
  let latestRoleDetailRequestId = 0
  const inflightRoleDetailById = new Map<number, Promise<RoleDetail | null>>()

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
    if (rolesService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
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
  operationStatus: initialOperationStatus(),

  getRoles: async () => {
    try {
      set({ loadingRoles: true })
      clearOp('list')
      const data = await rolesService.getRoles(get().queryParams)
      const pagination = mapperRolesPagination(data)

      set({
        rolesRaw: data.content,
        rolesRows: mapperRolesRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.roles.status.errors.loadError), error)
    } finally {
      set({ loadingRoles: false })
    }
  },

  getRoleDetail: async (roleId: string) => {
    const parsedRoleId = Number(roleId)
    if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
      setOpError('detail', messages.roles.status.errors.detailInvalidRoleId)
      set({ roleDetail: null })
      return null
    }

    const existing = inflightRoleDetailById.get(parsedRoleId)
    if (existing) {
      set({ loadingRoleDetail: true })
      return existing
    }

    const requestId = ++latestRoleDetailRequestId

    const promise = (async () => {
      try {
        set({ loadingRoleDetail: true, roleDetail: null })
        clearOp('detail')
        const data = await rolesService.getRoleDetail(parsedRoleId)
        if (requestId !== latestRoleDetailRequestId) return null
        set({ roleDetail: data })
        return data
      } catch (error) {
        if (requestId !== latestRoleDetailRequestId) return null
        setOpError('detail', resolveErrorMessage(error, messages.roles.status.errors.detailLoadError), error)
        return null
      } finally {
        if (requestId === latestRoleDetailRequestId) {
          set({ loadingRoleDetail: false })
        }
        inflightRoleDetailById.delete(parsedRoleId)
      }
    })()

    inflightRoleDetailById.set(parsedRoleId, promise)
    return promise
  },

  goToPage: async (page: number) => {
    const { pagination } = get()
    const lastPageIndex = pagination.totalPages - 1
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

  createRole: async (payload, permissionIds) => {
    const roleName = payload.name.trim()
    if (roleName.length < 3) {
      setOpError('create', messages.roles.status.errors.createRoleNameRequired)
      return false
    }
    if (permissionIds.length === 0) {
      setOpError('create', messages.roles.status.errors.createRolePermissionsRequired)
      return false
    }

    try {
      set({ createRoleSubmitting: true })
      clearOp('create')

      const data = await rolesService.createRole(payload)
      if (!Number.isInteger(data.id) || data.id <= 0) {
        setOpError('create', messages.roles.status.errors.createRolePermissionsAssignError)
        return false
      }

      try {
        await rolesService.replaceRolePermissions(data.id, permissionIds)
      } catch (error) {
        setOpError('create', resolveErrorMessage(error, messages.roles.status.errors.createRolePermissionsAssignError), error)
        return false
      }

      const displayName = formatRoleLabel(data.name)
      setOpSuccess('create', `${messages.roles.status.success.createRoleSuccess} (${displayName})`)
      return true
    } catch (error) {
      setOpError('create', resolveErrorMessage(error, messages.roles.status.errors.createRoleError), error)
      return false
    } finally {
      set({ createRoleSubmitting: false })
    }
  },

  updateRole: async (payload, permissionIds) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      setOpError('update', messages.roles.status.errors.updateRoleInvalidRoleId)
      return false
    }

    const roleName = payload.name.trim()
    if (roleName.length < 3) {
      setOpError('update', messages.roles.status.errors.createRoleNameRequired)
      return false
    }
    if (permissionIds.length === 0) {
      setOpError('update', messages.roles.status.errors.updateRolePermissionsRequired)
      return false
    }

    try {
      set({ updateRoleSubmitting: true })
      clearOp('update')

      await rolesService.updateRole(payload)
      try {
        await rolesService.replaceRolePermissions(payload.id, permissionIds)
      } catch (error) {
        setOpError('update', resolveErrorMessage(error, messages.roles.status.errors.updateRolePermissionsAssignError), error)
        return false
      }
      setOpSuccess('update', messages.roles.status.success.updateRoleSuccess)
      return true
    } catch (error) {
      setOpError('update', resolveErrorMessage(error, messages.roles.status.errors.updateRoleError), error)
      return false
    } finally {
      set({ updateRoleSubmitting: false })
    }
  },

  toggleRoleStatus: async (roleId: string, nextStatus: boolean) => {
    const parsedRoleId = Number(roleId)
    if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
      setOpError('toggle', messages.roles.status.errors.invalidStatusRoleId)
      return false
    }

    const previousRow = get().rolesRows.find((row) => row.id === roleId)
    const previousRaw = get().rolesRaw.find((role) => role.id === parsedRoleId)
    if (!previousRow || !previousRaw) {
      setOpError('toggle', messages.roles.status.errors.invalidStatusRoleId)
      return false
    }

    try {
      set({ loadingToggleStatus: true })
      clearOp('toggle')
      set((state) => ({
        rolesRaw: state.rolesRaw.map((role) => (role.id === parsedRoleId ? { ...role, enabled: nextStatus } : role)),
        rolesRows: state.rolesRows.map((row) => {
          if (row.id !== roleId) return row
          return {
            ...row,
            status: nextStatus,
            values: row.values.map((value, index) => {
              if (index !== rolesTableColumnIndex.status) return value
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
      setOpError('toggle', resolveErrorMessage(error, messages.roles.status.errors.toggleStatusError), error)
      return false
    } finally {
      set({ loadingToggleStatus: false })
    }
  },

  clearRoleDetail: () => {
    if (inflightRoleDetailById.size === 0) {
      latestRoleDetailRequestId += 1
    }
    set({ roleDetail: null, loadingRoleDetail: false })
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
