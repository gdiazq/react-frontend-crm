import axios from 'axios'
import { axiosInstance } from '@/config'
import type { AnnexSelectOption } from '@/types'

const RRHH_SELECTS_BASE_PATH = '/rrhh/select'
const RRHH_EMPLOYEE_SELECTS_BASE_PATH = '/rrhh/employee/select'

export const annexSelectsService = {
  getEmployeeWithContractOptions: async () => {
    const { data } = await axiosInstance.get<AnnexSelectOption[]>(`${RRHH_EMPLOYEE_SELECTS_BASE_PATH}/with-contract`)
    return data
  },

  getAnnexTypeOptions: async () => {
    const { data } = await axiosInstance.get<AnnexSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/contract-annex-types`)
    return data
  },
  isAxiosError: axios.isAxiosError,
}
