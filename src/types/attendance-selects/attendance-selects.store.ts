import type {
  AttendanceEmployeeSelectOption,
  AttendanceEmployeeWithCostCenterSelectOption,
  AttendanceMarkTypeSelectOption,
  AttendanceStatusSelectOption,
} from './attendance-selects'

export interface AttendanceSelectsStore {
  employeeWithContractOptions: AttendanceEmployeeSelectOption[]
  attendanceEmployeeOptions: AttendanceEmployeeWithCostCenterSelectOption[]
  attendanceStatusOptions: AttendanceStatusSelectOption[]
  attendanceMarkTypeOptions: AttendanceMarkTypeSelectOption[]
  loadingAttendanceFormOptions: boolean
  loadingAttendanceEmployeeOptions: boolean
  loadingAttendanceMarkTypeOptions: boolean
  attendanceFormOptionsErrorMessage: string | null
  attendanceEmployeeOptionsErrorMessage: string | null
  attendanceMarkTypeOptionsErrorMessage: string | null
  errorBack: unknown | null
  getAttendanceFormOptions: () => Promise<void>
  getAttendanceEmployeeOptions: () => Promise<void>
  getAttendanceMarkTypeOptions: () => Promise<void>
  clearAttendanceFormOptionsStatus: () => void
  clearAttendanceEmployeeOptionsStatus: () => void
  clearAttendanceMarkTypeOptionsStatus: () => void
}
