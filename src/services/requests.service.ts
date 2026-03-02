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

  isAxiosError: axios.isAxiosError,
}
