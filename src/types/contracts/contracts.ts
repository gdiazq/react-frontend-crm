import type { Pagination } from '../common'

export interface ContractRaw {
  id: number
  employeeId: number
  employeeName: string
  employeeIdentification: string
  name: string
  contractNumber: string
  contractType: string
  contractStatus: string
  company: string
  jobTitle: string
  baseSalary: string
  startDate: string
  endDate?: string | null
  active: boolean
  createdAt: string
  updatedAt?: string | null
}

export interface ContractCreateForm {
  employeeId: string
  costCenter: string
  name: string
  contractNumber: string
  contractTypeId: string
  safetyGroupId: string
  contractDetail: string
  baseSalary: string
  agreedSalary: string
  companyId: string
  zoneId: string
  jobTitleId: string
  siteId: string
  laborUnionId: string
  weeklyWorkHours: string
  workDays: string
  startDate: string
  endDate: string
  mealTypeId: string
  transportTypeId: string
}

export interface ContractFormSelectOption {
  label: string
  value: string
}

export interface ContractsFilterForm {
  statusId: string
  contractStatusId: string
  contractTypeId: string
  createdFrom: string
  createdTo: string
  startDateFrom: string
  startDateTo: string
  endDateFrom: string
  endDateTo: string
  updatedFrom: string
  updatedTo: string
}

export type ContractsFilterPayload = ContractsFilterForm

export interface ContractCreatePayload {
  employeeId: number
  costCenter: number
  name: string
  contractNumber: string
  contractTypeId: number
  safetyGroupId: number
  contractDetail: string | null
  baseSalary: string
  agreedSalary: string
  companyId: number
  zoneId: number
  jobTitleId: number
  siteId: number
  laborUnionId: number
  weeklyWorkHours: string
  workDays: string
  startDate: string
  endDate: string | null
  mealTypeId: number
  transportTypeId: number
}

export interface ContractUpdatePayload {
  id: number
  employeeId: number
  costCenter: number
  name: string
  contractNumber: string
  contractTypeId: number
  safetyGroupId: number
  contractDetail: string | null
  baseSalary: string
  agreedSalary: string
  companyId: number
  zoneId: number
  jobTitleId: number
  siteId: number
  laborUnionId: number
  weeklyWorkHours: string
  workDays: string
  startDate: string
  endDate: string | null
  mealTypeId: number
  transportTypeId: number
}

export interface ContractDetailReference {
  id: number
  name: string
}

export interface ContractDocument {
  id: number
  fileName: string
  contentType?: string | null
  size: number
  url?: string | null
  entityType?: string | null
  entityId?: number | null
  createdAt?: string
}

export interface ContractDetail {
  id: number
  employeeId: number
  costCenter?: number | null
  employeeName?: string | null
  employeeIdentification?: string | null
  name: string
  contractNumber: string
  contractType?: ContractDetailReference | null
  contractTypeId?: number
  contractStatus?: ContractDetailReference | null
  safetyGroup?: ContractDetailReference | null
  safetyGroupId?: number
  contractDetail?: string | null
  baseSalary: string
  agreedSalary: string
  company?: ContractDetailReference | null
  companyId?: number
  zone?: ContractDetailReference | null
  zoneId?: number
  jobTitle?: ContractDetailReference | null
  jobTitleId?: number
  site?: ContractDetailReference | null
  siteId?: number
  laborUnion?: ContractDetailReference | null
  laborUnionId?: number
  weeklyWorkHours: string
  workDays: string
  startDate: string
  endDate?: string | null
  mealType?: ContractDetailReference | null
  mealTypeId?: number
  transportType?: ContractDetailReference | null
  transportTypeId?: number
  status?: ContractDetailReference | null
  active?: boolean
  createdAt?: string
  updatedAt?: string
  requestId?: number | null
  documents?: ContractDocument[]
}

export interface ContractDetailDocumentView {
  id: number
  fileName: string
  sizeDisplay: string
  url: string
}

export interface ContractDetailView {
  contractName: string
  contractNumber: string
  employeeName: string
  employeeIdentification: string
  contractTypeName: string
  contractStatusName: string
  approvalStatusName: string
  companyName: string
  zoneName: string
  jobTitleName: string
  siteName: string
  laborUnionName: string
  safetyGroupName: string
  baseSalary: string
  agreedSalary: string
  weeklyWorkHours: string
  workDays: string
  startDateDisplay: string
  endDateDisplay: string
  mealTypeName: string
  transportTypeName: string
  contractDetailText: string
  createdAtDisplay: string
  updatedAtDisplay: string
  documents: ContractDetailDocumentView[]
}

export interface ContractCreateResponse {
  id: number
  name: string
  contractNumber: string
  createdAt: string
}

export interface ContractTableRow {
  id: string
  active: boolean
  values: string[]
}

export type ContractsSortBy =
  | 'employeeName'
  | 'employeeIdentification'
  | 'name'
  | 'companyId'
  | 'contractTypeId'
  | 'contractStatusId'
  | 'startDate'
  | 'endDate'
  | 'active'
  | 'createdAt'
  | 'updatedAt'

export type ContractsSortDir = 'asc' | 'desc'

export type ContractsPagination = Pagination

export interface ContractsQueryParams {
  page: number
  size: number
  search: string
  employeeId: string
  statusId: string
  contractStatusId: string
  contractTypeId: string
  createdFrom: string
  createdTo: string
  startDateFrom: string
  startDateTo: string
  endDateFrom: string
  endDateTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: ContractsSortBy
  sortDir: ContractsSortDir
}

export interface ContractPagedResponse {
  content: ContractRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  first?: boolean
  last?: boolean
}
