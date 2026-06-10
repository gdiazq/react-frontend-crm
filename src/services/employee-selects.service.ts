import axios from 'axios'
import { axiosInstance } from '@/config'
import type { EmployeeSelectOption, EmployeeYesNoOption } from '@/types'

const RRHH_SELECTS_BASE_PATH = '/rrhh/select'

export const employeeSelectsService = {
  getIdentificationTypeOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/identification-types`)
    return data
  },

  getYesNoOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeYesNoOption[]>(`${RRHH_SELECTS_BASE_PATH}/yes-no`)
    return data
  },

  getGenderOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/genders`)
    return data
  },

  getMaritalStatusOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/marital-statuses`)
    return data
  },

  getEducationLevelOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/education-levels`)
    return data
  },

  getDriverLicenseOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/driver-licenses`)
    return data
  },

  getProfessionOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/professions`)
    return data
  },

  getNationalityOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/nationalities`)
    return data
  },

  getExpatOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/expats`)
    return data
  },

  getEmergencyContactRelationshipOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/emergency-contact-relationships`)
    return data
  },

  getRegionOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/regions`)
    return data
  },

  getCommuneOptions: async (regionId: number) => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/communes`, {
      params: { regionId },
    })
    return data
  },

  getCityOptions: async (communeId: number) => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/cities`, {
      params: { communeId },
    })
    return data
  },

  getFamilyAllowanceTierOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/family-allowance-tiers`)
    return data
  },

  getRetirementStatusOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/retirement-statuses`)
    return data
  },

  getPensionStatusOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/pension-statuses`)
    return data
  },

  getAfpOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/afps`)
    return data
  },

  getHealthInsuranceOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/health-insurances`)
    return data
  },

  getHealthInsuranceTariffOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/health-insurance-tariffs`)
    return data
  },

  getPaymentMethodOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/payment-methods`)
    return data
  },

  getBankOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/banks`)
    return data
  },

  getApprovalEmployeeStatusOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/employee-statuses/approval`)
    return data
  },

  getHrRequestTypeOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/hr-request-types`)
    return data
  },

  getTransferToCostCenterOptions: async () => {
    const { data } = await axiosInstance.get<EmployeeSelectOption[]>('/rrhh/transfers/select/to-cost-centers')
    return data
  },

  isAxiosError: axios.isAxiosError,
}
