import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectCostCenterEmployeesQueryParams, mapperProjectsQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  ProjectCostCenterEmployeesPagedResponse,
  ProjectCostCenterEmployeesQueryParams,
  ProjectCreatePayload,
  ProjectCreateResponse,
  ProjectDetail,
  ProjectPagedResponse,
  ProjectUpdatePayload,
  ProjectUpdateResponse,
  ProjectsQueryParams,
} from '@/types'

export const projectsService = {
  getProjects: async (queryParams: ProjectsQueryParams) => {
    const { data } = await axiosInstance.get<ProjectPagedResponse>('/project/project/paged', {
      params: mapperProjectsQueryParams(queryParams),
    })
    return data
  },

  createProject: async (payload: ProjectCreatePayload) => {
    const { data } = await axiosInstance.post<ProjectCreateResponse>('/project/project/create', payload)
    return data
  },

  getProjectDetail: async (projectId: number) => {
    const { data } = await axiosInstance.get<ProjectDetail>(`/project/project/${projectId}`)
    return data
  },

  getCostCenterEmployees: async (costCenter: number, queryParams: ProjectCostCenterEmployeesQueryParams) => {
    const { data } = await axiosInstance.get<ProjectCostCenterEmployeesPagedResponse>(
      `/project/project/cost-center/${costCenter}/contracts/paged`,
      { params: mapperProjectCostCenterEmployeesQueryParams(queryParams) },
    )
    return data
  },

  updateProject: async (payload: ProjectUpdatePayload) => {
    const { data } = await axiosInstance.put<ProjectUpdateResponse>('/project/project/update', payload)
    return data
  },

  toggleProjectStatus: async (projectId: number, active: boolean) => {
    await axiosInstance.put(`/project/project/${projectId}/status`, { active })
  },

  exportProjectsCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/project/project/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  importProjectsCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/project/project/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
