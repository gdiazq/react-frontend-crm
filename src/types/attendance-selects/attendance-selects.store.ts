import type {
  AttendanceEmployeeSelectOption,
  AttendanceEmployeeWithCostCenterSelectOption,
  AttendanceMarkTypeSelectOption,
  AttendanceStatusSelectOption,
} from './attendance-selects'
import type { ProjectCostCenterSelectOption } from '../projects'

export interface AttendanceSelectsStore {
  employeeWithContractOptions: AttendanceEmployeeSelectOption[]
  attendanceEmployeeOptions: AttendanceEmployeeWithCostCenterSelectOption[]
  attendanceStatusOptions: AttendanceStatusSelectOption[]
  attendanceMarkTypeOptions: AttendanceMarkTypeSelectOption[]
  projectCostCenterOptions: ProjectCostCenterSelectOption[]
  loadingAttendanceFormOptions: boolean
  loadingAttendanceEmployeeOptions: boolean
  loadingAttendanceMarkTypeOptions: boolean
  loadingProjectCostCenterOptions: boolean
  attendanceFormOptionsErrorMessage: string | null
  attendanceEmployeeOptionsErrorMessage: string | null
  attendanceMarkTypeOptionsErrorMessage: string | null
  projectCostCenterOptionsErrorMessage: string | null
  errorBack: unknown | null
  getAttendanceFormOptions: () => Promise<void>
  getAttendanceEmployeeOptions: () => Promise<void>
  getAttendanceMarkTypeOptions: () => Promise<void>
  getProjectCostCenterOptions: () => Promise<void>
  getProjectCostCenterOption: (costCenter: number) => Promise<void>
  clearAttendanceFormOptionsStatus: () => void
  clearAttendanceEmployeeOptionsStatus: () => void
  clearAttendanceMarkTypeOptionsStatus: () => void
  clearProjectCostCenterOptionsStatus: () => void
}
