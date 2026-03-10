import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperContractsQueryParams } from '@/mappers'
import type {
  ContractCreatePayload,
  ContractCreateResponse,
  ContractPagedResponse,
  ContractsQueryParams,
} from '@/types'

export const contractsService = {
  getContracts: async (queryParams: ContractsQueryParams) => {
    const { data } = await axiosInstance.get<ContractPagedResponse>('/rrhh/contract/paged', {
      params: mapperContractsQueryParams(queryParams),
    })
    return data
  },

  createContract: async (payload: ContractCreatePayload) => {
    const { data } = await axiosInstance.post<ContractCreateResponse>('/rrhh/contract/create', payload)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
