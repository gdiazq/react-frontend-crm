import type { Pagination } from '../common'

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
  action?: string | null
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

export interface RequestsPagination extends Pagination {
  pending: number
  numberOfElements: number
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
  sortBy: RequestsSortBy
  sortDir: RequestsSortDir
}

export type RequestsSortBy =
  | 'identification'
  | 'firstName'
  | 'requestTypeName'
  | 'action'
  | 'statusName'
  | 'approverFullName'
  | 'approvalDate'
  | 'createdAt'
  | 'updatedAt'

export type RequestsSortDir = 'asc' | 'desc'

export interface RequestTableRow {
  id: string
  displayName: string
  statusId: number
  statusName: string
  values: string[]
}

export interface RequestSelectOption {
  label: string
  value: string
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

export interface HrRequestDetailReference {
  id: number
  name: string
}

export interface HrRequestDetailRaw {
  id: number
  idModule: number
  identification: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  requestType: HrRequestDetailReference
  status: HrRequestDetailReference
  requireApproval: boolean
  action?: string | null
  approver?: HrRequestDetailReference | null
  approvalDate?: string | null
  hhrrApprover?: HrRequestDetailReference | null
  hhrrApprovalDate?: string | null
  rejectionDetail?: string | null
  createdAt: string
  updatedAt: string
}

export interface RequestDetailView {
  fullName: string
  identification: string
  requestTypeName: string
  actionDisplay: string
  statusName: string
  requireApprovalLabel: string
  approverName: string
  approvalDateDisplay: string
  hhrrApproverName: string
  hhrrApprovalDateDisplay: string
  rejectionDetailDisplay: string
  createdAtDisplay: string
  updatedAtDisplay: string
}
