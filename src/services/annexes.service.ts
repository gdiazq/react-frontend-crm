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
    const { data } = await axiosInstance.get<AnnexPagedResponse>('rrhh/annexes/paged', {
      params: mapperAnnexesQueryParams(queryParams),
    })
    return data
  },

  getAnnexDetail: async (annexId: number) => {
    const { data } = await axiosInstance.get<AnnexDetail>(`rrhh/annexes/${annexId}`)
    return data
  },

  createAnnex: async (payload: AnnexCreatePayload, files: File[] = []) => {
    const formData = mapperCreateAnnexFormData(payload, files)
    const { data } = await axiosInstance.post<AnnexCreateResponse>('rrhh/annexes/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  updateAnnex: async (payload: AnnexUpdatePayload, files: File[] = []) => {
    const formData = mapperUpdateAnnexFormData(payload, files)
    await axiosInstance.put('rrhh/annexes/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteAnnexDocument: async (annexId: number, fileId: number, userId: number) => {
    await axiosInstance.delete(`rrhh/annexes/${annexId}/documents/${fileId}`, {
      params: { userId },
    })
  },

  exportAnnexesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('rrhh/annexes/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  getAnnexesByContract: async (contractId: number) => {
    const { data } = await axiosInstance.get<AnnexByContractItem[]>(`rrhh/annexes/select/by-contract/${contractId}`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
