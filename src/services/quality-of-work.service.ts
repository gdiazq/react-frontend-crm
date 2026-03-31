import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperQualityOfWorkQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  QualityOfWorkCreatePayload,
  QualityOfWorkCreateResponse,
  QualityOfWorkDetail,
  QualityOfWorkPagedResponse,
  QualityOfWorkQueryParams,
  QualityOfWorkUpdatePayload,
} from '@/types'

export const qualityOfWorkService = {
  getQualityOfWork: async (queryParams: QualityOfWorkQueryParams) => {
    const { data } = await axiosInstance.get<QualityOfWorkPagedResponse>('/rrhh/quality-of-work/paged', {
      params: mapperQualityOfWorkQueryParams(queryParams),
    })
    return data
  },

  getQualityOfWorkDetail: async (id: number) => {
    const { data } = await axiosInstance.get<QualityOfWorkDetail>(`/rrhh/quality-of-work/${id}`)
    return data
  },

  createQualityOfWork: async (payload: QualityOfWorkCreatePayload) => {
    const { data } = await axiosInstance.post<QualityOfWorkCreateResponse>('/rrhh/quality-of-work/create', payload)
    return data
  },

  updateQualityOfWork: async (payload: QualityOfWorkUpdatePayload) => {
    const { data } = await axiosInstance.put<QualityOfWorkCreateResponse>('/rrhh/quality-of-work/update', payload)
    return data
  },

  toggleQualityOfWorkStatus: async (id: number, active: boolean) => {
    await axiosInstance.put(`/rrhh/quality-of-work/${id}/status`, { active })
  },

  exportQualityOfWorkCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/quality-of-work/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importQualityOfWorkCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/rrhh/quality-of-work/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
