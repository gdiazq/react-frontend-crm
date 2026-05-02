import type { LeaveSelectOption } from './leave-selects'

export interface LeaveSelectsStore {
  employeeWithContractOptions: LeaveSelectOption[]
  leaveTypeOptions: LeaveSelectOption[]
  loadingLeaveFormOptions: boolean
  leaveFormOptionsErrorMessage: string | null
  errorBack: unknown | null
  getLeaveFormOptions: () => Promise<void>
  clearLeaveFormOptionsStatus: () => void
}
