import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectSpecialtiesQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  ProjectSpecialtyCreatePayload,
  ProjectSpecialtyCreateResponse,
  ProjectSpecialtyDetail,
  ProjectSpecialtyPagedResponse,
  ProjectSpecialtiesQueryParams,
  ProjectSpecialtyUpdatePayload,
} from '@/types'

export const projectSpecialtiesService = {
  getProjectSpecialties: async (queryParams: ProjectSpecialtiesQueryParams) => {
    const { data } = await axiosInstance.get<ProjectSpecialtyPagedResponse>('/project/project-specialty/paged', {
      params: mapperProjectSpecialtiesQueryParams(queryParams),
    })
    return data
  },

  getProjectSpecialtyDetail: async (projectSpecialtyId: number) => {
    const { data } = await axiosInstance.get<ProjectSpecialtyDetail>(`/project/project-specialty/${projectSpecialtyId}`)
    return data
  },

  createProjectSpecialty: async (payload: ProjectSpecialtyCreatePayload) => {
    const { data } = await axiosInstance.post<ProjectSpecialtyCreateResponse>('/project/project-specialty/create', payload)
    return data
  },

  updateProjectSpecialty: async (payload: ProjectSpecialtyUpdatePayload) => {
    const { data } = await axiosInstance.put<ProjectSpecialtyCreateResponse>('/project/project-specialty/update', payload)
    return data
  },

  toggleProjectSpecialtyStatus: async (projectSpecialtyId: number, active: boolean) => {
    await axiosInstance.put(`/project/project-specialty/${projectSpecialtyId}/status`, { active })
  },

  exportProjectSpecialtiesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/project/project-specialty/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importProjectSpecialtiesCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/project/project-specialty/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
