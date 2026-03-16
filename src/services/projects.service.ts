import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectsQueryParams } from '@/mappers'
import type {
  ProjectCreatePayload,
  ProjectCreateResponse,
  ProjectPagedResponse,
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

  isAxiosError: axios.isAxiosError,
}
