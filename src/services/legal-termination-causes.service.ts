import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperLegalTerminationCausesQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  LegalTerminationCauseCreatePayload,
  LegalTerminationCauseCreateResponse,
  LegalTerminationCauseDetail,
  LegalTerminationCausePagedResponse,
  LegalTerminationCausesQueryParams,
  LegalTerminationCauseUpdatePayload,
} from '@/types'

export const legalTerminationCausesService = {
  getLegalTerminationCauses: async (queryParams: LegalTerminationCausesQueryParams) => {
    const { data } = await axiosInstance.get<LegalTerminationCausePagedResponse>('/rrhh/legal-termination-cause/paged', {
      params: mapperLegalTerminationCausesQueryParams(queryParams),
    })
    return data
  },

  getLegalTerminationCauseDetail: async (legalTerminationCauseId: number) => {
    const { data } = await axiosInstance.get<LegalTerminationCauseDetail>(`/rrhh/legal-termination-cause/${legalTerminationCauseId}`)
    return data
  },

  createLegalTerminationCause: async (payload: LegalTerminationCauseCreatePayload) => {
    const { data } = await axiosInstance.post<LegalTerminationCauseCreateResponse>('/rrhh/legal-termination-cause/create', payload)
    return data
  },

  updateLegalTerminationCause: async (payload: LegalTerminationCauseUpdatePayload) => {
    const { data } = await axiosInstance.put<LegalTerminationCauseCreateResponse>('/rrhh/legal-termination-cause/update', payload)
    return data
  },

  toggleLegalTerminationCauseStatus: async (legalTerminationCauseId: number, active: boolean) => {
    await axiosInstance.put(`/rrhh/legal-termination-cause/${legalTerminationCauseId}/status`, { active })
  },

  exportLegalTerminationCausesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/legal-termination-cause/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importLegalTerminationCausesCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/rrhh/legal-termination-cause/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
