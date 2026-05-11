import type {
  OvertimeCreateForm,
  OvertimeCreatePayload,
  OvertimeDetail,
  OvertimePagedResponse,
  OvertimePagination,
  OvertimeQueryParams,
  OvertimeRaw,
  OvertimeTableRow,
  OvertimeUpdatePayload,
} from '@/types'
import { formatDate, formatNumber } from '@/utils'
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

function normalizeTimeInput(value: string): string | null {
  const normalized = value.trim()
  if (!normalized) return null

  const hourOnlyMatch = normalized.match(/^(\d{1,2})$/)
  if (hourOnlyMatch) {
    const hour = Number(hourOnlyMatch[1])
    if (hour >= 0 && hour <= 23) return `${String(hour).padStart(2, '0')}:00`
    return null
  }

  const compactMatch = normalized.match(/^(\d{1,2})(\d{2})$/)
  if (compactMatch) {
    const hour = Number(compactMatch[1])
    const minute = Number(compactMatch[2])
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
    return null
  }

  const timeMatch = normalized.match(/^(\d{1,2}):(\d{1,2})$/)
  if (timeMatch) {
    const hour = Number(timeMatch[1])
    const minute = Number(timeMatch[2])
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
  }

  return null
}

function toDateTimeValue(date: string, time: string): string {
  const normalizedDate = date.trim()
  const normalizedTime = normalizeTimeInput(time)
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
