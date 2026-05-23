import type {
  SelectActiveInactiveOption,
  SelectCompanyRepresentativeOption,
  SelectEmployeeStatusOption,
  SelectPermissionOption,
  SelectProjectTypeOption,
  SelectProjectSpecialtyOption,
  SelectProjectStatusOption,
  SelectRoleOption,
  SelectStatusOption,
  SelectSupervisorOption,
  SelectUserEmailOption,
  SelectUserNameOption,
  SelectVisitorOption,
} from './selects'

export interface SelectsStore {
  roleOptions: SelectRoleOption[]
  permissionOptions: SelectPermissionOption[]
  projectTypeOptions: SelectProjectTypeOption[]
  projectSpecialtyOptions: SelectProjectSpecialtyOption[]
  projectStatusOptions: SelectProjectStatusOption[]
  userNameOptions: SelectUserNameOption[]
  userEmailOptions: SelectUserEmailOption[]
  statusOptions: SelectStatusOption[]
  employeeStatusOptions: SelectEmployeeStatusOption[]
  projectActiveInactiveOptions: SelectActiveInactiveOption[]
  visitorOptions: SelectVisitorOption[]
  supervisorOptions: SelectSupervisorOption[]
  companyRepresentativeOptions: SelectCompanyRepresentativeOption[]
  loadingRoleOptions: boolean
  loadingPermissionOptions: boolean
  loadingStatusOptions: boolean
  loadingEmployeeStatusOptions: boolean
  loadingProjectActiveInactiveOptions: boolean
  loadingUsersFilterOptions: boolean
  loadingProjectTypeOptions: boolean
  loadingProjectSpecialtyOptions: boolean
  loadingProjectStatusOptions: boolean
  loadingVisitorOptions: boolean
  loadingSupervisorOptions: boolean
  loadingCompanyRepresentativeOptions: boolean
  roleOptionsErrorMessage: string | null
  permissionOptionsErrorMessage: string | null
  statusOptionsErrorMessage: string | null
  employeeStatusOptionsErrorMessage: string | null
  projectActiveInactiveOptionsErrorMessage: string | null
  usersFilterOptionsErrorMessage: string | null
  projectTypeOptionsErrorMessage: string | null
  projectSpecialtyOptionsErrorMessage: string | null
  projectStatusOptionsErrorMessage: string | null
  visitorOptionsErrorMessage: string | null
  supervisorOptionsErrorMessage: string | null
  companyRepresentativeOptionsErrorMessage: string | null
  errorBack: unknown | null
  getRoleOptions: () => Promise<void>
  getPermissionOptions: () => Promise<void>
  getStatusOptions: () => Promise<void>
  getEmployeeStatusOptions: () => Promise<void>
  getProjectActiveInactiveOptions: () => Promise<void>
  getUsersFilterOptions: () => Promise<void>
  getProjectTypeOptions: () => Promise<void>
  getProjectSpecialtyOptions: () => Promise<void>
  getProjectStatusOptions: () => Promise<void>
  getVisitorOptions: () => Promise<void>
  getSupervisorOptions: () => Promise<void>
  getCompanyRepresentativeOptions: () => Promise<void>
  clearRoleOptionsStatus: () => void
  clearPermissionOptionsStatus: () => void
  clearStatusOptionsStatus: () => void
  clearEmployeeStatusOptionsStatus: () => void
  clearProjectActiveInactiveOptionsStatus: () => void
  clearUsersFilterOptionsStatus: () => void
  clearProjectTypeOptionsStatus: () => void
  clearProjectSpecialtyOptionsStatus: () => void
  clearProjectStatusOptionsStatus: () => void
  clearVisitorOptionsStatus: () => void
  clearSupervisorOptionsStatus: () => void
  clearCompanyRepresentativeOptionsStatus: () => void
}
