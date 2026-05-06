import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  AttendanceEmployeeSelectOption,
  AttendanceEmployeeWithCostCenterSelectOption,
  AttendanceMarkTypeSelectOption,
  AttendanceStatusSelectOption,
} from '@/types'

export const attendanceSelectsService = {
  getEmployeeWithContractOptions: async () => {
    const { data } = await axiosInstance.get<AttendanceEmployeeSelectOption[]>('/rrhh/employee/select/with-contract')
    return data
  },

  getAttendanceEmployeeOptions: async () => {
    const { data } = await axiosInstance.get<AttendanceEmployeeWithCostCenterSelectOption[]>('/rrhh/employee/select/attendance')
    return data
  },

  getAttendanceStatusOptions: async () => {
    const { data } = await axiosInstance.get<AttendanceStatusSelectOption[]>('/rrhh/attendance-statuses/select')
    return data
  },

  getAttendanceMarkTypeOptions: async () => {
    const { data } = await axiosInstance.get<AttendanceMarkTypeSelectOption[]>('/rrhh/attendance-marks/select/types')
    return data
  },

  isAxiosError: axios.isAxiosError,
}
