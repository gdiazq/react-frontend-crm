import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperProjectAssignmentsQueryParams } from '@/mappers'
import type {
  ProjectAssignmentDetail,
  ProjectAssignmentEmployeeSelectOption,
  ProjectAssignmentsPagedResponse,
  ProjectAssignmentsQueryParams,
} from '@/types'

const RRHH_EMPLOYEE_SELECTS_BASE_PATH = '/rrhh/employee/select'

export const projectAssignmentsService = {
  getProjectAssignments: async (queryParams: ProjectAssignmentsQueryParams) => {
    const { data } = await axiosInstance.get<ProjectAssignmentsPagedResponse>('/rrhh/project-assignments/paged', {
      params: mapperProjectAssignmentsQueryParams(queryParams),
    })
    return data
  },

  getEmployeeWithContractOptions: async () => {
    const { data } = await axiosInstance.get<ProjectAssignmentEmployeeSelectOption[]>(`${RRHH_EMPLOYEE_SELECTS_BASE_PATH}/with-contract`)
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
