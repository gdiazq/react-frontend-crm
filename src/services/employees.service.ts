import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperEmployeesQueryParams } from '@/mappers'
import type { EmployeeCreatePayload, EmployeeCreateResponse, EmployeePagedResponse, EmployeesQueryParams } from '@/types'

export const employeesService = {
  getEmployees: async (queryParams: EmployeesQueryParams) => {
    const { data } = await axiosInstance.get<EmployeePagedResponse>('/rrhh/employee/paged', {
      params: mapperEmployeesQueryParams(queryParams),
    })
    return data
  },

  createEmployee: async (payload: EmployeeCreatePayload) => {
    const { data } = await axiosInstance.post<EmployeeCreateResponse>('/rrhh/employee/create', payload)
    return data
  },

  toggleEmployeeStatus: async (employeeId: number, active: boolean) => {
    await axiosInstance.put(`/rrhh/employee/${employeeId}/status`, { active })
  },

  exportEmployeesCsv: async () => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/employee/export/csv', {
      responseType: 'blob',
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
