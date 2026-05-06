import type {
  ProjectAssignmentDetail,
  ProjectAssignmentDetailView,
  ProjectAssignmentRaw,
  ProjectAssignmentTableRow,
  ProjectAssignmentsPagedResponse,
  ProjectAssignmentsPagination,
  ProjectAssignmentsQueryParams,
} from '@/types'
import { formatDate, formatDateTime, formatNumber } from '@/utils'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendBooleanString, appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'

function formatPercent(value?: number | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0%'
  return `${formatNumber(value)}%`
}

export function mapperProjectAssignmentsRows(result: ProjectAssignmentRaw[]): ProjectAssignmentTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    employeeId: item.employeeId,
    employeeName: item.employeeFullName,
    costCenter: item.costCenter,
    projectName: item.projectName,
    active: item.active,
    values: [
      item.employeeIdentification,
      item.employeeFullName,
      String(item.costCenter),
      item.projectName,
      item.roleOnProject || 'Sin rol',
      formatPercent(item.allocationPercent),
      formatDate(item.startDate, 'Sin registro'),
      formatDate(item.endDate || '', 'Actual'),
      item.active ? 'Activo' : 'Inactivo',
      '',
    ],
  }))
}

export function mapperProjectAssignmentsPagination(result: ProjectAssignmentsPagedResponse): ProjectAssignmentsPagination {
  return {
    ...mapperPagination(result),
    pending: result.pending ?? 0,
  }
}

export function mapperProjectAssignmentsQueryParams(result: ProjectAssignmentsQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendParsedId(params, 'costCenter', result.costCenter)
  appendBooleanString(params, 'active', result.active)
  appendString(params, 'dateFrom', result.dateFrom)
  appendString(params, 'dateTo', result.dateTo)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperProjectAssignmentDetailView(detail: ProjectAssignmentDetail | null): ProjectAssignmentDetailView | null {
  if (!detail) return null

  return {
    id: detail.id,
    employeeId: detail.employeeId,
    employeeName: detail.employeeFullName || '',
    employeeIdentification: detail.employeeIdentification || '',
    costCenter: detail.costCenter,
    costCenterDisplay: String(detail.costCenter),
    projectName: detail.projectName || '',
    roleOnProjectDisplay: detail.roleOnProject || 'Sin rol',
    allocationPercentDisplay: formatPercent(detail.allocationPercent),
    active: detail.active,
    statusDisplay: detail.active ? 'Activo' : 'Inactivo',
    startDateDisplay: formatDate(detail.startDate, 'Sin registro'),
    endDateDisplay: formatDate(detail.endDate || '', 'Actual'),
    createdAtDisplay: formatDateTime(detail.createdAt || '', 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt || '', 'Sin registro'),
  }
}

export function mapperProjectAssignmentDetailViews(details: ProjectAssignmentDetail[]): ProjectAssignmentDetailView[] {
  return details
    .map((detail) => mapperProjectAssignmentDetailView(detail))
    .filter((detail): detail is ProjectAssignmentDetailView => detail !== null)
}
