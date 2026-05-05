import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  SelectCompanyRepresentativeOption,
  SelectEmployeeStatusOption,
  SelectPermissionOption,
  SelectProjectTypeOption,
  SelectProjectSpecialtyOption,
  SelectProjectStatusOption,
  SelectRoleOption,
  SelectStatusOption,
  SelectSupervisorOption,
  SelectTerminationQuizQuestionOption,
  SelectUserEmailOption,
  SelectUserNameOption,
  SelectVisitorOption,
} from '@/types'

export const selectsService = {
  getRoleOptions: async () => {
    const { data } = await axiosInstance.get<SelectRoleOption[]>('/select/roles')
    return data
  },

  getUserNameOptions: async () => {
    const { data } = await axiosInstance.get<SelectUserNameOption[]>('/select/users/name')
    return data
  },

  getUserEmailOptions: async () => {
    const { data } = await axiosInstance.get<SelectUserEmailOption[]>('/select/users/email')
    return data
  },

  getStatusOptions: async () => {
    const { data } = await axiosInstance.get<SelectStatusOption[]>('/select/status')
    return data
  },

  getEmployeeStatusOptions: async () => {
    const { data } = await axiosInstance.get<SelectEmployeeStatusOption[]>('/rrhh/select/employee-statuses')
    return data
  },

  getPermissionOptions: async () => {
    const { data } = await axiosInstance.get<SelectPermissionOption[]>('/role/permissions/select')
    return data
  },

  getProjectTypeOptions: async () => {
    const { data } = await axiosInstance.get<SelectProjectTypeOption[]>('/project/select/project-types')
    return data
  },

  getProjectSpecialtyOptions: async () => {
    const { data } = await axiosInstance.get<SelectProjectSpecialtyOption[]>('/project/select/project-specialties')
    return data
  },

  getProjectStatusOptions: async () => {
    const { data } = await axiosInstance.get<SelectProjectStatusOption[]>('/project/select/project-statuses')
    return data
  },

  getVisitorOptions: async () => {
    const { data } = await axiosInstance.get<SelectVisitorOption[]>('/rrhh/employee/select/visitors')
    return data
  },

  getSupervisorOptions: async () => {
    const { data } = await axiosInstance.get<SelectSupervisorOption[]>('/rrhh/employee/select/supervisors')
    return data
  },

  getCompanyRepresentativeOptions: async () => {
    const { data } = await axiosInstance.get<SelectCompanyRepresentativeOption[]>('/rrhh/employee/select/company-representatives')
    return data
  },

  getTerminationQuizQuestionOptions: async () => {
    const { data } = await axiosInstance.get<SelectTerminationQuizQuestionOption[]>('/rrhh/select/termination-quiz-questions')
    return data
  },

  isAxiosError: axios.isAxiosError,
}
