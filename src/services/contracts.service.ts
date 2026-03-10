import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperContractsQueryParams, mapperCreateContractFormData } from '@/mappers'
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

  createContract: async (payload: ContractCreatePayload, files: File[] = []) => {
    const formData = mapperCreateContractFormData(payload, files)
    const { data } = await axiosInstance.post<ContractCreateResponse>('/rrhh/contract/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
