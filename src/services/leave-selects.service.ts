import axios from 'axios'
import { axiosInstance } from '@/config'
import type { LeaveSelectOption } from '@/types'

const RRHH_SELECTS_BASE_PATH = '/rrhh/select'
const RRHH_EMPLOYEE_SELECTS_BASE_PATH = '/rrhh/employee/select'

export const leaveSelectsService = {
  getEmployeeWithContractOptions: async () => {
    const { data } = await axiosInstance.get<LeaveSelectOption[]>(`${RRHH_EMPLOYEE_SELECTS_BASE_PATH}/with-contract`)
    return data
  },

  getLeaveTypeOptions: async () => {
    const { data } = await axiosInstance.get<LeaveSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/leave-types`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
