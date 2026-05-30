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
import {
  createOperationStatusHelpers,
  downloadBlobFile,
  formatCsvImportSummary,
  initialOperationLoading,
  formatRoleLabel,
  initialOperationStatus,
  resolveErrorMessage,
} from '@/utils'

export const useStoreRoles = create<RolesStore>()((set, get) => {
  let latestRoleDetailRequestId = 0
  const inflightRoleDetailById = new Map<number, Promise<RoleDetail | null>>()
  const inflightRolesByParams = new Map<string, Promise<void>>()

  const { setOpError, setOpSuccess, clearOp, setOpLoading } = createOperationStatusHelpers(set)

  return {
  rolesRaw: [],
  roleDetail: null,
  rolesRows: [...initialRolesRows],
  pagination: { ...initialRolesPagination },
  queryParams: { ...initialRolesQueryParams },
  exportingCsv: false,
  importingCsv: false,
  operationLoading: initialOperationLoading(),
  operationStatus: initialOperationStatus(),

  getRoles: async () => {
    const params = get().queryParams
    const paramsKey = JSON.stringify(params)

    const existing = inflightRolesByParams.get(paramsKey)
    if (existing) {
      return existing
    }

    const promise = (async () => {
      let appliedCurrentResponse = false

      try {
        setOpLoading('list', true)
        clearOp('list')
        const data = await rolesService.getRoles(params)
        const pagination = mapperRolesPagination(data)

        if (JSON.stringify(get().queryParams) !== paramsKey) return

        appliedCurrentResponse = true
        set({
          rolesRaw: data.content,
          rolesRows: mapperRolesRows(data.content),
          pagination,
          queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
        })
      } catch (error) {
        if (JSON.stringify(get().queryParams) !== paramsKey) return
        appliedCurrentResponse = true
        setOpError('list', resolveErrorMessage(error, messages.roles.status.errors.loadError), error)
      } finally {
        inflightRolesByParams.delete(paramsKey)
        if (appliedCurrentResponse || JSON.stringify(get().queryParams) === paramsKey || inflightRolesByParams.size === 0) {
          setOpLoading('list', false)
        }
      }
    })()

    inflightRolesByParams.set(paramsKey, promise)
    return promise
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
      setOpLoading('detail', true)
      return existing
    }

    const requestId = ++latestRoleDetailRequestId

    const promise = (async () => {
      try {
        setOpLoading('detail', true)
        set({ roleDetail: null })
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
          setOpLoading('detail', false)
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
      setOpLoading('create', true)
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
      setOpLoading('create', false)
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
      setOpLoading('update', true)
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
      setOpLoading('update', false)
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
      setOpLoading('toggle', true)
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
      setOpLoading('toggle', false)
    }
  },

  exportRolesCsv: async () => {
    if (get().exportingCsv) return false

    try {
      set({ exportingCsv: true })
      clearOp('list')
      const csvBlob = await rolesService.exportRolesCsv()
      downloadBlobFile(csvBlob, 'roles.csv')
      setOpSuccess('list', messages.roles.status.success.exportSuccess)
      return true
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.roles.status.errors.exportError), error)
      return false
    } finally {
      set({ exportingCsv: false })
    }
  },

  importRolesCsv: async (file: File) => {
    if (get().importingCsv) return null

    try {
      set({ importingCsv: true })
      clearOp('list')
      const result = await rolesService.importRolesCsv(file)
      await get().getRoles()
      return formatCsvImportSummary(result)
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.roles.status.errors.importError), error)
      return null
    } finally {
      set({ importingCsv: false })
    }
  },

  clearRoleDetail: () => {
    latestRoleDetailRequestId += 1
    inflightRoleDetailById.clear()
    set({ roleDetail: null })
      setOpLoading('detail', false)
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
