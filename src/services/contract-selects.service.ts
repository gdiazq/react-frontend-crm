import axios from 'axios'
import { axiosInstance } from '@/config'
import type { ContractSelectOption } from '@/types'

const RRHH_SELECTS_BASE_PATH = '/rrhh/select'

export const contractSelectsService = {
  getEmployeeWithoutContractOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>('/rrhh/employee/select/without-contract')
    return data
  },

  getContractTypeOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/contract-types`)
    return data
  },

  getSafetyGroupOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/safety-groups`)
    return data
  },

  getCompanyOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/companies`)
    return data
  },

  getZoneOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/zones`)
    return data
  },

  getJobTitleOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/job-titles`)
    return data
  },

  getSiteOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/sites`)
    return data
  },

  getLaborUnionOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/labor-unions`)
    return data
  },

  getMealTypeOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/meal-types`)
    return data
  },

  getTransportTypeOptions: async () => {
    const { data } = await axiosInstance.get<ContractSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/transport-types`)
    return data
  },

  isAxiosError: axios.isAxiosError,
}
