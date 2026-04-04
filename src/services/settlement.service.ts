import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperSettlementQueryParams, mapperCreateSettlementFormData, mapperUpdateSettlementFormData } from '@/mappers'
import type {
  SettlementCreatePayload,
  SettlementCreateResponse,
  SettlementDetail,
  SettlementPagedResponse,
  SettlementQueryParams,
  SettlementUpdatePayload,
} from '@/types'

export const settlementService = {
  getSettlements: async (queryParams: SettlementQueryParams) => {
    const { data } = await axiosInstance.get<SettlementPagedResponse>('/rrhh/settlements/paged', {
      params: mapperSettlementQueryParams(queryParams),
    })
    return data
  },

  getSettlementDetail: async (id: number) => {
    const { data } = await axiosInstance.get<SettlementDetail>(`/rrhh/settlements/${id}`)
    return data
  },

  createSettlement: async (payload: SettlementCreatePayload, files: File[] = []) => {
    const formData = mapperCreateSettlementFormData(payload, files)
    const { data } = await axiosInstance.post<SettlementCreateResponse>('/rrhh/settlements/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  updateSettlement: async (payload: SettlementUpdatePayload, files: File[] = []) => {
    const formData = mapperUpdateSettlementFormData(payload, files)
    await axiosInstance.put('/rrhh/settlements/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  isAxiosError: axios.isAxiosError,
}
