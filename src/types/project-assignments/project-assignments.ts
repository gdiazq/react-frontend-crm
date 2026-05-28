import type { Pagination } from '../common'

export interface ProjectAssignmentRaw {
  id: number
  employeeId: number
  employeeFullName: string
  employeeIdentification: string
  costCenter: number
  projectName: string
  roleOnProject?: string | null
  allocationPercent?: number | null
  startDate: string
  endDate?: string | null
  active: boolean
  createdAt: string
  updatedAt?: string | null
}

export type ProjectAssignmentDetail = ProjectAssignmentRaw

export interface ProjectAssignmentEmployeeSelectOption {
  id: number
  name: string
}

export interface ProjectAssignmentDetailView {
  id: number
  employeeId: number
  employeeName: string
  employeeIdentification: string
  costCenter: number
  costCenterDisplay: string
  projectName: string
  roleOnProjectDisplay: string
  allocationPercentDisplay: string
  active: boolean
  statusDisplay: string
  startDateDisplay: string
  endDateDisplay: string
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface ProjectAssignmentTableRow {
  id: string
  values: string[]
  employeeId: number
  employeeName: string
  costCenter: number
  projectName: string
  active?: boolean
}

export type ProjectAssignmentsSortBy =
  | 'employeeFullName'
  | 'employeeIdentification'
  | 'costCenter'
  | 'projectName'
  | 'roleOnProject'
  | 'allocationPercent'
  | 'startDate'
  | 'endDate'
  | 'active'
  | 'createdAt'
  | 'updatedAt'

export type ProjectAssignmentsSortDir = 'asc' | 'desc'

export interface ProjectAssignmentsPagination extends Pagination {
  pending: number
}

export interface ProjectAssignmentsQueryParams {
  page: number
  size: number
  search: string
  employeeId: string
  costCenter: string
  active: string
  dateFrom: string
  dateTo: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: ProjectAssignmentsSortBy
  sortDir: ProjectAssignmentsSortDir
}

export interface ProjectAssignmentsPagedResponse {
  content: ProjectAssignmentRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  pending?: number
  first?: boolean
  last?: boolean
}
