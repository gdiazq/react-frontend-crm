import { create } from 'zustand'
import { mapperAnnexSelectOptions } from '@/mappers'
import messages from '@/messages/messages'
import { annexSelectsService } from '@/services'
import type { AnnexSelectsStore } from '@/types'

export const useStoreAnnexSelects = create<AnnexSelectsStore>()((set) => ({
  employeeWithContractOptions: [],
  annexTypeOptions: [],
  loadingAnnexFormOptions: false,
  annexFormOptionsErrorMessage: null,
  errorBack: null,

  getAnnexFormOptions: async () => {
    try {
      set({ loadingAnnexFormOptions: true, annexFormOptionsErrorMessage: null, errorBack: null })
      const [employeesWithContract, annexTypes] = await Promise.all([
        annexSelectsService.getEmployeeWithContractOptions(),
        annexSelectsService.getAnnexTypeOptions(),
      ])
      set({
        employeeWithContractOptions: mapperAnnexSelectOptions(employeesWithContract),
        annexTypeOptions: mapperAnnexSelectOptions(annexTypes),
      })
    } catch (error) {
      if (annexSelectsService.isAxiosError(error)) {
        set({
          annexFormOptionsErrorMessage: error.response?.data?.message || messages.annexes.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({ annexFormOptionsErrorMessage: messages.annexes.status.errors.loadFormOptionsError, errorBack: error })
      }
    } finally {
      set({ loadingAnnexFormOptions: false })
    }
  },

  clearAnnexFormOptionsStatus: () => {
    set({ annexFormOptionsErrorMessage: null })
  },
}))
