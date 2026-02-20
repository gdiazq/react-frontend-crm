import axios from 'axios'
import { axiosInstance } from '@/config'
import type { UserPagedResponse, UsersQueryParams } from '@/types'
import { mapperUsersQueryParams } from '@/mappers'

export const usersService = {
  getUsers: async (queryParams: UsersQueryParams) => {
    const { data } = await axiosInstance.get<UserPagedResponse>('/user/paged', {
      params: mapperUsersQueryParams(queryParams),
    })
    return data
  },

  toggleUserStatus: async (userId: number, status: boolean) => {
    await axiosInstance.put(`/user/${userId}/status`, { status })
  },

  isAxiosError: axios.isAxiosError,
}
