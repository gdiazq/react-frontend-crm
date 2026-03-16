import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectsQueryParams } from '@/mappers'
import type {
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

  updateProject: async (payload: ProjectUpdatePayload) => {
    const { data } = await axiosInstance.put<ProjectUpdateResponse>('/project/project/update', payload)
    return data
  },

  toggleProjectStatus: async (projectId: number, active: boolean) => {
    await axiosInstance.put(`/project/project/${projectId}/status`, { active })
  },

  isAxiosError: axios.isAxiosError,
}
