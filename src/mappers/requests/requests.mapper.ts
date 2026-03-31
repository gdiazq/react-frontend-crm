import messages from '@/messages/messages'
import type {
  HrRequestDetailRaw,
  HrRequestRaw,
  RequestDetailView,
  RequestPagedResponse,
  RequestTableRow,
  RequestsPagination,
  RequestsQueryParams,
} from '@/types'
import { buildQueryParams, appendString, appendParsedId } from '../shared/queryParams.mapper'
import { formatDate, formatDateTime } from '@/utils'

function resolveApproverLabel(item: HrRequestRaw): string {
  const approverFullName = (item.hhrrApproverFullName ?? item.approverFullName ?? '').trim()
  return approverFullName.length > 0 ? approverFullName : messages.requests.ui.unassignedApprover
}

function resolveApprovalDateLabel(item: HrRequestRaw): string {
  const approvalDate = item.hhrrApprovalDate ?? item.approvalDate
  return approvalDate ? formatDate(approvalDate) : messages.requests.ui.noApprovalDate
}

function resolveActionLabel(action?: string | null): string {
  const normalized = action?.trim().toUpperCase() ?? ''
  if (normalized === 'CREATE') return 'Crear'
  if (normalized === 'UPDATE') return 'Actualizar'
  return normalized.length > 0 ? normalized : '-'
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
      resolveActionLabel(item.action),
      item.statusName,
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

export function mapperRequestsQueryParams(queryParams: RequestsQueryParams): Record<string, number | string> {
  const params = buildQueryParams(queryParams)
  appendString(params, 'search', queryParams.search)
  appendParsedId(params, 'statusId', queryParams.statusId)
  appendParsedId(params, 'idModule', queryParams.idModule)
  appendString(params, 'createdFrom', queryParams.createdFrom)
  appendString(params, 'createdTo', queryParams.createdTo)
  appendString(params, 'approvalFrom', queryParams.approvalFrom)
  appendString(params, 'approvalTo', queryParams.approvalTo)
  return params
}

export function mapperRequestDetailView(detail: HrRequestDetailRaw | null): RequestDetailView | null {
  if (!detail) return null

  const fullName = `${detail.firstName} ${detail.paternalLastName} ${detail.maternalLastName}`.trim()

  return {
    fullName,
    identification: detail.identification,
    moduleDisplay: `Modulo ${detail.idModule}`,
    requestTypeName: detail.requestType.name,
    actionDisplay: resolveActionLabel(detail.action),
    statusName: detail.status.name,
    requireApprovalLabel: detail.requireApproval ? messages.requests.ui.requireApprovalYes : messages.requests.ui.requireApprovalNo,
    approverName: detail.approver?.name ?? messages.requests.ui.unassignedApprover,
    approvalDateDisplay: formatDateTime(detail.approvalDate || '', messages.requests.ui.noApprovalDate),
    hhrrApproverName: detail.hhrrApprover?.name ?? messages.requests.ui.unassignedApprover,
    hhrrApprovalDateDisplay: formatDateTime(detail.hhrrApprovalDate || '', messages.requests.ui.noApprovalDate),
    rejectionDetailDisplay: detail.rejectionDetail?.trim() || 'Sin registro',
    createdAtDisplay: formatDateTime(detail.createdAt, 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt, 'Sin registro'),
  }
}
