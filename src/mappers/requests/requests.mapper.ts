import messages from '@/messages/messages'
import type {
  HrRequestDetailRaw,
  HrRequestRaw,
  RequestDetailView,
  RequestPagedResponse,
  RequestSelectOption,
  RequestTableRow,
  RequestsFilterForm,
  RequestsFilterPayload,
  RequestsPagination,
  RequestsQueryParams,
} from '@/types'
import { buildQueryParams, appendString, appendParsedId } from '../shared/queryParams.mapper'
import { formatDate, formatDateTime } from '@/utils'

const FINAL_REQUEST_STATUS_IDS = new Set([3, 4])

export function isFinalRequestStatus(statusId: number): boolean {
  return FINAL_REQUEST_STATUS_IDS.has(statusId)
}

export function mapperRequestSelectOptions(options: Array<{ id: number, name: string }>): RequestSelectOption[] {
  return options.map((option) => ({ label: option.name, value: String(option.id) }))
}

export function mapperRequestFiltersFromQuery(queryParams: RequestsQueryParams): RequestsFilterForm {
  return {
    statusId: queryParams.statusId,
    moduleId: queryParams.idModule,
    createdFrom: queryParams.createdFrom,
    createdTo: queryParams.createdTo,
    approvalFrom: queryParams.approvalFrom,
    approvalTo: queryParams.approvalTo,
  }
}

export function mapperRequestFiltersPayload(filters: RequestsFilterForm): RequestsFilterPayload {
  return {
    statusId: filters.statusId.trim(),
    idModule: filters.moduleId.trim(),
    createdFrom: filters.createdFrom.trim(),
    createdTo: filters.createdTo.trim(),
    approvalFrom: filters.approvalFrom.trim(),
    approvalTo: filters.approvalTo.trim(),
  }
}

export function mapperEmptyRequestFilters(): RequestsFilterForm {
  return {
    statusId: '',
    moduleId: '',
    createdFrom: '',
    createdTo: '',
    approvalFrom: '',
    approvalTo: '',
  }
}

export function mapperRequestRowDisplayName(row: RequestTableRow | null) {
  return row?.displayName || messages.requests.ui.detailTitleFallback
}

export function mapperRequestApproveConfirmMessage(row: RequestTableRow | null) {
  if (!row) return ''
  return `¿Seguro que deseas aprobar la solicitud de ${mapperRequestRowDisplayName(row)}?`
}

export function mapperRequestRejectConfirmMessage(row: RequestTableRow | null) {
  if (!row) return ''
  return `¿Seguro que deseas rechazar la solicitud de ${mapperRequestRowDisplayName(row)}?`
}

export function mapperRequestApproveSuccessMessage(row: RequestTableRow) {
  return `${mapperRequestRowDisplayName(row)}: ${messages.requests.status.success.approveSuccess}`
}

export function mapperRequestRejectSuccessMessage(row: RequestTableRow) {
  return `${mapperRequestRowDisplayName(row)}: ${messages.requests.status.success.rejectSuccess}`
}

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
  return response.map((item) => {
    const displayName = `${item.firstName} ${item.paternalLastName} ${item.maternalLastName}`.trim()

    return {
      id: String(item.id),
      displayName,
      statusId: item.statusId,
      statusName: item.statusName,
      values: [
        item.identification,
        displayName,
        item.requestTypeName,
        resolveActionLabel(item.action),
        item.statusName,
        resolveApproverLabel(item),
        resolveApprovalDateLabel(item),
        formatDate(item.createdAt),
        formatDate(item.updatedAt),
        '',
      ],
    }
  })
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
    requestTypeName: detail.requestType.name,
    actionDisplay: resolveActionLabel(detail.action),
    statusName: detail.status.name,
    requireApprovalLabel: detail.requireApproval ? messages.requests.ui.requireApprovalYes : messages.requests.ui.requireApprovalNo,
    approverName: detail.approver?.name ?? messages.requests.ui.unassignedApprover,
    approvalDateDisplay: formatDateTime(detail.approvalDate || '', messages.requests.ui.noApprovalDate),
    hhrrApproverName: detail.hhrrApprover?.name ?? messages.requests.ui.unassignedApprover,
    hhrrApprovalDateDisplay: formatDateTime(detail.hhrrApprovalDate || '', messages.requests.ui.noApprovalDate),
    rejectionDetailDisplay: detail.rejectionDetail?.trim() || '',
    createdAtDisplay: formatDateTime(detail.createdAt, 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt, 'Sin registro'),
  }
}

export function mapperRequestDetailTitle(detail: RequestDetailView | null, fallbackName: string): string {
  if (detail) return `Detalle de ${detail.fullName}`
  if (fallbackName.trim().length > 0) return `Detalle de ${fallbackName}`
  return messages.requests.ui.detailTitleFallback
}
