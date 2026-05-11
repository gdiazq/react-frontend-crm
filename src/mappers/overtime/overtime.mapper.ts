import type {
  OvertimePagedResponse,
  OvertimePagination,
  OvertimeQueryParams,
  OvertimeRaw,
  OvertimeTableRow,
} from '@/types'
import { formatDate, formatNumber } from '@/utils'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'

function formatOptionalNumber(value?: number | null): string {
  if (value === null || value === undefined) return '-'
  return String(value)
}

function formatOptionalDecimal(value?: number | null): string {
  if (value === null || value === undefined) return 'Sin registro'
  return formatNumber(value)
}

function formatPercent(value?: number | null): string {
  if (value === null || value === undefined) return '-'
  return `${formatNumber(value)}%`
}

function formatOvertimeTime(value?: string | null): string {
  const normalized = (value ?? '').trim()
  if (!normalized) return 'Sin registro'

  const date = new Date(normalized)
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  }

  return normalized.length >= 5 ? normalized.slice(0, 5) : normalized
}

export function mapperOvertimeRows(result: OvertimeRaw[]): OvertimeTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    employeeId: item.employeeId,
    costCenter: item.costCenter,
    overtimeTypeId: item.overtimeTypeId,
    values: [
      item.employeeName || '-',
      formatOptionalNumber(item.costCenter),
      item.projectName || '-',
      item.overtimeTypeName || '-',
      formatPercent(item.surchargePercent),
      formatDate(item.date, 'Sin registro'),
      formatOvertimeTime(item.startTime),
      formatOvertimeTime(item.endTime),
      formatOptionalDecimal(item.hours),
      item.currentStatusName || '-',
    ],
  }))
}

export function mapperOvertimePagination(result: OvertimePagedResponse): OvertimePagination {
  return {
    ...mapperPagination(result),
    pending: result.pending ?? 0,
  }
}

export function mapperOvertimeQueryParams(result: OvertimeQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendParsedId(params, 'costCenter', result.costCenter)
  appendParsedId(params, 'statusId', result.statusId)
  appendString(params, 'dateFrom', result.dateFrom)
  appendString(params, 'dateTo', result.dateTo)
  appendParsedId(params, 'overtimeTypeId', result.overtimeTypeId)
  return params
}
