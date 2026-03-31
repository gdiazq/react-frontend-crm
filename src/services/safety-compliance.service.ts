import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperSafetyComplianceQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  SafetyComplianceCreatePayload,
  SafetyComplianceCreateResponse,
  SafetyComplianceDetail,
  SafetyCompliancePagedResponse,
  SafetyComplianceQueryParams,
  SafetyComplianceUpdatePayload,
} from '@/types'

export const safetyComplianceService = {
  getSafetyCompliance: async (queryParams: SafetyComplianceQueryParams) => {
    const { data } = await axiosInstance.get<SafetyCompliancePagedResponse>('/rrhh/safety-compliance/paged', {
      params: mapperSafetyComplianceQueryParams(queryParams),
    })
    return data
  },

  getSafetyComplianceDetail: async (id: number) => {
    const { data } = await axiosInstance.get<SafetyComplianceDetail>(`/rrhh/safety-compliance/${id}`)
    return data
  },

  createSafetyCompliance: async (payload: SafetyComplianceCreatePayload) => {
    const { data } = await axiosInstance.post<SafetyComplianceCreateResponse>('/rrhh/safety-compliance/create', payload)
    return data
  },

  updateSafetyCompliance: async (payload: SafetyComplianceUpdatePayload) => {
    const { data } = await axiosInstance.put<SafetyComplianceCreateResponse>('/rrhh/safety-compliance/update', payload)
    return data
  },

  toggleSafetyComplianceStatus: async (id: number, active: boolean) => {
    await axiosInstance.put(`/rrhh/safety-compliance/${id}/status`, { active })
  },

  exportSafetyComplianceCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/safety-compliance/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importSafetyComplianceCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/rrhh/safety-compliance/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
