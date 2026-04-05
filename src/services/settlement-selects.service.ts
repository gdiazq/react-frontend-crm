import axios from 'axios'
import { axiosInstance } from '@/config'
import type { ContractSelectOption } from '@/types'

const RRHH_SELECT_BASE = '/rrhh/select'
const RRHH_EMPLOYEE_SELECT = '/rrhh/employee/select'
const RRHH_CONTRACT_SELECT = '/rrhh/contract/select'

export const settlementSelectsService = {
  getLegalTerminationCauseOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECT_BASE}/legal-termination-causes`)
    return data
  },

  getQualityOfWorkOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECT_BASE}/quality-of-work`)
    return data
  },

  getSafetyComplianceOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECT_BASE}/safety-compliances`)
    return data
  },

  getNoRehireCauseOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECT_BASE}/no-re-hired-causes`)
    return data
  },

  getEmployeeWithContractOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_EMPLOYEE_SELECT}/with-contract`)
    return data
  },

  getContractsByEmployeeOptions: async (employeeId: number) => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_CONTRACT_SELECT}/by-employee/${employeeId}`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
