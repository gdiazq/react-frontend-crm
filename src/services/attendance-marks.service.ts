import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  AttendanceMarkCreatePayload,
  AttendanceMarkRaw,
  AttendanceMarkResponse,
  AttendanceMarkUpdatePayload,
} from '@/types'

export const attendanceMarksService = {
  createAttendanceMark: async (payload: AttendanceMarkCreatePayload) => {
    const { data } = await axiosInstance.post<AttendanceMarkResponse>('/rrhh/attendance-marks/create', payload)
    return data
  },

  updateAttendanceMark: async (payload: AttendanceMarkUpdatePayload) => {
    const { data } = await axiosInstance.put<AttendanceMarkResponse>('/rrhh/attendance-marks/update', payload)
    return data
  },

  getAttendanceMarksByAttendance: async (attendanceId: number) => {
    const { data } = await axiosInstance.get<AttendanceMarkRaw[]>(`/rrhh/attendance-marks/by-attendance/${attendanceId}`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
