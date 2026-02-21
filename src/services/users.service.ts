import axios from 'axios'
import { axiosInstance } from '@/config'
import type { UserCreatePayload, UserCreateResponse, UserDetail, UserPagedResponse, UsersQueryParams } from '@/types'
import { mapperUsersQueryParams } from '@/mappers'

export const usersService = {
  getUsers: async (queryParams: UsersQueryParams) => {
    const { data } = await axiosInstance.get<UserPagedResponse>('/user/paged', {
      params: mapperUsersQueryParams(queryParams),
    })
    return data
  },

  getUserDetail: async (userId: number) => {
    const { data } = await axiosInstance.get<UserDetail>(`/user/detail/${userId}`)
    return data
  },

  getRolesForCreate: async () => {
    const attempts = [
      { url: '/user/role/paged', params: { page: 0, size: 100, sortBy: 'name', sortDir: 'asc' } },
      { url: '/user/role/paged', params: { page: 0, size: 100 } },
      { url: '/role/paged', params: { page: 0, size: 100 } },
    ]

    let lastError: unknown = null

    for (const attempt of attempts) {
      try {
        const { data } = await axiosInstance.get(attempt.url, { params: attempt.params })
        return data
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  },

  createUser: async (payload: UserCreatePayload) => {
    const { data } = await axiosInstance.post<UserCreateResponse>('/user/create', payload)
    return data
  },

  toggleUserStatus: async (userId: number, status: boolean) => {
    await axiosInstance.put(`/user/${userId}/status`, { status })
  },

  isAxiosError: axios.isAxiosError,
}
