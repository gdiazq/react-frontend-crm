import axios from 'axios'
import { axiosInstance } from '@/config'
import type { RolePagedResponse, RolesQueryParams } from '@/types'
import { mapperRolesQueryParams } from '@/mappers'

export const rolesService = {
  getRoles: async (queryParams: RolesQueryParams) => {
    const { data } = await axiosInstance.get<RolePagedResponse>('/role/paged', {
      params: mapperRolesQueryParams(queryParams),
    })
    return data
  },

  toggleRoleStatus: async (roleId: number, status: boolean) => {
    await axiosInstance.put(`/role/${roleId}/status`, { status })
  },

  isAxiosError: axios.isAxiosError,
}
