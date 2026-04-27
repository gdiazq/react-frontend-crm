import axios from 'axios'
import { axiosInstance } from '@/config'
import type { AnnexSelectOption } from '@/types'

const RRHH_SELECTS_BASE_PATH = '/rrhh/select'

export const annexSelectsService = {
  getAnnexTypeOptions: async () => {
    const { data } = await axiosInstance.get<AnnexSelectOption[]>(`${RRHH_SELECTS_BASE_PATH}/annex-types`)
    return data
  },
  isAxiosError: axios.isAxiosError,
}
