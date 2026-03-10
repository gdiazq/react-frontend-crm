export interface ContractRaw {
  id: number
  employeeId: number
  employeeName: string
  name: string
  contractNumber: string
  contractType: string
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
