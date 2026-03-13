import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperContractsQueryParams, mapperCreateContractFormData, mapperUpdateContractFormData } from '@/mappers'
import type {
  CsvImportResponse,
  ContractCreatePayload,
  ContractCreateResponse,
  ContractDetail,
  ContractPagedResponse,
  ContractUpdatePayload,
  ContractsQueryParams,
} from '@/types'

export const contractsService = {
  getContracts: async (queryParams: ContractsQueryParams) => {
    const { data } = await axiosInstance.get<ContractPagedResponse>('/rrhh/contract/paged', {
      params: mapperContractsQueryParams(queryParams),
    })
    return data
  },

  getContractDetail: async (contractId: number) => {
    const { data } = await axiosInstance.get<ContractDetail>(`/rrhh/contract/detail/${contractId}`)
    return data
  },

  createContract: async (payload: ContractCreatePayload, files: File[] = []) => {
    const formData = mapperCreateContractFormData(payload, files)
    const { data } = await axiosInstance.post<ContractCreateResponse>('/rrhh/contract/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  updateContract: async (payload: ContractUpdatePayload, files: File[] = []) => {
    const formData = mapperUpdateContractFormData(payload, files)
    await axiosInstance.put('/rrhh/contract/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  toggleContractStatus: async (contractId: number, active: boolean) => {
    await axiosInstance.put(`/rrhh/contract/${contractId}/status`, { active })
  },

  exportContractsCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/contract/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importContractsCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/rrhh/contract/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
