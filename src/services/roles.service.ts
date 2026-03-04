import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  CsvImportResponse,
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

  exportRolesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/role/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importRolesCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/role/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
