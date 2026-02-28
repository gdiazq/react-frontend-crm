export interface EmployeeRaw {
  id: number
  identification: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  corporateEmail: string
  phone?: string | null
  active: boolean
  rehireEligible: boolean
  createdAt: string
  updatedAt: string
}

export interface EmployeeTableRow {
  id: string
  values: string[]
  active?: boolean
}

export type EmployeesSortBy =
  | 'identification'
  | 'firstName'
  | 'corporateEmail'
  | 'phone'
  | 'rehireEligible'
  | 'active'
  | 'createdAt'
  | 'updatedAt'

export type EmployeesSortDir = 'asc' | 'desc'

export interface EmployeesPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

export interface EmployeesQueryParams {
  page: number
  size: number
  search: string
  active: string
  sortBy: EmployeesSortBy
  sortDir: EmployeesSortDir
}

export interface EmployeePagedResponse {
  content: EmployeeRaw[]
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
