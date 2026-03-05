import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperEmployeesQueryParams } from '@/mappers'
import type {
  CsvImportResponse,
  EmployeeCreatePayload,
  EmployeeCreateResponse,
  EmployeeDetail,
  EmployeePagedResponse,
  EmployeesQueryParams,
} from '@/types'

export const employeesService = {
  getEmployees: async (queryParams: EmployeesQueryParams) => {
    const { data } = await axiosInstance.get<EmployeePagedResponse>('/rrhh/employee/paged', {
      params: mapperEmployeesQueryParams(queryParams),
    })
    return data
  },

  getEmployeeDetail: async (employeeId: number) => {
    const { data } = await axiosInstance.get<EmployeeDetail>(`/rrhh/employee/detail/${employeeId}`)
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

  importEmployeesCsv: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<CsvImportResponse>('/rrhh/employee/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
