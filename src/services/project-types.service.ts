import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectTypesQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  ProjectTypeCreatePayload,
  ProjectTypeCreateResponse,
  ProjectTypeDetail,
  ProjectTypePagedResponse,
  ProjectTypesQueryParams,
  ProjectTypeUpdatePayload,
} from '@/types'

export const projectTypesService = {
  getProjectTypes: async (queryParams: ProjectTypesQueryParams) => {
    const { data } = await axiosInstance.get<ProjectTypePagedResponse>('/project/project-type/paged', {
      params: mapperProjectTypesQueryParams(queryParams),
    })
    return data
  },

  getProjectTypeDetail: async (projectTypeId: number) => {
    const { data } = await axiosInstance.get<ProjectTypeDetail>(`/project/project-type/${projectTypeId}`)
    return data
  },

  createProjectType: async (payload: ProjectTypeCreatePayload) => {
    const { data } = await axiosInstance.post<ProjectTypeCreateResponse>('/project/project-type/create', payload)
    return data
  },

  updateProjectType: async (payload: ProjectTypeUpdatePayload) => {
    const { data } = await axiosInstance.put<ProjectTypeCreateResponse>('/project/project-type/update', payload)
    return data
  },

  toggleProjectTypeStatus: async (projectTypeId: number, active: boolean) => {
    await axiosInstance.put(`/project/project-type/${projectTypeId}/status`, { active })
  },

  exportProjectTypesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/project/project-type/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importProjectTypesCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/project/project-type/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
