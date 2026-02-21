import { create } from 'zustand'
import { mapperSelectRoleOptions } from '@/mappers'
import messages from '@/messages/messages'
import { selectsService } from '@/services'
import type { SelectsStore } from '@/types'

export const useStoreSelects = create<SelectsStore>()((set) => ({
  roleOptions: [],
  loadingRoleOptions: false,
  roleOptionsErrorMessage: null,
  errorBack: null,

  getRoleOptions: async () => {
    try {
      set({
        loadingRoleOptions: true,
        roleOptionsErrorMessage: null,
        errorBack: null,
      })
      const data = await selectsService.getRoleOptions()
      set({ roleOptions: mapperSelectRoleOptions(data) })
    } catch (error) {
      if (selectsService.isAxiosError(error)) {
        set({
          roleOptionsErrorMessage: error.response?.data?.message || messages.selects.status.errors.loadRolesError,
          errorBack: error,
        })
      } else {
        set({
          roleOptionsErrorMessage: messages.selects.status.errors.loadRolesError,
          errorBack: error,
        })
      }
    } finally {
      set({ loadingRoleOptions: false })
    }
  },

  clearRoleOptionsStatus: () => {
    set({ roleOptionsErrorMessage: null })
  },
}))
