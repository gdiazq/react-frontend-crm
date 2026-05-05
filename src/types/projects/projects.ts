import type { Pagination } from '../common'

export interface ProjectRaw {
  id: number
  costCenter: number
  name: string
  address?: string | null
  description?: string | null
  typeId?: number | null
  statusId?: number | null
  specialtyId?: number | null
  visitorId?: number | null
  visitorName?: string | null
  supervisorId?: number | null
  supervisorName?: string | null
  companyRepresentativeIds?: number[] | null
  startDate?: string | null
  realStartDate?: string | null
  endDate?: string | null
  realEndDate?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectDetail {
  id: number
  costCenter: number
  name: string
  address?: string | null
  description?: string | null
  typeId?: number | null
  typeName?: string | null
  statusId?: number | null
  statusName?: string | null
  specialtyId?: number | null
  specialtyName?: string | null
  visitorId?: number | null
  visitorName?: string | null
  supervisorId?: number | null
  supervisorName?: string | null
  companyRepresentativeIds?: number[] | null
  companyRepresentativeNames?: string[] | null
  startDate?: string | null
  realStartDate?: string | null
  endDate?: string | null
  realEndDate?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectDetailView {
  projectName: string
  costCenter: number
  costCenterDisplay: string
  typeName: string
  statusName: string
  specialtyName: string
  addressDisplay: string
  descriptionDisplay: string
  visitorName: string
  supervisorName: string
  companyRepresentativesDisplay: string
  startDateDisplay: string
  realStartDateDisplay: string
  endDateDisplay: string
  realEndDateDisplay: string
  active: boolean
  createdAtDisplay: string
  updatedAtDisplay: string
}

export interface ProjectTableRow {
  id: string
  values: string[]
  active?: boolean
  typeId?: number | null
  statusId?: number | null
  specialtyId?: number | null
}

export type ProjectsSortBy =
  | 'costCenter'
  | 'name'
  | 'typeId'
  | 'statusId'
  | 'specialtyId'
  | 'visitorName'
  | 'supervisorName'
  | 'startDate'
  | 'endDate'
  | 'active'
  | 'createdAt'
  | 'updatedAt'

export type ProjectsSortDir = 'asc' | 'desc'

export type ProjectsPagination = Pagination

export interface ProjectsQueryParams {
  page: number
  size: number
  search: string
  active: string
  typeId: string
  statusId: string
  specialtyId: string
  createdFrom: string
  createdTo: string
  updatedFrom: string
  updatedTo: string
  sortBy: ProjectsSortBy
  sortDir: ProjectsSortDir
}

export interface ProjectPagedResponse {
  content: ProjectRaw[]
  page?: number
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number
  total?: number
  active?: number
  totalActive?: number
  first?: boolean
  last?: boolean
}

export interface ProjectCostCenterEmployeeRaw {
  id: number
  userId?: number | null
  identification: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  corporateEmail?: string | null
  phone?: string | null
  statusName?: string | null
  costCenter: number
  projectName?: string | null
  active: boolean
  rehireEligible: boolean
  hasContract: boolean
  createdAt: string
  updatedAt?: string | null
}

export type ProjectCostCenterEmployeesSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'identification'
  | 'firstName'
  | 'statusName'

export type ProjectCostCenterEmployeesSortDir = 'asc' | 'desc'

export interface ProjectCostCenterEmployeesQueryParams {
  page: number
  size: number
  search: string
  active: string
  statusId: string
  sortBy: ProjectCostCenterEmployeesSortBy
  sortDir: ProjectCostCenterEmployeesSortDir
}

export interface ProjectCostCenterEmployeesPagedResponse {
  content: ProjectCostCenterEmployeeRaw[]
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

export interface ProjectCreateForm {
  costCenter: string
  name: string
  address: string
  description: string
  typeId: string
  statusId: string
  specialtyId: string
  visitorId: string
  supervisorId: string
  companyRepresentativeIds: string[]
  startDate: string
  realStartDate: string
  endDate: string
  realEndDate: string
}

export interface ProjectCreatePayload {
  costCenter: number
  name: string
  address: string | null
  description: string | null
  typeId: number | null
  statusId: number | null
  specialtyId: number | null
  visitorId: number | null
  supervisorId: number | null
  companyRepresentativeIds: number[] | null
  startDate: string | null
  realStartDate: string | null
  endDate: string | null
  realEndDate: string | null
}

export interface ProjectCreateResponse {
  id: number
  name: string
  costCenter: number
}

export interface ProjectUpdatePayload {
  id: number
  costCenter?: number
  name?: string
  address?: string
  description?: string
  typeId?: number
  statusId?: number
  specialtyId?: number
  visitorId?: number
  supervisorId?: number
  companyRepresentativeIds?: number[]
  startDate?: string
  realStartDate?: string
  endDate?: string
  realEndDate?: string
}

export interface ProjectUpdateResponse {
  id: number
  name: string
  costCenter: number
}

export interface ProjectEmployeeSelectOption {
  id: number
  name: string
}
