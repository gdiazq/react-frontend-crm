import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperNoRehireCauseQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  NoRehireCauseCreatePayload,
  NoRehireCauseCreateResponse,
  NoRehireCauseDetail,
  NoRehireCausePagedResponse,
  NoRehireCauseQueryParams,
  NoRehireCauseUpdatePayload,
} from '@/types'

export const noRehireCauseService = {
  getNoRehireCause: async (queryParams: NoRehireCauseQueryParams) => {
    const { data } = await axiosInstance.get<NoRehireCausePagedResponse>('/rrhh/no-re-hired-cause/paged', {
      params: mapperNoRehireCauseQueryParams(queryParams),
    })
    return data
  },

  getNoRehireCauseDetail: async (id: number) => {
    const { data } = await axiosInstance.get<NoRehireCauseDetail>(`/rrhh/no-re-hired-cause/${id}`)
    return data
  },

  createNoRehireCause: async (payload: NoRehireCauseCreatePayload) => {
    const { data } = await axiosInstance.post<NoRehireCauseCreateResponse>('/rrhh/no-re-hired-cause/create', payload)
    return data
  },

  updateNoRehireCause: async (payload: NoRehireCauseUpdatePayload) => {
    const { data } = await axiosInstance.put<NoRehireCauseCreateResponse>('/rrhh/no-re-hired-cause/update', payload)
    return data
  },

  toggleNoRehireCauseStatus: async (id: number, active: boolean) => {
    await axiosInstance.put(`/rrhh/no-re-hired-cause/${id}/status`, { active })
  },

  exportNoRehireCauseCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/no-re-hired-cause/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importNoRehireCauseCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/rrhh/no-re-hired-cause/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
