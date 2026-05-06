import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectAssignmentsQueryParams } from '@/mappers'
import type {
  ProjectAssignmentDetail,
  ProjectAssignmentsPagedResponse,
  ProjectAssignmentsQueryParams,
} from '@/types'

export const projectAssignmentsService = {
  getProjectAssignments: async (queryParams: ProjectAssignmentsQueryParams) => {
    const { data } = await axiosInstance.get<ProjectAssignmentsPagedResponse>('/rrhh/project-assignments/paged', {
      params: mapperProjectAssignmentsQueryParams(queryParams),
    })
    return data
  },

  getProjectAssignmentsByEmployee: async (employeeId: number) => {
    const { data } = await axiosInstance.get<ProjectAssignmentDetail[]>(`/rrhh/project-assignments/select/by-employee/${employeeId}`)
    return data
  },

  getProjectAssignmentsByCostCenter: async (costCenter: number) => {
    const { data } = await axiosInstance.get<ProjectAssignmentDetail[]>(`/rrhh/project-assignments/select/by-cost-center/${costCenter}`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
