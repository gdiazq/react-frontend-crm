import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperAnnexesQueryParams, mapperCreateAnnexFormData, mapperUpdateAnnexFormData } from '@/mappers'
import type {
  AnnexByContractItem,
  AnnexCreatePayload,
  AnnexCreateResponse,
  AnnexDetail,
  AnnexPagedResponse,
  AnnexUpdatePayload,
  AnnexesQueryParams,
} from '@/types'

export const annexesService = {
  getAnnexes: async (queryParams: AnnexesQueryParams) => {
    const { data } = await axiosInstance.get<AnnexPagedResponse>('/annexes/paged', {
      params: mapperAnnexesQueryParams(queryParams),
    })
    return data
  },

  getAnnexDetail: async (annexId: number) => {
    const { data } = await axiosInstance.get<AnnexDetail>(`/annexes/${annexId}`)
    return data
  },

  createAnnex: async (payload: AnnexCreatePayload, files: File[] = []) => {
    const formData = mapperCreateAnnexFormData(payload, files)
    const { data } = await axiosInstance.post<AnnexCreateResponse>('/annexes/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  updateAnnex: async (payload: AnnexUpdatePayload, files: File[] = []) => {
    const formData = mapperUpdateAnnexFormData(payload, files)
    await axiosInstance.put('/annexes/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteAnnexDocument: async (annexId: number, fileId: number, userId: number) => {
    await axiosInstance.delete(`/annexes/${annexId}/documents/${fileId}`, {
      params: { userId },
    })
  },

  exportAnnexesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/annexes/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  getAnnexesByContract: async (contractId: number) => {
    const { data } = await axiosInstance.get<AnnexByContractItem[]>(`/annexes/select/by-contract/${contractId}`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
