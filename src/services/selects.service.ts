import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  SelectPermissionOption,
  SelectProjectSpecialtyOption,
  SelectRoleOption,
  SelectStatusOption,
  SelectUserEmailOption,
  SelectUserNameOption,
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

  getPermissionOptions: async () => {
    const { data } = await axiosInstance.get<SelectPermissionOption[]>('/role/permissions/select')
    return data
  },

  getProjectSpecialtyOptions: async () => {
    const { data } = await axiosInstance.get<SelectProjectSpecialtyOption[]>('/project/select/project-specialties')
    return data
  },

  isAxiosError: axios.isAxiosError,
}
