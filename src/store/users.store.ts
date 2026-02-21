import { create } from 'zustand'
import { usersService } from '@/services'
import {
  initialUsersPagination,
  initialUsersQueryParams,
  initialUsersRows,
} from '@/factories'
import {
  mapperUsersPagination,
  mapperUsersRows,
} from '@/mappers'
import messages from '@/messages/messages'
import type { UsersSortBy, UsersSortDir, UsersStore } from '@/types'

let latestUserDetailRequestId = 0

export const useStoreUsers = create<UsersStore>()((set, get) => ({
  usersRows: [...initialUsersRows],
  userDetail: null,
  pagination: { ...initialUsersPagination },
  queryParams: { ...initialUsersQueryParams },
  loadingUsers: false,
  loadingUserDetail: false,
  createUserSubmitting: false,
  loadingToggleStatus: false,
  errorMessage: null,
  detailErrorMessage: null,
  createUserErrorMessage: null,
  createUserSuccessMessage: null,
  errorBack: null,

  getUsers: async () => {
    try {
      set({ loadingUsers: true, errorMessage: null, errorBack: null })
      const data = await usersService.getUsers(get().queryParams)
      const pagination = mapperUsersPagination(data)
      set({
        usersRows: mapperUsersRows(data.content || []),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      set({ errorBack: error })
      if (usersService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.users.status.errors.loadError })
      } else {
        set({ errorMessage: messages.users.status.errors.loadError })
      }
    } finally {
      set({ loadingUsers: false })
    }
  },

  getUserDetail: async (userId: string) => {
    const parsedUserId = Number(userId)
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      set({
        detailErrorMessage: messages.users.status.errors.detailInvalidUserId,
        userDetail: null,
      })
      return false
    }
    const requestId = ++latestUserDetailRequestId

    try {
      set({
        loadingUserDetail: true,
        detailErrorMessage: null,
        userDetail: null,
        errorBack: null,
      })
      const data = await usersService.getUserDetail(parsedUserId)
      if (requestId !== latestUserDetailRequestId) return false
      set({ userDetail: data })
      return true
    } catch (error) {
      if (requestId !== latestUserDetailRequestId) return false
      if (usersService.isAxiosError(error)) {
        set({
          detailErrorMessage: error.response?.data?.message || messages.users.status.errors.detailLoadError,
          errorBack: error,
        })
      } else {
        set({
          detailErrorMessage: messages.users.status.errors.detailLoadError,
          errorBack: error,
        })
      }
      return false
    } finally {
      if (requestId === latestUserDetailRequestId) {
        set({ loadingUserDetail: false })
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
    set({ userDetail: null, detailErrorMessage: null, loadingUserDetail: false })
  },

  clearCreateUserStatus: () => {
    set({
      createUserErrorMessage: null,
      createUserSuccessMessage: null,
    })
  },

  mutationCreateUser: async (payload) => {
    if (!payload.roleIds.length) {
      set({ createUserErrorMessage: messages.users.status.errors.createUserRoleRequired })
      return false
    }

    try {
      set({
        createUserSubmitting: true,
        createUserErrorMessage: null,
        createUserSuccessMessage: null,
        errorBack: null,
      })

      const data = await usersService.createUser(payload)
      const username = typeof data.username === 'string' && data.username.length > 0 ? data.username : ''
      set({
        createUserSuccessMessage: username
          ? `${messages.users.status.success.createUserSuccess} (${username})`
          : messages.users.status.success.createUserSuccess,
      })
      return true
    } catch (error) {
      if (usersService.isAxiosError(error)) {
        set({
          createUserErrorMessage: error.response?.data?.message || messages.users.status.errors.createUserError,
          errorBack: error,
        })
      } else {
        set({
          createUserErrorMessage: messages.users.status.errors.createUserError,
          errorBack: error,
        })
      }
      return false
    } finally {
      set({ createUserSubmitting: false })
    }
  },

  mutationToggleUserStatus: async (userId: string, nextStatus: boolean) => {
    const parsedUserId = Number(userId)
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      set({ errorMessage: messages.users.status.errors.invalidStatusUserId })
      return false
    }

    const previousRow = get().usersRows.find((row) => row.id === userId)
    if (!previousRow) {
      set({ errorMessage: messages.users.status.errors.invalidStatusUserId })
      return false
    }

    try {
      set({ loadingToggleStatus: true, errorMessage: null, errorBack: null })
      set((state) => ({
        usersRows: state.usersRows.map((row) => {
          if (row.id !== userId) return row
          return {
            ...row,
            status: nextStatus,
            values: row.values.map((value, index) => {
              if (index !== 6) return value
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
      if (usersService.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.users.status.errors.toggleStatusError })
      } else {
        set({ errorMessage: messages.users.status.errors.toggleStatusError })
      }
      return false
    } finally {
      set({ loadingToggleStatus: false })
    }
  },
}))
