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
}

export interface ContractCreateForm {
  employeeId: string
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

export interface ContractCreatePayload {
  employeeId: number
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
  employeeName?: string | null
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

export type ContractsSortDir = 'asc' | 'desc'

export interface ContractsPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

export interface ContractsQueryParams {
  page: number
  size: number
  employeeId: string
  createdFrom: string
  createdTo: string
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
