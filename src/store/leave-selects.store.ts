import { create } from 'zustand'
import messages from '@/messages/messages'
import { leaveSelectsService } from '@/services'
import type { LeaveSelectsStore } from '@/types'

export const useStoreLeaveSelects = create<LeaveSelectsStore>()((set) => ({
  employeeWithContractOptions: [],
  leaveTypeOptions: [],
  yesNoOptions: [],
  loadingLeaveFormOptions: false,
  leaveFormOptionsErrorMessage: null,
  errorBack: null,

  getLeaveFormOptions: async () => {
    try {
      set({ loadingLeaveFormOptions: true, leaveFormOptionsErrorMessage: null, errorBack: null })
      const [employeesWithContract, leaveTypes, yesNoOptions] = await Promise.all([
        leaveSelectsService.getEmployeeWithContractOptions(),
        leaveSelectsService.getLeaveTypeOptions(),
        leaveSelectsService.getYesNoOptions(),
      ])
      set({
        employeeWithContractOptions: employeesWithContract,
        leaveTypeOptions: leaveTypes,
        yesNoOptions,
      })
    } catch (error) {
      if (leaveSelectsService.isAxiosError(error)) {
        set({
          leaveFormOptionsErrorMessage: error.response?.data?.message || messages.leaves.status.errors.loadFormOptionsError,
          errorBack: error,
        })
      } else {
        set({ leaveFormOptionsErrorMessage: messages.leaves.status.errors.loadFormOptionsError, errorBack: error })
      }
    } finally {
      set({ loadingLeaveFormOptions: false })
    }
  },

  clearLeaveFormOptionsStatus: () => {
    set({ leaveFormOptionsErrorMessage: null })
  },
}))
