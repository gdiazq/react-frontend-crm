import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperTransferQueryParams, mapperCreateTransferFormData, mapperUpdateTransferFormData } from '@/mappers'
import type {
  TransferCreatePayload,
  TransferCreateResponse,
  TransferDetail,
  TransferPagedResponse,
  TransferQueryParams,
  TransferUpdatePayload,
  ProjectCostCenterSelectOption,
} from '@/types'

export const transferService = {
  getTransfers: async (queryParams: TransferQueryParams) => {
    const { data } = await axiosInstance.get<TransferPagedResponse>('/rrhh/transfers/paged', {
      params: mapperTransferQueryParams(queryParams),
    })
    return data
  },

  getTransferDetail: async (id: number) => {
    const { data } = await axiosInstance.get<TransferDetail>(`/rrhh/transfers/${id}`)
    return data
  },

  createTransfer: async (payload: TransferCreatePayload, files: File[] = []) => {
    const formData = mapperCreateTransferFormData(payload, files)
    const { data } = await axiosInstance.post<TransferCreateResponse>('/rrhh/transfers/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  updateTransfer: async (payload: TransferUpdatePayload, files: File[] = []) => {
    const formData = mapperUpdateTransferFormData(payload, files)
    await axiosInstance.put('/rrhh/transfers/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  exportTransfersCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/transfers/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  getProjectCostCenterOptions: async () => {
    const { data } = await axiosInstance.get<ProjectCostCenterSelectOption[]>('/project/select/cost-centers')
    return data
  },

  getProjectCostCenterOption: async (costCenter: number) => {
    const { data } = await axiosInstance.get<ProjectCostCenterSelectOption>(`/project/select/cost-centers/${costCenter}`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
