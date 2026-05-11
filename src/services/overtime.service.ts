import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperOvertimeQueryParams } from '@/mappers'
import type { OvertimePagedResponse, OvertimeQueryParams, OvertimeTypeRaw } from '@/types'

export const overtimeService = {
  getOvertime: async (queryParams: OvertimeQueryParams) => {
    const { data } = await axiosInstance.get<OvertimePagedResponse>('/rrhh/overtime', {
      params: mapperOvertimeQueryParams(queryParams),
    })
    return data
  },

  getOvertimeTypes: async () => {
    const { data } = await axiosInstance.get<OvertimeTypeRaw[]>('/rrhh/overtime/types')
    return data
  },

  isAxiosError: axios.isAxiosError,
}
