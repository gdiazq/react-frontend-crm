import { create } from 'zustand'
import { usersService } from '@/services'
import {
  initialUsersPagination,
  initialUsersQueryParams,
  initialUsersRows,
  usersTableColumnIndex,
} from '@/factories'
import {
  mapperUsersPagination,
  mapperUsersRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { UsersSortBy, UsersSortDir, UsersStore } from '@/types'
import type { OperationKey, OperationStatus } from '@/types'

const initialOperationStatus: () => Record<OperationKey, OperationStatus> = () => ({
  list: { error: null, success: null, errorBack: null },
  detail: { error: null, success: null, errorBack: null },
  create: { error: null, success: null, errorBack: null },
  update: { error: null, success: null, errorBack: null },
  toggle: { error: null, success: null, errorBack: null },
})

export const useStoreUsers = create<UsersStore>()((set, get) => {
  let latestUserDetailRequestId = 0

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
    if (usersService.isAxiosError(error)) {
      return error.response?.data?.message || fallback
    }
    return fallback
  }

  return {
  usersRows: [...initialUsersRows],
  userDetail: null,
  pagination: { ...initialUsersPagination },
  queryParams: { ...initialUsersQueryParams },
  loadingUsers: false,
  loadingUserDetail: false,
  createUserSubmitting: false,
  updateUserSubmitting: false,
  loadingToggleStatus: false,
  operationStatus: initialOperationStatus(),

  getUsers: async () => {
    try {
      set({ loadingUsers: true })
      clearOp('list')
      const data = await usersService.getUsers(get().queryParams)
      const pagination = mapperUsersPagination(data)
      set({
        usersRows: mapperUsersRows(data.content),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      setOpError('list', resolveErrorMessage(error, messages.users.status.errors.loadError), error)
    } finally {
      set({ loadingUsers: false })
    }
  },

  getUserDetail: async (userId: string) => {
    const parsedUserId = Number(userId)
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      setOpError('detail', messages.users.status.errors.detailInvalidUserId)
      set({ userDetail: null })
      return null
    }
    const requestId = ++latestUserDetailRequestId

    try {
      set({ loadingUserDetail: true, userDetail: null })
      clearOp('detail')
      const data = await usersService.getUserDetail(parsedUserId)
      if (requestId !== latestUserDetailRequestId) return null
      set({ userDetail: data })
      return data
    } catch (error) {
      if (requestId !== latestUserDetailRequestId) return null
      setOpError('detail', resolveErrorMessage(error, messages.users.status.errors.detailLoadError), error)
      return null
    } finally {
      if (requestId === latestUserDetailRequestId) {
        set({ loadingUserDetail: false })
      }
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
    await get().getUsers()
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

  setAdvancedFilters: (filters) => {
    set((state) => ({
      queryParams: {
        ...state.queryParams,
        name: filters.name,
        email: filters.email,
        status: filters.status,
        roleId: filters.roleId,
      },
    }))
  },

  clearAdvancedFilters: () => {
    set((state) => ({
      queryParams: {
        ...state.queryParams,
        name: '',
        email: '',
        status: '',
        roleId: '',
      },
    }))
  },

  searchUsers: async () => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0 },
    }))
    await get().getUsers()
  },

  sortUsers: async (sortBy: UsersSortBy, sortDir: UsersSortDir) => {
    set((state) => ({
      pagination: { ...state.pagination, page: 0 },
      queryParams: { ...state.queryParams, page: 0, sortBy, sortDir },
    }))
    await get().getUsers()
  },

  clearUserDetail: () => {
    latestUserDetailRequestId += 1
    set({ userDetail: null, loadingUserDetail: false })
    clearOp('detail')
  },

  createUser: async (payload) => {
    if (!Number.isInteger(payload.roleId) || payload.roleId <= 0) {
      setOpError('create', messages.users.status.errors.createUserRoleRequired)
      return false
    }

    try {
      set({ createUserSubmitting: true })
      clearOp('create')

      const data = await usersService.createUser(payload)
      setOpSuccess('create', `${messages.users.status.success.createUserSuccess} (${data.username})`)
      return true
    } catch (error) {
      setOpError('create', resolveErrorMessage(error, messages.users.status.errors.createUserError), error)
      return false
    } finally {
      set({ createUserSubmitting: false })
    }
  },

  updateUser: async (payload) => {
    if (!Number.isInteger(payload.id) || payload.id <= 0) {
      setOpError('update', messages.users.status.errors.invalidStatusUserId)
      return false
    }

    if (!Number.isInteger(payload.roleId) || payload.roleId <= 0) {
      setOpError('update', messages.users.status.errors.updateUserRoleRequired)
      return false
    }

    try {
      set({ updateUserSubmitting: true })
      clearOp('update')

      await usersService.updateUser(payload)
      setOpSuccess('update', messages.users.status.success.updateUserSuccess)
      return true
    } catch (error) {
      setOpError('update', resolveErrorMessage(error, messages.users.status.errors.updateUserError), error)
      return false
    } finally {
      set({ updateUserSubmitting: false })
    }
  },

  toggleUserStatus: async (userId: string, nextStatus: boolean) => {
    const parsedUserId = Number(userId)
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      setOpError('toggle', messages.users.status.errors.invalidStatusUserId)
      return false
    }

    const previousRow = get().usersRows.find((row) => row.id === userId)
    if (!previousRow) {
      setOpError('toggle', messages.users.status.errors.invalidStatusUserId)
      return false
    }

    try {
      set({ loadingToggleStatus: true })
      clearOp('toggle')
      set((state) => ({
        usersRows: state.usersRows.map((row) => {
          if (row.id !== userId) return row
          return {
            ...row,
            status: nextStatus,
            values: row.values.map((value, index) => {
              if (index !== usersTableColumnIndex.status) return value
              return nextStatus ? messages.users.ui.statusEnabled : messages.users.ui.statusDisabled
            }),
          }
        }),
      }))

      await usersService.toggleUserStatus(parsedUserId, nextStatus)
      return true
    } catch (error) {
      set((state) => ({
        usersRows: state.usersRows.map((row) => (row.id === userId ? previousRow : row)),
      }))
      setOpError('toggle', resolveErrorMessage(error, messages.users.status.errors.toggleStatusError), error)
      return false
    } finally {
      set({ loadingToggleStatus: false })
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
