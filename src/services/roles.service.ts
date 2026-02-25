import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  RoleCreatePayload,
  RoleCreateResponse,
  RoleDetail,
  RolePagedResponse,
  RolesQueryParams,
  RoleUpdatePayload,
} from '@/types'
import { mapperRolesQueryParams } from '@/mappers'

export const rolesService = {
  getRoles: async (queryParams: RolesQueryParams) => {
    const { data } = await axiosInstance.get<RolePagedResponse>('/role/paged', {
      params: mapperRolesQueryParams(queryParams),
    })
    return data
  },

  getRoleDetail: async (roleId: number) => {
    const { data } = await axiosInstance.get<RoleDetail>(`/role/${roleId}`)
    return data
  },

  createRole: async (payload: RoleCreatePayload) => {
    const { data } = await axiosInstance.post<RoleCreateResponse>('/role/create', payload)
    return data
  },

  updateRole: async (payload: RoleUpdatePayload) => {
    await axiosInstance.put('/role/update', payload)
  },

  replaceRolePermissions: async (roleId: number, permissionIds: number[]) => {
    await axiosInstance.put(`/role/${roleId}/permissions`, { permissionIds })
  },

  toggleRoleStatus: async (roleId: number, status: boolean) => {
    await axiosInstance.put(`/role/${roleId}/status`, { status })
  },

  isAxiosError: axios.isAxiosError,
}
