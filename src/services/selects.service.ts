import axios from 'axios'
import { axiosInstance } from '@/config'
import type { SelectRoleOption } from '@/types'

export const selectsService = {
  getRoleOptions: async () => {
    const { data } = await axiosInstance.get<SelectRoleOption[]>('/select/roles')
    return data
  },

  isAxiosError: axios.isAxiosError,
}
