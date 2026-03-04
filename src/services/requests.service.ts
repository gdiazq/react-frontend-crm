import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperRequestsQueryParams } from '@/mappers'
import type { RequestPagedResponse, RequestsQueryParams } from '@/types'

export const requestsService = {
  getRequests: async (queryParams: RequestsQueryParams) => {
    const { data } = await axiosInstance.get<RequestPagedResponse>('/rrhh/hr-request/paged', {
      params: mapperRequestsQueryParams(queryParams),
    })
    return data
  },

  approveRequest: async (requestId: number) => {
    await axiosInstance.put(`/rrhh/hr-request/${requestId}/approve`)
  },

  rejectRequest: async (requestId: number, rejectionDetail: string) => {
    await axiosInstance.put(`/rrhh/hr-request/${requestId}/reject`, { rejectionDetail })
  },

  exportRequestsCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/hr-request/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
