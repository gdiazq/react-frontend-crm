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

export interface ProjectsPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  first: boolean
  last: boolean
}

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
