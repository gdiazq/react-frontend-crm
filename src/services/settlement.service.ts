import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperSettlementQueryParams } from '@/mappers'
import type {
  SettlementDetail,
  SettlementPagedResponse,
  SettlementQueryParams,
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

  isAxiosError: axios.isAxiosError,
}
