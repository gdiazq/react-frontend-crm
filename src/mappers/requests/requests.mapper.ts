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
  const result: Record<string, number | string> = {
    page: queryParams.page,
    size: queryParams.size,
    sortBy: queryParams.sortBy,
    sortDir: queryParams.sortDir,
  }

  const search = queryParams.search.trim()
  const statusId = queryParams.statusId.trim()
  const idModule = queryParams.idModule.trim()
  const createdFrom = queryParams.createdFrom.trim()
  const createdTo = queryParams.createdTo.trim()
  const approvalFrom = queryParams.approvalFrom.trim()
  const approvalTo = queryParams.approvalTo.trim()

  if (search.length > 0) result.search = search

  if (statusId.length > 0) {
    const parsedStatusId = Number(statusId)
    if (Number.isInteger(parsedStatusId) && parsedStatusId > 0) result.statusId = parsedStatusId
  }

  if (idModule.length > 0) {
    const parsedModuleId = Number(idModule)
    if (Number.isInteger(parsedModuleId) && parsedModuleId > 0) result.idModule = parsedModuleId
  }
  if (createdFrom.length > 0) result.createdFrom = createdFrom
  if (createdTo.length > 0) result.createdTo = createdTo
  if (approvalFrom.length > 0) result.approvalFrom = approvalFrom
  if (approvalTo.length > 0) result.approvalTo = approvalTo

  return result
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
