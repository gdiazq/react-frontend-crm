import type {
  AttendanceCreateForm,
  AttendanceCreatePayload,
  AttendanceDetail,
  AttendanceDetailView,
  AttendanceExportQueryParams,
  AttendanceMarkCreateForm,
  AttendanceMarkCreatePayload,
  AttendanceMarkRaw,
  AttendanceMarkType,
  AttendanceMarkUpdatePayload,
  AttendancePagedResponse,
  AttendanceRaw,
  AttendanceTableRow,
  AttendanceUpdatePayload,
  AttendancePagination,
  AttendanceQueryParams,
} from '@/types'
import { mapperPagination } from '../shared/pagination.mapper'
import { appendParsedId, appendString, buildQueryParams } from '../shared/queryParams.mapper'
import { normalizeDateValue, parseNullableNumber, parseNullableString, parseRequiredNumber } from '../shared/form.mapper'
import { formatDate, formatDateTime, formatNumber } from '@/utils'

function formatAttendanceTime(value?: string | null): string {
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

function toDateTimeValue(date: string, time: string): string | null {
  const normalizedDate = date.trim()
  const normalizedTime = normalizeTimeInput(time)
  if (!normalizedDate || !normalizedTime) return null
  return `${normalizedDate}T${normalizedTime}:00`
}

function formatOptionalNumber(value?: number | null): string {
  if (value === null || value === undefined) return '-'
  return String(value)
}

function formatOptionalDecimal(value?: number | null): string {
  if (value === null || value === undefined) return 'Sin registro'
  return formatNumber(value)
}

export function mapperAttendanceRows(result: AttendanceRaw[]): AttendanceTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    employeeId: item.employeeId,
    costCenter: item.costCenter,
    statusId: item.statusId,
    values: [
      item.employeeIdentification || '-',
      item.employeeFullName || '-',
      formatOptionalNumber(item.costCenter),
      item.projectName || '-',
      formatDate(item.date, 'Sin registro'),
      formatAttendanceTime(item.checkInTime),
      formatAttendanceTime(item.checkOutTime),
      formatOptionalDecimal(item.totalHours),
      item.statusName || '-',
      '',
    ],
  }))
}

export function mapperAttendancePagination(result: AttendancePagedResponse): AttendancePagination {
  return {
    ...mapperPagination(result),
    pending: result.pending ?? 0,
  }
}

export function mapperAttendanceQueryParams(result: AttendanceQueryParams): Record<string, number | string> {
  const params = buildQueryParams(result)
  appendString(params, 'search', result.search)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendParsedId(params, 'costCenter', result.costCenter)
  appendParsedId(params, 'statusId', result.statusId)
  appendString(params, 'dateFrom', result.dateFrom)
  appendString(params, 'dateTo', result.dateTo)
  appendString(params, 'createdFrom', result.createdFrom)
  appendString(params, 'createdTo', result.createdTo)
  appendString(params, 'updatedFrom', result.updatedFrom)
  appendString(params, 'updatedTo', result.updatedTo)
  return params
}

export function mapperAttendanceExportQueryParams(result: AttendanceExportQueryParams): Record<string, number | string> {
  const params: Record<string, number | string> = {}
  appendString(params, 'search', result.search)
  appendParsedId(params, 'employeeId', result.employeeId)
  appendParsedId(params, 'costCenter', result.costCenter)
  appendParsedId(params, 'statusId', result.statusId)
  appendString(params, 'dateFrom', result.dateFrom)
  appendString(params, 'dateTo', result.dateTo)
  return params
}

export function mapperCreateAttendancePayload(form: AttendanceCreateForm): AttendanceCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    costCenter: parseNullableNumber(form.costCenter),
    date: form.date.trim(),
    checkInTime: toDateTimeValue(form.date, form.checkInTime),
    checkOutTime: toDateTimeValue(form.date, form.checkOutTime),
    statusId: parseRequiredNumber(form.statusId),
    notes: parseNullableString(form.notes),
  }
}

export function mapperUpdateAttendancePayload(attendanceId: number, form: AttendanceCreateForm): AttendanceUpdatePayload {
  return {
    id: attendanceId,
    ...mapperCreateAttendancePayload(form),
  }
}

export function mapperAttendanceDetailToForm(detail: AttendanceDetail): AttendanceCreateForm {
  return {
    employeeId: String(detail.employeeId),
    costCenter: detail.costCenter ? String(detail.costCenter) : '',
    date: normalizeDateValue(detail.date),
    checkInTime: normalizeTimeValue(detail.checkInTime),
    checkOutTime: normalizeTimeValue(detail.checkOutTime),
    statusId: String(detail.statusId),
    notes: detail.notes ?? '',
  }
}

function toMarkDateTimeValue(date: string, time: string): string | null {
  const normalizedDate = date.trim()
  const normalizedTime = normalizeTimeInput(time)
  if (!normalizedDate || !normalizedTime) return null
  return `${normalizedDate}T${normalizedTime}:00`
}

export function mapperCreateAttendanceMarkPayload(form: AttendanceMarkCreateForm): AttendanceMarkCreatePayload {
  return {
    employeeId: parseRequiredNumber(form.employeeId),
    costCenter: parseNullableNumber(form.costCenter),
    statusId: parseNullableNumber(form.statusId),
    markTime: toMarkDateTimeValue(form.date, form.markTime) ?? '',
    markType: form.markType as AttendanceMarkType,
    notes: parseNullableString(form.notes),
  }
}

export function mapperUpdateAttendanceMarkPayload(
  markId: number,
  attendanceId: number | null,
  form: AttendanceMarkCreateForm,
): AttendanceMarkUpdatePayload {
  return {
    id: markId,
    attendanceId,
    ...mapperCreateAttendanceMarkPayload(form),
  }
}

export function mapperAttendanceMarkToForm(mark: AttendanceMarkRaw): AttendanceMarkCreateForm {
  return {
    markType: mark.markType,
    employeeId: String(mark.employeeId),
    statusId: '',
    costCenter: mark.costCenter != null ? String(mark.costCenter) : '',
    date: normalizeDateValue(mark.date),
    markTime: normalizeTimeValue(mark.markTime),
    notes: mark.notes ?? '',
  }
}

export function mapperAttendanceDetailView(detail: AttendanceDetail | null): AttendanceDetailView | null {
  if (!detail) return null

  return {
    id: detail.id,
    employeeName: detail.employeeFullName || '',
    employeeIdentification: detail.employeeIdentification || '',
    costCenterDisplay: formatOptionalNumber(detail.costCenter),
    projectName: detail.projectName || '',
    dateDisplay: formatDate(detail.date, 'Sin registro'),
    checkInTimeDisplay: formatAttendanceTime(detail.checkInTime),
    checkOutTimeDisplay: formatAttendanceTime(detail.checkOutTime),
    totalHoursDisplay: formatOptionalDecimal(detail.totalHours),
    statusId: detail.statusId,
    statusName: detail.statusName || '',
    statusCode: detail.statusCode || '',
    generatedByLeaveDisplay: detail.generatedByLeaveId ? `Permiso #${detail.generatedByLeaveId}` : 'No',
    manuallyOverriddenDisplay: detail.manuallyOverridden ? 'Sí' : 'No',
    hasActiveLeaveDisplay: detail.hasActiveLeave ? 'Sí' : 'No',
    notesText: detail.notes || '',
    createdAtDisplay: formatDateTime(detail.createdAt || '', 'Sin registro'),
    updatedAtDisplay: formatDateTime(detail.updatedAt || '', 'Sin registro'),
  }
}
