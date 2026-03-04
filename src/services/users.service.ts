import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  CsvImportResponse,
  UserCreatePayload,
  UserCreateResponse,
  UserDetail,
  UserPagedResponse,
  UsersQueryParams,
  UserUpdatePayload,
} from '@/types'
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

  createUser: async (payload: UserCreatePayload) => {
    const { data } = await axiosInstance.post<UserCreateResponse>('/user/create', payload)
    return data
  },

  updateUser: async (payload: UserUpdatePayload) => {
    await axiosInstance.put('/user/update', payload)
  },

  toggleUserStatus: async (userId: number, status: boolean) => {
    await axiosInstance.put(`/user/${userId}/status`, { status })
  },

  exportUsersCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/user/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importUsersCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/user/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
