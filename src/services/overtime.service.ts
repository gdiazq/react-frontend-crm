import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperOvertimeQueryParams } from '@/mappers'
import type {
  OvertimeCreatePayload,
  OvertimeCreateResponse,
  OvertimeDetail,
  OvertimePagedResponse,
  OvertimeQueryParams,
  OvertimeTypeRaw,
  OvertimeUpdatePayload,
  OvertimeUpdateResponse,
} from '@/types'

export const overtimeService = {
  getOvertime: async (queryParams: OvertimeQueryParams) => {
    const { data } = await axiosInstance.get<OvertimePagedResponse>('/rrhh/overtime/paged', {
      params: mapperOvertimeQueryParams(queryParams),
    })
    return data
  },

  getOvertimeTypes: async () => {
    const { data } = await axiosInstance.get<OvertimeTypeRaw[]>('/rrhh/overtime/types')
    return data
  },

  getOvertimeDetail: async (overtimeId: number) => {
    const { data } = await axiosInstance.get<OvertimeDetail>(`/rrhh/overtime/${overtimeId}`)
    return data
  },

  createOvertime: async (payload: OvertimeCreatePayload) => {
    const { data } = await axiosInstance.post<OvertimeCreateResponse>('/rrhh/overtime/create', payload)
    return data
  },

  updateOvertime: async (payload: OvertimeUpdatePayload) => {
    const { data } = await axiosInstance.put<OvertimeUpdateResponse>('/rrhh/overtime/update', payload)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
