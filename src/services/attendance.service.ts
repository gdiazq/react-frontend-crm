import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperAttendanceExportQueryParams, mapperAttendanceQueryParams } from '@/mappers'
import type {
  AttendanceCreatePayload,
  AttendanceCreateResponse,
  AttendanceDetail,
  AttendancePagedResponse,
  AttendanceQueryParams,
  AttendanceUpdatePayload,
  AttendanceUpdateResponse,
} from '@/types'

export const attendanceService = {
  getAttendance: async (queryParams: AttendanceQueryParams) => {
    const { data } = await axiosInstance.get<AttendancePagedResponse>('/rrhh/attendance/paged', {
      params: mapperAttendanceQueryParams(queryParams),
    })
    return data
  },

  getAttendanceDetail: async (attendanceId: number) => {
    const { data } = await axiosInstance.get<AttendanceDetail>(`/rrhh/attendance/${attendanceId}`)
    return data
  },

  createAttendance: async (payload: AttendanceCreatePayload) => {
    const { data } = await axiosInstance.post<AttendanceCreateResponse>('/rrhh/attendance/create', payload)
    return data
  },

  updateAttendance: async (payload: AttendanceUpdatePayload) => {
    const { data } = await axiosInstance.put<AttendanceUpdateResponse>('/rrhh/attendance/update', payload)
    return data
  },

  deleteAttendance: async (attendanceId: number) => {
    await axiosInstance.delete(`/rrhh/attendance/${attendanceId}`)
  },

  getAttendanceByEmployee: async (employeeId: number) => {
    const { data } = await axiosInstance.get<AttendanceDetail[]>(`/rrhh/attendance/select/by-employee/${employeeId}`)
    return data
  },

  getAttendanceByCostCenter: async (costCenter: number) => {
    const { data } = await axiosInstance.get<AttendanceDetail[]>(`/rrhh/attendance/select/by-cost-center/${costCenter}`)
    return data
  },

  exportAttendanceCsv: async (queryParams: AttendanceQueryParams) => {
    const { data } = await axiosInstance.get<Blob>('/rrhh/attendance/export/csv', {
      params: mapperAttendanceExportQueryParams(queryParams),
      responseType: 'blob',
    })
    return data
  },

  isAxiosError: axios.isAxiosError,
}
