import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperContractsQueryParams } from '@/mappers'
import type { ContractPagedResponse, ContractsQueryParams } from '@/types'

export const contractsService = {
  getContracts: async (queryParams: ContractsQueryParams) => {
    const { data } = await axiosInstance.get<ContractPagedResponse>('/rrhh/contract/paged', {
      params: mapperContractsQueryParams(queryParams),
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
