import type {
  OvertimeCreateForm,
  OvertimeCreatePayload,
  OvertimeDetail,
  OvertimeDetailView,
  OvertimePagedResponse,
  OvertimePagination,
  OvertimeQueryParams,
  OvertimeRaw,
  OvertimeTableRow,
  OvertimeUpdatePayload,
} from '@/types'
import { formatDate, formatDateTime, formatNumber, parseTimeInput } from '@/utils'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'
import { normalizeDateValue, parseRequiredNumber } from '../shared/form.mapper'

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

function normalizeTimeValue(value?: string | null): string {
  const normalized = (value ?? '').trim()
  if (!normalized) return ''

  const date = new Date(normalized)
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return normalized.length >= 5 ? normalized.slice(0, 5) : normalized
}

function toDateTimeValue(date: string, time: string): string {
  const normalizedDate = date.trim()
  const normalizedTime = parseTimeInput(time)
  if (!normalizedDate || !normalizedTime) return ''
  return `${normalizedDate}T${normalizedTime}:00`
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
      '',
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
  appendString(params, 'search', result.search)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendParsedId(params, 'costCenter', result.costCenter)
  appendParsedId(params, 'statusId', result.statusId)
  appendString(params, 'dateFrom', result.dateFrom)
  appendString(params, 'dateTo', result.dateTo)
  appendParsedId(params, 'overtimeTypeId', result.overtimeTypeId)
  return params
}

export function mapperCreateOvertimePayload(form: OvertimeCreateForm): OvertimeCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    overtimeTypeId: parseRequiredNumber(form.overtimeTypeId),
    date: form.date.trim(),
    startTime: toDateTimeValue(form.date, form.startTime),
    endTime: toDateTimeValue(form.date, form.endTime),
    reason: form.reason.trim(),
  }
}

export function mapperUpdateOvertimePayload(overtimeId: number, form: OvertimeCreateForm): OvertimeUpdatePayload {
  return {
    id: overtimeId,
    overtimeTypeId: parseRequiredNumber(form.overtimeTypeId),
    startTime: toDateTimeValue(form.date, form.startTime),
    endTime: toDateTimeValue(form.date, form.endTime),
    reason: form.reason.trim(),
  }
}

export function mapperOvertimeDetailToForm(detail: OvertimeDetail): OvertimeCreateForm {
  return {
    employeeId: String(detail.employeeId),
    overtimeTypeId: String(detail.overtimeTypeId),
    date: normalizeDateValue(detail.date),
    startTime: normalizeTimeValue(detail.startTime),
    endTime: normalizeTimeValue(detail.endTime),
    reason: detail.reason ?? '',
  }
}

export function mapperOvertimeDetailView(detail: OvertimeDetail | null): OvertimeDetailView | null {
  if (!detail) return null

  return {
    id: detail.id,
    employeeName: detail.employeeName || '',
    costCenterDisplay: formatOptionalNumber(detail.costCenter),
    projectName: detail.projectName || '',
    overtimeTypeName: detail.overtimeTypeName || '',
    surchargePercentDisplay: formatPercent(detail.surchargePercent),
    attendanceDisplay: detail.attendanceId ? 'Vinculada' : 'Sin asistencia vinculada',
    dateDisplay: formatDate(detail.date, 'Sin registro'),
    startTimeDisplay: formatOvertimeTime(detail.startTime),
    endTimeDisplay: formatOvertimeTime(detail.endTime),
    hoursDisplay: formatOptionalDecimal(detail.hours),
    reasonText: detail.reason || '',
    statusName: detail.currentStatusName || '',
    createdAtDisplay: formatDateTime(detail.createdAt || '', 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt || '', 'Sin registro'),
  }
}
