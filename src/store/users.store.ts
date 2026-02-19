import { create } from 'zustand'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { initialUsersPagination, initialUsersQueryParams, initialUsersRows } from '@/factories'
import { mapperUsersPagination, mapperUsersQueryParams, mapperUsersRows } from '@/mappers'
import messages from '@/messages/messages'
import type { UserPagedResponse, UserTableRow, UsersPagination, UsersQueryParams } from '@/types'

interface UsersStore {
  // State
  usersRows: UserTableRow[]
  pagination: UsersPagination
  queryParams: UsersQueryParams
  // Loading
  loadingUsers: boolean
  // Messages
  errorMessage: string | null
  errorBack: unknown | null
  // Actions
  getUsers: () => Promise<void>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setSearch: (value: string) => void
  searchUsers: () => Promise<void>
  mutationToggleUserStatus: (userId: string) => void
}

export const useStoreUsers = create<UsersStore>()((set, get) => ({
  usersRows: [...initialUsersRows],
  pagination: { ...initialUsersPagination },
  queryParams: { ...initialUsersQueryParams },
  loadingUsers: false,
  errorMessage: null,
  errorBack: null,

  getUsers: async () => {
    try {
      set({ loadingUsers: true, errorMessage: null, errorBack: null })
      const { data } = await axiosInstance.get<UserPagedResponse>('/user/paged', {
        params: mapperUsersQueryParams(get().queryParams),
      })
      const pagination = mapperUsersPagination(data)
      set({
        usersRows: mapperUsersRows(data.content || []),
        pagination,
        queryParams: { ...get().queryParams, page: pagination.page, size: pagination.size },
      })
    } catch (error) {
      set({ errorBack: error })
      if (axios.isAxiosError(error)) {
        set({ errorMessage: error.response?.data?.message || messages.users.status.errors.loadError })
      } else {
        set({ errorMessage: messages.users.status.errors.loadError })
      }
    } finally {
      set({ loadingUsers: false })
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

  mutationToggleUserStatus: (userId: string) => {
    set((state) => ({
      usersRows: state.usersRows.map((row) => {
        if (row.id !== userId) return row
        const nextStatus = row.status !== true
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
  },
}))
