import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectStatusesQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  ProjectStatusCreatePayload,
  ProjectStatusCreateResponse,
  ProjectStatusDetail,
  ProjectStatusPagedResponse,
  ProjectStatusesQueryParams,
  ProjectStatusUpdatePayload,
} from '@/types'

export const projectStatusesService = {
  getProjectStatuses: async (queryParams: ProjectStatusesQueryParams) => {
    const { data } = await axiosInstance.get<ProjectStatusPagedResponse>('/project/project-status/paged', {
      params: mapperProjectStatusesQueryParams(queryParams),
    })
    return data
  },

  getProjectStatusDetail: async (projectStatusId: number) => {
    const { data } = await axiosInstance.get<ProjectStatusDetail>(`/project/project-status/${projectStatusId}`)
    return data
  },

  createProjectStatus: async (payload: ProjectStatusCreatePayload) => {
    const { data } = await axiosInstance.post<ProjectStatusCreateResponse>('/project/project-status/create', payload)
    return data
  },

  updateProjectStatus: async (payload: ProjectStatusUpdatePayload) => {
    const { data } = await axiosInstance.put<ProjectStatusCreateResponse>('/project/project-status/update', payload)
    return data
  },

  toggleProjectStatusStatus: async (projectStatusId: number, active: boolean) => {
    await axiosInstance.put(`/project/project-status/${projectStatusId}/status`, { active })
  },

  exportProjectStatusesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/project/project-status/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importProjectStatusesCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/project/project-status/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
