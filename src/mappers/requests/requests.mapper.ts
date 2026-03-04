import messages from '@/messages/messages'
import type {
  HrRequestRaw,
  RequestPagedResponse,
  RequestTableRow,
  RequestsPagination,
  RequestsQueryParams,
} from '@/types'
import { formatDate } from '@/utils'

function resolveApproverLabel(item: HrRequestRaw): string {
  const approverFullName = (item.hhrrApproverFullName ?? item.approverFullName ?? '').trim()
  return approverFullName.length > 0 ? approverFullName : messages.requests.ui.unassignedApprover
}

function resolveApprovalDateLabel(item: HrRequestRaw): string {
  const approvalDate = item.hhrrApprovalDate ?? item.approvalDate
  return approvalDate ? formatDate(approvalDate) : messages.requests.ui.noApprovalDate
}

export function mapperRequestsRows(response: HrRequestRaw[]): RequestTableRow[] {
  return response.map((item) => ({
    id: String(item.id),
    statusId: item.statusId,
    statusName: item.statusName,
    values: [
      item.identification,
      `${item.firstName} ${item.paternalLastName} ${item.maternalLastName}`.trim(),
      item.requestTypeName,
      item.statusName,
      item.requireApproval ? messages.requests.ui.requireApprovalYes : messages.requests.ui.requireApprovalNo,
      resolveApproverLabel(item),
      resolveApprovalDateLabel(item),
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
      '',
    ],
  }))
}

export function mapperRequestsPagination(response: RequestPagedResponse): RequestsPagination {
  const page = response.page ?? response.number ?? response.pageable?.pageNumber ?? 0
  const size = response.size ?? response.pageable?.pageSize ?? 8
  const totalElements = response.totalElements ?? response.total ?? 0
  const totalPages = response.totalPages ?? 0
  const total = response.total ?? totalElements
  const active = response.active ?? 0
  const pending = response.pending ?? 0
  const numberOfElements = response.numberOfElements ?? response.content.length
  const first = response.first ?? page === 0
  const last = response.last ?? page >= totalPages - 1

  return {
    page,
    size,
    totalElements,
    totalPages,
    total,
    active,
    pending,
    numberOfElements,
    first,
    last,
  }
}

export function mapperRequestsQueryParams(queryParams: RequestsQueryParams): Record<string, number> {
  return {
    page: queryParams.page,
    size: queryParams.size,
  }
}
