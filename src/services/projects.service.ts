import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectsQueryParams } from '@/mappers'
import type {
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

  isAxiosError: axios.isAxiosError,
}
