export interface HrRequestRaw {
  id: number
  idModule: number
  identification: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  requestTypeId: number
  requestTypeName: string
  statusId: number
  statusName: string
  requireApproval: boolean
  approverId?: number | null
  approverFullName?: string | null
  approvalDate?: string | null
  hhrrApproverId?: number | null
  hhrrApproverFullName?: string | null
  hhrrApprovalDate?: string | null
  rejectionDetail?: string | null
  createdAt: string
  updatedAt: string
}

export interface RequestsPagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
  total: number
  active: number
  pending: number
  numberOfElements: number
  first: boolean
  last: boolean
}

export interface RequestsQueryParams {
  page: number
  size: number
  search: string
  statusId: string
  idModule: string
  createdFrom: string
  createdTo: string
  approvalFrom: string
  approvalTo: string
}

export interface RequestTableRow {
  id: string
  statusId: number
  statusName: string
  values: string[]
}

export interface RequestPagedResponse {
  content: HrRequestRaw[]
  page?: number
  pageable?: {
    pageNumber?: number
    pageSize?: number
  }
  totalElements?: number
  totalPages?: number
  last?: boolean
  first?: boolean
  numberOfElements?: number
  size?: number
  number?: number
  total?: number
  active?: number
  pending?: number
}
