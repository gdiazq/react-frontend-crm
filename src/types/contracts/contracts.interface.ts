export interface ContractRaw {
  id: number
  employeeId: number
  employeeName: string
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
  statusId: string
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
