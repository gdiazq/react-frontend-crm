import type { LeaveSelectOption, LeaveYesNoOption } from './leave-selects'

export interface LeaveSelectsStore {
  employeeWithContractOptions: LeaveSelectOption[]
  leaveTypeOptions: LeaveSelectOption[]
  yesNoOptions: LeaveYesNoOption[]
  loadingLeaveFormOptions: boolean
  leaveFormOptionsErrorMessage: string | null
  errorBack: unknown | null
  getLeaveFormOptions: () => Promise<void>
  clearLeaveFormOptionsStatus: () => void
}
